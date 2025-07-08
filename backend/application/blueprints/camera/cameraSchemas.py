from backend.application.models import Camera, db
from backend.application.extensions import ma


class CameraSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Camera
        load_instance = True  


camera_schema = CameraSchema(session=db.session)
cameras_schema = CameraSchema(many=True, session=db.session)