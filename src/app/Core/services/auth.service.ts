import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

interface LoginResponse { accessToken: string; refreshToken: string; role: string;userId: number }
interface RefreshResponse { accessToken: string; refreshToken: string; role: string; userId: number}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'https://localhost:44316/api/auth';  // Update to your API URL
  private tokenSubject = new BehaviorSubject<string | null>(localStorage.getItem('accessToken'));

  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { username, password }).pipe(
      tap(res => this.setTokens(res.accessToken, res.refreshToken,res.role, res.userId))
    );
  }

  register(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { username, password });
  }

  refreshToken(): Observable<RefreshResponse> {
    const refreshToken = localStorage.getItem('refreshToken');
    return this.http.post<RefreshResponse>(`${this.apiUrl}/refresh`, { refreshToken }).pipe(
      tap(res => this.setTokens(res.accessToken, res.refreshToken,res.role, res.userId))
    );
  }

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    this.tokenSubject.next(null);
    this.router.navigate(['']);
  }

  isLoggedIn(): boolean {
    return !!this.tokenSubject.value;
  }

  private setTokens(accessToken: string, refreshToken: string, role? :string , userId? :number) {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('role', role ?? "");
    localStorage.setItem('userId', userId?.toString() ?? (0).toString());
    this.tokenSubject.next(accessToken);
  }
}