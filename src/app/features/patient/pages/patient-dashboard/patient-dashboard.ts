import { Component } from '@angular/core';
import { Auth } from '../../../../core/services/auth';
import { Router } from '@angular/router';

@Component({
  imports: [],
  selector: 'app-patient-dashboard',
  styleUrl: './patient-dashboard.css',
  templateUrl: './patient-dashboard.html',
})
export class PatientDashboard {
    constructor(
    private auth: Auth,
    private router: Router
  ) {}

  logout(): void {

    this.auth.logout();

    this.router.navigate(['/login']);
  }
}
