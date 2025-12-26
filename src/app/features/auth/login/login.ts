import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoadingButton } from '@/app/shared/components/ui/loading-button/loading-button';
import { RouterLink } from '@angular/router';

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

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  async onLogin() {
    this.isLoading.set(true);
    setTimeout(() => this.isLoading.set(false), 2000);
  }
}
