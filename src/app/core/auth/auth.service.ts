import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { API_URL } from '@/app/core/providers/api.token';
import { tap } from 'rxjs';
import { STORAGE_KEYS } from '@/app/shared/constants/storage-constants';

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string;
  created_at: string;
  updated_at: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
  password_confirmation: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = inject(API_URL);

  currentUser = signal<User | null>(this.getUserFromStorage());
  isAuthenticated = computed(() => !!this.currentUser());

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

  private handleAuthSuccess(response: AuthResponse) {
    this.setToken(response.token);
    this.setUser(response.user);
  }

  private setToken(token: string) {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  }

  private setUser(user: User) {
    localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(user));
    this.currentUser.set(user);
  }

  private clearAuth() {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
    this.currentUser.set(null);
  }

  private getUserFromStorage(): User | null {
    if (typeof localStorage === 'undefined') return null;
    const userStr = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
    return userStr ? JSON.parse(userStr) : null;
  }

  getToken(): string | null {
    if (typeof localStorage === 'undefined') return null;
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  }
}
