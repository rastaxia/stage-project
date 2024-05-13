import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class isLoggedIn implements CanActivate {
  constructor(private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const authStorage = localStorage.getItem('auth');
    const token = authStorage ? JSON.parse(authStorage).jwt : null;

    if (!token) {
      return this.router.parseUrl('/login');
    } else {
      return true;
    }
  }
}
