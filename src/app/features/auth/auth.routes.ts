import { Routes } from '@angular/router';
import { guestGuard } from '@/app/core/auth/guest.guard';

export const authRoutes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./login/login').then((m) => m.Login),
    title: 'Login',
    canActivate: [guestGuard],
  },
  {
    path: 'register',
    loadComponent: () => import('./register/register').then((m) => m.Register),
    title: 'Register',
    canActivate: [guestGuard],
  },
];
