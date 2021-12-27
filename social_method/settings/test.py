"""
Social Method Testing Settings Module

A few things may be desried to be overried such as:
    - ALLOWED_HOSTS
    - DEBUG
"""
from .base import * 
from .local import * 


DATABASES = {
    'default': {
    'ENGINE': 'django.db.backends.sqlite3',
    'NAME': os.path.join(BASE_DIR, 'test_db.sqlite3')

    }
}