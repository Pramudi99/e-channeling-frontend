
import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import { CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AppointmentService } from '../../../../core/services/appointment';
import { Appointment } from '../../../../models/appointment.model';

@Component({
  selector: 'app-my-appointments',
  standalone: true,
  imports: [
    RouterLink,
    CurrencyPipe,
    DatePipe
  ],
  templateUrl: './my-appointments.html',
  styleUrl: './my-appointments.css'
})
export class MyAppointments implements OnInit {
  appointments: Appointment[] = [];

  isLoading = false;
  errorMessage = '';

  constructor(
    private appointmentService: AppointmentService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.appointmentService
      .getMyAppointments()
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: (data) => {
          this.appointments = data;
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Failed to load appointments:', error);

          if (error.status === 401) {
            this.errorMessage =
              'Your session may have expired. Please sign in again.';
          } else {
            this.errorMessage =
              'Unable to load your appointments. Please try again.';
          }

          this.cdr.markForCheck();
        }
      });
  }

  retry(): void {
    this.loadAppointments();
  }
}
