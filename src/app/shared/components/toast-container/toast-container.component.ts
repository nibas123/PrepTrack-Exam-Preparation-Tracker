import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, ToastMessage } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed bottom-5 right-5 z-50 flex flex-col space-y-3 max-w-sm w-full pointer-events-none">
      @for (toast of toastService.toasts(); track toast.id) {
        <div
          class="pointer-events-auto transform transition-all duration-300 ease-out translate-y-0 opacity-100 flex items-start p-4 rounded-xl shadow-lg border backdrop-blur-sm"
          [ngClass]="{
            'bg-emerald-50/95 border-emerald-200 text-emerald-900': toast.type === 'success',
            'bg-rose-50/95 border-rose-200 text-rose-900': toast.type === 'error',
            'bg-amber-50/95 border-amber-200 text-amber-900': toast.type === 'warning',
            'bg-sky-50/95 border-sky-200 text-sky-900': toast.type === 'info'
          }"
        >
          <!-- Icon -->
          <div class="flex-shrink-0 mr-3 mt-0.5">
            @if (toast.type === 'success') {
              <svg class="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            } @else if (toast.type === 'error') {
              <svg class="w-5 h-5 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            } @else if (toast.type === 'warning') {
              <svg class="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            } @else {
              <svg class="w-5 h-5 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0 pr-2">
            @if (toast.title) {
              <h4 class="text-sm font-semibold mb-0.5">{{ toast.title }}</h4>
            }
            <p class="text-xs leading-relaxed opacity-90">{{ toast.message }}</p>
          </div>

          <!-- Dismiss button -->
          <button
            type="button"
            (click)="toastService.remove(toast.id)"
            class="flex-shrink-0 text-slate-400 hover:text-slate-600 focus:outline-none p-1"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      }
    </div>
  `
})
export class ToastContainerComponent {
  public toastService = inject(ToastService);
}
