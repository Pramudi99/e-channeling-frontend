import { CanActivateFn, Router} from '@angular/router';
import { inject } from '@angular/core';

export const roleGuard = (
  allowedRoles: string[]
): CanActivateFn => {

  return (route, state) => {

    const router = inject(Router);

    const role = localStorage.getItem('role');

    if (role && allowedRoles.includes(role)) {
      return true;
    }

    router.navigate(['/login']);

    return false;
  };
};
