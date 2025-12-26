import { AclAdminUser, ACLAdminUserDTOesServiceProxy, OPSiteDTOesServiceProxy, OpSite } from '@/shared/service-proxies/service-proxies';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, signal, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { LoaderService } from '@/shared/utilities/services/loader.service';

@Component({
  selector: 'app-create-or-edit-acl-admin-user',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule, FormsModule, ReactiveFormsModule, InputTextModule, MultiSelectModule],
  providers: [MessageService, OPSiteDTOesServiceProxy],
  templateUrl: './createOrEditAclAdminUser.html',
  styleUrl: './createOrEditAclAdminUser.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateOrEditAclAdminUser {
  // Inputs are plain values (parent passes booleans/objects). Keep internal signals for local state.
  @Input() visible: boolean = false;
  @Input() user: AclAdminUser | null = null;
  @Output() userSaved = new EventEmitter<AclAdminUser>();
  @Output() closed = new EventEmitter<void>();

  submitted = signal<boolean>(false);
  confirmPassword = signal<string>('');
  passwordMismatch = signal<boolean>(false);
  isEditMode = signal<boolean>(false);
  isLoading = signal<boolean>(false);

  createOrEditUser = signal<AclAdminUser>(new AclAdminUser());

  // site options for multiselect
  sites = signal<OpSite[]>([]);
  // selected site ids for MultiSelect
  selectedSiteIds = signal<number[]>([]);

  constructor(
    private aclAdminUserService: ACLAdminUserDTOesServiceProxy,
    private opSiteService: OPSiteDTOesServiceProxy,
    private messageService: MessageService,
    private loaderService: LoaderService
  ) {}

  ngOnInit(): void {
    this.loadSites();
  }

  private loadSites() {
    this.opSiteService.oPSiteDTOesAll().subscribe({
      next: (data: OpSite[]) => this.sites.set(data),
      error: () => this.sites.set([])
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['user'] && this.user) {
      // Populate local editable model when parent passes a user
      const userData = this.user;
      this.isEditMode.set(!!userData?.autoid && userData.autoid > 0);
      this.createOrEditUser.set(Object.assign(new AclAdminUser(), userData));
      // populate selectedSiteIds from user's aclAdminUsersSites
      const ids = (userData.aclAdminUsersSites || []).map(s => s.autoid!).filter(id => id != null) as number[];
      this.selectedSiteIds.set(ids);
      this.submitted.set(false);
      this.confirmPassword.set('');
      this.passwordMismatch.set(false);
    }

    if (changes['visible']) {
      // When dialog is opened (visible = true), reset state if no user provided
      if (this.visible && !this.user) {
        this.isEditMode.set(false);
        this.createOrEditUser.set(new AclAdminUser());
        this.submitted.set(false);
        this.confirmPassword.set('');
        this.passwordMismatch.set(false);
      }
    }
  }

  checkPassword() {
    this.passwordMismatch.set(this.createOrEditUser().password !== this.confirmPassword());
  }

  saveUser() {
    this.submitted.set(true);

    if (!this.createOrEditUser().username || !this.createOrEditUser().email) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation',
        detail: 'Username and Email are required'
      });
      return;
    }

    // Password validation for new user
    if (!this.isEditMode()) {
      if (!this.createOrEditUser().password) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Validation',
          detail: 'Password is required for new users'
        });
        return;
      }

      if (this.passwordMismatch()) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Validation',
          detail: 'Passwords do not match'
        });
        return;
      }

      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#_])[A-Za-z\d@$!%*?&^#_]{8,}$/;
      if (!passwordRegex.test(this.createOrEditUser().password!)) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Validation',
          detail: 'Password must be at least 8 chars with uppercase, lowercase, number & special character'
        });
        return;
      }
    }

    if (this.isEditMode()) {
      this.updateUser();
    } else {
      this.createUser();
    }
  }

  private createUser() {
    this.isLoading.set(true);
    this.loaderService.showSaving('Creating user...');

    const createDto = Object.assign(new AclAdminUser(), {
      username: this.createOrEditUser().username,
      email: this.createOrEditUser().email,
      mobile: this.createOrEditUser().mobile,
      usertype: this.createOrEditUser().usertype,
      password: this.createOrEditUser().password,
      status: 'Active'
    });
    // include role/profileImage/opSites if present
    // createDto.role = this.createOrEditUser().role;
    // createDto.profileImage = this.createOrEditUser().profileImage;
    // map selected site ids to minimal opSite objects for backend
   createDto.aclAdminUsersSites = this.sites().filter(site =>
                this.selectedSiteIds().some(s => s === site.autoid)
            );
    this.aclAdminUserService.aCLAdminUserDTOesPOST(createDto).subscribe({
      next: (result) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'User created successfully'
        });

        this.loaderService.hide();
        this.isLoading.set(false);
  this.userSaved.emit(this.createOrEditUser());
        this.hideDialog();
      },
      error: (error) => {
        this.loaderService.hide();
        this.isLoading.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error?.error?.message || 'User creation failed'
        });
      }
    });
  }

  private updateUser() {
    this.isLoading.set(true);
    this.loaderService.showSaving('Updating user...');

    const userId = this.createOrEditUser().autoid;
    const updateDto = Object.assign(new AclAdminUser(), {
      username: this.createOrEditUser().username,
      email: this.createOrEditUser().email,
      mobile: this.createOrEditUser().mobile,
      usertype: this.createOrEditUser().usertype,
      status: this.createOrEditUser().status
    });
    // updateDto.role = this.createOrEditUser().role;
    // updateDto.profileImage = this.createOrEditUser().profileImage;
    updateDto.aclAdminUsersSites = this.sites().filter(site =>
                this.selectedSiteIds().some(s => s === site.autoid)
            );
    this.aclAdminUserService.aCLAdminUserDTOesPUT(userId!, updateDto).subscribe({
      next: (result) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'User updated successfully'
        });

        this.loaderService.hide();
        this.isLoading.set(false);
  this.userSaved.emit(this.createOrEditUser());
        this.hideDialog();
      },
      error: (error) => {
        this.loaderService.hide();
        this.isLoading.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error?.error?.message || 'User update failed'
        });
      }
    });
  }

  hideDialog() {
    // Do not mutate parent inputs directly. Emit closed so parent can toggle visibility.
    this.submitted.set(false);
    this.loaderService.hide();
    this.closed.emit();
  }
}
