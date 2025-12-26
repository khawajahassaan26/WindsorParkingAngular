import { OpTerminalRegistrationRequest, OpTerminalRegistrationRequestServiceProxy } from '@/shared/service-proxies/service-proxies';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewChild, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-op-terminal-registration-request-listing',
  standalone: true,
  imports: [TableModule, ButtonModule, FormsModule, CommonModule, ToolbarModule, SkeletonModule, TagModule, ConfirmDialogModule],
  providers: [MessageService, ConfirmationService, OpTerminalRegistrationRequestServiceProxy],
  templateUrl: './opTerminalRegistrationRequestListing.html',
  styleUrls: ['./opTerminalRegistrationRequestListing.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OpTerminalRegistrationRequestListing {
  requests = signal<OpTerminalRegistrationRequest[]>([]);
  loading = signal<boolean>(true);

  @ViewChild('dt') dt!: Table;

  constructor(
    private svc: OpTerminalRegistrationRequestServiceProxy,
    private msg: MessageService,
    private confirmation: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.loading.set(true);
    this.svc.getAllOpTerminalRegistrationRequests().subscribe({
      next: (d) => {
        this.requests.set(d || []);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.msg.add({ severity: 'error', summary: 'Error', detail: 'Failed to load requests' });
        this.loading.set(false);
      }
    });
  }

  getSeverity(status?: string) {
    switch (String(status || '').toLowerCase()) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'danger';
      case 'pending':
        return 'warn';
      case 'approve':
      case 'approved':
        return 'success';
      case 'rejected':
        return 'danger';
      default:
        return 'info';
    }
  }

  confirmApprove(item: OpTerminalRegistrationRequest) {
    this.confirmation.confirm({
      message: 'Are you sure you want to approve this request?',
      header: 'Confirm Approve',
      icon: 'pi pi-check',
      accept: () => this.updateAcceptance(item, 'Approved')
    });
  }

  confirmReject(item: OpTerminalRegistrationRequest) {
    this.confirmation.confirm({
      message: 'Are you sure you want to reject this request?',
      header: 'Confirm Reject',
      icon: 'pi pi-times',
      accept: () => this.updateAcceptance(item, 'Rejected')
    });
  }

  confirmPending(item: OpTerminalRegistrationRequest) {
    this.confirmation.confirm({
      message: 'Set this request to pending?',
      header: 'Confirm Pending',
      icon: 'pi pi-info-circle',
      accept: () => this.updateAcceptance(item, undefined)
    });
  }

  updateAcceptance(item: OpTerminalRegistrationRequest, acceptanceStatus: string | undefined) {
    const updated: OpTerminalRegistrationRequest = { ...item } as OpTerminalRegistrationRequest;
    updated.acceptanceStatus = acceptanceStatus;
    if (acceptanceStatus === 'Approved') {
      updated.status = 'Approve';
    } else if (acceptanceStatus === 'Rejected') {
      updated.status = 'Rejected';
    } else {
      // Pending
      updated.status = 'Pending';
    }

    this.loading.set(true);
    this.svc.updateOpTerminalRegistrationRequest(Number(updated.autoid), updated).subscribe({
      next: () => {
        this.msg.add({ severity: 'success', summary: 'Success', detail: 'Request updated' });
        this.load();
      },
      error: (err) => {
        console.error(err);
        this.msg.add({ severity: 'error', summary: 'Error', detail: 'Failed to update request' });
        this.loading.set(false);
      }
    });
  }
}
