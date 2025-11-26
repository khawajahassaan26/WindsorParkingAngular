import { inject } from '@angular/core';
import { HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfigService } from '../services/app-config.service';

export function apiBaseUrlInterceptor(
  request: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> {

  const appConfigService = inject(AppConfigService);

  if (request.url.startsWith('/api')) {
    const apiBaseUrl = appConfigService.apiBaseUrl;

    const modifiedRequest = request.clone({
      url: `${apiBaseUrl}${request.url}`
    });

    return next(modifiedRequest);
  }

  return next(request);
}
