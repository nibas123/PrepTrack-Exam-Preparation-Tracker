import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card card-hover flex flex-col justify-between relative overflow-hidden group">
      <!-- Top row: Title and Icon -->
      <div class="flex items-center justify-between">
        <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider">{{ title() }}</span>
        @if (iconBgColor()) {
          <div
            class="w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105"
            [style.background-color]="iconBgColor()"
            [style.color]="iconColor() || '#ffffff'"
          >
            <ng-content select="[card-icon]"></ng-content>
          </div>
        }
      </div>

      <!-- Center: Value -->
      <div class="mt-3">
        <div class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {{ value() }}
        </div>
      </div>

      <!-- Bottom: Subtitle / helper note -->
      @if (subtitle()) {
        <div class="mt-2 text-xs text-slate-500 flex items-center space-x-1.5">
          <span>{{ subtitle() }}</span>
        </div>
      }
    </div>
  `
})
export class StatCardComponent {
  public title = input.required<string>();
  public value = input.required<string | number>();
  public subtitle = input<string>('');
  public iconBgColor = input<string>('#eff6ff');
  public iconColor = input<string>('#2563eb');
}
