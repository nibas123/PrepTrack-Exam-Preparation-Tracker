import { Component, inject, output, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TimerService } from '../../../core/services/timer.service';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="h-16 bg-white border-b border-slate-200/90 px-4 lg:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      <!-- Left side: Mobile Toggle & Page Title -->
      <div class="flex items-center space-x-3">
        <button
          type="button"
          (click)="toggleMobile.emit()"
          class="lg:hidden p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 focus:outline-none"
        >
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div>
          <h1 class="text-base lg:text-lg font-bold text-slate-900 tracking-tight">{{ title() }}</h1>
        </div>
      </div>

      <!-- Right side: Running Timer Badge & User Profile Shortcut -->
      <div class="flex items-center space-x-3 sm:space-x-4">
        <!-- Active Timer Indicator Pill -->
        @if (timerService.activeTimer(); as timer) {
          <a
            routerLink="/study-sessions"
            class="flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all"
            [ngClass]="timer.isRunning ? 'bg-emerald-50 text-emerald-700 border-emerald-300 animate-pulse' : 'bg-amber-50 text-amber-700 border-amber-300'"
            title="Click to view Study Sessions & Timer"
          >
            <span class="w-2 h-2 rounded-full" [ngClass]="timer.isRunning ? 'bg-emerald-500' : 'bg-amber-500'"></span>
            <span>{{ timerService.formatDuration(timerService.elapsedSeconds()) }}</span>
            <span class="hidden sm:inline text-[11px] opacity-75 font-normal">({{ timer.isRunning ? 'Studying' : 'Paused' }})</span>
          </a>
        }

        <!-- Quick Study Action Shortcut -->
        @if (!timerService.activeTimer()) {
          <a
            routerLink="/study-sessions"
            class="hidden sm:inline-flex items-center space-x-1.5 text-xs font-medium text-brand-600 bg-brand-50 hover:bg-brand-100 border border-brand-200 px-3 py-1.5 rounded-lg transition-colors"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Start Study</span>
          </a>
        }

        <!-- User profile icon link -->
        <a
          routerLink="/settings"
          class="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-slate-100 text-slate-700 transition-colors"
          title="Account Settings"
        >
          <div class="w-8 h-8 rounded-full bg-brand-600 text-white font-bold flex items-center justify-center text-xs shadow-xs">
            {{ userInitial }}
          </div>
        </a>
      </div>
    </header>
  `
})
export class NavbarComponent {
  public timerService = inject(TimerService);
  public authService = inject(AuthService);

  public title = input<string>('Dashboard');
  public toggleMobile = output<void>();

  get userInitial(): string {
    const name = this.authService.currentProfile()?.display_name || this.authService.currentUser()?.email || 'A';
    return name.charAt(0).toUpperCase();
  }
}
