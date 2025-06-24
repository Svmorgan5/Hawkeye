from flask_marshmallow import Marshmallow
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_caching import Cache


ma = Marshmallow()
limiter = Limiter(
    get_remote_address,
    default_limits=["800 per day", "300 per hour"],
    storage_uri="memory://",
)
cache = Cache()

