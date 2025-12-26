import { OPSiteDTO, OPSiteDTOesServiceProxy } from '@/shared/service-proxies/service-proxies';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewChild, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { SkeletonModule } from 'primeng/skeleton';
import { CreateOrEditOpSite } from '../createOrEditOpSite/createOrEditOpSite';

@Component({
  selector: 'app-op-site-listing',
  standalone: true,
  imports: [TableModule, ButtonModule, FormsModule, CommonModule, ToolbarModule, CreateOrEditOpSite, SkeletonModule],
  providers: [MessageService, OPSiteDTOesServiceProxy],
  templateUrl: './opSiteListing.html',
  styleUrl: './opSiteListing.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OpSiteListing {
  sites = signal<OPSiteDTO[]>([]);
  dialogVisible = signal<boolean>(false);
  loading = signal<boolean>(true);
  selected = signal<OPSiteDTO | null>(null);

  expandedRows = signal<Record<string, boolean>>({});

  @ViewChild('dt') dt!: Table;

  constructor(private svc: OPSiteDTOesServiceProxy, private msg: MessageService) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.loading.set(true);
    this.svc.oPSiteDTOesAll().subscribe({
      next: (d) => {
        this.sites.set(d || []);
        this.loading.set(false);
      },
      error: (e) => {
        console.error(e);
        this.loading.set(false);
      }
    });
  }

  openNew() {
    this.selected.set(new OPSiteDTO());
    this.dialogVisible.set(true);
  }

  edit(s: OPSiteDTO) {
    this.svc.oPSiteDTOesGET(s.autoid!).subscribe({
      next: (f) => {
        this.selected.set(Object.assign(new OPSiteDTO(), f));
        this.dialogVisible.set(true);
      },
      error: () => this.msg.add({ severity: 'error', summary: 'Error', detail: 'Failed to load site' })
    });
  }

  onSaved(_: OPSiteDTO) {
    this.load();
  }

  onClosed() {
    this.dialogVisible.set(false);
    this.load();
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

  toggleRow(site: OPSiteDTO) {
    const key = site?.autoid?.toString();
    if (!key) return;
    const map = { ...this.expandedRows() };
    if (map[key]) {
      delete map[key];
    } else {
      map[key] = true;
    }
    this.expandedRows.set(map);
  }

  isRowExpanded(site: OPSiteDTO) {
    const key = site?.autoid?.toString();
    if (!key) return false;
    return !!this.expandedRows()[key];
  }
}
