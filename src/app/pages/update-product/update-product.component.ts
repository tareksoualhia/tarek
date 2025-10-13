import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ProductService } from 'src/app/services/product.service';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms'; // ✅
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-update-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], // ✅ AJOUTÉ ICI
  templateUrl: './update-product.component.html',
  styleUrls: ['./update-product.component.scss']
})
export class UpdateProductComponent implements OnInit {
  productForm: FormGroup;
  productId!: number;
  imagePreview: string | ArrayBuffer | null = null;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router
  ) {
    this.productForm = this.fb.group({
      name: [''],
      description: [''],
      price: [''],
      stock: [''],
      image: [null]
    });
  }

  ngOnInit(): void {
    this.productId = +this.route.snapshot.paramMap.get('id')!;
    this.productService.getProductById(this.productId).subscribe(product => {
      this.productForm.patchValue(product);
     this.imagePreview = (product as any).image;

    });
  }

  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.productForm.patchValue({ image: file });
      const reader = new FileReader();
      reader.onload = () => (this.imagePreview = reader.result);
      reader.readAsDataURL(file);
    }
  }

onSubmit(): void {
  const formData = new FormData();
  const formValue = this.productForm.value;

  Object.entries(formValue).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      if (key === 'image' && typeof value !== 'string') {
        formData.append(key, value as File); // 👈 si fichier
      } else {
        formData.append(key, value.toString()); // 👈 forcer string
      }
    }
  });

  this.productService.updateProduct(this.productId, formData).subscribe(() => {
    this.router.navigate(['/products']);
  });
}
}