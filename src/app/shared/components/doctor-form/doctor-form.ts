
import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges
} from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { Doctor } from '../../../models/doctor.model';
import { CreateDoctorRequest } from '../../../models/CreateDoctorRequest.model';

@Component({
  selector: 'app-doctor-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './doctor-form.html',
  styleUrl: './doctor-form.css',
})
export class DoctorForm implements OnChanges {
  @Input() doctor: Doctor | null = null;
  @Input() isSaving = false;

  @Output() saveDoctor = new EventEmitter<CreateDoctorRequest>();
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

  get isEditMode(): boolean {
    return this.doctor !== null;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['doctor']) {
      if (this.doctor) {
        this.doctorForm.patchValue({
          fullName: this.doctor.fullName,
          email: this.doctor.email,
          specialization: this.doctor.specialization,
          qualification: this.doctor.qualification,
          experience: this.doctor.experience,
          consultationFee: this.doctor.consultationFee,
          description: this.doctor.description ?? ''
        });
      } else {
        this.doctorForm.reset({
          fullName: '',
          email: '',
          specialization: '',
          qualification: '',
          experience: 0,
          consultationFee: 0,
          description: ''
        });
      }
    }
  }

  onSubmit(): void {
    if (this.doctorForm.invalid || this.isSaving) {
      this.doctorForm.markAllAsTouched();
      return;
    }

    this.saveDoctor.emit(this.doctorForm.getRawValue() as CreateDoctorRequest);
  }
}
