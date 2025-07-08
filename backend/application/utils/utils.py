from jose import jwt, JWTError
from flask_cors import CORS
from datetime import datetime, timezone, timedelta
from functools import wraps
from flask import request, jsonify
import os
import json
from urllib.request import urlopen
from backend.application.models import db, User, Member, Camera


SECRET_KEY = os.environ.get('SECRET_KEY') or "super secret secrets"



def encode_token(user_id):
    payload = {
        'exp': datetime.now(timezone.utc) + timedelta(days=0, hours=12),
        'iat': datetime.now(timezone.utc),
        'sub': str(user_id)  # Convert customer_id to a string
    }
    
    token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')
    
    return token


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        # print(f"Current UTC Time: {datetime.now(timezone.utc)}") DEBUGGING PRINT STATEMENT
        # print(f"Authorization Header: {request.headers.get('Authorization')}") DEBUGGING PRINT STATEMENT

        if 'Authorization' in request.headers:

            token = request.headers['Authorization'].split()[1]

            if not token:
                return jsonify({'message': 'missing token'}), 400
            
            try:
                data = jwt.decode(token, SECRET_KEY, algorithms='HS256')
                #print(data) token data for debuggings
                customer_id = data['sub']
            except jwt.ExpiredSignatureError as e:
                return jsonify({'message': 'token expired'}), 400
            except JWTError as e:
                print(f"Invalid token! Error: {e}")
                return jsonify({'message':'invalid token'}), 400
            
            return f(customer_id, *args, **kwargs)
        
        else:
            return jsonify({'message': 'You must be logged in to access this.'}), 400
        
    return decorated

#notifction function for all users/members of an institution when an alert is created for one of their cameras

def notify_institution_on_alert(camera_id, alert_id):
    camera = db.session.get(Camera, camera_id)
    if not camera or not camera.institution_id:
        return

    institution_id = camera.institution_id

    users = db.session.query(User).filter_by(institution_id=institution_id).all()
    members = db.session.query(Member).filter_by(institution_id=institution_id).all()

    for user in users:
        print(f"Notify user {user.email} about alert {alert_id} from camera {camera.name}")

    for member in members:
        print(f"Notify member {member.email} about alert {alert_id} from camera {camera.name}")



