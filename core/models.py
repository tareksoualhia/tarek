from django.db import models

class Client(models.Model):
    GOUVERNORAT_CHOICES = [
        ("Ariana", "Ariana"),
        ("Béja", "Béja"),
        ("Ben Arous", "Ben Arous"),
        ("Bizerte", "Bizerte"),
        ("Gabès", "Gabès"),
        ("Gafsa", "Gafsa"),
        ("Jendouba", "Jendouba"),
        ("Kairouan", "Kairouan"),
        ("Kasserine", "Kasserine"),
        ("Kébili", "Kébili"),
        ("Le Kef", "Le Kef"),
        ("Mahdia", "Mahdia"),
        ("La Manouba", "La Manouba"),
        ("Médenine", "Médenine"),
        ("Monastir", "Monastir"),
        ("Nabeul", "Nabeul"),
        ("Sfax", "Sfax"),
        ("Sidi Bouzid", "Sidi Bouzid"),
        ("Siliana", "Siliana"),
        ("Sousse", "Sousse"),
        ("Tataouine", "Tataouine"),
        ("Tozeur", "Tozeur"),
        ("Tunis", "Tunis"),
        ("Zaghouan", "Zaghouan"),
    ]

    nom = models.CharField(max_length=100)
    prenom = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)  # Auth sans User natif
    telephone = models.CharField(max_length=20, blank=True, null=True)
    rue = models.CharField(max_length=255, blank=True, null=True)
    gouvernorat = models.CharField(max_length=100, choices=GOUVERNORAT_CHOICES, blank=True, null=True)
    delegation = models.CharField(max_length=100, blank=True, null=True)
    localite = models.CharField(max_length=100, blank=True, null=True)
    ville = models.CharField(max_length=100, blank=True, null=True)
    code_postal = models.CharField(max_length=10, blank=True, null=True)
    date_inscription = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.prenom} {self.nom}"

    @property
    def is_authenticated(self):
        return True




class Contrat(models.Model):
    code_contrat = models.CharField(max_length=50, unique=True)
    numero_contrat = models.CharField(max_length=50)
    date_debut = models.DateField()
    date_fin = models.DateField(null=True, blank=True)
    designation = models.CharField(max_length=255)
    etat = models.CharField(max_length=50)
    code_cf = models.CharField(max_length=50)
    ref_offre = models.CharField(max_length=100)
    statut_commercial = models.CharField(max_length=100)

    def __str__(self):
        return self.numero_contrat


class Facture(models.Model):
    contrat = models.ForeignKey(Contrat, on_delete=models.CASCADE, related_name="factures")
    code_facture = models.CharField(max_length=50, unique=True)
    code_compte_facturation = models.CharField(max_length=50)
    numero_facture = models.CharField(max_length=50)
    montant_total = models.DecimalField(max_digits=10, decimal_places=3)
    reste_a_payer = models.DecimalField(max_digits=10, decimal_places=3)
    date_debut = models.DateField()
    date_fin = models.DateField()
    echeance = models.DateField()
    prise_en_charge = models.BooleanField(default=False)
    date_prise_en_charge = models.DateField(null=True, blank=True)

    def __str__(self):
        return self.numero_facture
    







    
class Admin(models.Model):
    nom = models.CharField(max_length=100)
    prenom = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    telephone = models.CharField(max_length=20, blank=True, null=True)
    role = models.CharField(max_length=50)
    date_creation = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.prenom} {self.nom}"

    @property
    def is_authenticated(self):
        return True


from django.db import models

class Product(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    price = models.FloatField()
    stock = models.IntegerField()
    image = models.ImageField(upload_to='product_images/', null=True, blank=True)  # ✅ Image ajoutée

    def __str__(self):
        return self.name

    def update_stock(self, quantity):
        self.stock -= quantity
        self.save()

from django.db import models
from .models import Client  # adjust path if needed


class Order(models.Model):
    client = models.ForeignKey(Client, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    paid = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order #{self.id} - {self.product.name} x{self.quantity}"




class Contrats(models.Model):
    code_contrat = models.CharField(max_length=100, unique=True)
    date_debut = models.DateField()
    date_fin = models.DateField()
    designation = models.CharField(max_length=255)
    statut_commercial = models.CharField(max_length=100)
    montant = models.DecimalField(max_digits=10, decimal_places=2, default=0) 
    def __str__(self):
        return f"{self.code_contrat} - {self.designation}"


class Factures(models.Model):
    contrats = models.ForeignKey(Contrats, on_delete=models.CASCADE, related_name='factures')  # 🔗 relation avec Contrats
    code_facture = models.CharField(max_length=100, unique=True)
    numero_facture = models.CharField(max_length=100)
    montant_total = models.DecimalField(max_digits=10, decimal_places=2)
    reste_a_payer = models.DecimalField(max_digits=10, decimal_places=2)
    date_fin = models.DateField()

    def __str__(self):
        return f"Facture {self.numero_facture} - Contrat {self.contrats.code_contrat}"



# core/models.py
class Subscription(models.Model):
    client = models.OneToOneField(Client, on_delete=models.CASCADE)  # ✅ one subscription total
    contrat = models.ForeignKey(Contrats, on_delete=models.CASCADE)
    date_souscription = models.DateTimeField(auto_now_add=True)


    class Meta:
        unique_together = ('client', 'contrat')  # prevents double subscribe

class Facturee(models.Model):
    subscription = models.ForeignKey(Subscription, on_delete=models.CASCADE, related_name="factures")
    montant = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)




from django.db import models

class Reclamation(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("in_progress", "In Progress"),
        ("resolved", "Resolved"),
    ]

    client = models.ForeignKey("Client", on_delete=models.CASCADE, related_name="reclamations")

    offre = models.CharField(max_length=100, null=True, blank=True)
    service = models.CharField(max_length=100, null=True, blank=True)
    categorie = models.CharField(max_length=100, null=True, blank=True)
    motif = models.CharField(max_length=100, null=True, blank=True)

    image = models.ImageField(upload_to="reclamations/", null=True, blank=True)
    gsm = models.CharField(max_length=15)
    message = models.TextField()

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    response = models.TextField(null=True, blank=True)  # ✅ admin reply
    responded_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Reclamation {self.id} - {self.offre or 'Sans offre'}"






