import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Authentication } from './authentication';

@Injectable({
  providedIn: 'root'
})
export class TripData {
  private apiBaseUrl = 'http://localhost:3000/api';

  constructor(
    private http: HttpClient,
    private authentication: Authentication
  ) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authentication.getToken();

    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  getTrips(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiBaseUrl}/trips`);
  }

  getTrip(code: string): Observable<any> {
    return this.http.get<any>(`${this.apiBaseUrl}/trips/${code}`);
  }

  addTrip(trip: any): Observable<any> {
    return this.http.post<any>(
      `${this.apiBaseUrl}/trips`,
      trip,
      { headers: this.getAuthHeaders() }
    );
  }

  updateTrip(code: string, trip: any): Observable<any> {
    return this.http.put<any>(
      `${this.apiBaseUrl}/trips/${code}`,
      trip,
      { headers: this.getAuthHeaders() }
    );
  }

  deleteTrip(code: string): Observable<any> {
    return this.http.delete<any>(
      `${this.apiBaseUrl}/trips/${code}`,
      { headers: this.getAuthHeaders() }
    );
  }
}