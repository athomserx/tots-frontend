import { Routes } from '@angular/router';
import { authRoutes } from './features/auth/auth.routes';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./app').then((m) => m.App),
    title: 'Home',
  },
  ...authRoutes,
  {
    path: '**',
    redirectTo: '',
  },
];
