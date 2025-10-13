import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent {
  product = {
    name: '',
    description: '',
    price: 0,
    stock: 0,
    image: null as File | null
  };

  constructor(private productService: ProductService, private router: Router) {}

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.product.image = file;
    }
  }

  onSubmit() {
    const formData = new FormData();
    formData.append('name', this.product.name);
    formData.append('description', this.product.description);
    formData.append('price', this.product.price.toString());
    formData.append('stock', this.product.stock.toString());

    if (this.product.image) {
      formData.append('image', this.product.image);
    }

    this.productService.addProduct(formData).subscribe({
      next: (res) => {
        console.log('✅ Product added successfully!', res);
        this.router.navigate(['/products']);
      },
      error: (err) => {
        console.error('❌ Failed to add product:', err);
      }
    });
  }
}
