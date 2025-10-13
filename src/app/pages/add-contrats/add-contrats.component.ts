import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContratService } from 'src/app/services/contrat.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-contrats',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-contrats.component.html',
  styleUrls: ['./add-contrats.component.scss']
})
export class AddContratsComponent {
  contratForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private contratService: ContratService,
    private router: Router
  ) {
    this.contratForm = this.fb.group({
      code_contrat: ['', Validators.required],
      date_debut: ['', Validators.required],
      date_fin: ['', Validators.required],
      designation: ['', Validators.required],
      statut_commercial: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.contratForm.valid) {
      this.contratService.addContrat(this.contratForm.value).subscribe(() => {
        this.router.navigate(['/contrats']);
      });
    }
  }
}
