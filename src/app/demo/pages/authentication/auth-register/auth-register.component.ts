import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-auth-register',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './auth-register.component.html',
  styleUrls: ['./auth-register.component.scss']
})
export class AuthRegisterComponent {
  SignUpOptions = [
    { image: 'assets/images/authentication/google.svg', name: 'Google' },
    { image: 'assets/images/authentication/twitter.svg', name: 'Twitter' },
    { image: 'assets/images/authentication/facebook.svg', name: 'Facebook' }
  ];

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

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.authService.registerClient(this.formData).subscribe({
      next: (res) => {
        console.log('Inscription réussie', res);
        alert('Inscription réussie');
        this.errorMessage = '';
        this.router.navigate(['/login']); // ✅ Redirect to login
      },
      error: (err) => {
        console.error('Erreur', err);
        this.errorMessage = err.error?.error || 'Une erreur est survenue.';
      }
    });
  }
}
