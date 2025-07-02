import os
from flask import request, jsonify
from backend.application.models import db, Notification, User, Member
from backend.application.blueprints.notification.notificationSchemas import notification_schema, notifications_schema
from backend.application.utils.utils import token_required
from flask import Blueprint

notification_bp = Blueprint('notifications', __name__, url_prefix='/notifications')

# POST /notifications
@notification_bp.route('/', methods=['POST'])
@token_required
def create_notification(current_user_id):
    data = request.json

    new_notification = Notification(
        message=data["message"],
        sender_user_id=data.get("sender_user_id"),
        sender_member_id=data.get("sender_member_id"),
    )

    db.session.add(new_notification)
    db.session.commit()
    return notification_schema.jsonify(new_notification), 201

# GET /notifications (all notifications sent by user or member)
@notification_bp.route('/', methods=['GET'])
@token_required
def get_notifications(current_user_id):
    query = db.session.query(Notification).filter(
        (Notification.sender_user_id == current_user_id) |
        (Notification.sender_member_id == current_user_id)
    )
    return notifications_schema.jsonify(query.all()), 200
