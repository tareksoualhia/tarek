from .settings import *  # noqa: F401,F403

# Override database settings for tests (PostgreSQL)
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'test_topnet_db',  # separate database for tests
        'USER': 'postgres',
        'PASSWORD': '1995',
        'HOST': 'localhost',  # different host for tests
        'PORT': '5432',
    }
}

# Use faster password hasher for tests
PASSWORD_HASHERS = [
    'django.contrib.auth.hashers.MD5PasswordHasher',
]

# Disable migrations for faster tests
class DisableMigrations(object):
    def __contains__(self, item):
        return True
    def __getitem__(self, item):
        return None

MIGRATION_MODULES = DisableMigrations()

# Use console email backend for testing
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

# Turn off debug mode for tests
DEBUG = False

