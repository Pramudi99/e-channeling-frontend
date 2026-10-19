import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import { ActivatedRoute, RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { finalize } from 'rxjs';

import { AppointmentService } from '../../../../core/services/appointment';
import { Appointment as AppointmentDetailsModel } from '../../../../models/appointment.model';

@Component({
  selector: 'app-appointment-details',
  standalone: true,
  imports: [
    RouterLink,
    CurrencyPipe,
    DatePipe
  ],
  templateUrl: './appointment-details.html',
  styleUrl: './appointment-details.css'
})
export class AppointmentDetails implements OnInit {
  appointment: AppointmentDetailsModel | null = null;

  isLoading = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private appointmentService: AppointmentService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!Number.isInteger(id) || id <= 0) {
      this.errorMessage = 'Invalid appointment ID.';
      return;
    }

    this.loadAppointment(id);
  }

  loadAppointment(id: number): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.appointment = null;

    this.appointmentService
      .getAppointmentById(id)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: (data) => {
          this.appointment = data;
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Failed to load appointment:', error);

          if (error.status === 404) {
            this.errorMessage =
              'Appointment not found, or you do not have permission to view it.';
          } else if (error.status === 401 || error.status === 403) {
            this.errorMessage =
              'You are not authorized to view this appointment. Please sign in again if needed.';
          } else {
            this.errorMessage =
              'Unable to load appointment details. Please try again.';
          }

          this.cdr.markForCheck();
        }
      });
  }
}
