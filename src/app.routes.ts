import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Dashboard } from './app/features/dashboard/dashboard';
import { Notfound } from './app/features/notfound/notfound';
import { AuthGuard } from '@/Core/guards/auth.guard';
import { LoginGuard } from '@/Core/guards/login.guard';

export const appRoutes: Routes = [
  // Login route (default if not logged in)
  {
    path: '',
    loadComponent: () => import('./app/Core/auth/login').then(m => m.Login),
    pathMatch: 'full',
    canActivate: [LoginGuard] 
  },
  {
    path: 'auth/login',
    loadComponent: () => import('./app/Core/auth/login').then(m => m.Login),
    pathMatch: 'full',
    canActivate: [LoginGuard] 
  },

  // Protected routes
  {
  path: '',
  component: AppLayout,
  canActivate: [AuthGuard],
  children: [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' }, // 👈 default
    { path: 'dashboard', component: Dashboard },
    { path: 'features', loadChildren: () => import('./app/features/features.routes') }
  ]
},

  // Public routes
  { path: 'notfound', component: Notfound },
  { path: 'auth', loadChildren: () => import('./app/Core/auth/auth.routes') },

  // Wildcard
  { path: '**', redirectTo: '/notfound' }
];
