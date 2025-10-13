import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private apiUrl = 'https://tarek-zryb.onrender.com';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/client/products/`);
  }
  
  addProduct(product: FormData) {
    return this.http.post(`${this.apiUrl}/products/`, product);
  }
  updateProduct(id: number, formData: FormData) {
  return this.http.put(`${this.apiUrl}/products/${id}/`, formData);
}

getProductById(id: number) {
  return this.http.get(`${this.apiUrl}/products/${id}/`);
}
deleteProduct(id: number) {
  return this.http.delete(`${this.apiUrl}/products/${id}/`); // ou adapte le chemin
}

}
