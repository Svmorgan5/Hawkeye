# config.py

import os

# project root
basedir = os.path.abspath(os.path.dirname(__file__))

class DevelopmentConfig:
    SQLALCHEMY_DATABASE_URI  = 'mysql+mysqlconnector://root:ABC123@localhost/Hawkeye_db'
    DEBUG                    = True
    CACHE_TYPE               = 'SimpleCache'
    UPLOAD_FOLDER            = os.path.join(basedir, 'static', 'uploads')


class TestingConfig:
    SQLALCHEMY_DATABASE_URI  = 'sqlite:///testing.db'
    DEBUG                    = True
    CACHE_TYPE               = 'SimpleCache'
    UPLOAD_FOLDER            = os.path.join(basedir, 'static', 'uploads')


class ProductionConfig:
    SQLALCHEMY_DATABASE_URI  = os.environ.get('SQLALCHEMY_DATABASE_URI')
    CACHE_TYPE               = 'SimpleCache'
    UPLOAD_FOLDER            = os.path.join(basedir, 'static', 'uploads')
