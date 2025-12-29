import { Routes } from '@angular/router';

import { authRoutes } from '@core/auth/auth.routes';
import { authGuard } from '@core/auth/guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./app').then((m) => m.App),
    title: 'Home',
    canActivate: [authGuard],
  },
  ...authRoutes,
  {
    path: '**',
    redirectTo: '',
  },
];
