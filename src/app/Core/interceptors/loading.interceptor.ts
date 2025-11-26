import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoaderService } from '@/shared/utilities/services/loader.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  private activeRequests = 0;

  constructor(private loaderService: LoaderService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    // Skip showing loader for certain requests
    const skipLoader = request.headers.has('X-Skip-Loader');

    if (!skipLoader) {
      if (this.activeRequests === 0) {
        this.loaderService.showLoading('Loading...');
      }
      this.activeRequests++;
    }

    return next.handle(request).pipe(
      tap({
        next: (event: HttpEvent<unknown>) => {
          if (event instanceof HttpResponse && !skipLoader) {
            this.activeRequests--;
            if (this.activeRequests === 0) {
              this.loaderService.hide();
            }
          }
        },
        error: (error) => {
          if (!skipLoader) {
            this.activeRequests--;
            if (this.activeRequests === 0) {
              this.loaderService.hide();
            }
          }
        },
      })
    );
  }
}
