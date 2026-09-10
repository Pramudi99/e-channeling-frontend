import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Auth {
    private apiUrl = 'http://localhost:5211/api/Auth';

  constructor(private http: HttpClient) {}

  register(data: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/register`,
      data
    );
  }

  login(data: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/login`,
      data
    );
  }

   getProfile(): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/profile`
    );
  }

  logout(): void {
  localStorage.removeItem('token');
  }
}
