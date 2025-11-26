// src/app/modules/auth/guards/auth.guard.ts
import { Injectable } from "@angular/core";
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { AuthService } from "../services/auth.service";
import { of } from "rxjs";

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot, 
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    const isLoginPage = state.url.includes('/auth/login');
    const isLoggedIn = this.authService.isLoggedIn();

    return true;
    // Case 1: Not logged in
    if (!isLoggedIn) {
      if (isLoginPage) {
        // Trying to access login page while not logged in → allow
      } else {
        // Trying to access protected route while not logged in → redirect to login
        return this.router.createUrlTree(['/auth/login'], {
          queryParams: { returnUrl: state.url }
        });
      }
    }

    // Case 2: Logged in
    if (isLoginPage) {
      // Trying to access login page while logged in → redirect to dashboard
      return this.router.createUrlTree(['/dashboard']);
    }

    // Case 3: Logged in and accessing protected route → check token
    if (this.authService.needsTokenRefresh()) {
      return this.authService.refreshToken().pipe(
        map(success => {
          if (success) {
            return true;
          } else {
            // Refresh failed, redirect to login
            return this.router.createUrlTree(['/auth/login'], {
              queryParams: { returnUrl: state.url }
            });
          }
        }),
        catchError(() => {
          // Error during refresh, redirect to login
          return of(this.router.createUrlTree(['/auth/login'], {
            queryParams: { returnUrl: state.url }
          }));
        })
      );
    }

    // Token is valid, allow access
    return true;
  }
}