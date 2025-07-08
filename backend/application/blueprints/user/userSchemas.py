from backend.application.models import User
from backend.application.extensions import ma


class UserSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = User
        load_instance = True
        include_relationships = True
        exclude = ("id", "phone")  

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