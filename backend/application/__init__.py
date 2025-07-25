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

# Swagger setup
SWAGGER_URL = '/api/docs'
API_URL     = '/static/swagger.yml'
swaggerui_bp = get_swaggerui_blueprint(
    SWAGGER_URL,
    API_URL,
    config={'app_name': "Hawkeye API"}
)

def create_app(config_name="ProductionConfig"):
    # 1) project root → static_folder (your Vite output)
    project_root  = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
    static_folder = os.path.join(project_root, 'Hawkeye', 'dist')

    app = Flask(
        __name__,
        static_folder=static_folder,
        static_url_path=''   # “/” serves dist/index.html
    )

    # 2) load config
    from config import ProductionConfig, DevelopmentConfig, TestingConfig
    config_map = {
        "ProductionConfig": ProductionConfig,
        "DevelopmentConfig": DevelopmentConfig,
        "TestingConfig": TestingConfig,
    }
    app.config.from_object(config_map[config_name])

    # 3) init extensions
    CORS(app)
    socketio.init_app(app, cors_allowed_origins="*")
    db.init_app(app)
    ma.init_app(app)
    limiter.init_app(app)
    cache.init_app(app)

    # 4) register all API & swagger blueprints first
    app.register_blueprint(users_bp,        url_prefix='/users')
    app.register_blueprint(members_bp,      url_prefix='/members')
    app.register_blueprint(cameras_bp,      url_prefix='/cameras')
    app.register_blueprint(institutions_bp, url_prefix='/institutions')
    app.register_blueprint(alerts_bp,       url_prefix='/alerts')
    app.register_blueprint(swaggerui_bp,    url_prefix=SWAGGER_URL)

    # 5) now the React “catch‑all” for client‑side routing
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve(path):
        full_path = os.path.join(app.static_folder, path)
        if path and os.path.exists(full_path):
            # serve actual static file (js/css/etc)
            return send_from_directory(app.static_folder, path)
        # all other paths go to React entrypoint
        return send_from_directory(app.static_folder, 'index.html')

    return app
