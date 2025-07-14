from flask import url_for
from marshmallow import fields, EXCLUDE
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from backend.application.models import Member
from backend.application.extensions import ma

class MemberSchema(ma.SQLAlchemyAutoSchema):
    created_by_user = fields.Nested("UserSchema", dump_only=True)
    institution     = fields.Nested("InstitutionSchema", dump_only=True)

    # New: add a Method field for the external image URL
    image_url = fields.Method("get_image_url", dump_only=True)

    class Meta:
        model = Member
        load_instance = True
        include_fk = True
        include_relationships = True
        unknown = EXCLUDE
        dump_only = (
            "created_by_user_id",
            "institution_id",
            "created_by_user",
            "institution",
        )

    def get_image_url(self, obj):
        """Return a fully-qualified URL for `obj.image`, or None."""
        if not obj.image:
            return None
        # if someone already stored a full URL, just return it
        if obj.image.startswith("http://") or obj.image.startswith("https://"):
            return obj.image
        # otherwise build it from the filename
        return url_for(
            "static",
            filename=f"uploads/{obj.image}",
            _external=True
        )

member_schema  = MemberSchema()
members_schema = MemberSchema(many=True)
