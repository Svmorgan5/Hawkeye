from backend.application.models import User
from backend.application.extensions import ma


class UserSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = User
        load_instance = True

user_schema = UserSchema()
users_schema = UserSchema(many=True)
login_schema = UserSchema(exclude=['name','phone', 'role']) #Readd dob if need be