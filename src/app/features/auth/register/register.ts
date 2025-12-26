import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { passwordMatchValidator } from '@/app/features/auth/password-match.validator';
import { LoadingButton } from '@/app/shared/components/ui/loading-button/loading-button';
import { Router, RouterLink } from '@angular/router';
import { AuthService, RegisterPayload } from '@/app/core/auth/auth.service';

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
  authService = inject(AuthService);
  router = inject(Router);

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

    const formValue = this.registerForm.getRawValue();

    const payload: RegisterPayload = {
      first_name: formValue.firstName!,
      last_name: formValue.lastName!,
      email: formValue.email!,
      phone: formValue.phone!,
      password: formValue.password!,
      password_confirmation: formValue.confirmPassword!,
    };

    this.authService.register(payload).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Registration error', err);
        this.isLoading.set(false);
        this.errorMessage.set('Registration failed. ' + (err.error?.message || 'Please try again.'));
      },
    });
  }
}
