from rest_framework_simplejwt.tokens import RefreshToken
from datetime import datetime, timezone

class CustomRefreshToken(RefreshToken):
    def __init__(self):
        self.current_time = datetime.now(tz=timezone.utc)
        self.payload = {}
        self.set_jti()
        self.set_exp()
        self.set_iat()

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['user_type'] = 'admin' if user.is_staff else 'client'
        return token
