import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

export const authGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoading()) {
    await authService.waitForAuthInit();
  }

  if (authService.isAuthenticated()) {
    return true;
  }

  // Not authenticated, redirect to login
  return router.createUrlTree(['/login']);
};
