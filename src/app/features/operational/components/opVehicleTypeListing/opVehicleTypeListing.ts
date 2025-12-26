import { OpVehicleType, OpVehicleTypeServiceProxy } from '@/shared/service-proxies/service-proxies';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewChild, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { CreateOrEditOpVehicleType } from '../createOrEditOpVehicleType/createOrEditOpVehicleType';
import { LoadingSkeleton } from '@/features/shared/components/loadingSkeleton/loadingSkeleton';

@Component({
  selector: 'app-op-vehicle-type-listing',
  standalone: true,
  imports: [TableModule, ButtonModule, FormsModule, CommonModule, ToolbarModule, CreateOrEditOpVehicleType, LoadingSkeleton],
  providers: [MessageService, OpVehicleTypeServiceProxy],
  templateUrl: './opVehicleTypeListing.html',
  styleUrl: './opVehicleTypeListing.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OpVehicleTypeListing {
  items = signal<OpVehicleType[]>([]);
  dialogVisible = signal<boolean>(false);
  loading = signal<boolean>(true);
  selected = signal<OpVehicleType | null>(null);

  @ViewChild('dt') dt!: Table;

  constructor(private svc: OpVehicleTypeServiceProxy, private msg: MessageService) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.loading.set(true);
    this.svc.getAllOpVehicleTypes().subscribe({
      next: (d) => {
        this.items.set(d);
        this.loading.set(false);
      },
      error: (e) => {
        console.error(e);
        this.loading.set(false);
      }
    });
  }

  openNew() {
    this.selected.set(new OpVehicleType());
    this.dialogVisible.set(true);
  }

  edit(item: OpVehicleType) {
    this.svc.getOpVehicleTypeById(item.autoid!).subscribe({
      next: (f) => {
        this.selected.set(Object.assign(new OpVehicleType(), f));
        this.dialogVisible.set(true);
      },
      error: () => this.msg.add({ severity: 'error', summary: 'Error', detail: 'Failed to load vehicle type' })
    });
  }

  onSaved(_: OpVehicleType) {
    this.load();
  }

  onClosed() {
    this.dialogVisible.set(false);
  }
}
