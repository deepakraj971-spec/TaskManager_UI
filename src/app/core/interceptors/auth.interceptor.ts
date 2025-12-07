import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ErrorService } from '../services/error.service';
import { catchError, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const errors = inject(ErrorService);

  const authReq = req.clone({ withCredentials: true });

  return next(authReq).pipe(
    catchError((err: HttpErrorResponse) => {
      // Only attempt refresh if it's not login/refresh/me endpoints
      const isAuthEndpoint =
        req.url.includes('/auth/login') ||
        req.url.includes('/auth/refresh') ||
        req.url.includes('/auth/me');

      if (err.status === 401 && !isAuthEndpoint) {
        // Try refresh
        return auth.refresh().pipe(
          switchMap((res) => {
            if (res.success) {
              // Retry original request after refresh
              const retryReq = req.clone({ withCredentials: true });
              return next(retryReq);
            } else {
              // Refresh failed → logout
              auth.updateAuthState(false);
              router.navigate(['/login']);
              return throwError(() => err);
            }
          }),
          catchError(() => {
            auth.updateAuthState(false);
            router.navigate(['/login']);
            return throwError(() => err);
          })
        );
      } else if (err.status === 403) {
        errors.show('You do not have permission for this action.');
      } else {
        errors.show(err.error?.message || 'Request failed.');
      }
      return throwError(() => err);
    })
  );
};
