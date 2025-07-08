from backend.application.models import Member
from backend.application.extensions import ma


class MemberSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Member

member_schema = MemberSchema()
members_schema = MemberSchema(many=True)