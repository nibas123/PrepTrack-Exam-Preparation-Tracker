import { Component, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

interface NavItem {
  label: string;
  route: string;
  iconSvg: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- Mobile Backdrop -->
    @if (mobileOpen()) {
      <div
        class="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
        (click)="closeMobile.emit()"
      ></div>
    }

    <!-- Sidebar Container -->
    <aside
      class="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200/90 flex flex-col transition-transform duration-200 ease-in-out lg:static lg:translate-x-0"
      [class.translate-x-0]="mobileOpen()"
      [class.-translate-x-full]="!mobileOpen()"
    >
      <!-- Brand Header -->
      <div class="h-16 flex items-center justify-between px-6 border-b border-slate-100">
        <a routerLink="/dashboard" class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
            <!-- Bank Building / Trophy Icon -->
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <span class="text-lg font-bold tracking-tight text-slate-900">Prep<span class="text-brand-600">Track</span></span>
            <span class="block text-[10px] font-medium uppercase tracking-wider text-slate-400">Bank Exam Suite</span>
          </div>
        </a>

        <!-- Mobile close button -->
        <button
          type="button"
          (click)="closeMobile.emit()"
          class="lg:hidden p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Navigation Links -->
      <nav class="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
        @for (item of navItems; track item.route) {
          <a
            [routerLink]="item.route"
            routerLinkActive="bg-brand-50 text-brand-700 font-semibold shadow-xs"
            [routerLinkActiveOptions]="{ exact: item.route === '/dashboard' }"
            (click)="closeMobile.emit()"
            class="flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors group"
          >
            <span
              class="w-5 h-5 flex items-center justify-center text-slate-400 group-hover:text-slate-600 group-[.bg-brand-50]:text-brand-600"
              [innerHTML]="item.iconSvg"
            ></span>
            <span>{{ item.label }}</span>
          </a>
        }
      </nav>

      <!-- User footer -->
      <div class="p-4 border-t border-slate-100 bg-slate-50/50">
        <div class="flex items-center space-x-3">
          <div class="w-9 h-9 rounded-full bg-brand-100 border border-brand-200 text-brand-700 font-bold flex items-center justify-center text-sm shadow-xs">
            {{ userInitial }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-xs font-semibold text-slate-800 truncate">
              {{ authService.currentProfile()?.display_name || authService.currentUser()?.email || 'Bank Aspirant' }}
            </p>
            <p class="text-[11px] text-slate-500">
              Target: {{ authService.currentProfile()?.daily_target_hours || 4 }} hrs/day
            </p>
          </div>
          <button
            (click)="authService.signOut()"
            title="Sign Out"
            class="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  `
})
export class SidebarComponent {
  public authService = inject(AuthService);
  public mobileOpen = input<boolean>(false);
  public closeMobile = output<void>();

  get userInitial(): string {
    const name = this.authService.currentProfile()?.display_name || this.authService.currentUser()?.email || 'A';
    return name.charAt(0).toUpperCase();
  }

  readonly navItems: NavItem[] = [
    {
      label: 'Dashboard',
      route: '/dashboard',
      iconSvg: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>`
    },
    {
      label: 'My Syllabus',
      route: '/syllabus',
      iconSvg: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>`
    },
    {
      label: 'Daily Goals',
      route: '/daily-goals',
      iconSvg: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>`
    },
    {
      label: 'Study Sessions',
      route: '/study-sessions',
      iconSvg: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`
    },
    {
      label: 'Mock Exams',
      route: '/mock-exams',
      iconSvg: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>`
    },
    {
      label: 'Exam Calendar',
      route: '/exam-calendar',
      iconSvg: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>`
    },
    {
      label: 'Practice Quizzes',
      route: '/quizzes',
      iconSvg: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>`
    },
    {
      label: 'Settings',
      route: '/settings',
      iconSvg: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>`
    }
  ];
}
