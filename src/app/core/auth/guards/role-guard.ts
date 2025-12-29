import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';

import { AuthService } from '@core/auth/auth-service';
import { RouteData } from '@/app/app.routes';

export const roleGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const { roles: requiredRoles } = route.data as RouteData;

  if (!requiredRoles) {
    throw Error('All permissionsGuard uses should include roles information it their route data');
  }

  return authService.hasSomeRole(requiredRoles);
};
