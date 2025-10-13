import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
private apiUrl = 'http://localhost:8000';


  constructor(private http: HttpClient) {}

  // ➕ Inscription
  registerClient(data: any) {
    return this.http.post(`${this.apiUrl}/register/`, data);
  }

  // 🔐 Connexion with reCAPTCHA
  loginClient(credentials: { email: string; password: string; recaptcha: string }) {
    return this.http.post(`${this.apiUrl}/login/`, credentials).pipe(
      tap((data: any) => {
        if (data.access) localStorage.setItem('access', data.access);
        if (data.refresh) localStorage.setItem('refresh', data.refresh);
        if (data.client_id) localStorage.setItem('clientId', data.client_id.toString());
      })
    );
  }

  // 🚪 Déconnexion
  logoutClient() {
    const refresh = localStorage.getItem('refresh');
    const access = localStorage.getItem('access');

    if (!refresh || !access) {
      return this.http.post(`${this.apiUrl}/logout/`, {});
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${access}`
    });

    return this.http.post(`${this.apiUrl}/logout/`, { refresh }, { headers }).pipe(
      tap(() => {
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        localStorage.removeItem('clientId');
      })
    );
  }

  // 🔍 Profil client connecté
  getClientProfile() {
    const accessToken = localStorage.getItem('access');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`
    });
    return this.http.get(`${this.apiUrl}/profile/`, { headers });
  }

  updateClientProfile(data: any) {
    const accessToken = localStorage.getItem('access');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`
    });
    return this.http.put(`${this.apiUrl}/profile/update/`, data, { headers });
  }

  // ----------------- Mot de passe oublié -----------------
  forgotPassword(email: string) {
    return this.http.post(`${this.apiUrl}/forgotpassword/`, { email });
  }

  resetPassword(clientId: number, token: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/resetpassword/${clientId}/${token}/`, {
      new_password: newPassword
    });
  }

  // --- Helpers ---
  private decodeJwt<T = any>(token: string): T | null {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload) as T;
    } catch {
      return null;
    }
  }

  getClientId(): number | null {
    const token = localStorage.getItem('access');
    if (!token) return null;
    const payload = this.decodeJwt<{ user_id?: number; client_id?: number }>(token);
    return payload?.client_id ?? payload?.user_id ?? null;
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
