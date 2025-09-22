# core/seed.py
from core.models import Admin
from django.contrib.auth.hashers import make_password
from django.db.utils import IntegrityError

def seed_admin():
    try:
        Admin.objects.create(
            nom='Soualhia',
            prenom='Tarek',
            email='soualhia.tarek@esprit.tn',
            password=make_password('12345'),
            telephone='123456789',
            role='superadmin'
        )
        print("✅ Admin seeded successfully")
    except IntegrityError:
        print("⚠️ Admin already exists")
