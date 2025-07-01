from flask import Blueprint

institutions_bp = Blueprint('institutions_bp', __name__)

from . import routes 