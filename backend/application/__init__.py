from flask import Flask
from flask_cors import CORS
from backend.application.models import db
from backend.application.extensions import ma, limiter, cache
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_swagger_ui import get_swaggerui_blueprint
from backend.application.blueprints.user import users_bp
from backend.application.blueprints.camera import cameras_bp
from backend.application.blueprints.member import members_bp

# i added this import to make sure the models are registered
from backend.application.blueprints.notification import notification_bp

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
    CORS(app)
    # add extensions
    db.init_app(app)
    ma.init_app(app)
    limiter.init_app(app)
    cache.init_app(app)

#Adding room for URL prefixes in the future
    app.register_blueprint(users_bp, url_prefix='/users')

    ## Uncomment the following lines to register other blueprints when they are created for API access
    ## Remember to add BPs to imports above to finish connection

    app.register_blueprint(members_bp, url_prefix='/members')
    app.register_blueprint(cameras_bp, url_prefix='/cameras')
    
    #app.register_blueprint(alerts_bp, url_prefix='/alerts')

    app.register_blueprint(notification_bp, url_prefix='/notifications')




    return app
