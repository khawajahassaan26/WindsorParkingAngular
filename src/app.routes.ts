import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Dashboard } from './app/pages/dashboard/dashboard';
import { Documentation } from './app/pages/documentation/documentation';
import { Landing } from './app/pages/landing/landing';
import { Notfound } from './app/pages/notfound/notfound';
import { AuthGuard } from '@/Core/guards/auth.guard';
import { LoginGuard } from '@/Core/guards/login.guard';

export const appRoutes: Routes = [
  // Login route (default if not logged in)
  {
    path: '',
    loadComponent: () => import('./app/pages/auth/login').then(m => m.Login),
    pathMatch: 'full',
    canActivate: [LoginGuard] 
  },
  {
    path: 'auth/login',
    loadComponent: () => import('./app/pages/auth/login').then(m => m.Login),
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
    { path: 'uikit', loadChildren: () => import('./app/pages/uikit/uikit.routes') },
    { path: 'documentation', component: Documentation },
    { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') }
  ]
},

  // Public routes
  { path: 'landing', component: Landing },
  { path: 'notfound', component: Notfound },
  { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },

  // Wildcard
  { path: '**', redirectTo: '/notfound' }
];
