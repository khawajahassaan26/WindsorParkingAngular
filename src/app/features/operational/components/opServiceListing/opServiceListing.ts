import { OpService, OpServiceServiceProxy } from '@/shared/service-proxies/service-proxies';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewChild, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { CreateOrEditOpService } from '../createOrEditOpService/createOrEditOpService';
import { LoadingSkeleton } from '@/features/shared/components/loadingSkeleton/loadingSkeleton';

@Component({
  selector: 'app-op-service-listing',
  standalone: true,
  imports: [TableModule, ButtonModule, FormsModule, CommonModule, ToolbarModule, CreateOrEditOpService,LoadingSkeleton],
  providers: [MessageService, OpServiceServiceProxy],
  templateUrl: './opServiceListing.html',
  styleUrl: './opServiceListing.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OpServiceListing {
  services = signal<OpService[]>([]);
  dialogVisible = signal<boolean>(false);
  loading = signal<boolean>(true);
  selected = signal<OpService | null>(null);

  @ViewChild('dt') dt!: Table;

  constructor(private svc: OpServiceServiceProxy, private msg: MessageService) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.loading.set(true);
    this.svc.getAllOpServices().subscribe({
      next: (d) => {
        this.services.set(d);
        this.loading.set(false);
      },
      error: (e) => {
        console.error(e);
        this.loading.set(false);
      }
    });
  }

  openNew() {
    this.selected.set(new OpService());
    this.dialogVisible.set(true);
  }

  edit(s: OpService) {
    this.svc.getOpServiceById(s.autoid!).subscribe({
      next: (f) => {
        this.selected.set(Object.assign(new OpService(), f));
        this.dialogVisible.set(true);
      },
      error: () => this.msg.add({ severity: 'error', summary: 'Error', detail: 'Failed to load service' })
    });
  }

  onSaved(_: OpService) {
    this.load();
  }

  onClosed() {
    this.dialogVisible.set(false);
  }
}
