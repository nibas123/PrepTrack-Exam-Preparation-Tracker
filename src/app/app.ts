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
      <!-- Main Application Layout Shell -->
      <div class="min-h-screen flex bg-slate-50">
        <!-- Sidebar Navigation -->
        <app-sidebar
          [mobileOpen]="isMobileSidebarOpen()"
          (closeMobile)="isMobileSidebarOpen.set(false)"
        ></app-sidebar>

        <!-- Main Workspace Area -->
        <div class="flex-1 flex flex-col min-w-0 min-h-screen">
          <!-- Top Navbar -->
          <app-navbar
            [title]="currentPageTitle()"
            (toggleMobile)="isMobileSidebarOpen.update(v => !v)"
          ></app-navbar>

          <!-- Main Page Body -->
          <main class="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            <router-outlet></router-outlet>
          </main>
        </div>

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
    if (url.includes('/syllabus')) return 'My Syllabus';
    if (url.includes('/daily-goals')) return 'Daily Goals';
    if (url.includes('/study-sessions')) return 'Study Sessions & Timer';
    if (url.includes('/mock-exams')) return 'Mock Exams';
    if (url.includes('/exam-calendar')) return 'Exam Calendar';
    if (url.includes('/settings')) return 'Settings';
    return 'Dashboard';
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
