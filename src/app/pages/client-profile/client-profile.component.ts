import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-client-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './client-profile.component.html',
  styleUrls: ['./client-profile.component.scss']
})
export class ClientProfileComponent implements OnInit {
  client: any = null;
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.getClientProfile()?.subscribe({
      next: (data) => {
        this.client = data;
      },
      error: (err) => {
        console.error('Error loading profile', err);
        this.errorMessage = 'Impossible de charger les informations du client.';
      }
    });
  }

  // ✅ Fonction pour rediriger vers la page de mise à jour
  goToUpdateProfile(): void {
    this.router.navigate(['/updateprofile']);
  }
}
