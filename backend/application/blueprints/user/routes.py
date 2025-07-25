import os
import re
from . import users_bp
from backend.application.blueprints.user.userSchemas import user_schema, users_schema, login_schema
from flask import request, jsonify, current_app, url_for
from backend.application.models import db, User
from marshmallow import ValidationError
from sqlalchemy import select, delete
from backend.application.extensions import limiter, cache
from backend.application.utils.utils import encode_token, token_required, upload_file_to_s3, build_s3_public_url
from werkzeug.utils import secure_filename
from werkzeug.security import generate_password_hash, check_password_hash


# Add this to the top of your users/routes.py
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def _allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@users_bp.route('/login', methods=['POST'])
def login():
    try:
        credentials = login_schema.load(request.json)
        email = credentials.email
        password = credentials.password  
    except ValidationError as e:
        return jsonify(e.messages), 400
   
    query = select(User).where(User.email == email)
    user = db.session.execute(query).scalars().first()

    if user and check_password_hash(user.password, password):
        token = encode_token(user.id)
        
        # Handle user image URL (supports S3 keys, full URLs, or legacy local files)
        user_image = user.image
        if user_image:
            if user_image.startswith(('http://', 'https://')):
                user_image_url = user_image                     # already full URL
            elif '/' in user_image:                             # looks like an S3 object key
                user_image_url = build_s3_public_url(user_image)
            else:                                               # legacy local filename
                user_image_url = url_for(
                    'static',
                    filename=f"uploads/{user_image}",
                    _external=True
                )
        else:
            user_image_url = None
        
        response = {
            "status": "success",
            "message": "Login successful",
            "token": token,
            "user_id": user.id,
            "user_institution": user.institution_id,
            "user_name": user.name,
            "user_image": user_image_url
        }
        return jsonify(response), 200
    else:
        return jsonify({"message": "Invalid email or password!"}), 401


@users_bp.route('/', methods=['POST'])
@limiter.limit("50 per hour")
def add_user():
   try:
      user_data = user_schema.load(request.json)
   except ValidationError as e:
      return jsonify(e.messages), 400
   
   password = user_data.password
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

   query = select(User).where(User.email == user_data.email)
   user = db.session.execute(query).scalars().first()

   if user:
      return jsonify({"error": "User already exists with this email"}), 400

   new_user = User(
      name=user_data.name,
      email=user_data.email,
      phone=user_data.phone,
      password=generate_password_hash(user_data.password),
      role=user_data.role,
   )

   db.session.add(new_user)
   db.session.commit()
   return user_schema.jsonify(new_user), 201

@users_bp.route('/<int:user_id>/upload-image', methods=['POST'])
@token_required
def upload_user_image(current_user_id, user_id):
    """Upload an image for a user → save locally AND on S3."""
    current_user = db.session.get(User, current_user_id)
    if not current_user:
        return jsonify({"error": "User not found"}), 404

    target_user = db.session.get(User, user_id)
    if not target_user:
        return jsonify({"error": "Target user not found"}), 404

    if current_user.id != user_id and current_user.role != 'Admin':
        return jsonify({"error": "Not authorized"}), 403

    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    if file.filename == '' or not _allowed_file(file.filename):
        return jsonify({"error": "Invalid or missing file"}), 400

    # 1️⃣  Save locally (legacy behaviour)
    filename = secure_filename(file.filename)
    save_dir = current_app.config.get('UPLOAD_FOLDER', 'static/uploads')
    os.makedirs(save_dir, exist_ok=True)
    local_path = os.path.join(save_dir, filename)
    file.seek(0)                    # rewind in case it was read
    file.save(local_path)
    local_url = url_for('static', filename=f'uploads/{filename}', _external=True)

    # 2️⃣  Upload the same file to S3
    file.seek(0)                    # rewind again for S3 upload
    s3_key = f"users/{user_id}/{filename}"
    upload_file_to_s3(file, s3_key)
    s3_url = build_s3_public_url(s3_key)

    # Store the S3 URL (keep local_url if you prefer; choose one)
    target_user.image = s3_url
    db.session.commit()

    return jsonify({
        "image": s3_url,
        "local_backup": local_url     # optional, exposed for debugging
    }), 200


#token required to get all users for instituion by instituion
@users_bp.route('/', methods=['GET'])
@token_required
def get_users(current_user_id):  # Accept the argument from the decorator
    try:
        page = int(request.args.get('page'))
        per_page = int(request.args.get('per_page'))
        query = select(User)
        users = db.paginate(query, page=page, per_page=per_page)
        return users_schema.jsonify(users), 200
    except:
        query = select(User)
        result = db.session.execute(query).scalars().all()
        return users_schema.jsonify(result), 200
   

#Token Required to update user
@users_bp.route('/', methods=['PUT'])
@token_required
def update_user(current_user_id):
    query = select(User).where(User.id == current_user_id)
    user = db.session.execute(query).scalars().first()

    if user is None:
        return jsonify({"error": "User not found"}), 200
    try:
        user_data = user_schema.load(request.json, partial=True)  # allow partial updates
    except ValidationError as e:
        return jsonify(e.messages), 400

    # Only check for email uniqueness if email is being changed
    if hasattr(user_data, "email") and user_data.email and user_data.email != user.email:
        query = select(User).where(User.email == user_data.email)
        db_user = db.session.execute(query).scalars().first()
        if db_user:
            return jsonify({"error": "Email already exists"}), 400

    # Update fields if they are not None
    for field in ['name', 'email', 'phone', 'password', 'role', 'image', 'institution_id']:
        value = getattr(user_data, field, None)
        if value is not None:
            setattr(user, field, value)

    db.session.commit()
    return user_schema.jsonify(user), 200


#Token Required to delete user
@users_bp.route("/", methods=['DELETE'])
@token_required
def delete_user(current_user_id):
   # Fetch the user using the current_user_id
   query = select(User).where(User.id == current_user_id)
   user = db.session.execute(query).scalars().first()

   if not user:
      return jsonify({"message": "User not found"}), 400

   
   db.session.delete(user)
   db.session.commit()

   return jsonify({"message":"User deleted successfully."}), 200

@users_bp.route('/logout', methods=['POST'])
@token_required
def logout(current_user_id):
    # Optional: Add token to blacklist for immediate invalidation
    # token = request.headers.get('Authorization', '').replace('Bearer ', '')
    # add_to_blacklist(token)  # You'd need to implement this
    
    return jsonify({
        "status": "success",
        "message": "Successfully logged out"
    }), 200