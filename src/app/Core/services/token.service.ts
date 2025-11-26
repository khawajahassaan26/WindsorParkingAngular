// src/app/modules/auth/services/token.service.ts
import { Injectable } from '@angular/core';
import { LoginInfo, LoginResponse, UserInfo } from '../models/User.modal';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private tokenKey = 'auth_token';
  private userKey = 'auth_user';
  private loginInfoKey = 'login_info'; // Fixed typo: loginInfo -> loginInfoKey
  private rightsKey = 'auth_rights';
 setAccessToken(token: string) {
    localStorage.setItem('accessToken', token);
  }

  setRefreshToken(token: string) {
    localStorage.setItem('refreshToken', token);
  }

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  // clear() {
  //   localStorage.removeItem('accessToken');
  //   localStorage.removeItem('refreshToken');
  // }
  storeToken(remember: boolean, response: LoginResponse): void {
    const storage: Storage = remember ? localStorage : sessionStorage;

    // Clear any existing tokens from both storages to avoid conflicts
    this.clear();

    // Store token
    if (response.token) {
      storage.setItem(this.tokenKey, response.token);
    }

    // Store user info
    if (response.user) {
      storage.setItem(this.userKey, JSON.stringify(response.user));
    }

    // Store user rights
    if (response.userRights) {
      storage.setItem(this.rightsKey, JSON.stringify(response.userRights));
    }

    // Store login detail
    if (response.loginDetail) {
      storage.setItem(this.loginInfoKey, JSON.stringify(response.loginDetail));
    }
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey) || sessionStorage.getItem(this.tokenKey);
  }

  getUser(): UserInfo | null {
    const userJson = localStorage.getItem(this.userKey) || sessionStorage.getItem(this.userKey);
    return userJson ? this.safeJsonParse<UserInfo>(userJson) : null;
  }

  // getUserRights(): Rights[] {
  //   const rightsJson = localStorage.getItem(this.rightsKey) || sessionStorage.getItem(this.rightsKey);
  //   const parsed = rightsJson ? this.safeJsonParse<Rights[]>(rightsJson, []) : [];
  //   return parsed || [];
  // }

  getLoginInfo(): LoginInfo | null {
    const loginInfoJson = localStorage.getItem(this.loginInfoKey) || sessionStorage.getItem(this.loginInfoKey);
    return loginInfoJson ? this.safeJsonParse<LoginInfo>(loginInfoJson) : null;
  }

  clear(): void {
    // Clear from localStorage
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    localStorage.removeItem(this.rightsKey);
    localStorage.removeItem(this.loginInfoKey);

    // Clear from sessionStorage
    sessionStorage.removeItem(this.tokenKey);
    sessionStorage.removeItem(this.userKey);
    sessionStorage.removeItem(this.rightsKey);
    sessionStorage.removeItem(this.loginInfoKey);
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) {
      return true;
    }

    const payload = this.decodeToken(token);
    if (!payload || !payload.exp) {
      return true;
    }

    // exp is in seconds, compare with current time in ms
    // Add 30 second buffer to account for clock skew
    const expiryTime = payload.exp * 1000;
    const currentTime = Date.now();
    const buffer = 30 * 1000; // 30 seconds

    return expiryTime < (currentTime + buffer);
  }

  getTokenExpiryDate(): Date | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }

    const payload = this.decodeToken(token);
    if (!payload || !payload.exp) {
      return null;
    }

    return new Date(payload.exp * 1000);
  }

  getTokenPayload(): any {
    const token = this.getToken();
    return token ? this.decodeToken(token) : null;
  }

  private decodeToken(token: string): any {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        console.error('Invalid JWT token format');
        return null;
      }
      
      const decoded = atob(parts[1]);
      return JSON.parse(decoded);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  private safeJsonParse<T>(json: string, fallback: any = null): T | null {
    try {
      return JSON.parse(json) as T;
    } catch (error) {
      console.error('Error parsing JSON:', error);
      return fallback;
    }
  }
}