from flask import Blueprint

cameras_bp = Blueprint('cameras_bp', __name__)

from . import routes 