
import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { finalize } from 'rxjs';

import { DoctorService } from '../../../../core/services/doctor';
import { AppointmentService } from '../../../../core/services/appointment';

import { Doctor } from '../../../../models/doctor.model';
import { CreateAppointmentRequest } from '../../../../models/appointment.model';

@Component({
  selector: 'app-book-appointment',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    CurrencyPipe
  ],
  templateUrl: './book-appointment.html',
  styleUrl: './book-appointment.css'
})
export class BookAppointment implements OnInit {

  doctor: Doctor | null = null;

  isLoadingDoctor = false;
  isBooking = false;

  errorMessage = '';
  successMessage = '';
  bookingReference: number | null = null;

  minDate = this.getTomorrowDate();

  bookingForm: FormGroup<{
  appointmentDate: FormControl<string>;
  timeSlot: FormControl<string>;
}>;

 constructor(
  private fb: FormBuilder,
  private router: Router,
  private route: ActivatedRoute,
  private doctorService: DoctorService,
  private appointmentService: AppointmentService,
  private cdr: ChangeDetectorRef
) {
  this.bookingForm = this.fb.group({
    appointmentDate: this.fb.nonNullable.control(
      '',
      Validators.required
    ),
    timeSlot: this.fb.nonNullable.control(
      '',
      Validators.required
    )
  });
}
  ngOnInit(): void {
    const doctorId = Number(
      this.route.snapshot.queryParamMap.get('doctorId')
    );

    if (!Number.isInteger(doctorId) || doctorId <= 0) {
      this.errorMessage =
        'Please select a doctor before booking.';
      return;
    }

    this.loadDoctor(doctorId);
  }

  private getTomorrowDate(): string {
    const date = new Date();
    date.setDate(date.getDate() + 1);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  loadDoctor(id: number): void {
    this.isLoadingDoctor = true;
    this.errorMessage = '';

    this.doctorService.getDoctorById(id)
      .pipe(
        finalize(() => {
          this.isLoadingDoctor = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: (data) => {
          this.doctor = data;
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Failed to load doctor:', error);

          this.errorMessage =
            error.status === 404
              ? 'Doctor not found.'
              : 'Unable to load doctor details.';

          this.cdr.markForCheck();
        }
      });
  }

  onSubmit(): void {
    if (
      this.bookingForm.invalid ||
      this.isBooking ||
      !this.doctor
    ) {
      this.bookingForm.markAllAsTouched();
      return;
    }

    const value = this.bookingForm.getRawValue();

    if (!value.appointmentDate || !value.timeSlot) {
      return;
    }

    const request: CreateAppointmentRequest = {
      doctorId: this.doctor.id,
      appointmentDate: value.appointmentDate,
      timeSlot: value.timeSlot
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
              appointmentDate: '',
              timeSlot: ''
            });

            this.cdr.markForCheck();

            // Show the success message before navigating.
            setTimeout(() => {
              this.router.navigate(['/appointments', response.id]);
            }, 5000);
          },
        error: (error) => {
          console.error('Appointment booking failed:', error);

          this.errorMessage =
            error.error?.message ??
            'Unable to book the appointment. Please try again.';

          this.cdr.markForCheck();
        }
      });
  }
}
