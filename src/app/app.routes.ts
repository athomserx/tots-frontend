import { Routes } from '@angular/router';
import { authRoutes } from './features/auth/auth.routes';
// import { authGuard } from '@/app/core/auth/auth-guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./app').then((m) => m.App),
    title: 'Home',
    canActivate: [],
  },
  ...authRoutes,
  {
    path: '**',
    redirectTo: '',
  },
];
