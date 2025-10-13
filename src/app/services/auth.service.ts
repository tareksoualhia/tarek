import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8000';


  constructor(private http: HttpClient) {}

  // 🔐 Connexion admin
  loginAdmin(credentials: { email: string; password: string }) {
    return this.http.post(`${this.apiUrl}/adminlogin/`, credentials);
  }

  // 🚪 Déconnexion admin
  logoutAdmin() {
    const refresh = localStorage.getItem('refresh');
    if (!refresh) {
      throw new Error('No refresh token found.');
    }

    return this.http.post(`${this.apiUrl}/adminlogout/`, { refresh });
  }

  // 🧹 Nettoyer localStorage
  clearTokens() {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('admin_id');
  }


getTotalClients(): Observable<{ total_users: number }> {
  return this.http.get<{ total_users: number }>(`${this.apiUrl}/total-clients/`);
}
getTotalReclamations(): Observable<{ total_reclamations: number }> {
  return this.http.get<{ total_reclamations: number }>(`${this.apiUrl}/total-reclamations/`);
}
getTotalcontrats(): Observable<{ total_contrats: number }> {
  return this.http.get<{ total_contrats: number }>(`${this.apiUrl}/total-contrats/`);
}
}