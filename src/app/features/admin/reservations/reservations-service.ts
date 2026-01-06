import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Reservation } from './reservation-types';
import { API_URL } from '@core/api/api-token';

export interface ReservationListResponse {
  data: Reservation[];
  total: number;
}

@Injectable({
  providedIn: 'root',
})
export class ReservationsService {
  http = inject(HttpClient);
  apiUrl = inject(API_URL);
  pathModel = 'reservations';
  baseUrl = `${this.apiUrl}/${this.pathModel}`;

  create(item: Reservation): Observable<Reservation> {
    return this.http.post<Reservation>(this.baseUrl, item);
  }

  list(queryParams?: string): Observable<ReservationListResponse> {
    const url = queryParams ? `${this.baseUrl}${queryParams}` : this.baseUrl;
    return this.http.get<ReservationListResponse>(url);
  }

  get(id: string): Observable<Reservation> {
    return this.http.get<Reservation>(`${this.baseUrl}/${id}`);
  }

  update(item: Reservation): Observable<Reservation> {
    return this.http.put<Reservation>(`${this.baseUrl}/${item.id}`, item);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
