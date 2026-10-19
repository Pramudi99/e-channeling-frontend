import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  Appointment,
  CreateAppointmentRequest,
  CreateAppointmentResponse
} from '../../models/appointment.model';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private readonly apiUrl =
    'http://localhost:5211/api/Appointment';

  constructor(private http: HttpClient) {}

  createAppointment(
    request: CreateAppointmentRequest
  ): Observable<CreateAppointmentResponse> {
    return this.http.post<CreateAppointmentResponse>(
      this.apiUrl,
      request
    );
  }

  getMyAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(
      `${this.apiUrl}/my`
    );
  }

  getAppointmentById(id: number): Observable<Appointment> {
    return this.http.get<Appointment>(
      `${this.apiUrl}/${id}`
    );
  }
}
