import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full">
      @if (showLabel()) {
        <div class="flex justify-between items-center text-xs font-medium text-slate-600 mb-1.5">
          <span>{{ label() }}</span>
          <span class="font-bold text-slate-800">{{ percentage() }}%</span>
        </div>
      }
      <div class="w-full bg-slate-100 rounded-full overflow-hidden" [ngClass]="heightClass">
        <div
          class="h-full rounded-full transition-all duration-500 ease-out"
          [style.width.%]="clampedPercentage"
          [style.background-color]="color() || '#2563eb'"
        ></div>
      </div>
    </div>
  `
})
export class ProgressBarComponent {
  public percentage = input<number>(0);
  public color = input<string>('#2563eb');
  public label = input<string>('');
  public showLabel = input<boolean>(true);
  public size = input<'sm' | 'md' | 'lg'>('md');

  get clampedPercentage(): number {
    return Math.min(100, Math.max(0, this.percentage() || 0));
  }

  get heightClass(): string {
    switch (this.size()) {
      case 'sm': return 'h-1.5';
      case 'lg': return 'h-3.5';
      default: return 'h-2.5';
    }
  }
}
