import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FactureService {
  private apiUrl = 'https://tarek-zryb.onrender.com'; // Django backend

  constructor(private http: HttpClient) {}

  // 🔹 Get all factures for a client
  getFacturesByClient(clientId: number): Observable<any[]> {
    const token = localStorage.getItem('access');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<any[]>(`${this.apiUrl}/clients/${clientId}/factures/`, { headers });
  }

  // 🔹 Trigger payment for a facture
  payFacture(factureId: number): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}/factures/${factureId}/create-payment-intent/`, {});
}


  // (Optional: If using Stripe)
  createPaymentIntent(factureId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/factures/${factureId}/create-payment-intent/`, {});
  }
}
