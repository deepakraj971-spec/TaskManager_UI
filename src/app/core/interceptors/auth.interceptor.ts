import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ErrorService } from '../services/error.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const errors = inject(ErrorService);

  const token = auth.getToken();
  const authReq = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

  return next(authReq).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401) {
        errors.show('Your session has expired. Please log in again.');
        auth.logout();
        router.navigate(['/login']);
      } else if (err.status === 403) {
        errors.show('You do not have permission for this action.');
      } else {
        errors.show(err.error?.message || 'Request failed.');
      }
      return throwError(() => err);
    })
  );
};
