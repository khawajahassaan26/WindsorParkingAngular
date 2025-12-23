import { OpVehicleType, OpVehicleTypeServiceProxy } from '@/shared/service-proxies/service-proxies';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { LoaderService } from '@/shared/utilities/services/loader.service';

@Component({
  selector: 'app-create-or-edit-op-vehicle-type',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule, FormsModule, InputTextModule],
  providers: [MessageService],
  templateUrl: './createOrEditOpVehicleType.html',
  styleUrl: './createOrEditOpVehicleType.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateOrEditOpVehicleType implements OnChanges {
  @Input() visible: boolean = false;
  @Input() vehicleType: OpVehicleType | null = null;
  @Output() saved = new EventEmitter<OpVehicleType>();
  @Output() closed = new EventEmitter<void>();

  model = signal<OpVehicleType>(new OpVehicleType());
  submitted = signal<boolean>(false);
  isEdit = signal<boolean>(false);
  isLoading = signal<boolean>(false);

  constructor(
    private svc: OpVehicleTypeServiceProxy,
    private msg: MessageService,
    private loader: LoaderService
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['vehicleType'] && this.vehicleType) {
      this.isEdit.set(!!this.vehicleType.autoid && this.vehicleType.autoid! > 0);
      this.model.set(Object.assign(new OpVehicleType(), this.vehicleType));
      this.submitted.set(false);
      this.isLoading.set(false);
    }

    if (changes['visible'] && this.visible && !this.vehicleType) {
      this.isEdit.set(false);
      this.model.set(new OpVehicleType());
      this.submitted.set(false);
    }
  }

  save() {
    this.submitted.set(true);
    if (!this.model().typeName) {
      this.msg.add({ severity: 'warn', summary: 'Validation', detail: 'Type Name is required' });
      return;
    }

    if (this.isEdit()) {
      this.update();
    } else {
      this.create();
    }
  }

  private create() {
    this.isLoading.set(true);
    this.loader.showSaving('Creating vehicle type...');
    const dto = Object.assign(new OpVehicleType(), {
      typeName: this.model().typeName,
      description: this.model().description,
      wheelCount: this.model().wheelCount,
      status: this.model().status || 'Active'
    });

    this.svc.createOpVehicleType(dto).subscribe({
      next: () => {
        this.loader.hide();
        this.isLoading.set(false);
        this.msg.add({ severity: 'success', summary: 'Created', detail: 'Vehicle type created' });
        this.saved.emit(this.model());
        this.close();
      },
      error: (err) => {
        this.loader.hide();
        this.isLoading.set(false);
        this.msg.add({ severity: 'error', summary: 'Error', detail: err?.error?.message || 'Create failed' });
      }
    });
  }

  private update() {
    this.isLoading.set(true);
    this.loader.showSaving('Updating vehicle type...');
    const id = this.model().autoid!;
    const dto = Object.assign(new OpVehicleType(), {
      typeName: this.model().typeName,
      description: this.model().description,
      wheelCount: this.model().wheelCount,
      status: this.model().status
    });

    this.svc.updateOpVehicleType(id, dto).subscribe({
      next: () => {
        this.loader.hide();
        this.isLoading.set(false);
        this.msg.add({ severity: 'success', summary: 'Updated', detail: 'Vehicle type updated' });
        this.saved.emit(this.model());
        this.close();
      },
      error: (err) => {
        this.loader.hide();
        this.isLoading.set(false);
        this.msg.add({ severity: 'error', summary: 'Error', detail: err?.error?.message || 'Update failed' });
      }
    });
  }

  close() {
    this.submitted.set(false);
    this.loader.hide();
    this.closed.emit();
  }
}
