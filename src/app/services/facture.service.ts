import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FactureService {
  private apiUrl = 'https://tarek-zryb.onrender.com/factures/';  // Ensure trailing slash here

  constructor(private http: HttpClient) {}

  // Get all factures
  getFactures(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Get a single facture by its ID
  getFactureById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}${id}/`);  // Adding / at the end to complete the URL
  }

  // Add a new facture
  addFacture(facture: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, facture);  // Use apiUrl for adding a new facture
  }

  // Update an existing facture by its ID
  updateFacture(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}${id}/`, data);  // Ensure correct URL structure
  }

  // Delete a facture by its ID
  deleteFacture(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}${id}/`);  // Use correct URL with /id/
  }
}
