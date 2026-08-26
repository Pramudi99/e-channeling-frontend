import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-register',
  styleUrl: './register.css',
  templateUrl: './register.html',
})
export class Register {
      registerForm = new FormGroup({
      firstName: new FormControl('', Validators.required),

      lastName: new FormControl('', Validators.required),

      email: new FormControl('', [
        Validators.required,
        Validators.email
      ]),

      phone: new FormControl('', [
        Validators.required
      ]),

      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6)
      ]),

      confirmPassword: new FormControl('', [
        Validators.required
      ])
    });
    
    onSubmit() {

  if (this.registerForm.invalid) {
    return;
  }

  console.log(this.registerForm.value);
}

}
