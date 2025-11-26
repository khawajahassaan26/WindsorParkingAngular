import { ApplicationConfig, APP_INITIALIZER } from '@angular/core';
import { provideHttpClient, withFetch, withInterceptors, HTTP_INTERCEPTORS } from '@angular/common/http';
import { provideRouter, withEnabledBlockingInitialNavigation, withInMemoryScrolling } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { API_BASE_URL } from '@/shared/service-proxies/service-proxies';

import Aura from '@primeuix/themes/aura';
import { providePrimeNG } from 'primeng/config';

import { appRoutes } from './app.routes';


import { apiBaseUrlInterceptor } from '@/shared/utilities/services/api-base-url.interceptor';
import { AuthInterceptor } from '@/Core/interceptors/auth.interceptor';
import { AppConfigService } from '@/shared/utilities/services/app-config.service';
import { AuthService } from '@/Core/services/auth.service';
import { LoaderService } from '@/shared/utilities/services/loader.service';

// 🔥 AppConfig Loader
export function initializeConfig(appConfigService: AppConfigService) {
  return () => appConfigService.load();
}

// 🔥 Auth Initialization
export function authInitializer(
  authService: AuthService,
  loaderService: LoaderService,
  appConfigService: AppConfigService
) {
  return () =>
    new Promise<void>((resolve) => {
      setTimeout(() => loaderService.showLoading(), 0);

      authService.refreshToken().subscribe({
        next: () => {
          setTimeout(() => {
            loaderService.hide();
            resolve();
          }, 0);
        },
        error: () => {
          setTimeout(() => {
            loaderService.setError();
            resolve();
          }, 0);
        }
      });
    });
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      appRoutes,
      withInMemoryScrolling({
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'enabled'
      }),
      withEnabledBlockingInitialNavigation()
    ),

    provideHttpClient(
      withFetch(),
      withInterceptors([
        apiBaseUrlInterceptor
      ])
    ),

    // Provide the class-based interceptor via the HTTP_INTERCEPTORS token so DI works correctly
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },

    provideAnimationsAsync(),

    providePrimeNG({
      theme: {
        preset: Aura,
        options: { darkModeSelector: '.app-dark' }
      }
    }),

    // 🔥 Config must load before anything else
    {
      provide: APP_INITIALIZER,
      useFactory: initializeConfig,
      deps: [AppConfigService],
      multi: true
    },

    // 🔥 Inject API Base URL from loaded config
    {
      provide: API_BASE_URL,
      useFactory: (config: AppConfigService) => config.apiBaseUrl,
      deps: [AppConfigService]
    },

    // 🔥 Auth Initialization
    {
      provide: APP_INITIALIZER,
      useFactory: authInitializer,
      deps: [AuthService, LoaderService, AppConfigService],
      multi: true
    }
  ]
};
