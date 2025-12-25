import { AclAdminUser, ACLAdminUserDTOesServiceProxy } from '@/shared/service-proxies/service-proxies';
import { ChangeDetectionStrategy, Component, signal, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { CreateOrEditAclAdminUser } from '../createOrEditAclAdminUser/createOrEditAclAdminUser';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { SkeletonModule } from 'primeng/skeleton';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';


@Component({
    selector: 'app-acl-admin-user-listing',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TableModule,
        ButtonModule,
        TagModule,
        DialogModule,
        SkeletonModule,
        ToolbarModule,
        InputTextModule,
        IconFieldModule,
        InputIconModule,
        CreateOrEditAclAdminUser
    ],
    providers: [MessageService, ConfirmationService, ACLAdminUserDTOesServiceProxy],
    templateUrl: './aclAdminUserListing.html',
    styleUrl: './aclAdminUserListing.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AclAdminUserListing {

    dialogVisible = signal<boolean>(false);

    users = signal<AclAdminUser[]>([]);

    loading = signal<boolean>(true);

    selectedUser = signal<AclAdminUser | null>(null);

    selectedUsers!: AclAdminUser[] | null;

    // Track expanded rows for the PrimeNG expandable table
    expandedRows = signal<Record<string, boolean>>({});

    @ViewChild('dt') dt!: Table;

    constructor(
        private aclAdminUserService: ACLAdminUserDTOesServiceProxy,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) { }

    ngOnInit(): void {
        this.loadUsers();
    }

    loadUsers() {
        this.loading.set(true);
        this.aclAdminUserService.aCLAdminUserDTOesAll().subscribe({
            next: (data) => {
                this.users.set(data);
                this.loading.set(false);
            },
            error: (err) => {
                console.error(err);
                this.loading.set(false);
            }
        });
    }

    openNew() {
        this.selectedUser.set(new AclAdminUser());
        this.dialogVisible.set(true);
    }

    editUser(user: AclAdminUser) {
        this.aclAdminUserService.aCLAdminUserDTOesGET(user.autoid!).subscribe({
            next: (fetchedUser) => {
                this.selectedUser.set(Object.assign(new AclAdminUser(), fetchedUser));
                this.dialogVisible.set(true);
            },
            error: (err) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to load user details'
                });
            }
        });
    }

    deleteUser(user: AclAdminUser) {
        this.confirmationService.confirm({
            message: `Are you sure you want to delete ${user.username}?`,
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                const updated = this.users().filter(x => x.autoid !== user.autoid);
                this.users.set(updated);

                this.messageService.add({
                    severity: 'success',
                    summary: 'Deleted',
                    detail: 'User removed successfully'
                });
            }
        });
    }

    deleteSelectedUsers() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete selected users?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                const filtered = this.users().filter(
                    user => !this.selectedUsers?.some(s => s.autoid === user.autoid)
                );

                this.users.set(filtered);
                this.selectedUsers = null;

                this.messageService.add({
                    severity: 'success',
                    summary: 'Deleted',
                    detail: 'Selected users removed'
                });
            }
        });
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    getSeverity(status: string) {
        switch (status?.toLowerCase()) {
            case 'active':
                return 'success';
            case 'inactive':
                return 'danger';
            case 'pending':
                return 'warn';
            default:
                return 'info';
        }
    }

    onUserSaved(user: AclAdminUser) {
        this.onDialogClosed();
        this.loadUsers();
    }

    onDialogClosed() {
        this.dialogVisible.set(false);
    }

    onRowExpand(event: any) {
        const key = event.data?.autoid?.toString();
        if (!key) return;
        const map = { ...this.expandedRows() };
        map[key] = true;
        this.expandedRows.set(map);
    }

    onRowCollapse(event: any) {
        const key = event.data?.autoid?.toString();
        if (!key) return;
        const map = { ...this.expandedRows() };
        delete map[key];
        this.expandedRows.set(map);
    }

    toggleRow(user: AclAdminUser) {
        const key = user?.autoid?.toString();
        if (!key) return;
        const map = { ...this.expandedRows() };
        if (map[key]) {
            delete map[key];
        } else {
            map[key] = true;
        }
        this.expandedRows.set(map);
    }

    isRowExpanded(user: AclAdminUser) {
        const key = user?.autoid?.toString();
        if (!key) return false;
        return !!this.expandedRows()[key];
    }
}

