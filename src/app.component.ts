import { GlobalLoaderComponent } from '@/shared/utilities/components/global-loader.component';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterModule,GlobalLoaderComponent],
    template: `<router-outlet></router-outlet>
    <app-global-loader></app-global-loader>
    `
})
export class AppComponent {}
