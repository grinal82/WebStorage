import os
from dotenv import load_dotenv
from .base import *

load_dotenv()

DEBUG = False


ALLOWED_HOSTS = ["79.174.86.182"]


DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.getenv("DB_NAME"),
        "USER": os.getenv("DB_USER"),
        "PASSWORD": os.getenv("DB_PASSWORD"),
        "HOST": "localhost",
    }
}
