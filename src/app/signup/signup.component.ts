import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true, // ✅ important
  imports: [CommonModule, FormsModule], // ✅ pour ngModel et *ngIf
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  formData = {
    nom: '',
    prenom: '',
    email: '',
    password: '',
    telephone: '',
    rue: '',
    gouvernorat: '',
    delegation: '',
    localite: '',
    ville: '',
    code_postal: ''
  };

  errorMessage: string = '';

  constructor(private authService: AuthService) {}

  onSubmit() {
    this.authService.registerClient(this.formData).subscribe({
      next: (res) => {
        console.log('Inscription réussie', res);
        alert('Inscription réussie');
        this.errorMessage = '';
      },
      error: (err) => {
        console.error('Erreur', err);
        this.errorMessage = err.error?.error || 'Une erreur est survenue.';
      }
    });
  }
}
