import os
from flask import request, jsonify, current_app, url_for
from backend.application.models import db, Member, User
from backend.application.blueprints.member import members_bp
from backend.application.blueprints.member.memberSchemas import member_schema, members_schema
from marshmallow import ValidationError
import csv
import io
from werkzeug.utils import secure_filename
from backend.application.utils.utils import encode_token, token_required

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def _allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Now you can use _allowed_file() in your routes

# Create a member (single)
@members_bp.route('/', methods=['POST'])
@token_required
def create_member(current_user_id):
    user = db.session.get(User, current_user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    try:
        member_data = member_schema.load(request.json, session=db.session)
    except ValidationError as e:
        return jsonify(e.messages), 400
    
    # Auto-assign fields from current user
    member_data.institution_id = user.institution_id
    member_data.created_by_user_id = user.id

    db.session.add(member_data)
    db.session.commit()
    
    # Use schema.dump() with Flask's jsonify()
    return jsonify(member_schema.dump(member_data)), 201



@members_bp.route('/<int:member_id>/upload_image', methods=['POST'])
@token_required
def upload_member_image(current_user_id, member_id):
    """
    Upload image for a member
    """
    # Get the member
    member = db.session.get(Member, member_id)
    if not member:
        return jsonify({"error": "Member not found"}), 404
    
    # Check authorization
    current_user = db.session.get(User, current_user_id)
    if not current_user or current_user.institution_id != member.institution_id:
        return jsonify({"error": "Not authorized"}), 403

    # Handle both form data and JSON
    field = request.form.get('field_name') or request.json.get('field_name') if request.is_json else request.form.get('field_name')
    if not field or field not in ('profile_image', 'image'):  # adjust field names as needed
        return jsonify({"error": "Invalid or missing field_name"}), 400

    # Handle URL case (JSON)
    if request.is_json and request.json.get('url'):
        url = request.json.get('url')
        setattr(member, field, url)
        db.session.commit()
        return jsonify({field: url}), 200

    # Handle file upload case (multipart/form-data)
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    f = request.files['file']
    if f.filename == '' or not _allowed_file(f.filename):
        return jsonify({"error": "Invalid or missing file"}), 400

    filename = secure_filename(f.filename)
    
    # Save file locally
    save_dir = current_app.config.get('UPLOAD_FOLDER', 'static/uploads')
    os.makedirs(save_dir, exist_ok=True)
    path = os.path.join(save_dir, filename)
    f.save(path)
    public_path = url_for('static', filename=f'uploads/{filename}', _external=True)

    # Update member with image URL
    setattr(member, field, public_path)
    db.session.commit()

    return jsonify({field: public_path}), 200

# Get all members or search members by name
@members_bp.route('/', methods=['GET'])
@token_required
def get_members(current_user_id):  
    search = request.args.get('search')
    query = db.session.query(Member)
    if search:
        # flexible search for member names not case sensitive
        query = query.filter(Member.name.ilike(f"%{search}%"))
    # Order results alphabetically by name
    query = query.order_by(Member.name.asc())
    members = query.all()
    return members_schema.jsonify(members), 200

# Get a single member
@members_bp.route('/<int:member_id>', methods=['GET'])
@token_required
def get_member(current_user_id, member_id):
    member = db.session.get(Member, member_id)
    if not member:
        return jsonify({"error": "Member not found"}), 404
    return member_schema.jsonify(member), 200

# Update a member
@members_bp.route('/<int:member_id>', methods=['PUT'])
@token_required
def update_member(current_user_id, member_id):
    member = db.session.get(Member, member_id)
    if not member:
        return jsonify({"error": "Member not found"}), 404

    # Check if the request is multipart (for image upload)
    if request.content_type and request.content_type.startswith('multipart/form-data'):
        # Handle image upload if present
        if 'image' in request.files:
            file = request.files['image']
            filename = secure_filename(file.filename)
            upload_folder = os.path.join(current_app.root_path, 'static', 'uploads')
            os.makedirs(upload_folder, exist_ok=True)
            upload_path = os.path.join(upload_folder, filename)
            file.save(upload_path)
            member.image = f'/static/uploads/{filename}'
        # Handle other fields from form data
        for field in ['name', 'email', 'role', 'groups']:
            if field in request.form:
                setattr(member, field, request.form[field])
    else:
        # Handle JSON update as before
        try:
            member_data = member_schema.load(request.json, partial=True)
        except ValidationError as e:
            return jsonify(e.messages), 400
        for field, value in member_data.items():
            setattr(member, field, value)

    db.session.commit()
    return member_schema.jsonify(member), 200

# Delete a member
@members_bp.route('/<int:member_id>', methods=['DELETE'])
@token_required
def delete_member(current_user_id,member_id):
    member = db.session.get(Member, member_id)
    if not member:
        return jsonify({"error": "Member not found"}), 404
    db.session.delete(member)
    db.session.commit()
    return jsonify({"message": "Member deleted"}), 200

# Bulk create members from CSV or RTF
@members_bp.route('/upload', methods=['POST'])
@token_required
def upload_members(current_user_id):  # ← ADD current_user_id parameter
    # Get the current user to set institution info
    user = db.session.get(User, current_user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    
    file = request.files['file']
    filename = file.filename.lower()
    members_created = []
    
    if filename.endswith('.csv'):
        stream = io.StringIO(file.stream.read().decode("UTF8"), newline=None)
        reader = csv.DictReader(stream)
        for row in reader:
            try:
                member_data = member_schema.load(row, session=db.session)
                # Set institution info from current user
                member_data.institution_id = user.institution_id
                member_data.created_by_user_id = user.id
                db.session.add(member_data)
                members_created.append(member_schema.dump(member_data))
            except ValidationError:
                continue
        db.session.commit()
        return jsonify({"created": members_created}), 201
        
    elif filename.endswith('.rtf'):
        content = file.stream.read().decode("UTF8")
        lines = [line.strip() for line in content.splitlines() if ',' in line]
        for line in lines:
            parts = [p.strip() for p in line.split(',')]
            if len(parts) >= 2:
                member_data = {"name": parts[0], "email": parts[1]}
                try:
                    member_data = member_schema.load(member_data, session=db.session)
                    # Set institution info from current user
                    member_data.institution_id = user.institution_id
                    member_data.created_by_user_id = user.id
                    db.session.add(member_data)
                    members_created.append(member_schema.dump(member_data))
                except ValidationError:
                    continue
        db.session.commit()
        return jsonify({"created": members_created}), 201
    else:
        return jsonify({"error": "Unsupported file type"}), 400