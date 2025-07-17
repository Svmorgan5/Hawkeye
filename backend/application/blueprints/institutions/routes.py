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
from backend.application.utils.utils import encode_token, token_required, send_invitation_email, mock_send_invitation_email

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

@institutions_bp.route('/', methods=['GET'])
@token_required
def get_institution_info(current_user_id):
    user = db.session.get(User, current_user_id)
    if not user or not user.institution_id:
        return jsonify({"error": "User or institution not found"}), 404
    
    institution = db.session.get(Institution, user.institution_id)
    if not institution:
        return jsonify({"error": "Institution not found"}), 404
    
    # Use same image handling logic as members
    data = institution_schema.dump(institution)
    
    # Handle multiple image fields for institutions
    for img_field in ['logo', 'image1', 'image2']:
        img = data.get(img_field)
        if img:
            if img.startswith('http://') or img.startswith('https://'):
                data[img_field] = img  # Already full URL
            else:
                data[img_field] = url_for(
                    'static',
                    filename=f"uploads/{img}",
                    _external=True
                )
        else:
            data[img_field] = None
    
    return jsonify(data), 200

# Get all members for the current members institution
@institutions_bp.route('/members', methods=['GET', 'OPTIONS'])
@token_required
def get_institution_members(current_user_id):
    # Handle CORS preflight
    if request.method == 'OPTIONS':
        return '', 200
        
    user = db.session.get(User, current_user_id)
    if not user or not user.institution_id:
        return jsonify({"error": "User or institution not found"}), 404
    
    search = request.args.get('search')
    query = db.session.query(Member).filter_by(institution_id=user.institution_id)
    
    if search:
        search_filter = db.or_(
            Member.name.ilike(f"%{search}%"),
            Member.email.ilike(f"%{search}%"),
            Member.id == int(search) if search.isdigit() else False
        )
        query = query.filter(search_filter)
    
    members = query.order_by(Member.name.asc()).all()

    # Process images (same as your other routes)
    raw = members_schema.dump(members, many=True)
    out = []
    for m in raw:
        img = m.get('image')
        if img:
            if img.startswith('http://') or img.startswith('https://'):
                m['image'] = img
            else:
                m['image'] = url_for(
                    'static',
                    filename=f"uploads/{img}",
                    _external=True
                )
        else:
            m['image'] = None
        out.append(m)

    return jsonify(out), 200

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

    # Get the identifier from the request (email or name)
    data = request.get_json()
    email_to_add = data.get('email')
    name_to_add = data.get('name')
    
    # Validate that at least one identifier is provided
    if not email_to_add and not name_to_add:
        return jsonify({"error": "Either email or name must be provided"}), 400

    # Find user by email or name
    user_to_add = None
    search_criteria = []
    
    if email_to_add:
        user_to_add = db.session.query(User).filter_by(email=email_to_add).first()
        search_criteria.append(f"email '{email_to_add}'")
    
    if not user_to_add and name_to_add:
        user_to_add = db.session.query(User).filter_by(name=name_to_add).first()
        search_criteria.append(f"name '{name_to_add}'")
    
    # If still not found, try searching with both criteria if both provided
    if not user_to_add and email_to_add and name_to_add:
        user_to_add = db.session.query(User).filter(
            (User.email == email_to_add) | (User.name == name_to_add)
        ).first()
    
    if not user_to_add:
        search_terms = " or ".join(search_criteria)
        return jsonify({"error": f"User with {search_terms} not found"}), 404

    # Check if user already belongs to an institution
    if user_to_add.institution_id:
        return jsonify({"error": f"User '{user_to_add.name}' ({user_to_add.email}) already belongs to an institution"}), 400

    # Assign the institution to the user
    user_to_add.institution_id = institution.id
    db.session.commit()

    return jsonify({
        "message": f"User '{user_to_add.name}' ({user_to_add.email}) added to institution {institution.name}.",
        "user_id": user_to_add.id,
        "user_name": user_to_add.name,
        "user_email": user_to_add.email,
        "institution_id": institution.id,
        "institution_name": institution.name
    }), 200

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
        return jsonify({"error": "Invalid, expired, or already used invitation"}), 400

    if request.method == 'GET':
        # Return invitation details for frontend to display form
        return jsonify({
            "email": inv.email,
            "institution_name": db.session.get(Institution, inv.institution_id).name,
            "expires_at": inv.expires_at.isoformat(),
            "message": "Please provide name and password to accept invitation"
        }), 200

    # 2) POST: process the submitted JSON data
    data = request.get_json()
    if not data:
        return jsonify({"error": "JSON data required"}), 400
        
    name = data.get('name')
    password = data.get('password')
    phone = data.get('phone', '')  # Optional
    
    # Validation
    if not name or not password:
        return jsonify({"error": "Name and password are required"}), 400

    # Password strength validation
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
        return jsonify({"error": " ".join(errors)}), 400

    try:
        # Check if user already exists
        user = db.session.query(User).filter_by(email=inv.email).first()
        if not user:
            # Create new user
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
            # Link existing user to institution
            user.institution_id = inv.institution_id

        # Mark invitation as used
        inv.used = True
        db.session.commit()

        return jsonify({
            "message": "Account created successfully! You can now log in.",
            "user_id": user.id,
            "email": user.email,
            "name": user.name,
            "institution_id": user.institution_id
        }), 201

    except IntegrityError as e:
        db.session.rollback()
        return jsonify({"error": "Could not accept invitation. Please try again."}), 500

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
    
    # 🔥 
    email_sent = send_invitation_email(email, institution.name, invite_link)
    
    if not email_sent:
        return jsonify({"error": "Failed to send invitation email"}), 500
    
    return jsonify({
        "message": f"Invitation sent to {email}",
        "expires_at": expiry_time.isoformat()
    }), 200

@institutions_bp.route('/<int:institution_id>/upload-image', methods=['POST'])
@token_required
def upload_institution_image(current_user_id, institution_id):
    current_user = db.session.get(User, current_user_id)
    if not current_user:
        return jsonify({"error": "User not found"}), 404
    
    inst = db.session.get(Institution, institution_id)
    if not inst or inst.id != current_user.institution_id:
        return jsonify({"error": "Not authorized"}), 403

    # Get field name from form or JSON
    field = request.form.get('field_name') or (request.json and request.json.get('field_name'))
    if field not in ('logo', 'image1', 'image2'):
        field = 'logo'  # Default to logo

    # Handle file upload (like members)
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    if file.filename == '' or not _allowed_file(file.filename):
        return jsonify({"error": "Invalid or missing file"}), 400

    filename = secure_filename(file.filename)
    save_dir = current_app.config.get('UPLOAD_FOLDER', 'static/uploads')
    os.makedirs(save_dir, exist_ok=True)
    path = os.path.join(save_dir, filename)
    file.save(path)
    public_path = url_for('static', filename=f'uploads/{filename}', _external=True)

    # Set the field on institution
    setattr(inst, field, public_path)
    db.session.commit()

    return jsonify({field: public_path}), 200