from flask import Blueprint

notifications_bp = Blueprint('notifications_bp', __name__)

from . import routes