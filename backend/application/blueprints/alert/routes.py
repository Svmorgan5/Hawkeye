#Place holder for alert CRUD

from flask import Blueprint, request, jsonify
from backend.application.models import db, Alert, Camera, AlertType, User
from marshmallow import ValidationError
from sqlalchemy import select
from datetime import datetime, timezone, timedelta
from backend.application.blueprints.alert.alertSchemas import alert_schema, alerts_schema
from . import alerts_bp
from backend.application.utils.utils import notify_institution_on_alert, token_required
import pytz




@alerts_bp.route('/', methods=['POST'])
@token_required
def create_alert(current_user_id):
    try:
        alert_data = alert_schema.load(request.json, session=db.session)
    except ValidationError as e:
        return jsonify(e.messages), 400

    # Get current user first
    current_user = db.session.get(User, current_user_id)
    if not current_user or not current_user.institution_id:
        return jsonify({"error": "User institution not found."}), 400

    # Set required fields
    new_alert = alert_data
    new_alert.timestamp = datetime.now(timezone.utc)
    new_alert.code = "ALERT-" + str(new_alert.timestamp.timestamp()).replace('.', '')
    new_alert.institution_id = current_user.institution_id
    
    # Handle timezone conversion
    if new_alert.scheduled_time:
        if new_alert.scheduled_time.tzinfo is None:
            local_tz = pytz.timezone('America/New_York')
            local_dt = local_tz.localize(new_alert.scheduled_time)
            new_alert.scheduled_time = local_dt.astimezone(timezone.utc).replace(tzinfo=None)
        else:
            new_alert.scheduled_time = new_alert.scheduled_time.astimezone(timezone.utc).replace(tzinfo=None)

    new_alert.timestamp = new_alert.timestamp.replace(tzinfo=None)

    print(f"🕒 Alert scheduled time (naive UTC): {new_alert.scheduled_time}")

    # ADD ALERT TO SESSION FIRST
    db.session.add(new_alert)
    db.session.flush()
    
    # Associate cameras
    camera_ids = request.json.get('camera_ids', [])
    if camera_ids:
        cameras = db.session.query(Camera).filter(Camera.id.in_(camera_ids)).all()
        new_alert.cameras = cameras
        
        if not new_alert.location and cameras:
            new_alert.location = cameras[0].location

    db.session.commit()

    from backend.application import socketio
    
    print(f"🚨 Alert created: {new_alert.id} for institution {current_user.institution_id}")
    
    # Emit to school institution room
    institution_room = f"institution_{new_alert.institution_id}"
    socketio.emit('school_alert', {
        'id': new_alert.id,
        'message': new_alert.message,
        'alert_type': new_alert.alert_type.value,
        'timestamp': new_alert.timestamp.isoformat(),
        'scheduled_time': new_alert.scheduled_time.isoformat() if new_alert.scheduled_time else None,
        'location': new_alert.location,
        'cameras': [{'id': c.id, 'name': c.name, 'location': c.location} for c in new_alert.cameras],
        'status': 'scheduled' if new_alert.alert_type == AlertType.SCHEDULED else 'active'
    }, room=institution_room)
    
    print(f"✅ Alert {new_alert.id} emitted to institution room")

    # ONLY send notifications for REAL alerts, NOT scheduled ones
    if new_alert.alert_type == AlertType.REAL:
        print(f"📧 Sending immediate notifications for REAL alert {new_alert.id}")
        for camera in new_alert.cameras:
            notify_institution_on_alert(camera_id=camera.id, alert_id=new_alert.id)
    else:
        print(f"⏰ SCHEDULED alert {new_alert.id} created - notifications will be sent when due")

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

@alerts_bp.route('/weapon-detected', methods=['POST'])
@token_required
def weapon_detected_alert(current_user_id):
    """Handle weapon detection from camera system"""
    camera_id = request.json.get('camera_id')
    detection_confidence = request.json.get('confidence', 0.0)
    weapon_type = request.json.get('weapon_type', 'Unknown weapon')
    
    if not camera_id:
        return jsonify({"error": "Camera ID required"}), 400
    
    camera = db.session.get(Camera, camera_id)
    if not camera:
        return jsonify({"error": "Camera not found"}), 404

    # Create URGENT weapon detection alert
    new_alert = Alert(
        message=f"🚨 WEAPON DETECTED: {weapon_type} detected at {camera.location}",
        alert_type=AlertType.REAL,
        timestamp=datetime.now(timezone.utc).replace(tzinfo=None),  # Store as naive UTC in database
        location=camera.location,
        institution_id=camera.institution_id
    )
    
    new_alert.code = "WEAPON-" + str(new_alert.timestamp.timestamp()).replace('.', '')
    
    # ADD TO SESSION FIRST
    db.session.add(new_alert)
    db.session.flush()
    
    # THEN associate camera
    new_alert.cameras = [camera]
    
    # NOW commit
    db.session.commit()

    from backend.application import socketio
    
    print(f"🚨 WEAPON DETECTED: Camera {camera.name} detected {weapon_type}")
    
    # Emit URGENT alert to entire school institution
    institution_room = f"institution_{camera.institution_id}"
    socketio.emit('weapon_alert', {
        'id': new_alert.id,
        'message': new_alert.message,
        'alert_type': 'WEAPON_DETECTION',
        'timestamp': new_alert.timestamp.isoformat(),
        'location': new_alert.location,
        'camera': {
            'id': camera.id, 
            'name': camera.name, 
            'location': camera.location,
            'stream_url': f'/cameras/{camera.id}/stream'
        },
        'weapon_type': weapon_type,
        'confidence': detection_confidence,
        'status': 'URGENT',
        'priority': 'CRITICAL'
    }, room=institution_room)

    # Also emit to general broadcast for immediate attention
    socketio.emit('emergency_alert', {
        'institution_id': camera.institution_id,
        'camera_id': camera.id,
        'message': new_alert.message,
        'action': 'OPEN_CAMERA_IMMEDIATELY'
    })

    # Send email notifications to ALL school staff
    notify_institution_on_alert(camera_id=camera.id, alert_id=new_alert.id)
    
    print(f"📡 WEAPON ALERT {new_alert.id} broadcasted to school {camera.institution_id}")
    print(f"📧 Emergency notifications sent to all staff")

    return jsonify({
        'alert_id': new_alert.id,
        'camera_id': camera.id,
        'camera_name': camera.name,
        'message': 'WEAPON DETECTION ALERT CREATED - IMMEDIATE ACTION REQUIRED',
        'open_camera_url': f'/cameras/{camera.id}/live'
    }), 201

@alerts_bp.route('/debug/alerts', methods=['GET'])
@token_required
def debug_alerts(current_user_id):
    """Debug scheduled alerts and their times"""
    user = db.session.get(User, current_user_id)
    alerts = db.session.query(Alert).filter_by(
        institution_id=user.institution_id,
        alert_type=AlertType.SCHEDULED
    ).all()
    
    # Use timezone-aware UTC (recommended approach)
    now = datetime.now(timezone.utc)
    one_hour_from_now = now + timedelta(hours=1)
    
    print(f"🕒 Current UTC time (timezone-aware): {now}")
    print(f"🕒 One hour from now: {one_hour_from_now}")
    
    # Convert to naive for database comparison (same as scheduler)
    now_naive = now.replace(tzinfo=None)
    one_hour_naive = one_hour_from_now.replace(tzinfo=None)
    
    debug_info = []
    for alert in alerts:
        print(f"📅 Alert {alert.id}: {alert.message}")
        print(f"   Scheduled time: {alert.scheduled_time}")
        print(f"   Scheduled type: {type(alert.scheduled_time)}")
        if alert.scheduled_time:
            print(f"   Timezone info: {alert.scheduled_time.tzinfo}")
            
            # Use same logic as scheduler
            time_diff = alert.scheduled_time - now_naive
            total_minutes = time_diff.total_seconds() / 60
            print(f"   Time until alert: {time_diff} ({total_minutes:.1f} minutes)")
            
            # Check using SAME logic as scheduler (broader 1-hour window)
            if now_naive < alert.scheduled_time <= one_hour_naive:
                print(f"   ✅ This alert IS in the 1-hour reminder window")
            else:
                print(f"   ❌ This alert is NOT in the 1-hour reminder window")
                print(f"      Now: {now_naive}")
                print(f"      Alert: {alert.scheduled_time}")
                print(f"      One hour: {one_hour_naive}")
        
        debug_info.append({
            'id': alert.id,
            'message': alert.message,
            'scheduled_time': alert.scheduled_time.isoformat() if alert.scheduled_time else None,
            'current_utc': now.isoformat(),
            'one_hour_window': one_hour_naive.isoformat(),
            'timezone_info': str(alert.scheduled_time.tzinfo) if alert.scheduled_time else None,
            'time_until_alert': str(time_diff) if alert.scheduled_time else None,
            'minutes_until': total_minutes if alert.scheduled_time else None
        })
    
    return jsonify(debug_info), 200

