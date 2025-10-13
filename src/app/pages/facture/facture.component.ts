import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FactureService } from '../../services/facture.service';
import { loadStripe, Stripe, StripeCardElement } from '@stripe/stripe-js';

@Component({
  selector: 'app-facture',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './facture.component.html',
  styleUrls: ['./facture.component.scss']
})
export class FactureComponent implements OnInit {
  factures: any[] = [];
  clientId: number | null = null;
  stripe!: Stripe | null;
  cardElements: { [key: number]: StripeCardElement } = {};

  constructor(private factureService: FactureService) {}

  async ngOnInit(): Promise<void> {
    // load Stripe
    this.stripe = await loadStripe('pk_test_51S8eQe8tFl7QNgQUU8EtXxnUJF0AmkJoPWIguNTfbyfIgBhLqXzcGzbqISpi5op9ewboeXNw0zSLSYbNOcDlahFz00d54tsffg'); // your publishable key

    const storedClientId = localStorage.getItem('clientId');
    if (storedClientId) {
      this.clientId = Number(storedClientId);
      this.loadFactures();
    }
  }

  loadFactures(): void {
    if (!this.clientId) return;
    this.factureService.getFacturesByClient(this.clientId).subscribe({
      next: (data) => {
        this.factures = data.map((f: any) => ({ ...f, paid: f.paid || false }));

        // mount card elements after factures are loaded
        setTimeout(() => {
          this.factures.forEach((facture) => {
            const elementId = `card-element-${facture.id}`;
            if (this.stripe && !this.cardElements[facture.id]) {
              const elements = this.stripe.elements();
              const card = elements.create('card');
              card.mount(`#${elementId}`);
              this.cardElements[facture.id] = card;
            }
          });
        }, 300);
      },
      error: (err) => console.error('Error loading factures', err)
    });
  }

  payer(factureId: number): void {
    if (!this.clientId || !this.stripe) return;

    this.factureService.createPaymentIntent(factureId).subscribe({
      next: async (res) => {
        console.log('Stripe clientSecret reçu:', res);

        const card = this.cardElements[factureId];
        if (!card) {
          alert('❌ Aucun champ carte trouvé pour cette facture');
          return;
        }

        const { error, paymentIntent } = await this.stripe!.confirmCardPayment(
          res.clientSecret,
          { payment_method: { card } }
        );

        if (error) {
          console.error('❌ Erreur paiement:', error);
          alert(error.message);
        } else if (paymentIntent?.status === 'succeeded') {
          console.log('✅ Paiement réussi:', paymentIntent);
          this.factures = this.factures.map((f) =>
            f.id === factureId ? { ...f, paid: true } : f
          );
        }
      },
      error: (err) => {
        console.error('Erreur paiement:', err);
      }
    });
  }
}
