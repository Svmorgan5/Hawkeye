from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime, timezone
from backend.application.models import db, Alert, AlertType
from backend.application.utils.utils import notify_institution_on_alert
from backend.application import socketio  

def process_scheduled_alerts(app):
    with app.app_context():
        now = datetime.now(timezone.utc)
        alerts = db.session.query(Alert).filter(
            Alert.scheduled_time != None,
            Alert.scheduled_time <= now,
            Alert.alert_type == AlertType.SCHEDULED
        ).all()
        for alert in alerts:
            for camera in alert.cameras:
                notify_institution_on_alert(camera_id=camera.id, alert_id=alert.id)
            alert.alert_type = AlertType.REAL
            
            # Emit SocketIO event for scheduled alert
            socketio.emit('new_alert', {
                'id': alert.id,
                'message': alert.message,
                'alert_type': alert.alert_type.value,
                'timestamp': alert.timestamp.isoformat(),
            })
        db.session.commit()

def start_scheduler(app):
    scheduler = BackgroundScheduler()
    scheduler.add_job(func=lambda: process_scheduled_alerts(app), trigger="interval", seconds=60)
    scheduler.start()
    return scheduler