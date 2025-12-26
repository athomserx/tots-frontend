import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { passwordMatchValidator } from '@/app/features/auth/password-match.validator';
import { LoadingButton } from '@/app/shared/components/ui/loading-button/loading-button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'tots-register',
  imports: [ReactiveFormsModule, ProgressSpinnerModule, LoadingButton, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  fb = inject(FormBuilder);

  registerForm = this.fb.group(
    {
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10,15}$')]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: passwordMatchValidator }
  );

  async onSubmit() {
    if (this.registerForm.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log('Registered:', this.registerForm.value);
    } catch (err) {
      this.errorMessage.set('Registration failed. Please try again.');
    } finally {
      this.isLoading.set(false);
    }
  }
}
