from backend.application.models import Notification
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema

class NotificationSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Notification
        load_instance = True

notification_schema = NotificationSchema()
notifications_schema = NotificationSchema(many=True)
# This schema is used to serialize and deserialize Notification objects
# It includes all fields from the Notification model and allows for instance loading