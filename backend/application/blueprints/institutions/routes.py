import os
import re
import csv
import io
import secrets
from datetime import datetime, timezone, timedelta

from flask import request, jsonify, current_app, render_template, redirect, url_for, flash
from werkzeug.security import generate_password_hash
from werkzeug.utils import secure_filename
import boto3  # if you prefer S3

from sqlalchemy.exc import IntegrityError
from marshmallow import ValidationError

from backend.application.models import db, Member, User, Institution, Camera, Invitation
from backend.application.blueprints.institutions import institutions_bp
from backend.application.blueprints.institutions.institutionsSchemas import institution_schema, institutions_schema
from backend.application.blueprints.user.userSchemas import users_schema, public_user_schema
from backend.application.blueprints.member.memberSchemas import member_schema, members_schema
from backend.application.blueprints.camera.cameraSchemas import cameras_schema
from backend.application.utils.utils import encode_token, token_required, send_invitation_email

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def _allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@institutions_bp.route('/', methods=['POST'])
@token_required
def create_institution(current_user_id):
    # current_user is the User instance from @token_required
    try:
        # Deserialize and validate the incoming JSON into an Institution
        new_institution = institution_schema.load(request.json, session=db.session)
    except ValidationError as e:
        return jsonify(e.messages), 400

    # Persist the new institution
    db.session.add(new_institution)
    db.session.commit()

    # Link the creator to their new institution
    current_user = db.session.get(User, current_user_id)
    if not current_user:
        return jsonify({"error": "User not found"}), 404

    current_user.institution_id = new_institution.id  # ✅ Correct - current_user is a User object
    db.session.commit()

    return institution_schema.jsonify(new_institution), 201
# Get all users for the current user's institution
@institutions_bp.route('/users', methods=['GET'])
@token_required
def get_institution_users(current_user_id):
    user = db.session.get(User, current_user_id)
    if not user or not user.institution_id:
        return jsonify({"error": "User or institution not found"}), 404
    users = db.session.query(User).filter_by(institution_id=user.institution_id).all()
    institution = db.session.get(Institution, user.institution_id)
    return jsonify({
        "institution": institution_schema.dump(institution),
        "users": public_user_schema.dump(users, many=True)  
    }), 200

# Get all members for the current members institution
@institutions_bp.route('/members', methods=['GET'])
@token_required
def get_institution_members(current_user_id):
    user = db.session.get(User, current_user_id)
    if not user or not user.institution_id:
        return jsonify({"error": "User or institution not found"}), 404
    members = db.session.query(Member).filter_by(institution_id=user.institution_id).all()
    return members_schema.jsonify(members), 200

# Update an institution (only by the user who created/owns it)
@institutions_bp.route('/<int:institution_id>', methods=['PUT'])
@token_required
def update_institution(current_user_id, institution_id):
    user = db.session.get(User, current_user_id)
    institution = db.session.get(Institution, institution_id)
    if not user or not institution:
        return jsonify({"error": "User or Institution not found"}), 404
    if user.institution_id != institution.id:
        return jsonify({"error": "Unauthorized"}), 403
    try:
        institution = institution_schema.load(request.json, partial=True)
    except ValidationError as e:
        return jsonify(e.messages), 400
    updated_institution = institution_schema.load(request.json, instance=institution, partial=True)
    db.session.commit()
    return institution_schema.jsonify(updated_institution), 200

# Delete an institution (only by the user who created/owns it)
@institutions_bp.route('/<int:institution_id>', methods=['DELETE'])
@token_required
def delete_institution(current_user_id, institution_id):
    user = db.session.get(User, current_user_id)
    institution = db.session.get(Institution, institution_id)
    if not user or not institution:
        return jsonify({"error": "User or Institution not found"}), 404
    if user.institution_id != institution.id:
        return jsonify({"error": "Unauthorized"}), 403
    db.session.delete(institution)
    db.session.commit()
    return jsonify({"message": "Institution deleted"}), 200

#Add user(ADMIN) to instituion by other admin

@institutions_bp.route('/<int:institution_id>/add_user', methods=['POST'])
@token_required
def add_user_to_institution(current_user_id, institution_id):
    user = db.session.get(User, current_user_id)
    institution = db.session.get(Institution, institution_id)
    if not user or not institution:
        return jsonify({"error": "User or Institution not found"}), 404

    # Get the user_id to add from the request
    data = request.get_json()
    user_id_to_add = data.get('user_id')
    if not user_id_to_add:
        return jsonify({"error": "No user_id provided"}), 400

    user_to_add = db.session.get(User, user_id_to_add)
    if not user_to_add:
        return jsonify({"error": "User to add not found"}), 404

    # Assign the institution to the user
    user_to_add.institution_id = institution.id
    db.session.commit()

    return jsonify({"message": f"User {user_to_add.id} added to institution {institution.id}."}), 200

#Get all cameras for the current users institution
@institutions_bp.route('/cameras', methods=['GET'])
@token_required
def get_institution_cameras(current_user_id):
    user = db.session.get(User, current_user_id)
    if not user or not user.institution_id:
        return jsonify({"error": "User or institution not found"}), 404
    cameras = db.session.query(Camera).filter_by(institution_id=user.institution_id).all()
    return cameras_schema.jsonify(cameras), 200

#invite user to institution by email
import secrets
from datetime import datetime, timedelta

@institutions_bp.route('/invite/accept/<token>', methods=['GET', 'POST'])
def accept_invitation(token):
    # 1) Fetch only unused, unexpired invitation
    inv = (
        db.session.query(Invitation)
        .filter_by(token=token, used=False)
        .first()
    )
    if not inv or inv.expires_at < datetime.utcnow():
        # invalid, expired, or already used
        return render_template('invite_invalid.html'), 400

    if request.method == 'GET':
        # show minimal acceptance form (email pre-filled)
        return render_template('accept_invitation.html', email=inv.email)

    # 2) POST: process the submitted form
    form = request.form
    name = form.get('name')
    password = form.get('password')
    phone = form.get('phone', '')  # Optional
    
    # Validation
    if not name or not password:
        return render_template('accept_invitation.html', 
                             email=inv.email, 
                             error="Name and password are required"), 400

    # Password strength validation (reuse your existing logic)
    errors = []
    if len(password) < 8:
        errors.append("Password must be at least 8 characters long.")
    if not re.search(r"[A-Z]", password):
        errors.append("Password must contain at least one uppercase letter.")
    if not re.search(r"[a-z]", password):
        errors.append("Password must contain at least one lowercase letter.")
    if not re.search(r"\d", password):
        errors.append("Password must contain at least one number.")
    if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
        errors.append("Password must contain at least one special character.")

    if errors:
        return render_template('accept_invitation.html', 
                             email=inv.email, 
                             error=" ".join(errors)), 400

    try:
        with db.session.begin():
            # look up existing user by email
            user = db.session.query(User).filter_by(email=inv.email).first()
            if not user:
                # create a new member user
                user = User(
                    email=inv.email,
                    name=name,
                    password=generate_password_hash(password),
                    phone=phone,
                    role='Member',  # default role
                    institution_id=inv.institution_id
                )
                db.session.add(user)
            else:
                # link an existing user to this institution
                user.institution_id = inv.institution_id

            # mark invitation as used
            inv.used = True

    except IntegrityError as e:
        db.session.rollback()
        return render_template('accept_invitation.html', 
                             email=inv.email, 
                             error="Could not accept invitation. Please try again."), 500

    # 3) redirect to login with success message
    flash("Account created successfully! Please log in.", "success")
    return redirect(url_for('users_bp.login'))  # Adjust to your actual login route name

@institutions_bp.route('/<int:institution_id>/invite_user', methods=['POST'])
@token_required
def invite_user_to_institution(current_user_id, institution_id):
    user = db.session.get(User, current_user_id)
    institution = db.session.get(Institution, institution_id)
    if not user or not institution:
        return jsonify({"error": "User or Institution not found"}), 404

    data = request.get_json()
    email = data.get("email")
    if not email:
        return jsonify({"error": "Email is required"}), 400

    # Check if invitation already exists for this email/institution
    existing_inv = db.session.query(Invitation).filter_by(
        email=email, 
        institution_id=institution_id, 
        used=False
    ).first()
    
    if existing_inv and existing_inv.expires_at > datetime.utcnow():
        return jsonify({"error": "Active invitation already exists for this email"}), 400

    # Generate a secure invitation token
    invitation_token = secrets.token_urlsafe(32)
    expiry_time = datetime.now(timezone.utc) + timedelta(hours=48)  # 48-hour expiry
    
    # Store invitation in database
    invitation = Invitation(
        email=email,
        institution_id=institution_id,
        token=invitation_token,
        expires_at=expiry_time,
        invited_by=current_user_id
    )
    db.session.add(invitation)
    db.session.commit()

    # Generate the invitation link
    invite_link = f"{request.host_url}institutions/invite/accept/{invitation_token}"
    
    # Send email with the invite link
    email_sent = send_invitation_email(email, institution.name, invite_link)
    
    if not email_sent:
        return jsonify({"error": "Failed to send invitation email"}), 500
    
    return jsonify({
        "message": f"Invitation sent to {email}",
        "expires_at": expiry_time.isoformat()
        # "invite_link": invite_link  # Remove this in production
    }), 200

@institutions_bp.route('/<int:institution_id>/upload-image', methods=['POST'])
@token_required
def upload_institution_image(current_user, institution_id):
    """
    Accepts either:
    - multipart/form-data with fields:
        * file (the FileStorage)
        * field_name (one of "logo", "image1", "image2")
    - application/json with:
        * url  (a publicly accessible image URL)
        * field_name
    """
    inst = db.session.get(Institution, institution_id)
    if not inst or inst.id != current_user.institution_id:
        return jsonify({"error": "Not authorized"}), 403

    field = request.form.get('field_name') or request.json.get('field_name')
    if field not in ('logo', 'image1', 'image2'):
        return jsonify({"error": "Invalid field_name"}), 400

    # 1) URL case
    if request.is_json and (url := request.json.get('url')):
        setattr(inst, field, url)
        db.session.commit()
        return jsonify({field: url}), 200

    # 2) File-upload case
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    f = request.files['file']
    if f.filename == '' or not _allowed_file(f.filename):
        return jsonify({"error": "Invalid or missing file"}), 400

    filename = secure_filename(f.filename)
    # --- LOCAL SAVE EXAMPLE --- 
    save_dir = current_app.config.get('UPLOAD_FOLDER', 'static/uploads')
    os.makedirs(save_dir, exist_ok=True)
    path = os.path.join(save_dir, filename)
    f.save(path)
    public_path = url_for('static', filename=f'uploads/{filename}', _external=True)

    # --- S3 UPLOAD EXAMPLE (uncomment if using S3) ---
    # s3 = boto3.client('s3')
    # bucket = current_app.config['S3_BUCKET']
    # key = f"institutions/{institution_id}/{field}/{filename}"
    # s3.upload_fileobj(f, bucket, key, ExtraArgs={'ACL':'public-read'})
    # public_path = f"https://{bucket}.s3.amazonaws.com/{key}"

    # Persist the URL
    setattr(inst, field, public_path)
    db.session.commit()

    return jsonify({field: public_path}), 200