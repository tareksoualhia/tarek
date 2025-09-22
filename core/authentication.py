from rest_framework_simplejwt.authentication import JWTAuthentication
from core.models import Client


class CustomJWTAuthentication(JWTAuthentication):
    def get_user(self, validated_token):
        client_id = validated_token.get("client_id")

        if not client_id:
            return None

        try:
            return Client.objects.get(id=client_id)
        except Client.DoesNotExist:
            return None



from django.contrib.auth import get_user_model

User = get_user_model()

class EmailAuthBackend:
    def authenticate(self, request, email=None, password=None, **kwargs):
        try:
            user = User.objects.get(email=email)
            if user.check_password(password):
                return user
        except User.DoesNotExist:
            return None
        return None

    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None
        



        from rest_framework_simplejwt.authentication import JWTAuthentication
from core.models import Admin

class AdminJWTAuthentication(JWTAuthentication):
    def get_user(self, validated_token):
        admin_id = validated_token.get("user_id")
        if not admin_id:
            return None
        try:
            return Admin.objects.get(id=admin_id)
        except Admin.DoesNotExist:
            return None

    def authenticate(self, request):
        result = super().authenticate(request)
        if result is None:
            return None
        user, validated_token = result
        return (user, validated_token)
from core.models import Admin
from django.contrib.auth.hashers import check_password

class AdminAuthBackend:
    def authenticate(self, request, email=None, password=None, **kwargs):
        try:
            admin = Admin.objects.get(email=email)
            if check_password(password, admin.password):
                return admin
        except Admin.DoesNotExist:
            return None
        return None

    def get_user(self, user_id):
        try:
            return Admin.objects.get(pk=user_id)
        except Admin.DoesNotExist:
            return None
