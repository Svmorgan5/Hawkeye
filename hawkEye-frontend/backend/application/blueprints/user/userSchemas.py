from backend.application.models import User
from backend.application.extensions import ma


class UserSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = User

user_schema = UserSchema()
users_schema = UserSchema(many=True)
login_schema = UserSchema(exclude=['name','phone']) #Readd dob if need be