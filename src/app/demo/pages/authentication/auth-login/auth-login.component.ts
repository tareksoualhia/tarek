import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { RecaptchaModule } from 'ng-recaptcha';

@Component({
  selector: 'app-auth-login',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule, RecaptchaModule],
  templateUrl: './auth-login.component.html',
  styleUrls: ['./auth-login.component.scss']
})
export class AuthLoginComponent {
  SignInOptions = [
    { image: 'assets/images/authentication/google.svg', name: 'Google' },
    { image: 'assets/images/authentication/twitter.svg', name: 'Twitter' },
    { image: 'assets/images/authentication/facebook.svg', name: 'Facebook' }
  ];

  credentials = {
    email: '',
    password: '',
    recaptcha: ''
  };

  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    if (!this.credentials.recaptcha) {
      this.errorMessage = 'Please complete the reCAPTCHA.';
      return;
    }

    this.authService.loginClient(this.credentials).subscribe({
      next: (res: any) => {
        localStorage.setItem('access', res.access);
        localStorage.setItem('refresh', res.refresh);
        localStorage.setItem('client_id', res.client_id);
        localStorage.setItem('email', res.email);
        this.router.navigate(['/dashboard/default']);
      },
      error: (err) => {
        this.errorMessage = err.error?.error || 'Login failed.';
      }
    });
  }

  onRecaptchaResolved(token: string) {
    this.credentials.recaptcha = token;
  }
}
