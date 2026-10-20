import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-dashboard-redirect',
  standalone: true,
  template: ''
})
export class DashboardRedirect implements OnInit {

  constructor(
    private auth: Auth,
    private router: Router
  ) {}

  ngOnInit(): void {
    const role = this.auth.getRole();

    switch (role) {
      case 'Patient':
        this.router.navigate(['/patient/dashboard']);
        break;

      case 'Doctor':
        this.router.navigate(['/doctor/dashboard']);
        break;

      case 'Admin':
        this.router.navigate(['/admin/dashboard']);
        break;

      default:
        this.router.navigate(['/login']);
        break;
    }
  }
}