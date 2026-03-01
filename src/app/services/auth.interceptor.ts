import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError, EMPTY } from 'rxjs';
import { AuthService } from './auth.service';

/**
 * Functional HTTP interceptor that:
 * 1. Attaches the JWT Bearer token to every outgoing request.
 * 2. Catches 401 Unauthorized responses (session expired / token invalid),
 *    logs the user out and redirects to /login.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();

  const authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401) {
        authService.logout();
        router.navigate(['/login'], { queryParams: { reason: 'session-expired' } });
        return EMPTY;
      }
      return throwError(() => err);
    })
  );
};
