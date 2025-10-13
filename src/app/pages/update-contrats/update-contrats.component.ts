import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ContratService } from 'src/app/services/contrat.service';

@Component({
  selector: 'app-update-contrats',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-contrats.component.html',
  styleUrls: ['./update-contrats.component.scss']
})
export class UpdateContratsComponent implements OnInit {
  contratForm: FormGroup;
  contratId: number = 0;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private contratService: ContratService,
    private router: Router
  ) {
    this.contratForm = this.fb.group({
      code_contrat: ['', Validators.required],
      date_debut: ['', Validators.required],
      date_fin: ['', Validators.required],
      designation: ['', Validators.required],
      statut_commercial: ['', Validators.required],
      montant: [0, [Validators.required, Validators.min(0)]], // ✅
    });
  }

  ngOnInit(): void {
    this.contratId = Number(this.route.snapshot.paramMap.get('id'));
    this.contratService.getContratById(this.contratId).subscribe(contrat => {
      this.contratForm.patchValue(contrat);
    });
  }

  onSubmit() {
    if (this.contratForm.valid) {
      this.contratService.updateContrat(this.contratId, this.contratForm.value).subscribe(() => {
        this.router.navigate(['/contrats']);
      });
    }
  }
}
