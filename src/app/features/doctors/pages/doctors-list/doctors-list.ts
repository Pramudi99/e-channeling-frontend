
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { DoctorService } from '../../../../core/services/doctor';
import { Doctor } from '../../../../models/doctor.model';

@Component({
  selector: 'app-doctors-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './doctors-list.html',
  styleUrl: './doctors-list.css'
})
export class DoctorsList implements OnInit {

  doctors: Doctor[] = [];

  searchTerm = '';
  selectedSpecialization = 'All';

  isLoading = false;
  errorMessage = '';

  constructor(
    private doctorService: DoctorService
  ) {}

  ngOnInit(): void {
    this.loadDoctors();
  }

  loadDoctors(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.doctorService.getDoctors().subscribe({
      next: (data) => {
        this.doctors = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Failed to load doctors:', error);
        this.errorMessage = 'Unable to load doctors. Please try again.';
        this.isLoading = false;
      }
    });
  }

  get specializations(): string[] {
    const values = this.doctors
      .map(doctor => doctor.specialization?.trim())
      .filter((value): value is string => !!value);

    return [...new Set(values)].sort();
  }

  get filteredDoctors(): Doctor[] {
    const term = this.searchTerm.trim().toLowerCase();

    return this.doctors.filter(doctor => {
      const name = doctor.fullName?.toLowerCase() ?? '';
      const specialization =
        doctor.specialization?.toLowerCase() ?? '';

      const matchesSearch =
        name.includes(term) ||
        specialization.includes(term);

      const matchesSpecialization =
        this.selectedSpecialization === 'All' ||
        doctor.specialization === this.selectedSpecialization;

      return matchesSearch && matchesSpecialization;
    });
  }

  selectSpecialization(value: string): void {
    this.selectedSpecialization = value;
  }
}
