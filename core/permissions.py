from rest_framework.permissions import BasePermission

class IsAdminFromToken(BasePermission):
    def has_permission(self, request, view):
        auth = request.auth
        if not auth:
            return False

        payload = getattr(auth, 'payload', None)
        if not payload or not isinstance(payload, dict):
            return False

        return payload.get("user_type") == "admin"
from rest_framework.permissions import BasePermission

class IsClient(BasePermission):
    """
    Allows access only to authenticated users that are clients.
    """

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and hasattr(request.user, "id"))
