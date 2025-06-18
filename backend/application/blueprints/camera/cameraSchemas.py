from backend.application.models import Camera
from backend.application.extensions import ma


class CameraSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Camera

camera_schema = CameraSchema()
cameras_schema = CameraSchema(many=True)