import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Auth } from '../../../../core/services/auth';
@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  constructor(
    private auth: Auth
  ) {}

  onSubmit() {

    if (this.loginForm.invalid) {
      return;
    }

    const request = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    };

    console.log('Sending login request:', request);

    this.auth.login(request).subscribe({

      next: response => {
        console.log('Login successful:', response);
        localStorage.setItem('token', response.token);
        localStorage.setItem('role', response.role);

        this.auth.getProfile().subscribe({

        next: profile => {
          console.log('Profile:', profile);
        },

        error: error => {
          console.error('Profile failed:', error);
        }

      });
      },

      error: error => {
        console.error('Login failed:', error);
      }

    });
  }
}
