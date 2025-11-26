# Quick Loader Reference

## Import
```typescript
import { LoaderService } from '@/shared/utilities/services/loader.service';
```

## Inject
```typescript
constructor(private loaderService: LoaderService) {}
```

## Common Patterns

### Pattern 1: Simple HTTP Request
```typescript
this.loaderService.showLoading('Fetching data...');
this.service.getData().subscribe({
  next: (data) => {
    this.loaderService.hide();
    this.data = data;
  },
  error: (err) => {
    this.loaderService.hide();
    console.error(err);
  }
});
```

### Pattern 2: Form Submission
```typescript
saveForm() {
  this.loaderService.showSaving('Saving your changes...');
  this.service.save(this.form.value).subscribe({
    next: () => {
      this.loaderService.hide();
      this.showSuccess('Saved!');
    },
    error: (err) => {
      this.loaderService.hide();
      this.showError('Save failed');
    }
  });
}
```

### Pattern 3: Authentication
```typescript
login() {
  this.loaderService.showLogin();
  this.authService.login(credentials).subscribe({
    next: () => {
      this.loaderService.hide();
      this.router.navigate(['/dashboard']);
    },
    error: () => {
      this.loaderService.hide();
      this.showError('Invalid credentials');
    }
  });
}
```

### Pattern 4: Long Operation
```typescript
importData() {
  this.loaderService.showProcessing('This may take a minute...');
  this.service.import(file).subscribe({
    next: () => {
      this.loaderService.hide();
    },
    error: () => {
      this.loaderService.hide();
    }
  });
}
```

## Quick API

| Method | Default Message | Use When |
|--------|-----------------|----------|
| `showLogin()` | "Signing in..." | User logging in |
| `showLogout()` | "Signing out..." | User logging out |
| `showSaving()` | "Saving..." | Saving data |
| `showLoading()` | "Loading..." | Fetching data |
| `showProcessing()` | "Processing..." | Long operations |
| `show()` | N/A | Custom message |
| `hide()` | N/A | Stop showing loader |

## Examples in Your App

### ✅ Already Implemented:
- **Create/Edit Admin User Dialog** - Shows "Saving user..." on submit
  ```typescript
  this.loaderService.showSaving('Creating user...');
  ```

### 🎯 Ready to Use In:
- Login form
- User registration
- Data import/export
- File uploads
- Complex calculations
- Any async operation!
