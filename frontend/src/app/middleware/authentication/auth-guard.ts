import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../../shared/userService/userService';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

export const AuthGuard = (allowedRoles: string[]): CanActivateFn => {
  return (route, state): Observable<boolean> | boolean => {
    const userService = inject(UserService);
    const router = inject(Router);

    // If user is not loaded yet, fetch it (common in your case)
    if (!userService.user) {
      return userService.getCurrentUser().pipe(
        map(res => {
          if (!userService.user) {
            // Not logged in → redirect to login
            router.navigate(['/login']);
            return false;
          }

          const userRole = userService.user.role;
          const hasAccess = allowedRoles.includes(userRole);

          if (!hasAccess) {
            // Redirect to unauthorized page or home
            router.navigate(['/not-found']); // or ['/'] or whatever
            return false;
          }

          return true;
        })
      );
    }

    // User already loaded
    const userRole = userService.user.role;
    const hasAccess = allowedRoles.includes(userRole);

    if (!hasAccess) {
      router.navigate(['/unauthorized']);
      return false;
    }

    return true;
  };
};