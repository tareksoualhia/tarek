from django.core.management.base import BaseCommand
from core.models import Contrat, Facture
from datetime import date, timedelta

class Command(BaseCommand):
    help = "Generate a facture for each contrat"

    def handle(self, *args, **kwargs):
        for contrat in Contrat.objects.all():
            Facture.objects.create(
                contrat=contrat,
                numero_facture=f"FAC-{contrat.numero_contrat}",
                montant_total=100.00,
                reste_a_payer=100.00,
                date_debut=date.today(),
                date_fin=date.today() + timedelta(days=30),
                echeance=date.today() + timedelta(days=30),
                prise_en_charge=False
            )
        self.stdout.write(self.style.SUCCESS("✅ Factures generated successfully."))
