import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectButtonModule } from 'primeng/selectbutton';

@Component({
  selector: 'app-status-select',
  standalone: true,
  imports: [CommonModule, FormsModule, SelectButtonModule],
  templateUrl: './statusSelect.html',
  styleUrl: './statusSelect.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusSelect {
  @Input() status: string | undefined;
  @Output() statusChange = new EventEmitter<string>();

  options = [
    { label: 'Active', value: 'Active' },
    { label: 'Inactive', value: 'Inactive' }
  ];

  onChange(value: string) {
    this.statusChange.emit(value);
  }
}
