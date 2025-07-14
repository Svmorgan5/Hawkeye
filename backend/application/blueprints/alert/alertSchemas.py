#Place Holder to do Schemas
from marshmallow import fields, EXCLUDE
from marshmallow_enum import EnumField
from backend.application.models import Alert, AlertType
from backend.application.extensions import ma


class AlertSchema(ma.SQLAlchemyAutoSchema):
    alert_type = EnumField(AlertType, by_value=True, required=True)
    scheduled_time = fields.DateTime(allow_none=True)
    location = fields.Str(required=True, allow_none=False)  # Add this line
    # Mark institution as dump_only so it isn't expected on input
    institution = fields.Nested("InstitutionSchema", dump_only=True)
    
    class Meta:
        model = Alert
        include_relationships = True
        load_instance = True
        unknown = EXCLUDE   # ignore extra fields like camera_ids
        dump_only = ("code", "institution_id", "timestamp", "institution")  # Remove "location" from here

alert_schema = AlertSchema()
alerts_schema = AlertSchema(many=True)