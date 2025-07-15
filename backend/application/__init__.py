# backend/application/__init__.py

import os
from flask import Flask
from flask_cors import CORS
from flask_socketio import SocketIO
from backend.application.models import db
from backend.application.extensions import ma, limiter, cache
from flask_swagger_ui import get_swaggerui_blueprint
from backend.application.blueprints.user import users_bp
from backend.application.blueprints.camera import cameras_bp
from backend.application.blueprints.member import members_bp
from backend.application.blueprints.alert import alerts_bp
from backend.application.blueprints.institutions import institutions_bp

socketio = SocketIO()

SWAGGER_URL = '/api/docs'
API_URL     = '/static/swagger.yml'
swaggerui_blueprint = get_swaggerui_blueprint(
    SWAGGER_URL,
    API_URL,
    config={'app_name': "Hawkeye API"}
)

def create_app(config_name):
    # point static_folder at your top-level /static dir
    project_root  = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
    static_folder = os.path.join(project_root, 'static')

    app = Flask(
        __name__,
        static_folder=static_folder,
        static_url_path='/static'
    )
    app.config.from_object(f'config.{config_name}')

    CORS(app)
    socketio.init_app(app, cors_allowed_origins="*")
    db.init_app(app)
    ma.init_app(app)
    limiter.init_app(app)
    cache.init_app(app)

    app.register_blueprint(users_bp,        url_prefix='/users')
    app.register_blueprint(members_bp,      url_prefix='/members')
    app.register_blueprint(cameras_bp,      url_prefix='/cameras')
    app.register_blueprint(institutions_bp, url_prefix='/institutions')
    app.register_blueprint(alerts_bp,       url_prefix='/alerts')
    app.register_blueprint(swaggerui_blueprint, url_prefix=SWAGGER_URL)

    return app
