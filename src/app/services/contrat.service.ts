import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ContratService {
  private base = 'https://tarek-zryb.onrender.com';
  private contratsClientUrl = `${this.base}/client/contrats/`;   // list
  private subscribeUrl = (id: number) => `${this.base}/contrats/${id}/subscribe/`;

  constructor(private http: HttpClient) {}

  getContrats(): Observable<any[]> {
    return this.http.get<any[]>(this.contratsClientUrl);
  }

  subscribeToContrat(contratId: number, clientId: number) {
    return this.http.post(this.subscribeUrl(contratId), { client_id: clientId });
  }
}
