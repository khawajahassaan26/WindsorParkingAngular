import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { RouterModule } from '@angular/router';
import { GlobalLoaderComponent } from '@/shared/utilities/components/global-loader.component';
import { LoaderService } from '@/shared/utilities/services/loader.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, GlobalLoaderComponent],
  template: `
    <router-outlet></router-outlet>
    <app-global-loader></app-global-loader>
  `
})
export class AppComponent implements OnInit {

  constructor(
    private router: Router,
    private loaderService: LoaderService
  ) {}

  ngOnInit(): void {
    this.router.events.subscribe(event => {

      if (event instanceof NavigationStart) {
        this.loaderService.showLoading('Loading page...');
      }

      if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        this.loaderService.hide();
      }

    });
  }
}
