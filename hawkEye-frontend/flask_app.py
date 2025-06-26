from backend.application import create_app
from backend.application.models import db

app = create_app('DevelopmentConfig')  # Change to 'TestingConfig' or 'ProductionConfig' as needed

with app.app_context():
    #db.drop_all()  # Drop all tables if they exist & need be
    db.create_all()

if __name__ == "__main__":
    app.run(debug=True)