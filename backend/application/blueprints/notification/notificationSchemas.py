from backend.application.models import Notification
from backend.application.extensions import ma

class NotificationSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Notification
        load_instance = True

notification_schema = NotificationSchema()
notifications_schema = NotificationSchema(many=True)
