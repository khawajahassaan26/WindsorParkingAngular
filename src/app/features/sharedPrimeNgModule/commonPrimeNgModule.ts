import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToolbarModule } from 'primeng/toolbar';

export const CommonPrimeNgImports = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  TableModule,
  ButtonModule,
  TagModule,
  DialogModule,
  AutoCompleteModule,
  ToolbarModule,
  InputTextModule,
  IconFieldModule,
  InputIconModule,
  DatePipe // ✅ Pipe allowed here
];
