from dotenv import load_dotenv
import os

load_dotenv()


class DevelopmentConfig:
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL')
    DEBUG = True
    CACHE_TYPE = 'SimpleCache'


class TestingConfig:
    SQLALCHEMY_DATABASE_URI = 'sqlite:///testing.db'
    DEBUG = True
    CACHE_TYPE = 'SimpleCache'


class ProductionConfig:
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL')
    CACHE_TYPE = 'SimpleCache'

