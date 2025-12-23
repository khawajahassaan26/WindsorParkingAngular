import { OpService, OpServiceServiceProxy } from '@/shared/service-proxies/service-proxies';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { LoaderService } from '@/shared/utilities/services/loader.service';

@Component({
  selector: 'app-create-or-edit-op-service',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule, FormsModule, InputTextModule],
  providers: [MessageService],
  templateUrl: './createOrEditOpService.html',
  styleUrl: './createOrEditOpService.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateOrEditOpService implements OnChanges {
  @Input() visible: boolean = false;
  @Input() opService: OpService | null = null;
  @Output() saved = new EventEmitter<OpService>();
  @Output() closed = new EventEmitter<void>();

  model = signal<OpService>(new OpService());
  submitted = signal<boolean>(false);
  isEdit = signal<boolean>(false);
  isLoading = signal<boolean>(false);

  constructor(
    private service: OpServiceServiceProxy,
    private messageService: MessageService,
    private loader: LoaderService
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['opService'] && this.opService) {
      this.isEdit.set(!!this.opService.autoid && this.opService.autoid! > 0);
      this.model.set(Object.assign(new OpService(), this.opService));
      this.submitted.set(false);
      this.isLoading.set(false);
    }

    if (changes['visible'] && this.visible && !this.opService) {
      this.isEdit.set(false);
      this.model.set(new OpService());
      this.submitted.set(false);
    }
  }

  save() {
    this.submitted.set(true);
    if (!this.model().serviceName) {
      this.messageService.add({ severity: 'warn', summary: 'Validation', detail: 'Service Name is required' });
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
    this.loader.showSaving('Creating service...');
    const dto = Object.assign(new OpService(), {
      serviceName: this.model().serviceName,
      description: this.model().description,
      type: this.model().type,
      status: this.model().status || 'Active'
    });

    this.service.createOpService(dto).subscribe({
      next: () => {
        this.loader.hide();
        this.isLoading.set(false);
        this.messageService.add({ severity: 'success', summary: 'Created', detail: 'Service created' });
        this.saved.emit(this.model());
        this.close();
      },
      error: (err) => {
        this.loader.hide();
        this.isLoading.set(false);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err?.error?.message || 'Create failed' });
      }
    });
  }

  private update() {
    this.isLoading.set(true);
    this.loader.showSaving('Updating service...');
    const id = this.model().autoid!;
    const dto = Object.assign(new OpService(), {
      serviceName: this.model().serviceName,
      description: this.model().description,
      type: this.model().type,
      status: this.model().status
    });

    this.service.updateOpService(id, dto).subscribe({
      next: () => {
        this.loader.hide();
        this.isLoading.set(false);
        this.messageService.add({ severity: 'success', summary: 'Updated', detail: 'Service updated' });
        this.saved.emit(this.model());
        this.close();
      },
      error: (err) => {
        this.loader.hide();
        this.isLoading.set(false);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err?.error?.message || 'Update failed' });
      }
    });
  }

  close() {
    this.submitted.set(false);
    this.loader.hide();
    this.closed.emit();
  }
}
