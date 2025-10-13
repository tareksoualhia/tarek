import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-auth-login',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule],
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
    password: ''
  };

  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.authService.loginAdmin(this.credentials).subscribe({
      next: (res: any) => {
        console.log('Admin login success:', res);
        localStorage.setItem('access', res.access);
        localStorage.setItem('refresh', res.refresh);
        localStorage.setItem('admin_id', res.admin_id);
        this.router.navigate(['/dashboard/default']);
      },
      error: (err) => {
        console.error('Admin login error:', err);
        this.errorMessage = err.error?.error || 'Login failed.';
      }
    });
  }
}
