import { computed, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { API_URL } from '@core/config/api.token';
import { tap } from 'rxjs';
import { STORAGE_KEYS } from '@core/auth/auth-constants';
import { AuthResponse, LoginPayload, RegisterPayload, User } from './auth-types';
import { isPlatformBrowser } from '@angular/common';
import { UserRole } from '@core/models/role-model';

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

  private token = signal<string | null>(this.getInitialToken());

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
    this.http.post(`${this.apiUrl}/logout`, {}).subscribe({
      next: () => {
        this.clearAuth();
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Logout failed', err);
        this.clearAuth();
        this.router.navigate(['/login']);
      }
    });
  }

  getToken(): string | null {
    return this.token();
  }

  getUser(): User | null {
    return this.currentUser()!;
  }

  hasSomeRole(roles: UserRole[]): boolean {
    const roleId = this.getUser()?.roleId;

    return roles.some((role) => Number(roleId) === Number(role));
  }

  private getInitialToken(): string | null {
    if (!this.isBrowser) return null;
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);

    if (token && this.isTokenExpired(token)) {
      this.clearLocalStorage();
      return null;
    }
    return token;
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return Date.now() >= payload.exp * 1000;
    } catch {
      return true;
    }
  }

  private handleAuthSuccess(response: AuthResponse) {
    const token = response.token;
    this.token.set(token);
    if (this.isBrowser) {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(this.currentUser()));
    }
  }

  private clearAuth() {
    this.clearLocalStorage();
    this.token.set(null);
  }

  private decodeUserFromToken(token: string | null): User | null {
    if (!token) return null;

    try {
      const payload = token.split('.')[1];
      const decoded: UserJWTClaims = JSON.parse(atob(payload));

      return {
        id: decoded.sub,
        email: decoded.email,
        name: decoded.name,
        phone: decoded.phone,
        roleId: decoded.role,
      };
    } catch (error) {
      return null;
    }
  }

  private clearLocalStorage() {
    if (this.isBrowser) {
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
    }
  }
}
