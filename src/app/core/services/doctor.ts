
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Doctor } from '../../models/doctor.model';
import { CreateDoctorRequest } from '../../models/CreateDoctorRequest.model';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
    private apiUrl = 'http://localhost:5211/api/Doctor';

  constructor(private http: HttpClient) {}

   getDoctors(): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(this.apiUrl);
  }

  getDoctorById(id: number): Observable<Doctor> {
    return this.http.get<Doctor>(`${this.apiUrl}/${id}`);
  }
  createDoctor(doctor: CreateDoctorRequest) {
  return this.http.post<Doctor>(this.apiUrl, doctor);
}

  updateDoctor(id: number, data: CreateDoctorRequest): Observable<Doctor> {
    return this.http.put<Doctor>(`${this.apiUrl}/${id}`, data);
  }

  deleteDoctor(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
