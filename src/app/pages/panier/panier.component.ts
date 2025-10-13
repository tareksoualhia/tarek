import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { loadStripe, Stripe, StripeCardElement } from '@stripe/stripe-js';

@Component({
  selector: 'app-panier',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
  templateUrl: './panier.component.html',
  styleUrl: './panier.component.scss'
})
export class PanierComponent implements AfterViewInit {
  cart: any[] = [];
  stripe: Stripe | null = null;
  card: StripeCardElement | null = null;

  constructor(private router: Router, private http: HttpClient) {}

  async ngAfterViewInit(): Promise<void> {
    this.stripe = await loadStripe('pk_test_51S8eQe8tFl7QNgQUU8EtXxnUJF0AmkJoPWIguNTfbyfIgBhLqXzcGzbqISpi5op9ewboeXNw0zSLSYbNOcDlahFz00d54tsffg'); // ✅ Replace with your Stripe public key
    const elements = this.stripe?.elements();
    if (elements) {
      this.card = elements.create('card');
      this.card.mount('#card-element');
    }
  }

  ngOnInit(): void {
    const storedCart = localStorage.getItem('cart');
    this.cart = storedCart ? JSON.parse(storedCart) : [];
    this.fetchPurchaseHistory(); // ✅ Load history on init
  }

  getTotal(): number {
    return this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  updateQuantity(index: number, value: number): void {
    if (value < 1) return;
    this.cart[index].quantity = value;
    this.saveCart();
  }

  removeItem(index: number): void {
    this.cart.splice(index, 1);
    this.saveCart();
  }

  saveCart(): void {
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }

  async createOrder(): Promise<void> {
  try {
    const clientId = localStorage.getItem('client_id');

    await this.http.post<any>(
      'https://tarek-zryb.onrender.com/create-order/',
      {
        items: this.cart,
        client_id: clientId
      }
    ).toPromise();
  } catch (err) {
    console.error('Erreur lors de la création de la commande:', err);
  }
}
purchaseHistory: any[] = [];

async fetchPurchaseHistory(): Promise<void> {
  const clientId = localStorage.getItem('client_id');
  if (!clientId) return;

  try {
    const res = await this.http.get<any[]>(
      `https://tarek-zryb.onrender.com/purchase-history/?client_id=${clientId}`
    ).toPromise();

    this.purchaseHistory = res;
  } catch (err) {
    console.error('Erreur lors du chargement de l’historique:', err);
  }
}


  async checkout(): Promise<void> {
    if (!this.card || !this.stripe) {
      alert('Stripe n’est pas prêt.');
      return;
    }

    try {
      const totalAmount = this.getTotal();

      const res = await this.http.post<any>(
        'https://tarek-zryb.onrender.com/initiate-payment/', // ✅ Match Django endpoint
        { amount: totalAmount * 100 }
      ).toPromise();

      const result = await this.stripe.confirmCardPayment(res.clientSecret, {
        payment_method: {
          card: this.card
        }
      });

      if (result.error) {
        alert('❌ Paiement échoué: ' + result.error.message);
      } else if (result.paymentIntent?.status === 'succeeded') {
        await this.createOrder();
        alert('✅ Paiement réussi et commande enregistrée !');
        localStorage.removeItem('cart');
        this.cart = [];
        this.router.navigate(['/products']);
      }
    } catch (err) {
      console.error('Erreur de paiement:', err);
      alert('Erreur lors du paiement.');
    }
  }
}
