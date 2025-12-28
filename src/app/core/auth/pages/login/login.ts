import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoadingButton } from '@/app/shared/ui/loading-button/loading-button';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@core/auth/auth-service';

@Component({
  selector: 'tots-login',
  imports: [ReactiveFormsModule, LoadingButton, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  async onLogin() {
    if (this.loginForm.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const { email, password } = this.loginForm.getRawValue();

    if (!email || !password) return;

    this.authService.login({ email, password }).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Login error', err);
        this.isLoading.set(false);
        this.errorMessage.set('Invalid credentials or server error.');
      },
    });
  }
}
