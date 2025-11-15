import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { LoaderService, LoaderState } from '../services/loader.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-global-loader',
  standalone: true,
  imports: [CommonModule, ProgressSpinnerModule],
  template: `
    <div class="global-loader-overlay" *ngIf="loaderState.show" [ngClass]="'loader-' + loaderState.type">
      <div class="global-loader-container">
        <!-- Spinner -->
        <div class="loader-spinner-wrapper">
          <p-progressSpinner 
            [style]="{ width: '60px', height: '60px' }" 
            strokeWidth="4"
            animationDuration="1s">
          </p-progressSpinner>
        </div>
        
        <!-- Message -->
        <div class="loader-message" *ngIf="loaderState.message">
          {{ loaderState.message }}
        </div>
        
        <!-- Icon based on type -->
        <div class="loader-icon" *ngIf="loaderState.type !== 'default'">
          <i [ngClass]="getIconClass()"></i>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .global-loader-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.7);
      backdrop-filter: blur(3px);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
      animation: fadeIn 0.3s ease-in-out;
    }

    .global-loader-container {
      background: var(--surface-0);
      border: 1px solid var(--surface-border);
      border-radius: 12px;
      padding: 2rem;
      text-align: center;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
      min-width: 200px;
      animation: scaleIn 0.3s ease-out;
    }

    .loader-spinner-wrapper {
      margin-bottom: 1rem;
    }

    .loader-message {
      font-size: 1rem;
      font-weight: 500;
      color: var(--text-color);
      margin-bottom: 0.5rem;
    }

    .loader-icon {
      margin-top: 1rem;
    }

    .loader-icon i {
      font-size: 2rem;
      color: var(--primary-color);
    }

    /* Type-specific styling */
    .loader-login .global-loader-container {
      border-left: 4px solid var(--green-500);
    }

    .loader-logout .global-loader-container {
      border-left: 4px solid var(--red-500);
    }

    .loader-saving .global-loader-container {
      border-left: 4px solid var(--blue-500);
    }

    .loader-processing .global-loader-container {
      border-left: 4px solid var(--orange-500);
    }

    .loader-loading .global-loader-container {
      border-left: 4px solid var(--primary-color);
    }

    /* Animations */
    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    @keyframes scaleIn {
      from {
        transform: scale(0.8);
        opacity: 0;
      }
      to {
        transform: scale(1);
        opacity: 1;
      }
    }

    /* Dark theme adjustments */
    :host-context(.dark) .global-loader-overlay {
      background: rgba(0, 0, 0, 0.8);
    }
  `]
})
export class GlobalLoaderComponent implements OnInit, OnDestroy {
  loaderState: LoaderState = { show: false };
  private destroy$ = new Subject<void>();

  constructor(private loaderService: LoaderService) {}

  ngOnInit(): void {
    this.loaderService.loader$
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        this.loaderState = state;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getIconClass(): string {
    switch (this.loaderState.type) {
      case 'login':
        return 'pi pi-sign-in text-green-500';
      case 'logout':
        return 'pi pi-sign-out text-red-500';
      case 'saving':
        return 'pi pi-save text-blue-500';
      case 'processing':
        return 'pi pi-cog pi-spin text-orange-500';
      case 'loading':
        return 'pi pi-spinner pi-spin text-primary';
      default:
        return '';
    }
  }
}