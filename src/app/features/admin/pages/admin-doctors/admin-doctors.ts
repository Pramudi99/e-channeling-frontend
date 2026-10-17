// import { Component,OnInit,ChangeDetectionStrategy } from '@angular/core';
// import { DoctorService } from '../../../../core/services/doctor';
// import { DataTable, TableColumn } from '../../../../shared/components/data-table/data-table';
// import { DoctorForm } from '../../../../shared/components/doctor-form/doctor-form';
// import { Doctor } from '../../../../models/doctor.model';
// import { CreateDoctorRequest } from '../../../../models/CreateDoctorRequest.model';

// @Component({
//    standalone: true,
//   changeDetection: ChangeDetectionStrategy.Default,
//   imports: [DataTable,DoctorForm],
//   selector: 'app-admin-doctors',
//   styleUrl: './admin-doctors.css',
//   templateUrl: './admin-doctors.html',
// })
// export class AdminDoctors implements OnInit {
//   doctors: Doctor[] = [];

//   isLoading = false;
//   errorMessage = '';

//   showDoctorForm = false;
//   isSaving = false;

//   columns: TableColumn[] = [
//     { key: 'fullName', label: 'Doctor Name' },
//     { key: 'email', label: 'Email' },
//     { key: 'specialization', label: 'Specialization' },
//     { key: 'qualification', label: 'Qualification' },
//     { key: 'experience', label: 'Experience (Years)' },
//     { key: 'consultationFee', label: 'Consultation Fee' }
//   ];

//   constructor(private doctorService: DoctorService) {}

//   ngOnInit(): void {
//     this.loadDoctors();
//   }

//   // loadDoctors(): void {
//   //   this.isLoading = true;
//   //   this.errorMessage = '';

//   //   this.doctorService.getDoctors().subscribe({
//   //     next: (response) => {
//   //       console.log('Doctors received:', response);
//   //       this.doctors = response;
//   //       this.isLoading = false;
//   //     },

//   //     error: (error) => {
//   //       console.error('Error loading doctors:', error);
//   //       this.errorMessage = 'Unable to load doctors. Please try again.';
//   //       this.isLoading = false;
//   //     }
//   //   });
//   // }

// loadDoctors(): void {
//   console.log('loadDoctors() called');

//   this.isLoading = true;
//   this.errorMessage = '';

//   this.doctorService.getDoctors().subscribe({
//     next: (response) => {
//       console.log('API response:', response);
//       console.log('Is array:', Array.isArray(response));
//       console.log('Response length:', response.length);

//       this.doctors = [...response];

//       console.log('Assigned doctors:', this.doctors);
//       console.log('Assigned count:', this.doctors.length);

//       this.isLoading = false;
//       console.log('Loading:', this.isLoading);
//     },

//     error: (error) => {
//       console.error('API error:', error);
//       this.errorMessage = 'Unable to load doctors. Please try again.';
//       this.isLoading = false;
//     }
//   });
// }

//   openDoctorForm(): void {
//   this.showDoctorForm = true;
// }

// cancelDoctorForm(): void {
//   this.showDoctorForm = false;
// }

// onSaveDoctor(doctorData: CreateDoctorRequest): void {
//   this.isSaving = true;
//   this.errorMessage = '';

//   this.doctorService.createDoctor(doctorData).subscribe({
//     next: () => {
//       this.showDoctorForm = false;
//       this.loadDoctors();
//       this.isSaving = false;
//     },
//     error: (error) => {
//       this.errorMessage =
//         error.error?.message ?? 'Failed to create doctor.';
//       this.isSaving = false;
//     }
//   });
// }
// }












import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';
import { finalize } from 'rxjs';

import { DoctorService } from '../../../../core/services/doctor';
import {
  DataTable,
  TableColumn
} from '../../../../shared/components/data-table/data-table';
import { DoctorForm } from '../../../../shared/components/doctor-form/doctor-form';
import { Doctor } from '../../../../models/doctor.model';
import { CreateDoctorRequest } from '../../../../models/CreateDoctorRequest.model';

@Component({
  selector: 'app-admin-doctors',
  standalone: true,
  imports: [DataTable, DoctorForm],
  templateUrl: './admin-doctors.html',
  styleUrl: './admin-doctors.css',
})
export class AdminDoctors implements OnInit {
  doctors: Doctor[] = [];
  isLoading = false;
  isSaving = false;
  errorMessage = '';
  showDoctorForm = false;

  columns: TableColumn[] = [
    { key: 'fullName', label: 'Doctor Name' },
    { key: 'email', label: 'Email' },
    { key: 'specialization', label: 'Specialization' },
    { key: 'qualification', label: 'Qualification' },
    { key: 'experience', label: 'Experience (Years)' },
    { key: 'consultationFee', label: 'Consultation Fee' }
  ];

  constructor(
    private doctorService: DoctorService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadDoctors();
  }

  loadDoctors(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.cdr.markForCheck();

    this.doctorService.getDoctors()
      .pipe(
        finalize(() => {
          this.isLoading = false;
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

  openDoctorForm(): void {
    this.showDoctorForm = true;
  }

  cancelDoctorForm(): void {
    this.showDoctorForm = false;
  }

  onSaveDoctor(doctorData: CreateDoctorRequest): void {
    if (this.isSaving) {
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';
    this.cdr.markForCheck();

    this.doctorService.createDoctor(doctorData)
      .pipe(
        finalize(() => {
          this.isSaving = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: () => {
          this.showDoctorForm = false;
          this.loadDoctors();
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Error creating doctor:', error);
          this.errorMessage =
            error.error?.message ?? 'Failed to create doctor.';
          this.cdr.markForCheck();
        }
      });
  }
}
