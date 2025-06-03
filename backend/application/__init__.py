from flask import Flask
from backend.application.models import db
from backend.application.extensions import ma, limiter, cache
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_swagger_ui import get_swaggerui_blueprint
from backend.application.blueprints.user import users_bp



#Just getting swagger ready for testing purposes.
#SWAGGER_URL = '/api/docs' 
#API_URL = '/static/swagger.yaml'

#swaggerui_blueprint= get_swaggerui_blueprint(
#    SWAGGER_URL,
#    API_URL,
#    config={
#        'app_name': "Hawkeye API"
#    }
#)



def create_app(config_name):

    app = Flask(__name__)
    app.config.from_object(f'config.{config_name}')
    # add extensions
    db.init_app(app)
    ma.init_app(app)
    limiter.init_app(app)
    cache.init_app(app)

#Adding room for URL prefixes in the future
    app.register_blueprint(users_bp, url_prefix='/users')




    return app
