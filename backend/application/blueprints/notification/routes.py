from flask import request, jsonify
from backend.application.models import db, Notification
from backend.application.blueprints.notification import notification_bp
from backend.application.blueprints.notification.notificationSchemas import notification_schema, notifications_schema
from backend.application.utils.utils import token_required
from sqlalchemy import select

@notification_bp.route('/', methods=['POST'])
@token_required
def create_notification(current_user_id):
    data = request.json
    new_notification = Notification(
        user_id=data["user_id"],
        message=data["message"]
    )
    db.session.add(new_notification)
    db.session.commit()
    return notification_schema.jsonify(new_notification), 201

@notification_bp.route('/', methods=['GET'])
@token_required
def get_notifications(current_user_id):
    query = select(Notification).where(Notification.user_id == current_user_id)
    results = db.session.execute(query).scalars().all()
    return notifications_schema.jsonify(results), 200

@notification_bp.route('/<int:notification_id>/read', methods=['PUT'])
@token_required
def mark_as_read(current_user_id, notification_id):
    notif = db.session.get(Notification, notification_id)
    if not notif or notif.user_id != current_user_id:
        return jsonify({"error": "Notification not found"}), 404
    notif.is_read = True
    db.session.commit()
    return jsonify({"message": "Notification marked as read"}), 200
@notification_bp.route('/<int:notification_id>', methods=['DELETE'])
@token_required
def delete_notification(current_user_id, notification_id):
    notif = db.session.get(Notification, notification_id)
    if not notif or notif.user_id != current_user_id:
        return jsonify({"error": "Notification not found"}), 404
    db.session.delete(notif)
    db.session.commit()
    return jsonify({"message": "Notification deleted"}), 200
