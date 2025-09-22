import re
import traceback
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.hashers import make_password, check_password
from rest_framework_simplejwt.tokens import RefreshToken
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from .models import Client
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from .tokens import CustomRefreshToken
from rest_framework import viewsets
from .models import Contrat, Facture
from core.models import Admin
from .serializers import ContratSerializer, FactureSerializer
from rest_framework import generics
from rest_framework import viewsets
from .models import Product
from .ProductSerializer import ProductSerializer
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework import status
from .models import Contrats, Factures
from .serializers import ContratsSerializer, FacturesSerializer
from .permissions import IsAdminFromToken


from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
import requests
from .models import Facture

# core/views.py
from decimal import Decimal
from django.db import transaction
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny  # change to IsAuthenticated when JWT/Token is used
from rest_framework.response import Response
from rest_framework import status, generics

from .serializers import FactureeSerializer
from .models import Client, Contrats, Subscription, Facturee
from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets, permissions

from rest_framework import viewsets, permissions
from .models import Facturee
from .serializers import FactureeSerializer

# core/views.py
from decimal import Decimal
from django.db import transaction
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny  # swap to IsAuthenticated when you attach the bearer token
from rest_framework.response import Response
from rest_framework import status
from .serializers import FactureeSerializer
from .models import Client, Contrats, Subscription, Facturee
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Reclamation
from .serializers import ReclamationSerializer




import requests
from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Facturee

# ----------------- Register Client -----------------
@method_decorator(csrf_exempt, name='dispatch')
class RegisterClientView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        try:
            required_fields = ["nom", "prenom", "email", "password"]
            for field in required_fields:
                if field not in request.data:
                    return Response({"error": f"Missing field: {field}"}, status=400)

            email = request.data["email"]

            if Client.objects.filter(email=email).exists():
                return Response({"error": "Email already used."}, status=400)

            client = Client.objects.create(
                nom=request.data["nom"],
                prenom=request.data["prenom"],
                email=email,
                password=make_password(request.data["password"]),
                telephone=request.data.get("telephone"),
                rue=request.data.get("rue"),
                gouvernorat=request.data.get("gouvernorat"),
                delegation=request.data.get("delegation"),
                localite=request.data.get("localite"),
                ville=request.data.get("ville"),
                code_postal=request.data.get("code_postal"),
            )

            return Response({"message": "Client registered successfully."}, status=201)

        except Exception as e:
            traceback.print_exc()
            return Response({"error": str(e)}, status=500)

# ----------------- Login Client -----------------
from rest_framework_simplejwt.tokens import RefreshToken
from datetime import timedelta
from django.conf import settings
from core.authentication import CustomJWTAuthentication

import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from django.contrib.auth.hashers import check_password
from rest_framework_simplejwt.tokens import RefreshToken
from datetime import timedelta
from core.models import Client  # ✅ Your custom model

class LoginClientView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")
        recaptcha_token = request.data.get("recaptcha")

        if not email or not password or not recaptcha_token:
            return Response({"error": "Email, password, and reCAPTCHA are required."}, status=400)

        # ✅ Verify reCAPTCHA
        recaptcha_response = requests.post(
            "https://www.google.com/recaptcha/api/siteverify",
            data={
                "secret": "6LcwtMwrAAAAAF5TaDPG14oFM7X8UO-kiEs_vPsc",
                "response": recaptcha_token
            }
        )
        result = recaptcha_response.json()
        if not result.get("success"):
            return Response({"error": "reCAPTCHA verification failed."}, status=403)

        # ✅ Authenticate client
        client = Client.objects.filter(email=email).first()
        if not client or not check_password(password, client.password):
            return Response({"error": "Invalid credentials."}, status=401)

        # ✅ Manually create tokens (no for_user)
        refresh = RefreshToken()
        refresh.set_exp(lifetime=timedelta(days=7))
        refresh["client_id"] = client.id
        refresh["email"] = client.email

        access = refresh.access_token
        access.set_exp(lifetime=timedelta(minutes=30))
        access["client_id"] = client.id
        access["email"] = client.email

        return Response({
            "refresh": str(refresh),
            "access": str(access),
            "client_id": client.id,
            "email": client.email,
        })
# ----------------- Logout -----------------
@method_decorator(csrf_exempt, name='dispatch')
class LogoutView(APIView):
    authentication_classes = [CustomJWTAuthentication]  # ✅ instead of JWTAuthentication
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            if not refresh_token:
                return Response({"error": "Refresh token is required."}, status=400)

            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response({"message": "✅ Logged out successfully"}, status=205)

        except TokenError:
            return Response({"error": "Invalid or expired token"}, status=400)

        except Exception as e:
            traceback.print_exc()
            return Response({"error": str(e)}, status=500)




from django.core.mail import send_mail
from django.utils.crypto import get_random_string
from django.conf import settings
from django.contrib.auth.hashers import make_password
from core.models import Client
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

RESET_TOKENS = {}  # Temporary, for demo (use DB/Redis in prod)

# ----------------- Forgot Password -----------------
from django.utils.crypto import get_random_string
from django.core.mail import send_mail
from django.conf import settings
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import permissions
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from core.models import Client
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from django.contrib.auth.hashers import check_password, make_password
from django.core.mail import send_mail
from django.conf import settings
from rest_framework_simplejwt.tokens import RefreshToken
from datetime import datetime, timedelta
from core.models import Client
import secrets

# In-memory storage for reset tokens { client_id: {"token": "...", "expires_at": datetime } }
RESET_TOKENS = {}


# ---------------- Forgot Password ----------------
class ForgotPasswordView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get("email")
        if not email:
            return Response({"error": "Email is required"}, status=400)

        client = Client.objects.filter(email=email).first()
        if not client:
            return Response({"error": "Client not found"}, status=404)

        # Generate token
        token = secrets.token_urlsafe(16)

        # Save token in dict with expiration (30 min)
        RESET_TOKENS[client.id] = {
            "token": token,
            "expires_at": datetime.utcnow() + timedelta(minutes=30)
        }

        # Build reset link
        reset_link = f"http://localhost:4200/resetpassword/{client.id}/{token}/"

        # Send email
        send_mail(
            subject="Réinitialisation du mot de passe",
            message=f"Bonjour, cliquez sur ce lien pour réinitialiser votre mot de passe : {reset_link}",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[client.email],
            fail_silently=False,
        )

        return Response({"message": "Un lien de réinitialisation a été envoyé à votre email."}, status=200)


# ---------------- Reset Password ----------------
class ResetPasswordView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, client_id, token):
        new_password = request.data.get("new_password")

        if not new_password:
            return Response({"error": "Missing new password"}, status=400)

        # Get token data
        token_data = RESET_TOKENS.get(int(client_id))

        if not token_data:
            return Response({"error": "Invalid or expired token"}, status=400)

        # Validate token value
        if token_data["token"] != token:
            return Response({"error": "Invalid token"}, status=400)

        # Check expiration
        if datetime.utcnow() > token_data["expires_at"]:
            RESET_TOKENS.pop(int(client_id), None)
            return Response({"error": "Token expired"}, status=400)

        # Update password
        client = Client.objects.filter(id=client_id).first()
        if not client:
            return Response({"error": "Client not found"}, status=404)

        client.password = make_password(new_password)
        client.save()

        # Remove used token
        RESET_TOKENS.pop(int(client_id), None)

        return Response({"message": "Password reset successful ✅"}, status=200)

# ----------------- Reset Password (with old password) -----------------

# ----------------- Retrieve Client Info -----------------
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication
from core.models import Client
from rest_framework import status

from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from core.models import Client
from core.authentication import CustomJWTAuthentication  # ✅ utiliser ta custom auth

class ClientProfileView(APIView):
    authentication_classes = [CustomJWTAuthentication]  # ✅ pas JWTAuthentication
    permission_classes = [IsAuthenticated]

    def get(self, request):
        client = request.user  # 👉 maintenant `request.user` est un `Client`

        if not client or not isinstance(client, Client):
            return Response({"error": "Client not found"}, status=404)

        return Response({
            "nom": client.nom,
            "prenom": client.prenom,
            "email": client.email,
            "telephone": client.telephone,
            "rue": client.rue,
            "gouvernorat": client.gouvernorat,
            "delegation": client.delegation,
            "localite": client.localite,
            "ville": client.ville,
            "code_postal": client.code_postal,
        }, status=200)


from rest_framework import generics, permissions
from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import Client
from .serializers import ClientSerializer

class UpdateClientProfileView(APIView):
    authentication_classes = [CustomJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def put(self, request):
        client = request.user  # ✅ récupère bien le Client
        if not client or not isinstance(client, Client):
            return Response({"error": "Client not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = ClientSerializer(client, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



 
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied

from .models import Contrat
from .serializers import ContratSerializer

class ContratListCreateView(generics.ListCreateAPIView):
    queryset = Contrat.objects.all()
    serializer_class = ContratSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        user_type = self.request.auth.get("user_type")  # JWT claim
        if user_type != "admin":
            raise PermissionDenied("Only admin can create contrats.")
        serializer.save()


class ContratDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Contrat.objects.all()
    serializer_class = ContratSerializer
    permission_classes = [permissions.IsAuthenticated]

    def update(self, request, *args, **kwargs):
        user_type = request.auth.get("user_type")
        if user_type != "admin":
            raise PermissionDenied("Only admin can update contrats.")
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        user_type = request.auth.get("user_type")
        if user_type != "admin":
            raise PermissionDenied("Only admin can delete contrats.")
        return super().destroy(request, *args, **kwargs)


# Facture
class FactureListCreateView(generics.ListCreateAPIView):
    queryset = Facture.objects.all()
    serializer_class = FactureSerializer

class FactureDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Facture.objects.all()
    serializer_class = FactureSerializer


@method_decorator(csrf_exempt, name='dispatch')
class AdminLoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        try:
            # 🔒 Récupération des credentials
            email = request.data.get("email")
            password = request.data.get("password")

            if not email or not password:
                return Response({"error": "Email and password are required."}, status=status.HTTP_400_BAD_REQUEST)

            # 🔍 Recherche de l'admin
            admin = Admin.objects.filter(email=email).first()
            if not admin or not check_password(password, admin.password):
                return Response({"error": "Invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED)

            # 🔐 Génération des tokens JWT avec infos personnalisées
            refresh = CustomRefreshToken()
            refresh["user_id"] = admin.id         # requis pour JWTAuthentication
            refresh["email"] = admin.email
            refresh["user_type"] = "admin"

            access = refresh.access_token
            access["user_id"] = admin.id
            access["email"] = admin.email
            access["user_type"] = "admin"

            return Response({
                "refresh": str(refresh),
                "access": str(access),
                "admin_id": admin.id,
                "email": admin.email
            }, status=status.HTTP_200_OK)

        except Exception as e:
            import traceback
            traceback.print_exc()
            return Response({"error": "Internal server error."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@method_decorator(csrf_exempt, name='dispatch')
class LogoutAdminView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            if not refresh_token:
                return Response({"error": "Refresh token is required."}, status=400)

            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "Admin logged out successfully."}, status=205)

        except TokenError:
            return Response({"error": "Invalid token."}, status=400)
        except Exception as e:
            import traceback
            traceback.print_exc()
            return Response({"error": str(e)}, status=500)
        




class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAdminFromToken]


class ProductsClientViewSet(viewsets.ReadOnlyModelViewSet):  # 👈 only list/retrieve
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]  # or custom IsClientFromToken

class ContratsViewSet(viewsets.ModelViewSet):
    queryset = Contrats.objects.all()
    serializer_class = ContratsSerializer
    permission_classes = [IsAdminFromToken]


class ContratsClientViewSet(viewsets.ReadOnlyModelViewSet):  # 👈 only list/retrieve
    queryset = Contrats.objects.all()
    serializer_class = ContratsSerializer
    permission_classes = [permissions.AllowAny]  # or custom IsClientFromToken

class FacturesViewSet(viewsets.ModelViewSet):
    queryset = Factures.objects.all()
    serializer_class = FacturesSerializer
    permission_classes = [IsAdminFromToken]

class FactureeClientViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for listing/retrieving Factures
    """
    queryset = Facturee.objects.all().order_by('-created_at')  # ✅ fixed field name
    serializer_class = FactureeSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        client_id = self.request.query_params.get("client_id")
        qs = Facturee.objects.all().order_by('-created_at')
        if client_id:
            qs = qs.filter(subscription__client_id=client_id)
        return qs


AMOUNT_FIELDS = ('montant', 'prix', 'price', 'tarif', 'cout', 'montant_mensuel', 'prix_mensuel')

@api_view(['POST'])
@permission_classes([AllowAny])
def subscribe_contrat(request, contrat_id: int):
    """
    Create a Subscription for (client, contrat) and generate a Facturee with the contract's amount.
    Body: { "client_id": <int> }
    """
    client_id = request.data.get("client_id")
    if not client_id:
        return Response({"error": "client_id is required"}, status=status.HTTP_400_BAD_REQUEST)

    # Validate client & contract
    client = get_object_or_404(Client, id=client_id)
    contrat = get_object_or_404(Contrats, id=contrat_id)

    # Resolve amount from the Contrats instance
    amount = None
    for fname in AMOUNT_FIELDS:
        if hasattr(contrat, fname):
            amount = getattr(contrat, fname)
            break

    if amount is None:
        tried = ", ".join(AMOUNT_FIELDS)
        # List actual model fields to help you rename quickly
        model_fields = [f.name for f in Contrats._meta.get_fields()]
        return Response(
            {
                "error": f"No amount field found on Contrats (tried: {tried}).",
                "available_fields": model_fields
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    # Coerce to Decimal
    try:
        amount = Decimal(str(amount))
    except Exception:
        return Response({"error": "Invalid amount format on Contrats"}, status=status.HTTP_400_BAD_REQUEST)

    # Prevent duplicates
    if Subscription.objects.filter(client=client, contrat=contrat).exists():
        return Response(
            {"error": "Client already subscribed to this contrat"},
            status=status.HTTP_409_CONFLICT
        )

    # Create both rows atomically
    with transaction.atomic():
        subscription = Subscription.objects.create(client=client, contrat=contrat)
        facture = Facturee.objects.create(subscription=subscription, montant=amount)

# Possible names for amount fields in Contrats
AMOUNT_FIELDS = (
    'montant', 'prix', 'price', 'tarif',
    'cout', 'montant_mensuel', 'prix_mensuel'
)


@api_view(['POST'])
@permission_classes([AllowAny])
def subscribe_contrat(request, contrat_id: int):
    """
    Subscribe a client to a contrat.
    - If client has no subscription → create one.
    - If client already has a subscription → update it.
    - Ensure only ONE facture per subscription (update if exists).
    Body: { "client_id": <int> }
    """
    client_id = request.data.get("client_id")
    if not client_id:
        return Response({"error": "client_id is required"}, status=status.HTTP_400_BAD_REQUEST)

    # Validate client and contrat
    client = get_object_or_404(Client, id=client_id)
    contrat = get_object_or_404(Contrats, id=contrat_id)

    # Try to resolve amount dynamically
    amount = None
    for fname in AMOUNT_FIELDS:
        if hasattr(contrat, fname):
            amount = getattr(contrat, fname)
            break

    if amount is None:
        tried = ", ".join(AMOUNT_FIELDS)
        model_fields = [f.name for f in Contrats._meta.get_fields()]
        return Response(
            {
                "error": f"No amount field found on Contrats (tried: {tried}).",
                "available_fields": model_fields,
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    # Coerce amount to Decimal
    try:
        amount = Decimal(str(amount))
    except Exception:
        return Response({"error": "Invalid amount format on Contrats"}, status=status.HTTP_400_BAD_REQUEST)

    # Create or update subscription + facture atomically
    with transaction.atomic():
        subscription, created = Subscription.objects.update_or_create(
            client=client,
            defaults={"contrat": contrat}
        )
        # update_or_create ensures only one facture per subscription
        facture, _ = Facturee.objects.update_or_create(
            subscription=subscription,
            defaults={"montant": amount}
        )

    return Response(
        {
            "message": "Subscription created" if created else "Subscription updated",
            "subscription_id": subscription.id,
            "facture_id": facture.id,
            "montant": str(amount),
        },
        status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
    )
from rest_framework import permissions

class FacturesByClientView(generics.ListAPIView):
    serializer_class = FactureeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        client_id = self.kwargs['client_id']

        # ✅ Vérifie juste si l’utilisateur connecté correspond au client_id
        if self.request.user.id != int(client_id):
            return Facturee.objects.none()

        return Facturee.objects.filter(
            subscription__client_id=client_id
        ).order_by('-created_at')


class LatestFactureByClientView(generics.RetrieveAPIView):
    serializer_class = FactureeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        client_id = self.kwargs['client_id']

        if self.request.user.id != int(client_id):
            return None

        return (
            Facturee.objects
            .filter(subscription__client_id=client_id)
            .order_by('-created_at')
            .first()
        )

import stripe
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status, permissions
from django.conf import settings

stripe.api_key = settings.STRIPE_SECRET_KEY  # test key from dashboard

# Step 1: Create Payment Intent
@api_view(["POST"])
@permission_classes([permissions.AllowAny])
def create_payment_intent(request, facture_id):
    try:
        # Get facture amount (example)
        from core.models import Facturee
        facture = Facturee.objects.get(id=facture_id)

        intent = stripe.PaymentIntent.create(
            amount=int(float(facture.montant) * 100),  # Stripe expects cents
            currency="usd",
            automatic_payment_methods={"enabled": True},
        )

        return Response({"clientSecret": intent.client_secret})
    except Facturee.DoesNotExist:
        return Response({"error": "Facture not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


import stripe
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status, permissions
from django.conf import settings

stripe.api_key = settings.STRIPE_SECRET_KEY  # test key from dashboard
@api_view(["POST"])
@permission_classes([permissions.AllowAny])
def initiate_payment(request):
    try:
        amount = request.data.get("amount")
        intent = stripe.PaymentIntent.create(
            amount=int(amount),
            currency="usd",
            automatic_payment_methods={"enabled": True},
        )
        return Response({"clientSecret": intent.client_secret})
    except Exception as e:
        return Response({"error": str(e)}, status=400)
    
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import Order, Client, Product

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import Order, Client, Product

class CreateOrderView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        client_id = request.data.get("client_id")
        try:
            client = Client.objects.get(id=client_id)
        except Client.DoesNotExist:
            return Response({"message": "Client not found"}, status=404)

        for item in request.data.get("items", []):
            try:
                product = Product.objects.get(id=item["id"])
            except Product.DoesNotExist:
                return Response({"error": f"Produit ID {item['id']} introuvable."}, status=404)

            # ✅ Check stock availability
            if product.stock < item["quantity"]:
                return Response({"error": f"Stock insuffisant pour {product.name}."}, status=400)

            # ✅ Decrement stock
            product.stock -= item["quantity"]
            product.save()

            # ✅ Create order
            Order.objects.create(
                client=client,
                product=product,
                quantity=item["quantity"],
                paid=True
            )

        return Response({"message": "Commande enregistrée."})

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import Order

class PurchaseHistoryView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        client_id = request.query_params.get("client_id")
        if not client_id:
            return Response({"error": "Missing client_id"}, status=400)

        orders = Order.objects.filter(client_id=client_id).select_related("product")
        data = [
            {
                "product_name": order.product.name,
                "quantity": order.quantity,
                "price": order.product.price,
                "paid": order.paid
            }
            for order in orders
        ]
        return Response(data)


@api_view(["GET"])
def list_reclamations(request):
    reclamations = Reclamation.objects.all().order_by("-created_at")
    serializer = ReclamationSerializer(reclamations, many=True)
    return Response(serializer.data)

@api_view(["POST"])
def create_reclamation(request):
    serializer = ReclamationSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

from rest_framework.views import APIView
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from django.shortcuts import get_object_or_404
from django.utils.timezone import now

from core.models import Reclamation, Admin
from core.serializers import ReclamationSerializer
from core.authentication import AdminJWTAuthentication  # ✅ Import your admin auth class

class RespondReclamationView(APIView):
    authentication_classes = [AdminJWTAuthentication]  # ✅ Only accept admin tokens
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, reclamation_id):
        token = request.auth
        user_type = token.get("user_type") if token else None
        admin_id = token.get("user_id") if token else None

        if user_type != "admin" or not admin_id:
            raise PermissionDenied("Only admin can respond to reclamations.")

        admin = get_object_or_404(Admin, id=admin_id)
        reclamation = get_object_or_404(Reclamation, id=reclamation_id)

        response_text = request.data.get("response")
        if not response_text:
            return Response({"error": "Response text is required."}, status=status.HTTP_400_BAD_REQUEST)

        status_update = request.data.get("status", "resolved")

        reclamation.response = response_text
        reclamation.status = status_update
        reclamation.responded_at = now()
        reclamation.response_by = admin  # ✅ Track who responded
        reclamation.save()

        serializer = ReclamationSerializer(reclamation)
        return Response(serializer.data, status=status.HTTP_200_OK)
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from rest_framework.exceptions import PermissionDenied
from core.models import Reclamation
from core.serializers import ReclamationSerializer
from core.authentication import AdminJWTAuthentication

class AdminReclamationListView(APIView):
    authentication_classes = [AdminJWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        token = request.auth
        if not token or token.get("user_type") != "admin":
            raise PermissionDenied("Only admin can view all reclamations.")

        reclamations = Reclamation.objects.all().order_by("-created_at")
        serializer = ReclamationSerializer(reclamations, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)




from django.http import JsonResponse


def total_users(request):
    count = Client.objects.count()  # or Client.objects.count()
    return JsonResponse({'total_users': count})

def total_reclamations(request):
    count = Reclamation.objects.count()  # or Client.objects.count()
    return JsonResponse({'total_reclamations': count})

def total_contrats(request):
    count = Contrats.objects.count()  # or Client.objects.count()
    return JsonResponse({'total_contrats': count})



