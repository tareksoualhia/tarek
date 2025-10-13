import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReclamationService } from '../../services/reclamation.service';

@Component({
  selector: 'app-reclamations-add',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reclamations-add.component.html',
  styleUrls: ['./reclamations-add.component.scss']
})
export class ReclamationsAddComponent {
 offre = '';
  service = '';
  categorie = '';
  motif = '';
  gsm = '';
  message = '';
  image: File | null = null;
  responseMsg = '';

  constructor(private reclamationService: ReclamationService) {}

  onFileSelected(event: any) {
    this.image = event.target.files[0];
  }

  submitReclamation() {
    const formData = new FormData();
    formData.append('offre', this.offre);
    formData.append('service', this.service);
    formData.append('categorie', this.categorie);
    formData.append('motif', this.motif);
    formData.append('gsm', this.gsm);
    formData.append('message', this.message);
    if (this.image) {
      formData.append('image', this.image);
    }
    formData.append('client', '1'); // ⚠️ à remplacer par l'ID du client connecté

    this.reclamationService.addReclamation(formData).subscribe({
      next: () => this.responseMsg = "Réclamation envoyée ✅",
      error: (err) => console.error(err)
    });
  }
}