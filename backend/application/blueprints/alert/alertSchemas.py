#Place Holder to do Schemas
from marshmallow import fields
from marshmallow_enum import EnumField
from backend.application.models import Alert, AlertType
from backend.application.extensions import ma


class AlertSchema(ma.SQLAlchemyAutoSchema):
    alert_type = EnumField(AlertType, by_value=True, required=True)
    scheduled_time = fields.DateTime(allow_none=True)


    class Meta:
        model = Alert
        include_relationships = True
        load_instance = True
        # In your alertSchema

alert_schema = AlertSchema()
alerts_schema = AlertSchema(many=True)