import { Component } from '@angular/core';
import { DoctorService } from '../../../../core/services/doctor';
import { OnInit } from '@angular/core';
import { DataTable, TableColumn } from '../../../../shared/components/data-table/data-table';
import { DoctorForm } from '../../../../shared/components/doctor-form/doctor-form';
import { Doctor } from '../../../../models/doctor.model';
import { CreateDoctorRequest } from '../../../../models/CreateDoctorRequest.model';

@Component({
  imports: [DataTable,DoctorForm],
  selector: 'app-admin-doctors',
  styleUrl: './admin-doctors.css',
  templateUrl: './admin-doctors.html',
})
export class AdminDoctors implements OnInit {
  doctors: Doctor[] = [];

  isLoading = false;
  errorMessage = '';

  showDoctorForm = false;
  isSaving = false;

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

  openDoctorForm(): void {
  this.showDoctorForm = true;
}

cancelDoctorForm(): void {
  this.showDoctorForm = false;
}

onSaveDoctor(doctorData: CreateDoctorRequest): void {
  this.isSaving = true;
  this.errorMessage = '';

  this.doctorService.createDoctor(doctorData).subscribe({
    next: () => {
      this.showDoctorForm = false;
      this.loadDoctors();
      this.isSaving = false;
    },
    error: (error) => {
      this.errorMessage =
        error.error?.message ?? 'Failed to create doctor.';
      this.isSaving = false;
    }
  });
}
}
