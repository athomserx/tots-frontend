import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '@core/auth/auth-service';
import { User } from '@core/auth/auth-types';
import { UserRole } from '@core/models/role.enum';
import { NavLink } from './nav-link/nav-link';

@Component({
  selector: 'tots-main-layout',
  imports: [RouterOutlet, NavLink],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout {
  authService = inject(AuthService);

  user = signal<User | null>(this.authService.getUser());
  roles = UserRole;

  logout() {
    this.authService.logout();
  }
}
