import { Component, inject, output, input, signal, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TimerService } from '../../../core/services/timer.service';
import { AuthService } from '../../../core/auth/auth.service';
import { PwaService } from '../../../core/services/pwa.service';
import { ExamTrackService } from '../../../core/services/exam-track.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="bg-white dark:bg-slate-900 border-b border-slate-200/90 dark:border-slate-800 sticky top-0 z-30 shadow-xs transition-colors">
      <!-- Main Header Bar -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        <!-- Left: Brand / Logo & Mobile Menu Toggle -->
        <div class="flex items-center space-x-3">
          <button
            type="button"
            (click)="toggleMobile.emit()"
            class="lg:hidden p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
            aria-label="Toggle navigation drawer"
          >
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <a routerLink="/dashboard" class="flex items-center space-x-2.5 group">
            <div class="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-xs"
                 [ngClass]="trackService.isKeralaHca() ? 'bg-court-700' : 'bg-brand-900'">
              @if (trackService.isKeralaHca()) {
                <svg class="w-5 h-5 text-amber-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
              } @else {
                <svg class="w-5 h-5 text-slate-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              }
            </div>
            <div>
              <span class="text-base font-bold tracking-tight text-slate-900 dark:text-white">
                Prep<span [ngClass]="trackService.isKeralaHca() ? 'text-court-700' : 'text-brand-900 dark:text-brand-400'">Track</span>
              </span>
              <span class="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {{ trackService.isKeralaHca() ? 'Kerala High Court' : (trackService.isBank() ? 'Bank Exam Suite' : 'Multi-Exam Prep') }}
              </span>
            </div>
          </a>
        </div>

        <!-- Desktop Navigation Bar (Full screen workspace with horizontal links) -->
        <nav class="hidden lg:flex items-center space-x-1 overflow-x-auto py-1">
          <a
            routerLink="/dashboard"
            routerLinkActive="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
            [routerLinkActiveOptions]="{ exact: true }"
            class="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
          >
            Dashboard
          </a>

          @if (!trackService.isBank()) {
            <a
              routerLink="/kerala-high-court"
              routerLinkActive="bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 font-semibold"
              class="px-3 py-1.5 rounded-lg text-xs font-medium text-amber-800 dark:text-amber-300 hover:bg-amber-50/70 dark:hover:bg-amber-950/30 transition-colors flex items-center gap-1.5"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              High Court Hub
            </a>
          }

          <a
            routerLink="/study-library"
            routerLinkActive="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
            class="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
          >
            Study Library
          </a>

          <a
            routerLink="/descriptive-lab"
            routerLinkActive="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
            class="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
          >
            Descriptive Lab
          </a>

          <a
            routerLink="/mock-exams"
            routerLinkActive="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
            class="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
          >
            Mock Exams
          </a>

          <a
            routerLink="/quizzes"
            routerLinkActive="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
            class="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
          >
            Quizzes & Papers
          </a>

          <a
            routerLink="/revision"
            routerLinkActive="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
            class="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
          >
            Smart Revision
          </a>

          <a
            routerLink="/exam-calendar"
            routerLinkActive="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
            class="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
          >
            All Exams
          </a>
        </nav>

        <!-- Right Side: Single Install Button, Active Timer, and Profile Avatar Dropdown -->
        <div class="flex items-center space-x-2.5 sm:space-x-3 shrink-0">
          <!-- Active Timer Pill -->
          @if (timerService.activeTimer(); as timer) {
            <a
              routerLink="/study-sessions"
              class="flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold border transition-all"
              [ngClass]="timer.isRunning ? 'bg-emerald-50 text-emerald-700 border-emerald-300 animate-pulse' : 'bg-amber-50 text-amber-700 border-amber-300'"
              title="Click to view Study Sessions & Timer"
            >
              <span class="w-2 h-2 rounded-full" [ngClass]="timer.isRunning ? 'bg-emerald-500' : 'bg-amber-500'"></span>
              <span>{{ timerService.formatDuration(timerService.elapsedSeconds()) }}</span>
            </a>
          }

          <!-- Single Official Install App Button (Visible when installable) -->
          @if (pwaService.canInstall() && !pwaService.isInstalled()) {
            <button
              type="button"
              (click)="pwaService.promptInstall()"
              class="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors shadow-2xs cursor-pointer"
              title="Install PrepTrack Progressive Web App"
            >
              <svg class="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Install App</span>
            </button>
          }

          <!-- Profile Icon / Dropdown Menu Trigger -->
          <div class="relative">
            <button
              type="button"
              (click)="isProfileMenuOpen.set(!isProfileMenuOpen())"
              class="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-indigo-500/30 transition-all focus:outline-none"
              [class.ring-2]="isProfileMenuOpen()"
              [class.ring-indigo-500]="isProfileMenuOpen()"
              title="Open Account Menu"
              aria-haspopup="true"
            >
              <div class="w-8 h-8 rounded-full bg-slate-900 dark:bg-indigo-700 text-white font-bold flex items-center justify-center text-xs shadow-xs">
                {{ userInitial }}
              </div>
              <svg class="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 hidden sm:inline transition-transform duration-200" [class.rotate-180]="isProfileMenuOpen()" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <!-- Compact Profile Dropdown Panel -->
            @if (isProfileMenuOpen()) {
              <div
                class="fixed inset-0 z-30"
                (click)="isProfileMenuOpen.set(false)"
              ></div>

              <div
                class="absolute right-0 top-full mt-2 z-40 w-80 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 shadow-2xl space-y-2 animate-in fade-in slide-in-from-top-2 duration-150"
              >
                <!-- 1. Profile and Account Details Header -->
                <div class="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div class="flex items-center space-x-3">
                    <div class="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-xs shrink-0">
                      {{ userInitial }}
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {{ authService.currentProfile()?.display_name || 'Aspirant' }}
                      </p>
                      <p class="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {{ authService.currentUser()?.email }}
                      </p>
                    </div>
                  </div>

                  <div class="mt-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[11px]">
                    <span class="text-slate-500 dark:text-slate-400">Target Exam:</span>
                    <span class="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[140px]">
                      {{ authService.currentProfile()?.target_exam_name || 'Kerala High Court Assistant' }}
                    </span>
                  </div>

                  @if (authService.isAdmin()) {
                    <div class="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
                      <svg class="w-3 h-3 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      <span>Platform Administrator (nibasnazeem)</span>
                    </div>
                  }
                </div>

                <!-- 2. Target Exam Track Quick Switcher -->
                <div class="px-2 py-1">
                  <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-1">
                    Exam Preparation Track
                  </span>
                  <div class="grid grid-cols-3 gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-semibold">
                    <button
                      type="button"
                      (click)="switchTrack('kerala_hca')"
                      [ngClass]="trackService.activeTrack() === 'kerala_hca' ? 'bg-white dark:bg-slate-900 text-amber-700 dark:text-amber-400 shadow-xs' : 'text-slate-600 dark:text-slate-400'"
                      class="py-1 px-1.5 rounded text-center transition-all">
                      High Court
                    </button>
                    <button
                      type="button"
                      (click)="switchTrack('bank')"
                      [ngClass]="trackService.activeTrack() === 'bank' ? 'bg-white dark:bg-slate-900 text-brand-900 dark:text-brand-300 shadow-xs' : 'text-slate-600 dark:text-slate-400'"
                      class="py-1 px-1.5 rounded text-center transition-all">
                      Bank Suite
                    </button>
                    <button
                      type="button"
                      (click)="switchTrack('all')"
                      [ngClass]="trackService.activeTrack() === 'all' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'"
                      class="py-1 px-1.5 rounded text-center transition-all">
                      All Exams
                    </button>
                  </div>
                </div>

                <!-- 3. Navigation Links List -->
                <div class="space-y-0.5">
                  <a
                    routerLink="/settings"
                    (click)="isProfileMenuOpen.set(false)"
                    class="flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <svg class="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Settings & Preferences</span>
                  </a>

                  <a
                    routerLink="/growth-stats"
                    (click)="isProfileMenuOpen.set(false)"
                    class="flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <svg class="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <span>Growth & Preparation Analytics</span>
                  </a>

                  <!-- Admin Console Link (Strictly visible only to nibasnazeem@gmail.com) -->
                  @if (authService.isAdmin()) {
                    <a
                      routerLink="/admin"
                      (click)="isProfileMenuOpen.set(false)"
                      class="flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-amber-700 dark:text-amber-400 hover:bg-amber-50/60 dark:hover:bg-amber-950/30 transition-colors"
                    >
                      <svg class="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      <span>Admin & AI Console</span>
                    </a>
                  }

                  <!-- Theme & Appearance Toggle Button -->
                  <button
                    type="button"
                    (click)="toggleTheme()"
                    class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <div class="flex items-center space-x-2.5">
                      @if (isDarkMode()) {
                        <svg class="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      } @else {
                        <svg class="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                        </svg>
                      }
                      <span>Appearance</span>
                    </div>
                    <span class="text-[11px] font-semibold text-slate-400">{{ isDarkMode() ? 'Dark Mode' : 'Light Mode' }}</span>
                  </button>

                  <!-- Install App Button inside Dropdown (if supported) -->
                  @if (pwaService.canInstall() && !pwaService.isInstalled()) {
                    <button
                      type="button"
                      (click)="triggerInstall()"
                      class="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50/60 dark:bg-indigo-950/40 hover:bg-indigo-100 transition-colors"
                    >
                      <svg class="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      <span>Install PrepTrack Application</span>
                    </button>
                  }

                  <!-- Help & Support -->
                  <button
                    type="button"
                    (click)="showHelpModal.set(true); isProfileMenuOpen.set(false)"
                    class="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <svg class="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Help & Exam Guide</span>
                  </button>
                </div>

                <!-- 4. Sign Out Action -->
                <div class="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    (click)="signOut()"
                    class="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  >
                    <svg class="w-4 h-4 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </header>

    <!-- Help & Exam Support Modal -->
    @if (showHelpModal()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
        <div class="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 class="text-base font-bold text-slate-900 dark:text-white">Help & Preparation Guidelines</h3>
            <button
              (click)="showHelpModal.set(false)"
              class="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="space-y-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            <p><strong class="text-slate-900 dark:text-white">High Court Recruitment Hub:</strong> Complete study notes, articles 214-231 of the Constitution, Kerala High Court Act 1958, landmark rulings, and legal maxims.</p>
            <p><strong class="text-slate-900 dark:text-white">Descriptive Examination Lab:</strong> Practice précis writing with live word count against the strict 1/3rd official length benchmark, model essays, and scoring rubrics.</p>
            <p><strong class="text-slate-900 dark:text-white">Smart Revision Vault:</strong> Incorrect mock test answers are automatically captured and scheduled for spaced repetition active recall.</p>
            <p><strong class="text-slate-900 dark:text-white">Keyboard Navigation:</strong> Use Tab to navigate through quiz options, Space to select, and Enter to advance.</p>
          </div>

          <div class="pt-3 flex justify-end">
            <button
              (click)="showHelpModal.set(false)"
              class="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
            >
              Close Guide
            </button>
          </div>
        </div>
      </div>
    }
  `
})
export class NavbarComponent {
  public timerService = inject(TimerService);
  public authService = inject(AuthService);
  public pwaService = inject(PwaService);
  public trackService = inject(ExamTrackService);

  public title = input<string>('Dashboard');
  public toggleMobile = output<void>();

  public isProfileMenuOpen = signal<boolean>(false);
  public showHelpModal = signal<boolean>(false);
  public isDarkMode = signal<boolean>(false);

  constructor() {
    // Check initial dark mode from DOM or localStorage
    if (typeof window !== 'undefined') {
      const isDark = document.documentElement.classList.contains('dark') || localStorage.getItem('preptrack_theme') === 'dark';
      this.isDarkMode.set(isDark);
      if (isDark) {
        document.documentElement.classList.add('dark');
      }
    }
  }

  get userInitial(): string {
    const name = this.authService.currentProfile()?.display_name || this.authService.currentUser()?.email || 'A';
    return name.charAt(0).toUpperCase();
  }

  switchTrack(trackId: any): void {
    this.trackService.setTrack(trackId);
    this.isProfileMenuOpen.set(false);
  }

  toggleTheme(): void {
    const nextDark = !this.isDarkMode();
    this.isDarkMode.set(nextDark);
    if (typeof window !== 'undefined') {
      if (nextDark) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('preptrack_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('preptrack_theme', 'light');
      }
    }
  }

  triggerInstall(): void {
    this.isProfileMenuOpen.set(false);
    this.pwaService.promptInstall();
  }

  signOut(): void {
    this.isProfileMenuOpen.set(false);
    this.authService.signOut();
  }
}
