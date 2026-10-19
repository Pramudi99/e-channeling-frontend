
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
  isDeleting = false;

  errorMessage = '';
  successMessage = '';

  showDoctorForm = false;
  selectedDoctor: Doctor | null = null;
  doctorToView: Doctor | null = null;

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
      .pipe(finalize(() => {
        this.isLoading = false;
        this.cdr.markForCheck();
      }))
      .subscribe({
        next: (response: Doctor[]) => {
          this.doctors = response;
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Error loading doctors:', error);
          this.errorMessage = 'Unable to load doctors. Please try again.';
          this.cdr.markForCheck();
        }
      });
  }

  openDoctorForm(): void {
    this.selectedDoctor = null;
    this.showDoctorForm = true;
    this.doctorToView = null;
    this.successMessage = '';
    this.errorMessage = '';
  }

  cancelDoctorForm(): void {
    this.showDoctorForm = false;
    this.selectedDoctor = null;
  }

  viewDoctor(row: object): void {
    this.doctorToView = row as Doctor;
    this.showDoctorForm = false;
    this.selectedDoctor = null;
    this.errorMessage = '';
    this.successMessage = '';
  }

  editDoctor(row: object): void {
    this.selectedDoctor = row as Doctor;
    this.showDoctorForm = true;
    this.doctorToView = null;
    this.errorMessage = '';
    this.successMessage = '';
  }

  closeDetails(): void {
    this.doctorToView = null;
  }

  onSaveDoctor(doctorData: CreateDoctorRequest): void {
    if (this.isSaving) {
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';
    this.successMessage = '';

    const request$ = this.selectedDoctor
      ? this.doctorService.updateDoctor(
          this.selectedDoctor.id,
          doctorData
        )
      : this.doctorService.createDoctor(doctorData);

    request$
      .pipe(finalize(() => {
        this.isSaving = false;
        this.cdr.markForCheck();
      }))
      .subscribe({
        next: () => {
          const wasEditing = this.selectedDoctor !== null;

          this.showDoctorForm = false;
          this.selectedDoctor = null;
          this.successMessage = wasEditing
            ? 'Doctor updated successfully.'
            : 'Doctor created successfully.';

          this.loadDoctors();
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Error saving doctor:', error);
          this.errorMessage =
            error.error?.message ?? 'Failed to save doctor.';
          this.cdr.markForCheck();
        }
      });
  }

  deleteDoctor(row: object): void {
    const doctor = row as Doctor;

    const confirmed = confirm(
      `Are you sure you want to delete ${doctor.fullName}?`
    );

    if (!confirmed || this.isDeleting) {
      return;
    }

    this.isDeleting = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.doctorService.deleteDoctor(doctor.id)
      .pipe(finalize(() => {
        this.isDeleting = false;
        this.cdr.markForCheck();
      }))
      .subscribe({
        next: () => {
          this.successMessage = 'Doctor deleted successfully.';

          if (this.doctorToView?.id === doctor.id) {
            this.doctorToView = null;
          }

          if (this.selectedDoctor?.id === doctor.id) {
            this.selectedDoctor = null;
            this.showDoctorForm = false;
          }

          this.loadDoctors();
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Error deleting doctor:', error);
          this.errorMessage =
            error.error?.message ?? 'Failed to delete doctor.';
          this.cdr.markForCheck();
        }
      });
  }
}
