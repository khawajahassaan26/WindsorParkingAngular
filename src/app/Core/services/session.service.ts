// src/app/modules/auth/services/session.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TokenService } from './token.service';
import { LoginInfo, Rights, UserInfo } from '../models/User.modal';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private _userSubject: BehaviorSubject<UserInfo | null> = new BehaviorSubject<UserInfo | null>(null);
  private _rightsSubject: BehaviorSubject<Rights[]> = new BehaviorSubject<Rights[]>([]);
  private _loginInfoSubject: BehaviorSubject<LoginInfo | null> = new BehaviorSubject<LoginInfo | null>(null);

  user$: Observable<UserInfo | null> = this._userSubject.asObservable();
  rights$: Observable<Rights[]> = this._rightsSubject.asObservable();
  loginInfo$: Observable<LoginInfo | null> = this._loginInfoSubject.asObservable();

  constructor(private tokenService: TokenService) {
    this.loadSession();
  }

  private loadSession(): void {
    // Load from storage on initialization
    const user = this.tokenService.getUser();
    const loginInfo = this.tokenService.getLoginInfo();
    
    console.log('SessionService loadSession - User:', user);
    console.log('SessionService loadSession - LoginInfo:', loginInfo);
    
    if (user) {
      this._userSubject.next(user);
      this._loginInfoSubject.next(loginInfo);
    }
  }

  updateSession(user: UserInfo, rights: Rights[], loginInfo: LoginInfo): void {
    console.log('SessionService updateSession - User:', user);
    console.log('SessionService updateSession - LoginInfo:', loginInfo);
    
    // Update BehaviorSubjects
    this._userSubject.next(user);
    this._rightsSubject.next(rights);
    this._loginInfoSubject.next(loginInfo);
  }

  clearSession(): void {
    this._userSubject.next(null);
    this._rightsSubject.next([]);
    this._loginInfoSubject.next(null);
  }

  getUser(): UserInfo | null {
    return this._userSubject.value;
  }

  getLoginInfo(): LoginInfo | null {
    return this._loginInfoSubject.value;
  }

  isAuthenticated(): boolean {
    const hasToken = !!this.tokenService.getToken();
    const hasUser = !!this.getUser();
    const tokenNotExpired = !this.tokenService.isTokenExpired();
    
    console.log('SessionService isAuthenticated check:', {
      hasToken,
      hasUser,
      tokenNotExpired,
      user: this.getUser(),
      token: this.tokenService.getToken()?.substring(0, 20) + '...'
    });
    
    // Primary check: token exists and is not expired
    // User data is secondary (might not be loaded yet in some edge cases)
    return hasToken && tokenNotExpired && hasUser;
  }
}