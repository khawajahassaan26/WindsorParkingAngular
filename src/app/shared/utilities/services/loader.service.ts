import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface LoaderState {
  show: boolean;
  message?: string;
  type?: 'default' | 'login' | 'logout' | 'saving' | 'loading' | 'processing';
}

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  setError() {
    throw new Error('Method not implemented.');
  }
 
  private loaderSubject = new BehaviorSubject<LoaderState>({ show: false });
  public loader$: Observable<LoaderState> = this.loaderSubject.asObservable();

  // Show loader with optional message and type
  show(message?: string, type: LoaderState['type'] = 'default'): void {
    this.loaderSubject.next({ show: true, message, type });
  }

  // Hide loader
  hide(): void {
    this.loaderSubject.next({ show: false });
  }

  // Specific methods for common scenarios
  showLogin(message: string = 'Signing in...'): void {
    this.show(message, 'login');
  }

  showLogout(message: string = 'Signing out...'): void {
    this.show(message, 'logout');
  }

  showSaving(message: string = 'Saving...'): void {
    this.show(message, 'saving');
  }

  showLoading(message: string = 'Loading...'): void {
    this.show(message, 'loading');
  }

  showProcessing(message: string = 'Processing...'): void {
    this.show(message, 'processing');
  }

  // Get current loader state
  get isLoading(): boolean {
    return this.loaderSubject.value.show;
  }

  get currentState(): LoaderState {
    return this.loaderSubject.value;
  }
}