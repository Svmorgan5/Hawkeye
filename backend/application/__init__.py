# backend/application/__init__.py

import os
from flask import Flask, send_from_directory
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

import os
from flask import Flask, send_from_directory, abort
from flask_cors import CORS
from flask_socketio import SocketIO
from backend.application.models import db
from backend.application.extensions import ma, limiter, cache
from flask_swagger_ui import get_swaggerui_blueprint

# your blueprints
from backend.application.blueprints.user        import users_bp
from backend.application.blueprints.camera      import cameras_bp
from backend.application.blueprints.member      import members_bp
from backend.application.blueprints.alert       import alerts_bp
from backend.application.blueprints.institutions import institutions_bp

# your config file
from config import ProductionConfig, DevelopmentConfig, TestingConfig

socketio = SocketIO()

SWAGGER_URL  = '/api/docs'        # where you view UI
API_YAML_URL = '/static/swagger.yml'  # where your YAML lives

def create_app(config_name="ProductionConfig"):
    # 1) figure out where our React dist lives
    project_root  = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
    static_folder = os.path.join(project_root, 'Hawkeye', 'dist')

    # 2) spin up Flask, pointing it at that folder
    app = Flask(
        __name__,
        static_folder=static_folder,
        static_url_path=''   # so "/" serves index.html
    )

    # 3) load config so SQLALCHEMY_DATABASE_URI is set
    config_map = {
        "ProductionConfig":  ProductionConfig,
        "DevelopmentConfig": DevelopmentConfig,
        "TestingConfig":     TestingConfig,
    }
    app.config.from_object(config_map[config_name])

    # 4) init extensions
    CORS(app)
    socketio.init_app(app, cors_allowed_origins="*")
    db.init_app(app)
    ma.init_app(app)
    limiter.init_app(app)
    cache.init_app(app)

    # 5) mount your API blueprints
    app.register_blueprint(users_bp,        url_prefix='/users')
    app.register_blueprint(members_bp,      url_prefix='/members')
    app.register_blueprint(cameras_bp,      url_prefix='/cameras')
    app.register_blueprint(institutions_bp, url_prefix='/institutions')
    app.register_blueprint(alerts_bp,       url_prefix='/alerts')

    # 6) set up Swagger UI
    swaggerui_blueprint = get_swaggerui_blueprint(SWAGGER_URL, API_YAML_URL, config={'app_name': "Hawkeye API"})
    app.register_blueprint(swaggerui_blueprint, url_prefix=SWAGGER_URL)

    # 7) last—only if no other route matched, serve React’s index.html
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve_react(path):
        # Let real API/static routes 404 or be handled by Flask
        if any(path.startswith(p) for p in (
            'users', 'members', 'cameras', 'institutions', 'alerts',
            SWAGGER_URL.lstrip('/'), 'static'
        )):
            return abort(404)

        full_path = os.path.join(static_folder, path)
        if path and os.path.exists(full_path):
            return send_from_directory(static_folder, path)

        # otherwise serve index.html so React Router can take over
        return send_from_directory(static_folder, 'index.html')

    return app
