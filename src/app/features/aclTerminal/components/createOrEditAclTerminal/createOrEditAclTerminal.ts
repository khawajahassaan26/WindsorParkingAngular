import { AclTerminal, AclTerminalServiceProxy } from '@/shared/service-proxies/service-proxies';
import { StatusSelect } from '@/features/shared/components/statusSelect/statusSelect';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { LoaderService } from '@/shared/utilities/services/loader.service';

@Component({
  selector: 'app-create-or-edit-acl-terminal',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule, FormsModule, ReactiveFormsModule, InputTextModule, StatusSelect],
  providers: [MessageService],
  templateUrl: './createOrEditAclTerminal.html',
  styleUrl: './createOrEditAclTerminal.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateOrEditAclTerminal implements OnChanges {
  @Input() visible: boolean = false;
  @Input() terminal: AclTerminal | null = null;
  @Output() terminalSaved = new EventEmitter<AclTerminal>();
  @Output() closed = new EventEmitter<void>();

  submitted = signal<boolean>(false);
  isEditMode = signal<boolean>(false);
  isLoading = signal<boolean>(false);

  editModel = signal<AclTerminal>(new AclTerminal());

  constructor(
    private terminalService: AclTerminalServiceProxy,
    private messageService: MessageService,
    private loaderService: LoaderService
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['terminal'] && this.terminal) {
      const data = this.terminal;
      this.isEditMode.set(!!data?.autoid && data.autoid! > 0);
      this.editModel.set(Object.assign(new AclTerminal(), data));
      this.submitted.set(false);
      this.isLoading.set(false);
    }

    if (changes['visible'] && this.visible && !this.terminal) {
      this.isEditMode.set(false);
      this.editModel.set(new AclTerminal());
      this.submitted.set(false);
    }
  }

  save() {
    this.submitted.set(true);
    if (!this.editModel().pcName) {
      this.messageService.add({ severity: 'warn', summary: 'Validation', detail: 'PC Name is required' });
      return;
    }

    if (this.isEditMode()) {
      this.update();
    } else {
      this.create();
    }
  }

  private create() {
    this.isLoading.set(true);
    this.loaderService.showSaving('Creating terminal...');
    const dto = Object.assign(new AclTerminal(), {
      pcName: this.editModel().pcName,
      siteId: this.editModel().siteId,
      macAddress: this.editModel().macAddress,
      status: this.editModel().status || 'Active'
    });

    this.terminalService.createAclTerminal(dto).subscribe({
      next: () => {
        this.loaderService.hide();
        this.isLoading.set(false);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Terminal created' });
        this.terminalSaved.emit(this.editModel());
        this.hide();
      },
      error: (err) => {
        this.loaderService.hide();
        this.isLoading.set(false);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err?.error?.message || 'Create failed' });
      }
    });
  }

  private update() {
    this.isLoading.set(true);
    this.loaderService.showSaving('Updating terminal...');
    const id = this.editModel().autoid!;
    const dto = Object.assign(new AclTerminal(), {
      pcName: this.editModel().pcName,
      siteId: this.editModel().siteId,
      macAddress: this.editModel().macAddress,
      status: this.editModel().status
    });

    this.terminalService.updateAclTerminal(id, dto).subscribe({
      next: () => {
        this.loaderService.hide();
        this.isLoading.set(false);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Terminal updated' });
        this.terminalSaved.emit(this.editModel());
        this.hide();
      },
      error: (err) => {
        this.loaderService.hide();
        this.isLoading.set(false);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err?.error?.message || 'Update failed' });
      }
    });
  }

  hide() {
    this.submitted.set(false);
    this.loaderService.hide();
    this.closed.emit();
  }
}
