# intruderwatch/settings/prod.py
from .base import *

DEBUG = False
ALLOWED_HOSTS = ['mydomain.com']  # Change this to your domain

# Production database settings, logging, security settings etc.
