import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReclamationService } from '../../services/reclamation.service';

@Component({
  selector: 'app-reclamations-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reclamations.component.html',
  styleUrls: ['./reclamations.component.scss']
})
export class ReclamationsComponent implements OnInit {
  reclamations: any[] = [];

  constructor(private reclamationService: ReclamationService) {}

  ngOnInit(): void {
    this.loadReclamations();
  }

  loadReclamations(): void {
    this.reclamationService.getReclamations().subscribe({
      next: (data) => (this.reclamations = data),
      error: (err) => console.error(err),
    });
  }
}
