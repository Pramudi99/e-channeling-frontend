import { Component } from '@angular/core';
import { DoctorService } from '../../../../core/services/doctor';
import { OnInit } from '@angular/core';
import { DataTable, TableColumn } from '../../../../shared/components/data-table/data-table';
import { Doctor } from '../../../../models/doctor.model';

@Component({
  imports: [DataTable],
  selector: 'app-admin-doctors',
  styleUrl: './admin-doctors.css',
  templateUrl: './admin-doctors.html',
})
export class AdminDoctors implements OnInit {
  doctors: Doctor[] = [];

  isLoading = false;
  errorMessage = '';

  columns: TableColumn[] = [
    { key: 'fullName', label: 'Doctor Name' },
    { key: 'email', label: 'Email' },
    { key: 'specialization', label: 'Specialization' },
    { key: 'qualification', label: 'Qualification' },
    { key: 'experience', label: 'Experience (Years)' },
    { key: 'consultationFee', label: 'Consultation Fee' }
  ];

  constructor(private doctorService: DoctorService) {}

  ngOnInit(): void {
    this.loadDoctors();
  }

  loadDoctors(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.doctorService.getDoctors().subscribe({
      next: (response) => {
        this.doctors = response;
        this.isLoading = false;
      },

      error: (error) => {
        console.error('Error loading doctors:', error);
        this.errorMessage = 'Unable to load doctors. Please try again.';
        this.isLoading = false;
      }
    });
  }
}
