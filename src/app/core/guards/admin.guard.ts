import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { ToastService } from '../services/toast.service';

export const adminGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toast = inject(ToastService);

  if (authService.isLoading()) {
    await authService.waitForAuthInit();
  }

  if (authService.isAdmin()) {
    return true;
  }

  toast.error('Access restricted. Admin Console is only accessible to authorized administrator (nibasnazeem@gmail.com).');
  return router.createUrlTree(['/dashboard']);
};
