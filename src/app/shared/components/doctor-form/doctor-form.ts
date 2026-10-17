import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-doctor-form',
  styleUrl: './doctor-form.css',
  templateUrl: './doctor-form.html',
})
export class DoctorForm {
   @Output() saveDoctor = new EventEmitter<any>();
  @Output() cancelForm = new EventEmitter<void>();

  doctorForm;

  constructor(private fb: FormBuilder) {
    this.doctorForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      specialization: ['', Validators.required],
      qualification: ['', Validators.required],
      experience: [0, [Validators.required, Validators.min(0)]],
      consultationFee: [0, [Validators.required, Validators.min(0)]],
      description: ['']
    });
  }

  onSubmit(): void {
    if (this.doctorForm.invalid) {
      this.doctorForm.markAllAsTouched();
      return;
    }

    this.saveDoctor.emit(this.doctorForm.getRawValue());
  }
}
