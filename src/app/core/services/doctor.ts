import { Service } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
    private apiUrl = 'http://localhost:5211/api/Doctor';

  constructor(private http: HttpClient) {}

  getDoctors(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getDoctor(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  createDoctor(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  updateDoctor(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  deleteDoctor(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
