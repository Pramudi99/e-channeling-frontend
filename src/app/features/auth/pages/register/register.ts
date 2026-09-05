import { Component } from '@angular/core';
import { Auth } from '../../../../core/services/auth';
import { FormGroup,
   FormControl,
   Validators, 
   ReactiveFormsModule,
   AbstractControl,
   ValidatorFn,
  ValidationErrors } from '@angular/forms';

  export const passwordMatchValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {

  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;

  if (password !== confirmPassword) {
    return {
      passwordMismatch: true
    };
  }

  return null;
};


@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-register',
  styleUrl: './register.css',
  templateUrl: './register.html',
})



export class Register {

  constructor(
  private authService: Auth
) {}
      registerForm = new FormGroup({
      firstName: new FormControl('', Validators.required),

      lastName: new FormControl('', Validators.required),

      email: new FormControl('', [
        Validators.required,
        Validators.email
      ]),

      // phone: new FormControl('', [
      //   Validators.required
      // ]),

      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6)
      ]),

      confirmPassword: new FormControl('', [
        Validators.required
      ])
    },

     {
    validators: passwordMatchValidator
     }
  );


  
    
    onSubmit() {

  if (this.registerForm.invalid) {
    return;
  }

  const request = {
    fullName:
      `${this.registerForm.value.firstName} ${this.registerForm.value.lastName}`,

    email: this.registerForm.value.email,

    password: this.registerForm.value.password
  };

  console.log('Sending to backend:', request);

  this.authService.register(request).subscribe({
    next: response => {
      console.log('Registration successful:', response);
    },

    error: error => {
      console.error('Registration failed:', error);
    }
  });
}

}
