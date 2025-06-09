from . import users_bp
from backend.application.blueprints.user.userSchemas import user_schema, users_schema, login_schema
from flask import request, jsonify
from backend.application.models import db, User
from marshmallow import ValidationError
from sqlalchemy import select, delete
from backend.application.extensions import limiter, cache
from backend.application.utils.utils import encode_token, token_required


@users_bp.route('/login', methods=['POST'])
def login():
   try:
    credentials = login_schema.load(request.json)
    email = credentials['email']
    password = credentials['password']  
   except ValidationError as e:
      return jsonify(e.messages), 400
   
   query = select(User).where(User.email == email)
   user= db.session.execute(query).scalars().first()

   if user and user.password == password:
      token = encode_token(user.id)

      response = {
         "status": "success",
         "message": "Login successful",
         "token": token
      }
      
      return jsonify(response), 200
   else:
      return jsonify({"message": "Invalid email or password!"}), 401


@users_bp.route('/', methods=['POST'])
@limiter.limit("5 per hour")  # Limit to 5 requests per hour to avoid brute force attacks
def add_user():
   try:
      user_data = user_schema.load(request.json)
   except ValidationError as e:
      return jsonify(e.messages), 400
   
   query = select(User).where(User.email == user_data['email'])
   user = db.session.execute(query).scalars().first()

   if user:
      return jsonify({"error": "User already exists with this email"}), 400
   

   new_user = User(name=user_data['name'], email=user_data['email'], phone=user_data['phone'], password= user_data['password'])

   db.session.add(new_user)
   db.session.commit()
   return user_schema.jsonify(new_user), 201

#token required to get all users
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

    # Only check for email uniqueness if email is being changed, otherwise change what is being modified
    if 'email' in user_data and user_data['email'] != user.email:
        query = select(User).where(User.email == user_data['email'])
        db_user = db.session.execute(query).scalars().first()
        if db_user:
            return jsonify({"error": "Email already exists"}), 400

    for field, value in user_data.items():
        if value is not None:
            setattr(user, field, value)

    db.session.commit()
    return user_schema.jsonify(user), 200


#Token Required to delete user
@users_bp.route("/", methods=['DELETE'])
@token_required
def delete_user(user_id):
   # Fetch the user using the user_id
   query = select(User).where(User.id == user_id)
   user = db.session.execute(query).scalars().first()

   if not user:
      return jsonify({"message": "User not found"}), 400

   # Delete the User
   db.session.delete(user)
   db.session.commit()

   return jsonify({"message":"User deleted successfully."}), 200