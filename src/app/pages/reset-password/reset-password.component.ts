// src/app/demo/pages/authentication/reset-password/reset-password.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  newPassword = '';
  confirmPassword = '';
  message = '';
  error = '';
  loading = false;

  private clientId!: number;
  private token!: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.clientId = Number(this.route.snapshot.paramMap.get('id'));   // ✅ route param
    this.token = this.route.snapshot.paramMap.get('token')!;          // ✅ route param
  }

  onSubmit(): void {
    if (!this.newPassword || !this.confirmPassword) {
      this.error = 'Veuillez remplir tous les champs';
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.error = 'Les mots de passe ne correspondent pas ❌';
      return;
    }

    this.loading = true;
    this.message = '';
    this.error = '';

    this.authService.resetPassword(this.clientId, this.token, this.newPassword).subscribe({
      next: (res: any) => {
        this.message = res.message || 'Mot de passe réinitialisé avec succès ✅';
        this.error = '';
        this.loading = false;

        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        console.error('❌ Reset password error:', err);
        this.error = err.error?.error || 'Échec de la réinitialisation ❌';
        this.message = '';
        this.loading = false;
      }
    });
  }
}
