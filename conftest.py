import os
import django

# Ensure pytest-django uses the dedicated test settings
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "topnet_client.test_settings")

# Initialize Django so apps are loaded before tests use the DB
django.setup()


