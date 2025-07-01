#Place holder for alert CRUD

from flask import Blueprint, request, jsonify
from backend.application.models import db, Alert, Camera, AlertType, User
from marshmallow import ValidationError
from sqlalchemy import select
from datetime import datetime
from backend.application.blueprints.alert.alertSchemas import alert_schema, alerts_schema
from . import alerts_bp
from backend.application.utils.utils import notify_institution_on_alert, token_required





@alerts_bp.route('/', methods=['POST'])
@token_required
def create_alert(current_user_id):
    try:
        alert_data = alert_schema.load(request.json)
    except ValidationError as e:
        return jsonify(e.messages), 400

    camera_ids = request.json.get('camera_ids', [])
    cameras = db.session.query(Camera).filter(Camera.id.in_(camera_ids)).all() if camera_ids else []

    new_alert = alert_data
    new_alert.cameras = cameras

    db.session.add(new_alert)
    db.session.commit()

    from backend.application import socketio
    if new_alert.alert_type != AlertType.SCHEDULED:
        socketio.emit('new_alert', {
            'id': new_alert.id,
            'message': new_alert.message,
            'alert_type': new_alert.alert_type.value,
            'timestamp': new_alert.timestamp.isoformat(),
            'scheduled_time': new_alert.scheduled_time.isoformat() if new_alert.scheduled_time else None,
        })

    # Notify all users/members for each camera's institution
    for camera in new_alert.cameras:
        notify_institution_on_alert(camera_id=camera.id, alert_id=new_alert.id)

    return alert_schema.jsonify(new_alert), 201


@alerts_bp.route('/', methods=['GET'])
@token_required
def get_alerts(current_user_id):
    alerts = db.session.query(Alert).all()
    return alerts_schema.jsonify(alerts), 200
## Commented out GET all alerts route for security reasons. Alerts should be fetched based on institution/camera.
# Get single alert
@alerts_bp.route('/<int:alert_id>', methods=['GET'])
@token_required
def get_alert(current_user_id, alert_id):
    alert = db.session.get(Alert, alert_id)
    if not alert:
        return jsonify({"error": "Alert not found"}), 404
    return alert_schema.jsonify(alert), 200

#@alerts_bp.route('/institution', methods=['GET'])
#@token_required
#def get_institution_alerts(current_user_id):
    user = db.session.get(User, current_user_id)
    if not user or not user.institution_id:
        return jsonify({"error": "User or institution not found"}), 404

    # Get all cameras for this institution
    camera_ids = [c.id for c in db.session.query(Camera).filter_by(institution_id=user.institution_id).all()]
    # Get all alerts linked to those cameras
    alerts = db.session.query(Alert).join(Alert.cameras).filter(Camera.id.in_(camera_ids)).all()
    return alerts_schema.jsonify(alerts), 200

# Update alert
@alerts_bp.route('/<int:alert_id>', methods=['PUT'])
@token_required
def update_alert(current_user_id,alert_id):
    alert = db.session.get(Alert, alert_id)
    if not alert:
        return jsonify({"error": "Alert not found"}), 404
    try:
        # This returns an Alert instance with updated fields
        updated_alert = alert_schema.load(request.json, session=db.session, instance=alert, partial=True)
    except ValidationError as e:
        return jsonify(e.messages), 400

    db.session.commit()
    return alert_schema.jsonify(updated_alert), 200

# Delete alert
@alerts_bp.route('/<int:alert_id>', methods=['DELETE'])
@token_required
def delete_alert(current_user_id,alert_id ):
    alert = db.session.get(Alert, alert_id)
    if not alert:
        return jsonify({"error": "Alert not found"}), 404
    db.session.delete(alert)
    db.session.commit()
    return jsonify({"message": "Alert deleted successfully."}), 200

