import { AclTerminal, AclTerminalServiceProxy } from '@/shared/service-proxies/service-proxies';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewChild, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ToolbarModule } from 'primeng/toolbar';
import { CreateOrEditAclTerminal } from '../createOrEditAclTerminal/createOrEditAclTerminal';
import { LoadingSkeleton } from '@/features/shared/components/loadingSkeleton/loadingSkeleton';

@Component({
  selector: 'app-acl-terminal-listing',
  standalone: true,
  imports: [TableModule, ButtonModule, DialogModule, FormsModule, CommonModule, ToolbarModule, CreateOrEditAclTerminal,LoadingSkeleton],
  providers: [MessageService, AclTerminalServiceProxy],
  templateUrl: './aclTerminalListing.html',
  styleUrl: './aclTerminalListing.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AclTerminalListing {
  terminals = signal<AclTerminal[]>([]);
  dialogVisible = signal<boolean>(false);
  loading = signal<boolean>(true);
  selectedTerminal = signal<AclTerminal | null>(null);

  @ViewChild('dt') dt!: Table;

  constructor(
    private terminalService: AclTerminalServiceProxy,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.loading.set(true);
    this.terminalService.getAllAclTerminals().subscribe({
      next: (data) => {
        this.terminals.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.loading.set(false);
      }
    });
  }

  openNew() {
    this.selectedTerminal.set(new AclTerminal());
    this.dialogVisible.set(true);
  }

  edit(terminal: AclTerminal) {
    // fetch fresh data by id
    this.terminalService.getAclTerminalById(terminal.autoid!).subscribe({
      next: (t) => {
        this.selectedTerminal.set(Object.assign(new AclTerminal(), t));
        this.dialogVisible.set(true);
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load terminal' });
      }
    });
  }

  onSaved(_: AclTerminal) {
    this.load();
  }

  onClosed() {
    this.dialogVisible.set(false);
  }
}
