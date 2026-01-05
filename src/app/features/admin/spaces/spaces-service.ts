import { inject, Injectable } from '@angular/core';

import { MCApiRestHttpService, MCListResponse } from '@mckit/core';

import { Space } from './space-types';
import { API_URL } from '@core/api/api-token';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SpacesService implements MCApiRestHttpService<Space> {
  http = inject(HttpClient);

  apiUrl = inject(API_URL);
  pathModel = 'spaces';
  baseUrl = `${this.apiUrl}/${this.pathModel}`;

  create(item: Space) {
    return of(item);
    // return this.http.post<Space>(this.baseUrl, item);
  }

  list(queryParams?: string): Observable<MCListResponse<Space>> {
    console.log('queryParams', queryParams);
    return of({
      data: [
        {
          id: 1,
          name: 'Space 1',
          type: 'Type 1',
          description: 'Description 1',
          pricePerHour: 1,
          capacity: 1,
          createdAt: '2026-01-01',
          updatedAt: '2026-01-01',
        },
        {
          id: 2,
          name: 'Space 2',
          type: 'Type 2',
          description: 'Description 2',
          pricePerHour: 2,
          capacity: 2,
          createdAt: '2026-01-01',
          updatedAt: '2026-01-01',
        },
      ],
      total: 50,
    });
    // return this.http.get<MCListResponse<Space>>(this.baseUrl + queryParams);
  }

  get(id: string) {
    return of({
      id: 1,
      name: 'Space 1',
      type: 'Type 1',
      description: 'Description 1',
      pricePerHour: 1,
      capacity: 1,
      createdAt: '2026-01-01',
      updatedAt: '2026-01-01',
    });
    // return this.http.get<Space>(`${this.baseUrl}/${id}`);
  }

  update(item: Space) {
    return of(item);
    // return this.http.put<Space>(`${this.baseUrl}/${item.id}`, item);
  }

  delete(id: string): Observable<void> {
    console.log('remove id', id);
    return of(undefined);
    // return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
