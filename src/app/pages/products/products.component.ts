import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from 'src/app/services/products.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  products: any[] = [];

  constructor(private productService: ProductService,private router: Router) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe({
      next: (data: any) => {
        this.products = data.map((p: any) => {
  if (p.image && !p.image.startsWith('http')) {
    p.image = `http://127.0.0.1:8000${p.image}`;
  }
  return p;
});

      },
      error: (error) => {
        console.error('Error loading products:', error);
      }
    });
  }
  

cart: any[] = [];

addToCart(product: any): void {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const existing = cart.find((item: any) => item.id === product.id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  alert('✅ Produit ajouté au panier !');
}

  }
