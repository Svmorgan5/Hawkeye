from marshmallow import fields, EXCLUDE
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from backend.application.models import Member
from backend.application.extensions import ma


class MemberSchema(ma.SQLAlchemyAutoSchema):
    # Mark auto-assigned fields as dump_only (output only, not required for input)
    created_by_user = fields.Nested("UserSchema", dump_only=True)
    institution = fields.Nested("InstitutionSchema", dump_only=True)
    
    class Meta:
        model = Member
        load_instance = True  # This ensures load() returns Member instances
        include_fk = True
        include_relationships = True
        unknown = EXCLUDE  # Ignore unknown fields
        dump_only = ("created_by_user_id", "institution_id", "created_by_user", "institution")

member_schema = MemberSchema()
members_schema = MemberSchema(many=True)