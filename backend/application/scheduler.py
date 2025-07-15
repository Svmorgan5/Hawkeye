from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime, timezone, timedelta
from backend.application.models import db, Alert, AlertType
from backend.application import socketio
from backend.application.utils.utils import notify_institution_on_alert

# Track sent reminders to prevent duplicates
sent_reminders = set()
scheduler_instance = None  # Add this line

def process_scheduled_alerts(app):
    global sent_reminders
    
    with app.app_context():
        print(f"🔍 Scheduler running at {datetime.now()}")
        
        # Use timezone-aware UTC for calculations
        now = datetime.now(timezone.utc)
        one_hour_from_now = now + timedelta(hours=1)
        
        # For database queries, convert to naive UTC for comparison
        now_naive = now.replace(tzinfo=None)
        one_hour_naive = one_hour_from_now.replace(tzinfo=None)
        
        print(f"🕒 Current time (naive UTC): {now_naive}")
        
        # Get alerts due in next hour
        alerts_due_in_hour = db.session.query(Alert).filter(
            Alert.scheduled_time != None,
            Alert.scheduled_time <= one_hour_naive,
            Alert.scheduled_time > now_naive,
            Alert.alert_type == AlertType.SCHEDULED
        ).all()
        
        # Get alerts due now (within next 5 minutes for immediate trigger)
        five_minutes_from_now = now + timedelta(minutes=5)
        five_min_naive = five_minutes_from_now.replace(tzinfo=None)
        
        alerts_due_now = db.session.query(Alert).filter(
            Alert.scheduled_time != None,
            Alert.scheduled_time <= five_min_naive,
            Alert.alert_type == AlertType.SCHEDULED
        ).all()
        
        print(f"📋 Found {len(alerts_due_now)} alerts due now (within 5 minutes)")
        print(f"⏰ Found {len(alerts_due_in_hour)} alerts due in 1 hour")
        
        # Send reminders only for alerts not already processed
        for alert in alerts_due_in_hour:
            if alert.id not in sent_reminders:
                time_until = alert.scheduled_time - now_naive
                minutes_until = time_until.total_seconds() / 60
                
                print(f"⏰ Processing reminder for alert {alert.id} - FIRST TIME ({minutes_until:.1f} minutes until)")
                
                # Send SocketIO reminder
                institution_room = f"institution_{alert.institution_id}"
                socketio.emit('school_reminder', {
                    'id': alert.id,
                    'message': f"🏫 SCHOOL REMINDER: {alert.message} (scheduled in {int(minutes_until)} minutes)",
                    'alert_type': alert.alert_type.value,
                    'scheduled_time': alert.scheduled_time.isoformat(),
                    'location': alert.location,
                    'minutes_until': int(minutes_until),
                    'status': 'drill_reminder'
                }, room=institution_room)
                
                print(f"📡 SocketIO reminder emitted for alert {alert.id}")
                
                # Send email reminders
                for camera in alert.cameras:
                    notify_institution_on_alert(camera_id=camera.id, alert_id=alert.id)
                
                # Mark as sent
                sent_reminders.add(alert.id)
                print(f"✅ Added alert {alert.id} to sent reminders cache")
            else:
                print(f"⏰ Alert {alert.id} reminder already sent - skipping")
        
        # Process alerts due now (trigger them)
        for alert in alerts_due_now:
            print(f"🚨 Triggering alert {alert.id}: {alert.message}")
            
            for camera in alert.cameras:
                notify_institution_on_alert(camera_id=camera.id, alert_id=alert.id)
            
            alert.alert_type = AlertType.REAL
            
            # EMIT ALERT TRIGGERED
            institution_room = f"institution_{alert.institution_id}"
            socketio.emit('school_alert_triggered', {
                'id': alert.id,
                'message': alert.message,
                'alert_type': alert.alert_type.value,
                'timestamp': alert.timestamp.isoformat() if alert.timestamp else None,
                'location': alert.location,
                'cameras': [{'id': c.id, 'name': c.name, 'location': c.location} for c in alert.cameras],
                'status': 'active_now'
            }, room=institution_room)
            
            print(f"📡 Alert {alert.id} triggered and emitted")
            
            # Clean up from reminder cache
            if alert.id in sent_reminders:
                sent_reminders.remove(alert.id)
                print(f"🗑️ Removed triggered alert {alert.id} from reminder cache")
        
        if alerts_due_now:
            db.session.commit()
            print(f"💾 Database updated")
        else:
            print("😴 No alerts to process immediately")

def start_scheduler(app):
    global scheduler_instance
    
    # Check if scheduler already exists and is running
    if 'scheduler_instance' in globals() and scheduler_instance is not None:
        try:
            if scheduler_instance.running:
                print("⚠️ Scheduler already running - skipping duplicate")
                return scheduler_instance
            else:
                print("⚠️ Stopping old scheduler instance")
                scheduler_instance.shutdown()
        except:
            print("⚠️ Error checking scheduler - creating new one")
    
    scheduler_instance = BackgroundScheduler()
    
    # Add the job with 300-second interval
    scheduler_instance.add_job(
        func=process_scheduled_alerts,
        trigger="interval",
        seconds=300,  # Run every 300 seconds (5 minutes)
        args=[app],
        id='process_alerts'
    )
    
    scheduler_instance.start()
    print("🚀 Starting scheduler...")
    print("✅ Scheduler started - checking every 300 seconds")
    print(f"🔧 Active jobs: {len(scheduler_instance.get_jobs())}")
    
    return scheduler_instance