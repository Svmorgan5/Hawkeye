# flask_app.py

from backend.application import create_app, socketio
from backend.application.models import db

# ← now picks up UPLOAD_FOLDER from config
app = create_app('DevelopmentConfig')

with app.app_context():
    #db.drop_all()
    db.create_all()

from backend.application.scheduler import start_scheduler
scheduler = start_scheduler(app)

if __name__ == "__main__":
    # use the config’s DEBUG flag
    socketio.run(app, debug=app.config.get('DEBUG', False))
