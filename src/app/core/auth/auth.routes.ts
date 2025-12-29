import { AppRoutes } from '@/app/app.routes';
import { guestGuard } from '@core/auth/guards/guest-guard';

export const authRoutes: AppRoutes = [
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
