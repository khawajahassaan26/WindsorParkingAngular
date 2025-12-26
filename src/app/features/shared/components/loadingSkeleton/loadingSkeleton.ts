import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-loading-skeleton',
  standalone: true,
  imports: [CommonModule, SkeletonModule],
  templateUrl: './loadingSkeleton.html',
  styleUrls: ['./loadingSkeleton.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingSkeleton {
  @Input() rows = 5;
  @Input() colspan = 8;
  @Input() shape: 'rect' | 'circle' = 'circle';
  @Input() size = '2rem';
}
