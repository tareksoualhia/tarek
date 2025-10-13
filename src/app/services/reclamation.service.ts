import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ReclamationService {
  private apiUrl = 'https://tarek-zryb.onrender.com';

  constructor(private http: HttpClient) {}

  getReclamations(): Observable<any[]> {
    const token = localStorage.getItem('access');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<any[]>(`${this.apiUrl}/reclamations/`, { headers });
  }

  addReclamation(formData: FormData): Observable<any> {
    const token = localStorage.getItem('access');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.post<any>(`${this.apiUrl}/reclamations/add/`, formData, { headers });
  }
}