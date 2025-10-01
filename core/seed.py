from core.models import Admin
from django.contrib.auth.hashers import make_password

def seed_admin():
    if not Admin.objects.filter(email='soualhia.tarek@esprit.tn').exists():
        Admin.objects.create(
            nom='Soualhia',
            prenom='Tarek',
            email='soualhia.tarek@esprit.tn',
            password=make_password('12345'),
            telephone='123456789',
            role='superadmin'
        )
        print("Admin seeded successfully")
    else:
        print("Admin already exists")
