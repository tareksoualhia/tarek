import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FactureService } from 'src/app/services/facture.service';
import { ContratService } from 'src/app/services/contrat.service';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-add-facture',
  templateUrl: './add-facture.component.html',
  styleUrl: './add-facture.component.scss',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule], // ✅ ReactiveFormsModule ajouté
})
export class AddFactureComponent implements OnInit {
  factureForm!: FormGroup;
  contrats: any[] = [];

  constructor(
    private fb: FormBuilder,
    private factureService: FactureService,
    private contratService: ContratService
  ) {}

  ngOnInit(): void {
    this.factureForm = this.fb.group({
      code_facture: ['', Validators.required],
      numero_facture: ['', Validators.required],
      montant_total: ['', Validators.required],
      reste_a_payer: ['', Validators.required],
      date_fin: ['', Validators.required],
      contrats_id: [null, Validators.required]
    });

    this.contratService.getContrats().subscribe(data => {
      this.contrats = data;
    });
  }

onSubmit() {
  if (this.factureForm.valid) {
    const formData = this.factureForm.value;

    const payload = {
      code_facture: formData.code_facture,
      numero_facture: formData.numero_facture,
      montant_total: formData.montant_total,
      reste_a_payer: formData.reste_a_payer,
      date_fin: new Date(formData.date_fin).toISOString().slice(0, 10), // format 'YYYY-MM-DD'
      contrats_id: formData.contrat?.id   // ✅ champ `contrats`, pas `contrat`
    };

    this.factureService.addFacture(payload).subscribe({
      next: () => {
        alert("Facture ajoutée !");
        this.factureForm.reset();
      },
      error: (err) => {
        console.error("Erreur:", err.error); // 👈 utile pour debug
      }
    });
  }
}
}