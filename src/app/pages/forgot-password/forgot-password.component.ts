import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  email = '';
  message = '';
  error = '';
  loading = false;

  constructor(private authService: AuthService) {}

  onSubmit() {
    if (!this.email) {
      this.error = 'Veuillez entrer votre email';
      return;
    }

    this.loading = true;
    this.message = '';
    this.error = '';

    this.authService.forgotPassword(this.email).subscribe({
      next: (res: any) => {
        this.message = res.message || 'Lien de réinitialisation envoyé ✅';
        this.error = '';
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Forgot password error:', err);
        this.error = err.error?.error || 'Impossible d’envoyer le lien ❌';
        this.message = '';
        this.loading = false;
      }
    });
  }
}
