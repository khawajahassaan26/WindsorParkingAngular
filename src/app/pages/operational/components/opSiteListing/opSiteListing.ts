import { OpSite, OpSiteServiceProxy } from '@/shared/service-proxies/service-proxies';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewChild, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { CreateOrEditOpSite } from '../createOrEditOpSite/createOrEditOpSite';

@Component({
  selector: 'app-op-site-listing',
  standalone: true,
  imports: [TableModule, ButtonModule, FormsModule, CommonModule, ToolbarModule, CreateOrEditOpSite],
  providers: [MessageService, OpSiteServiceProxy],
  templateUrl: './opSiteListing.html',
  styleUrl: './opSiteListing.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OpSiteListing {
  sites = signal<OpSite[]>([]);
  dialogVisible = signal<boolean>(false);
  selected = signal<OpSite | null>(null);

  @ViewChild('dt') dt!: Table;

  constructor(private svc: OpSiteServiceProxy, private msg: MessageService) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.svc.getAllOpSites().subscribe({ next: (d) => this.sites.set(d), error: (e) => console.error(e) });
  }

  openNew() {
    this.selected.set(new OpSite());
    this.dialogVisible.set(true);
  }

  edit(s: OpSite) {
    this.svc.getOpSiteById(s.autoid!).subscribe({
      next: (f) => {
        this.selected.set(Object.assign(new OpSite(), f));
        this.dialogVisible.set(true);
      },
      error: () => this.msg.add({ severity: 'error', summary: 'Error', detail: 'Failed to load site' })
    });
  }

  onSaved(_: OpSite) {
    this.load();
  }

  onClosed() {
    this.dialogVisible.set(false);
  }
}
