from rest_framework import serializers
from .models import Contrat, Facture ,Contrats,Factures,Product # <-- vérifie que Contrat est bien importé

class ContratSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contrat
        fields = '__all__'

class FactureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Facture
        fields = '__all__'


class ContratsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contrats  # ⚠️ nom du modèle Contrat au pluriel
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product  # ⚠️ nom du modèle Contrat au pluriel
        fields = '__all__'


class FacturesSerializer(serializers.ModelSerializer):
    contrats = ContratsSerializer(read_only=True)  # nested serializer pour lecture
    contrats_id = serializers.PrimaryKeyRelatedField(
        queryset=Contrats.objects.all(), write_only=True, source="contrats"
    )

    class Meta:
        model = Factures
        fields = '__all__'



# core/serializers.py
from rest_framework import serializers
from .models import Facturee

class FactureeSerializer(serializers.ModelSerializer):
    date_generation = serializers.DateTimeField(source='created_at', read_only=True)

    class Meta:
        model = Facturee
        fields = ['id', 'montant', 'date_generation', 'subscription']




from rest_framework import serializers
from .models import Reclamation

class ReclamationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reclamation
        fields = "__all__"

        
from rest_framework import serializers
from .models import Client, Contrats, Factures  # only models here

class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = "__all__"


from rest_framework import serializers
from .models import Client

class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = [
            "nom", "prenom", "email", "telephone",
            "rue", "gouvernorat", "delegation",
            "localite", "ville", "code_postal"
        ]



