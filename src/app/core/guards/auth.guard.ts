import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.hasToken()) {
    return true;
  } else {
    router.navigate(['/login'], { queryParams: { redirect: location.pathname } });
    return false;
  }
};
