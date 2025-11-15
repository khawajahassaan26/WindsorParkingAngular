import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { MenuService, NewMenuItem } from '../service/menu.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        <ng-container *ngFor="let item of model; let i = index">
            <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
            <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>
    </ul> `
})
export class AppMenu {
    model: NewMenuItem[] = [];
     private destroy$ = new Subject<void>();
    constructor(private menuService: MenuService) {}
    ngOnInit() {
        this.menuService.loadDynamicMenuFromAPI()
        
        this.menuService.dynamicMenu$
            .pipe(takeUntil(this.destroy$))
            .subscribe(menuItems => {
                this.model = menuItems;
            });
    }
}
