import { OpService, OPServicesDTO, OpServiceServiceProxy, OPSiteDTO, OPSiteDTOesServiceProxy } from '@/shared/service-proxies/service-proxies';
import { StatusSelect } from '@/features/shared/components/statusSelect/statusSelect';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { LoaderService } from '@/shared/utilities/services/loader.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-create-or-edit-op-site',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule, FormsModule, InputTextModule, MultiSelectModule, StatusSelect],
  providers: [MessageService, OpServiceServiceProxy, OPSiteDTOesServiceProxy],
  templateUrl: './createOrEditOpSite.html',
  styleUrl: './createOrEditOpSite.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateOrEditOpSite implements OnChanges {
  @Input() visible: boolean = false;
  @Input() site: OPSiteDTO | null = null;
  @Output() saved = new EventEmitter<OPSiteDTO>();
  @Output() closed = new EventEmitter<void>();

  model = signal<OPSiteDTO>(new OPSiteDTO());
  submitted = signal<boolean>(false);
  isEdit = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  // services options and selected ids
  services = signal<OpService[]>([]);
  selectedServiceIds = signal<number[]>([]);

  constructor(
    private svc: OPSiteDTOesServiceProxy,
    private opServiceSvc: OpServiceServiceProxy,
    private msg: MessageService,
    private loader: LoaderService
  ) {}

  ngOnInit(): void {
    this.loadServices();
  }

  private loadServices() {
    this.opServiceSvc.getAllOpServices().subscribe({
      next: (data) => this.services.set(data || []),
      error: () => this.services.set([])
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['site'] && this.site) {
      this.isEdit.set(!!this.site.autoid && this.site.autoid! > 0);
      this.model.set(Object.assign(new OPSiteDTO(), this.site));
      // populate selectedServiceIds from site's services (DTO shape)
      const ids = (this.site.services || []).map(s => s.autoid!).filter(id => id != null) as number[];
      this.selectedServiceIds.set(ids);
      this.submitted.set(false);
      this.isLoading.set(false);
    }

    if (changes['visible'] && this.visible && !this.site) {
      this.isEdit.set(false);
      this.model.set(new OPSiteDTO());
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
    const dto = Object.assign(new OPSiteDTO(), {
        createddate: this.model().createddate,
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
    // include selected services as DTO 'services' minimal objects
     dto.services = this.services()
    .filter(service =>
        this.selectedServiceIds().includes(service.autoid!)
    )
    .map(service => {
        const svc = new OPServicesDTO();
        svc.autoid = service.autoid!;
        svc.createddate = service.createddate;
        svc.serviceName = service.serviceName;
        svc.serviceDescription = service.description ?? "";
        return svc;
    });          

    this.svc.oPSiteDTOesPOST(dto).subscribe({
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
    const dto = Object.assign(new OPSiteDTO(), {
      createddate: this.model().createddate,
      autoid: this.model().autoid,
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

     dto.services = this.services()
    .filter(service =>
        this.selectedServiceIds().includes(service.autoid!)
    )
    .map(service => {
        const svc = new OPServicesDTO();
        svc.autoid = service.autoid!;
        svc.createddate = service.createddate;
        svc.serviceName = service.serviceName;
        svc.serviceDescription = service.description ?? "";
        return svc;
    });
        this.svc.oPSiteDTOesPUT(id, dto).pipe(finalize(() => {
      this.loader.hide();
      this.isLoading.set(false);
    })).subscribe({ 
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
