import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ContratService } from 'src/app/services/contrat.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
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

  constructor(private contratService: ContratService, private authService: AuthService,private router: Router,private fb: FormBuilder) {}

  ngOnInit(): void {
    this.loadContrats();
    this.contratForm = this.fb.group({
      code_contrat: [''],
      date_debut: [''],
      date_fin: [''],
      designation: [''],
      statut_commercial: [''],
       montant: [''],
    });
  }

  loadContrats() {
    this.contratService.getContrats().subscribe((data) => {
      this.contrats = data;
    });
  }

subscribe(contratId: number) {
  const clientId = this.authService.getClientId();
  if (!clientId) {
    console.error('client_id not found in token');
    return;
  }
  this.contratService.subscribeToContrat(contratId, clientId).subscribe({
    next: res => console.log('Subscribed!', res),
    error: err => console.error('Subscribe error', err)
  });
}



}

