import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-update-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.scss']
})
export class UpdateProfileComponent implements OnInit {
  client: any = {};
  message = '';
  error = '';
  loading = false;

  gouvernorats: string[] = [
    "Ariana", "Béja", "Ben Arous", "Bizerte", "Gabès", "Gafsa",
    "Jendouba", "Kairouan", "Kasserine", "Kébili", "Le Kef", "Mahdia",
    "La Manouba", "Médenine", "Monastir", "Nabeul", "Sfax",
    "Sidi Bouzid", "Siliana", "Sousse", "Tataouine", "Tozeur",
    "Tunis", "Zaghouan"
  ];

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  // 🔹 Charger les infos actuelles
  loadProfile(): void {
    this.loading = true;
    this.authService.getClientProfile().subscribe({
      next: (data) => {
        this.client = { ...data };
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Erreur profil:', err);
        this.error = 'Impossible de charger le profil.';
        this.loading = false;
      }
    });
  }

  // 🔹 Sauvegarder et rediriger
  saveProfile(): void {
    this.loading = true;
    const updateData = {
      nom: this.client.nom || '',
      prenom: this.client.prenom || '',
      email: this.client.email || '',
      telephone: this.client.telephone || '',
      rue: this.client.rue || '',
      gouvernorat: this.client.gouvernorat || '',
      delegation: this.client.delegation || '',
      localite: this.client.localite || '',
      ville: this.client.ville || '',
      code_postal: this.client.code_postal || ''
    };

    this.authService.updateClientProfile(updateData).subscribe({
      next: (res) => {
        this.message = '✅ Profil mis à jour avec succès';
        this.error = '';
        this.loading = false;
        this.client = { ...res };

        // ⏩ Rediriger vers la page profil après succès
        setTimeout(() => {
          this.router.navigate(['/mes-informations']);
        }, 1000); // petit délai pour afficher le message
      },
      error: (err) => {
        console.error('❌ Erreur update:', err);
        this.error = 'Erreur lors de la mise à jour ❌';
        this.message = '';
        this.loading = false;
      }
    });
  }
}
