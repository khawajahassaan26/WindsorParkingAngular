// src/app/modules/auth/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError, of } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { TokenService } from './token.service';
import { SessionService } from './session.service';
import { LoginResponse, UserInfo, LoginInfo, Rights } from '../models/User.modal';

interface LoginDto {
  username: string;
  password: string;
}

interface RefreshResponse {
  token: string;
  user: UserInfo;
  userRights?: Rights[];
  loginDetail?: LoginInfo;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'https://localhost:44318/api/auth';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    private tokenService: TokenService,
    private sessionService: SessionService
  ) {
    // Initialize authentication state on service creation
    this.initializeAuthState();
  }

  private initializeAuthState(): void {
    const isAuth = this.sessionService.isAuthenticated();
    this.isAuthenticatedSubject.next(isAuth);
  }

  login(username: string, password: string, remember: boolean = false): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { username, password }).pipe(
      tap(response => {
        console.log('Login response:', response); // Debug log
        
        // Store tokens and user data using TokenService
        this.tokenService.storeToken(remember, response);
        
        // Update session with user info - ALWAYS update, even with partial data
        this.sessionService.updateSession(
          response.user || {} as UserInfo,
          response.userRights || [],
          response.loginDetail || {} as LoginInfo
        );
        
        // Verify storage
        console.log('After login - Token:', this.tokenService.getToken());
        console.log('After login - User:', this.sessionService.getUser());
        console.log('After login - isAuthenticated:', this.sessionService.isAuthenticated());
        
        this.isAuthenticatedSubject.next(true);
      }),
      catchError(error => {
        console.error('Login failed:', error);
        return throwError(() => error);
      })
    );
  }

  register(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { username, password });
  }

  refreshToken(): Observable<boolean> {
    const token = this.tokenService.getToken();
    
    // If no token exists or token is not expired, skip refresh
    if (!token) {
      return of(false);
    }

    if (!this.tokenService.isTokenExpired()) {
      // Token is still valid, no need to refresh
      this.isAuthenticatedSubject.next(true);
      return of(true);
    }

    // Token exists but is expired, attempt refresh
    return this.http.post<RefreshResponse>(`${this.apiUrl}/refresh`, { 
      refreshToken: token 
    }).pipe(
      map(response => {
        // Determine storage type based on where current token is stored
        const remember = !!localStorage.getItem(this.tokenService['tokenKey']);
        
        // Store new tokens
        this.tokenService.storeToken(remember, {
          token: response.token,
          user: response.user,
          userRights: response.userRights,
          loginDetail: response.loginDetail
        } as LoginResponse);
        
        // Update session
        if (response.user && response.loginDetail) {
          this.sessionService.updateSession(
            response.user,
            response.userRights || [],
            response.loginDetail
          );
        }
        
        this.isAuthenticatedSubject.next(true);
        return true;
      }),
      catchError(error => {
        console.error('Token refresh failed:', error);
        this.logout();
        return of(false);
      })
    );
  }

  logout(): void {
    const refreshToken = this.tokenService.getToken();
    
    // Call backend logout if token exists
    if (refreshToken) {
      this.http.post(`${this.apiUrl}/logout`, { refreshToken }).subscribe({
        error: (err) => console.error('Logout API call failed:', err)
      });
    }
    
    // Clear all stored data
    this.tokenService.clear();
    this.sessionService.clearSession();
    this.isAuthenticatedSubject.next(false);
    
    // Navigate to login
    this.router.navigate(['/auth/login']);
  }

  isLoggedIn(): boolean {
    return this.sessionService.isAuthenticated();
  }

  getCurrentUser(): UserInfo | null {
    return this.sessionService.getUser();
  }

  getLoginInfo(): LoginInfo | null {
    return this.sessionService.getLoginInfo();
  }

  // Helper method to check if token needs refresh
  needsTokenRefresh(): boolean {
    return this.tokenService.isTokenExpired();
  }
}