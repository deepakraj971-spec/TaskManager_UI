import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { firstValueFrom } from 'rxjs';

export const authGuard = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  try {
    // Ping backend to check if cookie/session is valid
    const res = await firstValueFrom(auth.checkSession());
    if (res.success) {
      auth.updateAuthState(true);
      return true;
    } else {
      auth.updateAuthState(false);
      router.navigate(['/login'], { queryParams: { redirect: location.pathname } });
      return false;
    }
  } catch {
    auth.updateAuthState(false);
    router.navigate(['/login'], { queryParams: { redirect: location.pathname } });
    return false;
  }
};
