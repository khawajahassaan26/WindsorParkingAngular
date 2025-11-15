import { Injectable } from "@angular/core";
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "../services/auth.service";

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
  if (this.authService.isLoggedIn()) {
    // If user tries to access /auth/login while logged in → redirect
    if (state.url.includes('/auth/login')) {
      this.router.navigate(['/dashboard']);
      return false;
    }
    return true;
  }

  // If not logged in and trying to access protected routes → redirect to login
  if (!state.url.includes('/auth/login')) {
    this.router.navigate(['/auth/login']);
  }
  return !state.url.includes('/auth/login');
}
}
