import { Injectable, inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthGuard {
  constructor(
    public auth: AuthService,
    public router: Router,
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): boolean {
    this.auth.getAuthState().subscribe((res) => {
      if (res && res.uid) {
        sessionStorage.setItem('uid', res.uid);
        return true;
      } else {
        sessionStorage.clear();
        this.router.navigate(['/login']);
        return false;
      }
    });
    return true;
  }
}

export const IsAuthGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
): boolean => {
  return inject(AuthGuard).canActivate(route, state);
};
