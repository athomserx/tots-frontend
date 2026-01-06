import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { MCApiRestHttpService, MCListResponse } from '@mckit/core';

import { Space } from './space-types';
import { API_URL } from '@core/api/api-token';
import { buildUrlWithParams } from '@core/api/api-utils';

@Injectable({
  providedIn: 'root',
})
export class SpacesService implements MCApiRestHttpService<Space> {
  http = inject(HttpClient);

  apiUrl = inject(API_URL);
  pathModel = 'spaces';
  baseUrl = `${this.apiUrl}/${this.pathModel}`;

  create(item: Space): Observable<Space> {
    return this.http.post<Space>(this.baseUrl, item);
  }

  list(queryParams?: string): Observable<MCListResponse<Space>> {
    const url = buildUrlWithParams(this.baseUrl, queryParams);
    return this.http.get<MCListResponse<Space>>(url);
  }

  get(id: string): Observable<Space> {
    return this.http.get<Space>(`${this.baseUrl}/${id}`);
  }

  update(item: Space): Observable<Space> {
    return this.http.put<Space>(`${this.baseUrl}/${item.id}`, item);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
