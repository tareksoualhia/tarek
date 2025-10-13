import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReclamationService {
  private baseUrl = 'https://tarek-zryb.onrender.com';

  constructor(private http: HttpClient) {}

  // ✅ Admin-only endpoint
  getAllForAdmin(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/admin/reclamations/`);
  }

  respond(id: number, response: string, status: string = 'resolved'): Observable<any> {
    const body = { response, status };
    return this.http.patch(`${this.baseUrl}/reclamations/${id}/respond/`, body);
  }
}
