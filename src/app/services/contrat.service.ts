import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContratService {
  private apiUrl = 'https://tarek-zryb.onrender.com/contrats/'; // ✅ SLASH FINAL important

  constructor(private http: HttpClient) {}

  // Obtenir tous les contrats
  getContrats(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Ajouter un contrat
  addContrat(contrat: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, contrat);
  }

  // Supprimer un contrat
  deleteContrat(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}${id}/`);
  }

  // Récupérer un contrat par ID
  getContratById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}${id}/`);
  }

  // Mettre à jour un contrat
  updateContrat(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}${id}/`, data);
  }
}
