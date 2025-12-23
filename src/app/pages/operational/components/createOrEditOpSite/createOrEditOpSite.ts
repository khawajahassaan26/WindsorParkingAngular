import { OpSite, OpSiteServiceProxy } from '@/shared/service-proxies/service-proxies';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { LoaderService } from '@/shared/utilities/services/loader.service';

@Component({
  selector: 'app-create-or-edit-op-site',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule, FormsModule, InputTextModule],
  providers: [MessageService],
  templateUrl: './createOrEditOpSite.html',
  styleUrl: './createOrEditOpSite.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateOrEditOpSite implements OnChanges {
  @Input() visible: boolean = false;
  @Input() site: OpSite | null = null;
  @Output() saved = new EventEmitter<OpSite>();
  @Output() closed = new EventEmitter<void>();

  model = signal<OpSite>(new OpSite());
  submitted = signal<boolean>(false);
  isEdit = signal<boolean>(false);
  isLoading = signal<boolean>(false);

  constructor(
    private svc: OpSiteServiceProxy,
    private msg: MessageService,
    private loader: LoaderService
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['site'] && this.site) {
      this.isEdit.set(!!this.site.autoid && this.site.autoid! > 0);
      this.model.set(Object.assign(new OpSite(), this.site));
      this.submitted.set(false);
      this.isLoading.set(false);
    }

    if (changes['visible'] && this.visible && !this.site) {
      this.isEdit.set(false);
      this.model.set(new OpSite());
      this.submitted.set(false);
    }
  }

  save() {
    this.submitted.set(true);
    if (!this.model().siteName) {
      this.msg.add({ severity: 'warn', summary: 'Validation', detail: 'Site Name is required' });
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
    this.loader.showSaving('Creating site...');
    const dto = Object.assign(new OpSite(), {
      siteName: this.model().siteName,
      siteAddress: this.model().siteAddress,
      city: this.model().city,
      province: this.model().province,
      country: this.model().country,
      siteLongitude: this.model().siteLongitude,
      siteLattitude: this.model().siteLattitude,
      siteParkingCapacity: this.model().siteParkingCapacity,
      siteLogo: this.model().siteLogo,
      status: this.model().status || 'Active'
    });

    this.svc.createOpSite(dto).subscribe({
      next: () => {
        this.loader.hide();
        this.isLoading.set(false);
        this.msg.add({ severity: 'success', summary: 'Created', detail: 'Site created' });
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
    this.loader.showSaving('Updating site...');
    const id = this.model().autoid!;
    const dto = Object.assign(new OpSite(), {
      siteName: this.model().siteName,
      siteAddress: this.model().siteAddress,
      city: this.model().city,
      province: this.model().province,
      country: this.model().country,
      siteLongitude: this.model().siteLongitude,
      siteLattitude: this.model().siteLattitude,
      siteParkingCapacity: this.model().siteParkingCapacity,
      siteLogo: this.model().siteLogo,
      status: this.model().status
    });

    this.svc.updateOpSite(id, dto).subscribe({
      next: () => {
        this.loader.hide();
        this.isLoading.set(false);
        this.msg.add({ severity: 'success', summary: 'Updated', detail: 'Site updated' });
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
