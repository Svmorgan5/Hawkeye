#Place Holder to do Schemas

from marshmallow_enum import EnumField
from backend.application.models import Alert, AlertType
from backend.application.extensions import ma


class AlertSchema(ma.SQLAlchemyAutoSchema):
    alert_type = EnumField(AlertType, by_value=True, required=True)

    class Meta:
        model = Alert
        include_relationships = True
        load_instance = True

alert_schema = AlertSchema()
alerts_schema = AlertSchema(many=True)