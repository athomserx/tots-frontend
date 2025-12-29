import { computed, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { API_URL } from '@core/api/api.token';
import { tap } from 'rxjs';
import { STORAGE_KEYS } from '@core/auth/auth-constants';
import { AuthResponse, LoginPayload, RegisterPayload, User } from './auth-types';
import { isPlatformBrowser } from '@angular/common';

interface UserJWTClaims {
  sub: string;
  email: string;
  name: string;
  role: number;
  phone: string;
  exp: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = inject(API_URL);

  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  private token = signal<string | null>(
    this.isBrowser ? localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN) : null
  );

  readonly currentUser = computed(() => this.decodeUserFromToken(this.token()));
  readonly isAuthenticated = computed(() => !!this.token() && !!this.currentUser());

  login(payload: LoginPayload) {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/login`, payload)
      .pipe(tap((response) => this.handleAuthSuccess(response)));
  }

  register(payload: RegisterPayload) {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/register`, payload)
      .pipe(tap((response) => this.handleAuthSuccess(response)));
  }

  logout() {
    this.clearAuth();
    this.router.navigate(['/auth/login']);

    return this.http.post(`${this.apiUrl}/logout`, {});
  }

  getToken(): string | null {
    return this.token();
  }

  private handleAuthSuccess(response: AuthResponse) {
    const token = response.token;
    if (this.isBrowser) {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    }
    this.token.set(token);
  }

  private clearAuth() {
    if (this.isBrowser) {
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    }
    this.token.set(null);
  }

  private decodeUserFromToken(token: string | null): User | null {
    if (!token) return null;

    try {
      const payload = token.split('.')[1];
      const decoded: UserJWTClaims = JSON.parse(atob(payload));

      if (Date.now() >= decoded.exp * 1000) {
        this.clearAuth();
        return null;
      }

      return {
        id: decoded.sub,
        email: decoded.email,
        name: decoded.name,
        phone: decoded.phone,
        roleId: decoded.role,
      };
    } catch (error) {
      console.error('Invalid Token', error);
      this.clearAuth();
      return null;
    }
  }
}
