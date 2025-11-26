import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { MenuItem } from 'primeng/api';

export interface DynamicMenuConfig {
  menus: NewMenuItem[];
}

export interface UserPermissions {
  permissions: string[];
  role: string;
}
export interface NewMenuItem extends MenuItem 
{
    permissions? : string[];

}

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private dynamicMenuSubject = new BehaviorSubject<NewMenuItem[]>([]);
  public dynamicMenu$ = this.dynamicMenuSubject.asObservable();
  private apiUrl = 'https://localhost:44318/';  // Update to your API URL

  // Mock user permissions - replace with real auth service
  private currentUserPermissions: UserPermissions = {
    role: 'admin',
    permissions: [
      // 'view_analytics', 'view_reports', 'manage_users', 'manage_roles', 
      // 'manage_permissions', 'manage_content', 'manage_media', 'manage_products',
      // 'view_orders', 'manage_customers', 'manage_inventory', 'view_messages',
      // 'manage_notifications', 'manage_templates', 'system_admin', 'view_audit_logs'
    ]
  };

  constructor(private http: HttpClient) {}

  // Load dynamic menu from assets
  loadDynamicMenu(): void {
  this.http.get<DynamicMenuConfig>('assets/data/menu.json')
    .pipe(
      map(config => {
        console.log('Raw config from JSON:', config);   // ✅ log here
        return this.filterMenuByPermissions(config.menus);
      }),
      catchError(error => {
        console.error('Error loading dynamic menu config:', error);
        return of([]);
      })
    )
    .subscribe(filteredMenu => {
      console.log('Filtered menu:', filteredMenu);   // ✅ log after filtering
      this.dynamicMenuSubject.next(filteredMenu);
    });
}


  // Future method for API integration with your .NET Core backend
  loadDynamicMenuFromAPI(): void {
    
  const userId = Number(localStorage.getItem('userId'));
    this.http.get<DynamicMenuConfig>(`${this.apiUrl}api/UserMenu/${userId}/formatted`)
    .pipe(
      map(config => {
        console.log('Raw config from JSON:', config);   // ✅ log here
        return this.filterMenuByPermissions(config.menus);
      }),
      catchError(error => {
        console.error('Error loading dynamic menu config:', error);
        return of([]);
      })
    )
    .subscribe(filteredMenu => {
      console.log('Filtered menu:', filteredMenu);   // ✅ log after filtering
      this.dynamicMenuSubject.next(filteredMenu);
    });
}

  private filterMenuByPermissions(menus: NewMenuItem[]): NewMenuItem[] {
    return menus.map(menu => ({
      ...menu,
      items: menu.items?.filter(item => this.hasPermission(item))
    })).filter(menu => menu.items && menu.items.length > 0);
  }

  private hasPermission(item: NewMenuItem): boolean {
    
    // If no permissions specified, allow access
    if (!item.permissions) return true;
    
    // Check if user has any of the required permissions
    return item.permissions.some((permission: string) => 
      this.currentUserPermissions.permissions.includes(permission)
    );
  }

  updateUserPermissions(permissions: UserPermissions): void {
    this.currentUserPermissions = permissions;
    this.loadDynamicMenu();
  }

  refreshDynamicMenu(): void {
    this.loadDynamicMenu();
  }
}