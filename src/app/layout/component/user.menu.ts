import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '@/Core/services/auth.service';

@Component({
    selector: 'app-user-menu',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="flex flex-col">
            <!-- User Info Header -->
            <div class="flex items-center pb-3 mb-3 border-b border-surface">
                <div class="flex items-center justify-center bg-primary text-primary-contrast rounded-full w-10 h-10">
                    <i class="pi pi-user text-lg"></i>
                </div>
                <div class="ml-3 flex-1">
                    <div class="font-semibold text-surface-900 dark:text-surface-0 text-sm">{{ currentUser.name }}</div>
                    <div class="text-surface-600 dark:text-surface-300 text-xs">{{ currentUser.email }}</div>
                    <div class="text-surface-500 dark:text-surface-400 text-xs">{{ currentUser.role }}</div>
                </div>
            </div>
            
            <!-- Menu Items -->
            <div class="flex flex-col gap-1">
                <button 
                    type="button"
                    class="flex items-center p-2 text-left border-none bg-transparent hover:bg-surface-100 dark:hover:bg-surface-800 cursor-pointer rounded text-surface-700 dark:text-surface-200 transition-colors duration-150"
                    (click)="viewProfile()"
                >
                    <i class="pi pi-user text-primary mr-3 text-sm"></i>
                    <span class="text-sm">My Profile</span>
                </button>
                
                <button 
                    type="button"
                    class="flex items-center p-2 text-left border-none bg-transparent hover:bg-surface-100 dark:hover:bg-surface-800 cursor-pointer rounded text-surface-700 dark:text-surface-200 transition-colors duration-150"
                    (click)="changePassword()"
                >
                    <i class="pi pi-lock text-primary mr-3 text-sm"></i>
                    <span class="text-sm">Change Password</span>
                </button>
                
                <button 
                    type="button"
                    class="flex items-center p-2 text-left border-none bg-transparent hover:bg-surface-100 dark:hover:bg-surface-800 cursor-pointer rounded text-surface-700 dark:text-surface-200 transition-colors duration-150"
                    (click)="accountSettings()"
                >
                    <i class="pi pi-cog text-primary mr-3 text-sm"></i>
                    <span class="text-sm">Account Settings</span>
                </button>
                
                <!-- Divider -->
                <div class="border-t border-surface my-2"></div>
                
                <button 
                    type="button"
                    class="flex items-center p-2 text-left border-none bg-transparent hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer rounded text-red-500 transition-colors duration-150"
                    (click)="logout()"
                >
                    <i class="pi pi-sign-out mr-3 text-sm"></i>
                    <span class="text-sm">Logout</span>
                </button>
            </div>
        </div>
    `,
    host: {
        class: 'hidden absolute top-13 right-0 w-64 p-4 bg-surface-0 dark:bg-surface-900 border border-surface rounded-border origin-top shadow-[0px_3px_5px_rgba(0,0,0,0.02),0px_0px_2px_rgba(0,0,0,0.05),0px_1px_4px_rgba(0,0,0,0.08)]'
    }
})
export class AppUserMenu {
    currentUser = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        role: 'Administrator'
    };
    constructor(private _authService : AuthService)
    {}

    viewProfile() {
        console.log('View Profile clicked');
        // Navigate to profile page
    }

    changePassword() {
        console.log('Change Password clicked');
        // Open change password dialog
    }

    accountSettings() {
        console.log('Account Settings clicked');
        // Navigate to settings page
    }

    logout() {
this._authService.logout();
        // Handle logout logic
        // Clear tokens, navigate to login, etc.
    }
}