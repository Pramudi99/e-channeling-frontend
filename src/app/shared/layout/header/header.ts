
import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  isLoggedIn = false;
  role: string | null = null;

  constructor(
    private auth: Auth,
    private router: Router
  ) {
    this.updateAuthState();
  }

  updateAuthState(): void {
    this.isLoggedIn = this.auth.isLoggedIn();
    this.role = this.auth.getRole();
  }

  logout(): void {
    this.auth.logout();
    this.updateAuthState();
    this.router.navigate(['/login']);
  }
}
