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
    
    # Handle both JSON and multipart/form-data
    if request.content_type and request.content_type.startswith('multipart/form-data'):
        # Extract member data from form
        member_data = {}
        for field in ['name', 'email', 'role', 'groups']:
            if field in request.form:
                member_data[field] = request.form[field]
        
        # Handle image upload
        if 'image' in request.files:
            file = request.files['image']
            if file and _allowed_file(file.filename):
                filename = secure_filename(file.filename)
                save_dir = current_app.config.get('UPLOAD_FOLDER', 'static/uploads')
                os.makedirs(save_dir, exist_ok=True)
                path = os.path.join(save_dir, filename)
                file.save(path)
                member_data['image'] = url_for('static', filename=f'uploads/{filename}', _external=True)
    else:
        # Handle JSON data
        member_data = request.json
    
    try:
        member_instance = member_schema.load(member_data, session=db.session)
    except ValidationError as e:
        return jsonify(e.messages), 400
    
    # Auto-assign fields from current user
    member_instance.institution_id = user.institution_id
    member_instance.created_by_user_id = user.id

    db.session.add(member_instance)
    db.session.commit()
    
    return jsonify(member_schema.dump(member_instance)), 201

# Get all members or search members by name
@members_bp.route('/', methods=['GET'])
@token_required
def get_members(current_user_id):
    # Get the current user to access their institution
    user = db.session.get(User, current_user_id)
    if not user or not user.institution_id:
        return jsonify({"error": "User or institution not found"}), 404
    
    search = request.args.get('search')
    
    # ✅ Filter by user's institution FIRST
    query = db.session.query(Member).filter_by(institution_id=user.institution_id)
    
    if search:
        # Enhanced search: name, email, and ID
        search_filter = db.or_(
            Member.name.ilike(f"%{search}%"),
            Member.email.ilike(f"%{search}%"),
            Member.id == int(search) if search.isdigit() else False
        )
        query = query.filter(search_filter)
    
    members = query.order_by(Member.name.asc()).all()

    # Process images
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


@members_bp.route('/<int:member_id>', methods=['GET'])
@token_required
def get_member(current_user_id, member_id):
    member = db.session.get(Member, member_id)
    if not member:
        return jsonify({"error": "Member not found"}), 404

    data = member_schema.dump(member)
    img  = data.get('image')
    if img:
        if img.startswith('http://') or img.startswith('https://'):
            data['image'] = img
        else:
            data['image'] = url_for(
                'static',
                filename=f"uploads/{img}",
                _external=True
            )
    else:
        data['image'] = None

    return jsonify(data), 200

# Update a member
@members_bp.route('/<int:member_id>', methods=['PUT'])
@token_required
def update_member(current_user_id, member_id):
    member = db.session.get(Member, member_id)
    if not member:
        return jsonify({"error": "Member not found"}), 404

    # Check authorization (optional)
    current_user = db.session.get(User, current_user_id)
    if not current_user or current_user.institution_id != member.institution_id:
        return jsonify({"error": "Not authorized"}), 403

    # Handle multipart/form-data (with potential image upload)
    if request.content_type and request.content_type.startswith('multipart/form-data'):
        # Handle image upload if present
        if 'image' in request.files:
            file = request.files['image']
            if file and _allowed_file(file.filename):
                filename = secure_filename(file.filename)
                save_dir = current_app.config.get('UPLOAD_FOLDER', 'static/uploads')
                os.makedirs(save_dir, exist_ok=True)
                path = os.path.join(save_dir, filename)
                file.save(path)
                member.image = url_for('static', filename=f'uploads/{filename}', _external=True)
        
        # Handle other fields from form data
        for field in ['name', 'email', 'role', 'groups']:
            if field in request.form:
                setattr(member, field, request.form[field])
    else:
        # Handle JSON update
        try:
            member_data = member_schema.load(request.json, partial=True, session=db.session)
        except ValidationError as e:
            return jsonify(e.messages), 400
        
        for field, value in member_schema.dump(member_data).items():
            if value is not None:  # Only update non-null values
                setattr(member, field, value)

    db.session.commit()
    return jsonify(member_schema.dump(member)), 200

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