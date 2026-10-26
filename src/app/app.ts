import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from './core/auth/auth.service';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { ToastContainerComponent } from './shared/components/toast-container/toast-container.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    SidebarComponent,
    NavbarComponent,
    ToastContainerComponent
  ],
  template: `
    @if (isAuthRoute()) {
      <!-- Plain view for Login / Register -->
      <router-outlet></router-outlet>
      <app-toast-container></app-toast-container>
    } @else {
      <!-- Main Application Layout Shell: Full-width, distraction-free workspace -->
      <div class="min-h-screen flex flex-col bg-slate-50 text-slate-900 transition-colors">
        <!-- Sidebar Navigation Drawer (off-canvas for mobile & drawer access) -->
        <app-sidebar
          [mobileOpen]="isMobileSidebarOpen()"
          (closeMobile)="isMobileSidebarOpen.set(false)"
        ></app-sidebar>

        <!-- Top Header Navigation -->
        <app-navbar
          [title]="currentPageTitle()"
          (toggleMobile)="isMobileSidebarOpen.update(v => !v)"
        ></app-navbar>

        <!-- Main Content Area: Maximum screen space, clean distraction-free -->
        <main class="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <router-outlet></router-outlet>
        </main>

        <!-- Global Toast Container -->
        <app-toast-container></app-toast-container>
      </div>
    }
  `
})
export class App {
  public authService = inject(AuthService);
  private router = inject(Router);

  public isMobileSidebarOpen = signal<boolean>(false);
  public currentUrl = signal<string>('/dashboard');

  public isAuthRoute = computed(() => {
    return this.currentUrl().includes('/login');
  });

  public currentPageTitle = computed(() => {
    const url = this.currentUrl();
    if (url.includes('/kerala-high-court')) return 'High Court Recruitment Hub';
    if (url.includes('/study-library')) return 'Comprehensive Legal Study Library';
    if (url.includes('/descriptive-lab')) return 'Descriptive Examination Lab';
    if (url.includes('/revision')) return 'Smart Revision & Error Vault';
    if (url.includes('/syllabus')) return 'Syllabus Tracker';
    if (url.includes('/daily-goals')) return 'Daily Goals';
    if (url.includes('/study-sessions')) return 'Study Sessions & Timer';
    if (url.includes('/mock-exams')) return 'Mock Exams';
    if (url.includes('/exam-calendar')) return 'All Recruitment Examinations';
    if (url.includes('/quizzes')) return 'Practice Quizzes & Previous Papers';
    if (url.includes('/growth-stats')) return 'Growth & Preparation Stats';
    if (url.includes('/admin')) return 'Admin & AI Control Console';
    if (url.includes('/settings')) return 'Settings';
    return 'Preparation Dashboard';
  });

  constructor() {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.currentUrl.set(event.urlAfterRedirects);
        this.isMobileSidebarOpen.set(false);
      });
  }
}
