import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { finalize } from 'rxjs';

import { DoctorService } from '../../../../core/services/doctor';
import { AppointmentService } from '../../../../core/services/appointment';

import { Doctor } from '../../../../models/doctor.model';
import {
  CreateAppointmentRequest
} from '../../../../models/appointment.model';

@Component({
  selector: 'app-book-appointment',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './book-appointment.html',
  styleUrl: './book-appointment.css'
})
export class BookAppointment implements OnInit {
  doctors: Doctor[] = [];

  isLoadingDoctors = false;
  isBooking = false;

  errorMessage = '';
  successMessage = '';
  bookingReference: number | null = null;

  minDate = this.getTomorrowDate();

  bookingForm;

  constructor(
    private fb: FormBuilder,
    private doctorService: DoctorService,
    private appointmentService: AppointmentService,
    private cdr: ChangeDetectorRef
  ) {
    this.bookingForm = this.fb.group({
      doctorId: [null as number | null, Validators.required],
      appointmentDate: ['', Validators.required],
      timeSlot: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadDoctors();
  }

  private getTomorrowDate(): string {
    const date = new Date();

    date.setDate(date.getDate() + 1);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  loadDoctors(): void {
    this.isLoadingDoctors = true;
    this.errorMessage = '';

    this.doctorService.getDoctors()
      .pipe(
        finalize(() => {
          this.isLoadingDoctors = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: (response: Doctor[]) => {
          this.doctors = response;
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Error loading doctors:', error);

          this.errorMessage =
            'Unable to load doctors. Please try again.';

          this.cdr.markForCheck();
        }
      });
  }

  onSubmit(): void {
    if (this.bookingForm.invalid || this.isBooking) {
      this.bookingForm.markAllAsTouched();
      return;
    }

    const formValue = this.bookingForm.getRawValue();

    if (
      formValue.doctorId === null ||
      !formValue.appointmentDate ||
      !formValue.timeSlot
    ) {
      return;
    }

    const request: CreateAppointmentRequest = {
      doctorId: Number(formValue.doctorId),
      appointmentDate: formValue.appointmentDate,
      timeSlot: formValue.timeSlot
    };

    this.isBooking = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.bookingReference = null;

    this.appointmentService.createAppointment(request)
      .pipe(
        finalize(() => {
          this.isBooking = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: (response) => {
          this.successMessage = response.message;
          this.bookingReference = response.id;

          this.bookingForm.reset({
            doctorId: null,
            appointmentDate: '',
            timeSlot: ''
          });

          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Error booking appointment:', error);

          this.errorMessage =
            error.error?.message ??
            'Unable to book your appointment. Please try again.';

          this.cdr.markForCheck();
        }
      });
  }
}