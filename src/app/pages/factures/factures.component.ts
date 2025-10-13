import { Component, OnInit } from '@angular/core';
import { FactureService } from 'src/app/services/facture.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-factures',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './factures.component.html',
  styleUrls: ['./factures.component.scss']
})
export class FacturesComponent implements OnInit {
  factures: any[] = [];

  constructor(private factureService: FactureService) {}

  ngOnInit(): void {
    this.factureService.getFactures().subscribe({
      next: (data) => this.factures = data,
      error: (err) => console.error('Erreur chargement factures:', err)
    });
  }
}
