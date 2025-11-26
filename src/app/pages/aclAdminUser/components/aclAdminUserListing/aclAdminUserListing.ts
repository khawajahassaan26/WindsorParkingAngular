import { AclAdminUser, AclAdminUserServiceProxy } from '@/shared/service-proxies/service-proxies';
import { ChangeDetectionStrategy, Component, signal, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { CreateOrEditAclAdminUser } from '../createOrEditAclAdminUser/createOrEditAclAdminUser';
import { CommonPrimeNgImports } from '@/pages/shared/commonPrimeNgModule';


@Component({
  selector: 'app-acl-admin-user-listing',
  standalone: true,
  imports: [CommonPrimeNgImports,CreateOrEditAclAdminUser],
  providers: [MessageService, ConfirmationService, AclAdminUserServiceProxy],
  templateUrl: './aclAdminUserListing.html',
  styleUrl: './aclAdminUserListing.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AclAdminUserListing {

  dialogVisible = signal<boolean>(false);

  users = signal<AclAdminUser[]>([]);

  selectedUser = signal<AclAdminUser | null>(null);

  selectedUsers!: AclAdminUser[] | null;

  @ViewChild('dt') dt!: Table;

  constructor(
    private aclAdminUserService: AclAdminUserServiceProxy,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

   ngOnInit(): void {
        this.loadUsers();
    }

    loadUsers() {
        this.aclAdminUserService.getAllAclAdminUsers().subscribe({
            next: (data) => {
                this.users.set(data);
            },
            error: (err) => {
                console.error(err);
            }
        });
    }

    openNew() {
        this.selectedUser.set(new AclAdminUser());
        this.dialogVisible.set(true);
    }

   editUser(user: AclAdminUser) {
  this.aclAdminUserService.getAclAdminUserById(user.autoid!).subscribe({
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
        this.loadUsers();
    }

    onDialogClosed() {
        this.dialogVisible.set(false);
    }
}

