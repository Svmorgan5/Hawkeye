# backend/application/blueprints/alert/__init__.py
from flask import Blueprint

alerts_bp = Blueprint('alerts_bp', __name__)

from . import routes