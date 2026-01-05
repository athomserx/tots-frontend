import { Route } from '@angular/router';

import { authRoutes } from '@core/auth/auth.routes';
import { authGuard } from '@core/auth/guards/auth-guard';
import { roleGuard } from '@core/auth/guards/role-guard';
import { UserRole } from '@core/models/role-model';

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
        loadComponent: () => import('@features/client/explore/explore').then((m) => m.Explore),
        canMatch: [roleGuard],
        data: { roles: [UserRole.CLIENT] },
      },
      {
        path: 'dashboard',
        loadComponent: () => import('@features/admin/spaces/spaces').then((m) => m.Spaces),
        canMatch: [roleGuard],
        data: { roles: [UserRole.ADMIN] },
      },
      {
        path: 'bookings',
        loadComponent: () => import('@features/client/bookings/bookings').then((m) => m.Bookings),
        canMatch: [roleGuard],
        data: { roles: [UserRole.CLIENT] },
      },
      {
        path: 'reservations',
        loadComponent: () =>
          import('@features/admin/reservations/reservations').then((m) => m.Reservations),
        canMatch: [roleGuard],
        data: { roles: [UserRole.ADMIN] },
      },
    ],
  },
  ...authRoutes,
  {
    path: '**',
    redirectTo: '',
  },
];
