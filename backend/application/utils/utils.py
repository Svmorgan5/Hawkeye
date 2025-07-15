from jose import jwt, JWTError
from flask_cors import CORS
from datetime import datetime, timezone, timedelta
from functools import wraps
from flask import request, jsonify
import os
import boto3
import json
from urllib.request import urlopen
from backend.application.models import db, User, Member, Camera
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


SECRET_KEY = os.environ.get('SECRET_KEY') or "super secret secrets"


#s3 = boto3.client(
 #   's3',
 #   aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
 #   aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY'],
 #   region_name='us-east-1'  # Change to your region
#)
#BUCKET_NAME = 'your-bucket-name'

#def upload_file_to_s3(file_obj, s3_key):
#    s3.upload_fileobj(file_obj, BUCKET_NAME, s3_key, ExtraArgs={'ACL': 'private'})

#def generate_presigned_url(s3_key, expires_in=3600):
#    return s3.generate_presigned_url(
#        'get_object',
#        Params={'Bucket': BUCKET_NAME, 'Key': s3_key},
#        ExpiresIn=expires_in
#    )


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

    # Enhanced logging for school context
    print(f"🏫 ALERT: Notifying institution {institution_id} about alert {alert_id}")
    print(f"📍 Camera Location: {camera.name} at {camera.location}")

    for user in users:
        print(f"📧 Notify school admin {user.email} about alert {alert_id} from camera {camera.name}")
        # TODO: Add urgent email sending logic here

    for member in members:
        print(f"📧 Notify school staff {member.email} about alert {alert_id} from camera {camera.name}")
        # TODO: Add urgent email sending logic here
    
    print(f"✅ Notification completed for alert {alert_id}")

def send_invitation_email(to_email, institution_name, invite_link):
    """
    Send an invitation email to a user to join an institution.
    
    Args:
        to_email (str): Recipient's email address
        institution_name (str): Name of the institution
        invite_link (str): The invitation acceptance link
    
    Returns:
        bool: True if email sent successfully, False otherwise
    """
    try:
        # Email configuration (set these in your environment variables)
        smtp_server = os.environ.get('SMTP_SERVER', 'smtp.gmail.com')
        smtp_port = int(os.environ.get('SMTP_PORT', 587))
        sender_email = os.environ.get('SENDER_EMAIL')
        sender_password = os.environ.get('SENDER_PASSWORD')
        
        if not sender_email or not sender_password:
            print("Email credentials not configured")
            return False
        
        # Create email content
        subject = f"Invitation to join {institution_name} on Hawkeye"
        
        # HTML email body
        html_body = f"""
        <html>
            <body>
                <h2>You're Invited!</h2>
                <p>You have been invited to join <strong>{institution_name}</strong> on Hawkeye.</p>
                <p>Click the button below to accept the invitation:</p>
                <a href="{invite_link}" style="background-color: #4CAF50; color: white; padding: 14px 20px; text-decoration: none; border-radius: 4px;">Accept Invitation</a>
                <p>Or copy and paste this link into your browser:</p>
                <p><a href="{invite_link}">{invite_link}</a></p>
                <p><strong>Note:</strong> This invitation expires in 48 hours.</p>
                <hr>
                <p><small>This email was sent from Hawkeye Security System.</small></p>
            </body>
        </html>
        """
        
        # Plain text fallback
        text_body = f"""
        You're Invited!
        
        You have been invited to join {institution_name} on Hawkeye.
        
        Click the link below to accept the invitation:
        {invite_link}
        
        Note: This invitation expires in 48 hours.
        
        This email was sent from Hawkeye Security System.
        """
        
        # Create message
        msg = MIMEMultipart('alternative')
        msg['From'] = sender_email
        msg['To'] = to_email
        msg['Subject'] = subject
        
        # Attach text and HTML versions
        text_part = MIMEText(text_body, 'plain')
        html_part = MIMEText(html_body, 'html')
        
        msg.attach(text_part)
        msg.attach(html_part)
        
        # Send email
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(sender_email, sender_password)
        server.send_message(msg)
        server.quit()
        
        print(f"Invitation email sent successfully to {to_email}")
        return True
        
    except Exception as e:
        print(f"Failed to send invitation email: {e}")
        return False



