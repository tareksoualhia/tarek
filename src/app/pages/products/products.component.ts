import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from 'src/app/services/product.service';
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
          // Supprimer http://127.0.0.1:8000 pour que ça passe par le proxy
          if (p.image) {
            p.image = p.image.replace('http://127.0.0.1:8000', '');
          }
          return p;
        });
      },
      error: (error) => {
        console.error('Error loading products:', error);
      }
    });
  }
  
onEdit(productId: number): void {
  this.router.navigate(['/update-product', productId]);
}

onDelete(id: number) {
  if (confirm('Are you sure you want to delete this product?')) {
    this.productService.deleteProduct(id).subscribe({
      next: () => {
        this.products = this.products.filter(p => p.id !== id); // MAJ UI sans recharger
      },
      error: err => {
        console.error('Error deleting product:', err);
      }
    });
  }
}}
