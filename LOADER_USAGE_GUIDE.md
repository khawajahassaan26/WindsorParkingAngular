# Global Loader Service - Usage Guide

## Overview
The Global Loader Service is a centralized loading/progress indicator system for your Angular application. It displays a modal overlay with a spinner and optional messages, providing a professional loading experience.

## Features
✅ Global loading overlay with blur background  
✅ Multiple loader types (default, login, logout, saving, loading, processing)  
✅ Optional custom messages  
✅ Automatic HTTP request tracking  
✅ Smooth animations  
✅ Dark theme support  

## Installation & Setup

### 1. Loader Component (Already Setup)
The loader component is automatically included in `app.component.ts`:

```typescript
import { GlobalLoaderComponent } from '@/shared/utilities/components/global-loader.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterModule, GlobalLoaderComponent],
    template: `<router-outlet></router-outlet>
    <app-global-loader></app-global-loader>
    `
})
export class AppComponent {}
```

### 2. LoaderService Injection
The service is provided at root level, so you can inject it anywhere:

```typescript
import { LoaderService } from '@/shared/utilities/services/loader.service';

constructor(private loaderService: LoaderService) {}
```

## Usage Methods

### Basic Methods

#### 1. **Show Generic Loader**
```typescript
// Show with default message
this.loaderService.show();

// Show with custom message
this.loaderService.show('Please wait...');

// Show with specific type
this.loaderService.show('Please wait...', 'loading');
```

#### 2. **Show Type-Specific Loaders**
```typescript
// Login loader
this.loaderService.showLogin('Signing in...');
this.loaderService.showLogin(); // Uses default message: 'Signing in...'

// Logout loader
this.loaderService.showLogout('Signing out...');
this.loaderService.showLogout();

// Saving loader
this.loaderService.showSaving('Saving...');
this.loaderService.showSaving('Uploading file...');

// Loading loader
this.loaderService.showLoading('Loading...');
this.loaderService.showLoading('Fetching data...');

// Processing loader
this.loaderService.showProcessing('Processing...');
this.loaderService.showProcessing('Computing results...');
```

#### 3. **Hide Loader**
```typescript
this.loaderService.hide();
```

#### 4. **Check Loading Status**
```typescript
// Get boolean flag
if (this.loaderService.isLoading) {
  console.log('Currently loading');
}

// Get current state
const state = this.loaderService.currentState;
console.log(state.show, state.message, state.type);
```

## Practical Examples

### Example 1: User Registration Form
```typescript
import { LoaderService } from '@/shared/utilities/services/loader.service';
import { AuthService } from '@/app/Core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormModule, ButtonModule],
})
export class RegisterComponent {
  constructor(
    private authService: AuthService,
    private loaderService: LoaderService
  ) {}

  register(formData: any) {
    this.loaderService.showSaving('Creating account...');

    this.authService.register(formData).subscribe({
      next: (response) => {
        this.loaderService.hide();
        console.log('Registration successful');
      },
      error: (error) => {
        this.loaderService.hide();
        console.error('Registration failed', error);
      }
    });
  }
}
```

### Example 2: Data Import with Processing
```typescript
importData(file: File) {
  this.loaderService.showProcessing('Importing data... This may take a few moments');

  this.dataService.importFile(file).subscribe({
    next: (response) => {
      this.loaderService.hide();
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Data imported successfully'
      });
    },
    error: (error) => {
      this.loaderService.hide();
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to import data'
      });
    }
  });
}
```

### Example 3: With Promises
```typescript
async performAsyncTask() {
  this.loaderService.showLoading('Processing your request...');

  try {
    const result = await this.longRunningTask();
    this.loaderService.hide();
    console.log('Task completed', result);
  } catch (error) {
    this.loaderService.hide();
    console.error('Task failed', error);
  }
}
```

### Example 4: Create/Edit Dialog (Already Implemented)
```typescript
export class CreateOrEditAclAdminUser {
  isLoading = signal<boolean>(false);

  constructor(private loaderService: LoaderService) {}

  saveUser() {
    // Validation...
    this.isLoading.set(true);
    this.loaderService.showSaving('Saving user...');

    this.userService.save(userData).subscribe({
      next: (result) => {
        this.loaderService.hide();
        this.isLoading.set(false);
        // Handle success
      },
      error: (error) => {
        this.loaderService.hide();
        this.isLoading.set(false);
        // Handle error
      }
    });
  }
}
```

## Loader Types and Styling

| Type | Icon | Border Color | Use Case |
|------|------|--------------|----------|
| `default` | None | Primary | Generic operations |
| `login` | pi pi-sign-in | Green | User authentication |
| `logout` | pi pi-sign-out | Red | User logout operations |
| `saving` | pi pi-save | Blue | Save/update operations |
| `loading` | pi pi-spinner | Primary | Data fetching |
| `processing` | pi pi-cog (spinning) | Orange | Long-running tasks |

## Styling Customization

### Default Colors
The loader uses CSS variables from your PrimeNG theme:
- `--surface-0`: Background color
- `--surface-border`: Border color
- `--text-color`: Text color
- `--primary-color`: Primary accent color
- `--green-500`, `--red-500`, `--blue-500`, `--orange-500`: Type-specific colors

### Custom Styling
To override loader styles, add custom CSS:

```css
/* In your global styles.scss */
:host-context(.dark) .global-loader-overlay {
  background: rgba(0, 0, 0, 0.9);
}

.global-loader-container {
  min-width: 300px; /* Make wider */
  padding: 3rem; /* More padding */
}

.loader-message {
  font-size: 1.1rem; /* Larger text */
}
```

## HTTP Interceptor (Auto Tracking)

The `LoadingInterceptor` automatically shows/hides the loader for HTTP requests:

```typescript
// Automatically shows 'Loading...' for HTTP calls
this.httpClient.get('/api/users').subscribe(...);

// Skip loader for specific requests
const headers = new HttpHeaders({
  'X-Skip-Loader': 'true'
});
this.httpClient.get('/api/health-check', { headers }).subscribe(...);
```

## Advanced: Manual Control with Loading State

For fine-grained control (like disabling buttons while loading):

```typescript
@Component({
  selector: 'app-my-form',
  template: `
    <button 
      [disabled]="loaderService.isLoading"
      [loading]="loaderService.isLoading"
      (click)="submitForm()">
      Submit
    </button>
  `
})
export class MyFormComponent {
  constructor(public loaderService: LoaderService) {}

  submitForm() {
    this.loaderService.showSaving();
    // ... handle submission
  }
}
```

## Best Practices

1. **Always Hide Loader**: Ensure you call `hide()` in both success and error handlers
```typescript
subscribe({
  next: () => { this.loaderService.hide(); },
  error: () => { this.loaderService.hide(); }
});
```

2. **Use Appropriate Types**: Choose the right type for better UX
```typescript
// ✅ Good
this.loaderService.showLogin('Signing in...');
this.loaderService.showSaving('Updating profile...');

// ❌ Avoid
this.loaderService.show('Signing in...', 'saving'); // Wrong type
```

3. **Custom Messages**: Provide meaningful context
```typescript
// ✅ Good
this.loaderService.show('Uploading file: document.pdf...');

// ❌ Avoid
this.loaderService.show('Please wait');
```

4. **Handle Timeouts**: Set a timeout to prevent stuck loaders
```typescript
this.loaderService.showLoading('Fetching data...');

this.dataService.fetch().pipe(
  timeout(30000), // 30 second timeout
).subscribe({
  next: () => this.loaderService.hide(),
  error: () => this.loaderService.hide()
});
```

5. **Use Signal for Button States**: Track loading state for UI updates
```typescript
isLoading = signal<boolean>(false);

saveData() {
  this.isLoading.set(true);
  this.loaderService.showSaving();
  
  this.service.save(data).subscribe({
    next: () => {
      this.isLoading.set(false);
      this.loaderService.hide();
    },
    error: () => {
      this.isLoading.set(false);
      this.loaderService.hide();
    }
  });
}
```

## Troubleshooting

### Loader Not Showing
- Verify `GlobalLoaderComponent` is imported in `app.component.ts`
- Check that `LoaderService` is injected correctly
- Ensure you're calling `show()` methods before async operations

### Loader Stuck
- Make sure `hide()` is called in error handlers
- Check for unhandled promise rejections
- Use timeout operators for long-running requests

### Style Issues
- Verify PrimeNG theme is properly configured
- Check CSS variable names match your theme
- Ensure `z-index: 9999` is not being overridden

## Service API Reference

```typescript
export interface LoaderState {
  show: boolean;
  message?: string;
  type?: 'default' | 'login' | 'logout' | 'saving' | 'loading' | 'processing';
}

export class LoaderService {
  // Show loader with optional message and type
  show(message?: string, type?: LoaderState['type']): void;
  
  // Hide loader
  hide(): void;
  
  // Type-specific shortcuts
  showLogin(message?: string): void;
  showLogout(message?: string): void;
  showSaving(message?: string): void;
  showLoading(message?: string): void;
  showProcessing(message?: string): void;
  
  // Observable stream of loader states
  loader$: Observable<LoaderState>;
  
  // Getters
  get isLoading(): boolean;
  get currentState(): LoaderState;
}
```

## Summary

The Global Loader Service provides a clean, reusable way to show loading indicators throughout your application. It's fully integrated with HTTP interceptors and supports multiple loader types with customizable messages. Simply inject the service and call the appropriate method before async operations!
