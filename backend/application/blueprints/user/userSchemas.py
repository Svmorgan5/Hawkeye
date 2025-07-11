from backend.application.models import User, db
from backend.application.extensions import ma
from marshmallow import fields

class UserSchema(ma.SQLAlchemyAutoSchema):
    password = fields.String(load_only=True)   # ← password can be provided, but won't be dumped
    class Meta:
        model = User
        load_instance = True
        sqla_session = db.session
        include_fk = True
        # optionally:
        exclude = ("cameras", "institutions", "invitations_sent")  # hide relationships           # ← so it picks up your FK fields

class PublicUserSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = User
        load_instance = True
        include_relationships = True
        exclude = ("id", "password", "phone", "institution", "email" )  # Hide id, password, phone

user_schema = UserSchema()
users_schema = UserSchema(many=True)
login_schema = UserSchema(exclude=['name','phone', 'role']) 
public_user_schema = PublicUserSchema()