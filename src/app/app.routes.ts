import { Route, Routes } from '@angular/router';

import { authRoutes } from '@core/auth/auth.routes';
import { authGuard } from '@core/auth/guards/auth-guard';
import { roleGuard } from '@core/auth/guards/role-guard';
import { UserRole } from '@core/models/role.enum';

export interface RouteData {
  roles?: UserRole[];
}

export interface AppRoute extends Route {
  data?: RouteData;
  children?: AppRoutes;
}

export type AppRoutes = AppRoute[];

export const routes: AppRoutes = [
  {
    path: '',
    loadComponent: () => import('@layout/main-layout/main-layout').then((m) => m.MainLayout),
    title: 'Home',
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('@features/explore/pages/explore/explore').then((m) => m.Explore),
        canMatch: [roleGuard],
        data: { roles: [UserRole.CLIENT] },
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('@features/admin/pages/admin/admin').then((m) => m.Admin),
        canMatch: [roleGuard],
        data: { roles: [UserRole.ADMIN] },
      },
      {
        path: 'reservations',
        loadComponent: () =>
          import('@features/reservations/pages/reservations/reservations').then((m) => m.Reservations),
        canMatch: [roleGuard],
        data: { roles: [UserRole.CLIENT] },
      },
    ],
  },
  ...authRoutes,
  {
    path: '**',
    redirectTo: '',
  },
];
