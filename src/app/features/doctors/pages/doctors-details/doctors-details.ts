
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';

import { DoctorService } from '../../../../core/services/doctor';
import { Doctor } from '../../../../models/doctor.model';

@Component({
  selector: 'app-doctors-details',
  standalone: true,
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './doctors-details.html',
  styleUrl: './doctors-details.css'
})
export class DoctorsDetails implements OnInit {

  doctor: Doctor | null = null;
  isLoading = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private doctorService: DoctorService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('Doctor details component initialized');

    const id = Number(this.route.snapshot.paramMap.get('id'));

    console.log('Doctor ID from route:', id);

    if (!Number.isInteger(id) || id <= 0) {
      this.errorMessage = 'Invalid doctor ID.';
      return;
    }

    this.loadDoctor(id);
  }

  loadDoctor(id: number): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.doctorService.getDoctorById(id).subscribe({
      next: (data) => {
        console.log('Doctor API response:', data);

        this.doctor = data;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Doctor API request failed:', error);

        this.errorMessage =
          error.status === 404
            ? 'Doctor not found.'
            : 'Unable to load doctor details.';

        this.isLoading = false;
        this.cdr.markForCheck();
      },
      complete: () => {
        console.log('Doctor API request completed');
      }
    });
  }
}
