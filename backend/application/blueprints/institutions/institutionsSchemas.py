from backend.application.models import Institution
from backend.application.extensions import ma


class InstitutionSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Institution
        load_instance = True

institution_schema = InstitutionSchema()
institutions_schema = InstitutionSchema(many=True)