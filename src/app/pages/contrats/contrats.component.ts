import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup ,Validators} from '@angular/forms';
import { ContratService } from 'src/app/services/contrat.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-contrats',
   standalone: true,
  imports: [CommonModule], // ✅ ajoute ça !
  templateUrl: './contrats.component.html',
  styleUrls: ['./contrats.component.scss'],
})
export class ContratsComponent implements OnInit {
  contrats: any[] = [];
  contratForm!: FormGroup;

  constructor(private contratService: ContratService, private router: Router,private fb: FormBuilder) {}

  ngOnInit(): void {
    this.loadContrats();
   this.contratForm = this.fb.group({
  code_contrat: ['', Validators.required],
  date_debut: ['', Validators.required],
  date_fin: ['', Validators.required],
  designation: ['', Validators.required],
  statut_commercial: ['', Validators.required],
  montant: [0, [Validators.required, Validators.min(0)]], // 🆕
});
  }

  loadContrats() {
    this.contratService.getContrats().subscribe((data) => {
      this.contrats = data;
    });
  }


  deleteContrat(id: number) {
    this.contratService.deleteContrat(id).subscribe(() => {
      this.loadContrats();
    });
  }
  editContrat(id: number) {
  this.router.navigate(['/contrats/update', id]);
}
}
