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