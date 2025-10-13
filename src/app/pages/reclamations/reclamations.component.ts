import { Component, OnInit } from '@angular/core';
import { ReclamationService } from 'src/app/services/reclamation.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reclamations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reclamations.component.html',
  styleUrls: ['./reclamations.component.scss']
})
export class ReclamationsComponent implements OnInit {
  reclamations: any[] = [];
  selectedReclamationId: number | null = null;
  responseText: string = '';
  loading: boolean = false;
  message: string = '';

  constructor(private reclamationService: ReclamationService) {}

  ngOnInit(): void {
    this.fetchReclamations();
  }

  fetchReclamations(): void {
    this.reclamationService.getAllForAdmin().subscribe({
      next: data => this.reclamations = data,
      error: err => this.message = 'Erreur lors du chargement des réclamations.'
    });
  }

  submitResponse(): void {
    if (!this.selectedReclamationId || !this.responseText.trim()) {
      this.message = 'Veuillez sélectionner une réclamation et écrire une réponse.';
      return;
    }

    this.loading = true;
    this.reclamationService.respond(this.selectedReclamationId, this.responseText).subscribe({
      next: res => {
        this.message = 'Réclamation traitée avec succès.';
        this.responseText = '';
        this.selectedReclamationId = null;
        this.fetchReclamations();
      },
      error: err => {
        this.message = 'Erreur lors de l\'envoi de la réponse.';
      },
      complete: () => this.loading = false
    });
  }
}
