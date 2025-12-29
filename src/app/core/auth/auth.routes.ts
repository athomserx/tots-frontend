import { Routes } from '@angular/router';
import { guestGuard } from '@core/auth/guards/guest-guard';

export const authRoutes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then((m) => m.Login),
    title: 'Login',
    canActivate: [guestGuard],
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register').then((m) => m.Register),
    title: 'Register',
    canActivate: [guestGuard],
  },
];
