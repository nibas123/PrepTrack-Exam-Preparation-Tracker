import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth/auth.service';
import { SupabaseService } from '../../core/services/supabase.service';
import { DataStorageService } from '../../core/services/data-storage.service';
import { ToastService } from '../../core/services/toast.service';
import { WidgetConfigService } from '../../core/services/widget-config.service';
import { DashboardWidgetConfig } from '../../core/models/database.types';
import { RouterModule } from '@angular/router';
import { PwaService } from '../../core/services/pwa.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="space-y-6 max-w-4xl mx-auto">
      <!-- Header -->
      <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-xl font-bold text-slate-900 tracking-tight">Application & Prep Settings</h2>
          <p class="text-xs text-slate-500 mt-0.5">Customize your dashboard widgets, preparation goals, and database connection</p>
        </div>

        <a
          routerLink="/admin"
          class="btn-primary text-xs py-2 px-4 font-semibold bg-purple-600 hover:bg-purple-700 flex items-center space-x-1.5 self-start sm:self-auto shadow-xs"
        >
          <span>🛡️ Admin & AI Console</span>
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </a>
      </div>

      <!-- ADMIN & QUESTION ENGINE CONSOLE SHORTCUT CARD -->
      <div class="card p-5 bg-gradient-to-br from-purple-50/50 via-white to-indigo-50/30 border-purple-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="space-y-1">
          <div class="flex items-center space-x-2">
            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-800">
              Admin & Diagnostics
            </span>
            <span class="text-xs font-bold text-slate-800">Platform Control Center</span>
          </div>
          <h3 class="text-sm font-bold text-slate-950">Question Bank, Algorithmic Patterns & Gemini Tokens</h3>
          <p class="text-xs text-slate-600">
            Monitor the offline question bank, test exam pattern generation speed, and toggle or reapply Gemini AI API tokens.
          </p>
        </div>

        <a
          routerLink="/admin"
          class="btn-primary text-xs py-2 px-4 font-semibold bg-purple-600 hover:bg-purple-700 whitespace-nowrap self-start sm:self-auto shadow-xs flex items-center space-x-1.5"
        >
          <span>Open Admin Console</span>
          <span>→</span>
        </a>
      </div>

      <!-- DASHBOARD WIDGETS CONFIGURATION CARD -->
      <div class="card space-y-4">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 class="text-sm font-bold text-slate-900 tracking-tight">Dashboard Widgets Customization</h3>
            <p class="text-xs text-slate-500">Toggle which cards and panels appear on your preparation dashboard</p>
          </div>

          <button
            type="button"
            (click)="resetWidgets()"
            class="text-xs font-semibold text-brand-600 hover:text-brand-700"
          >
            Reset Defaults
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <!-- Widget 1: Next Exam Banner -->
          <div class="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/60">
            <div>
              <span class="font-bold text-slate-800 block">Upcoming Exam Countdown Banner</span>
              <span class="text-[11px] text-slate-400">Shows urgent days remaining for your next target exam</span>
            </div>
            <input
              type="checkbox"
              [checked]="widgetConfig.config().showNextExamBanner"
              (change)="toggleWidget('showNextExamBanner')"
              class="w-4 h-4 text-brand-600 rounded cursor-pointer"
            />
          </div>

          <!-- Widget 2: Overall Syllabus Card -->
          <div class="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/60">
            <div>
              <span class="font-bold text-slate-800 block">Syllabus Mastery Card</span>
              <span class="text-[11px] text-slate-400">Overall syllabus completion percentage and counters</span>
            </div>
            <input
              type="checkbox"
              [checked]="widgetConfig.config().showSyllabusCard"
              (change)="toggleWidget('showSyllabusCard')"
              class="w-4 h-4 text-brand-600 rounded cursor-pointer"
            />
          </div>

          <!-- Widget 3: Today's Plan Card -->
          <div class="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/60">
            <div>
              <span class="font-bold text-slate-800 block">Today's Topics Plan Card</span>
              <span class="text-[11px] text-slate-400">Daily plan execution count and remaining tasks</span>
            </div>
            <input
              type="checkbox"
              [checked]="widgetConfig.config().showTodayPlanCard"
              (change)="toggleWidget('showTodayPlanCard')"
              class="w-4 h-4 text-brand-600 rounded cursor-pointer"
            />
          </div>

          <!-- Widget 4: Study Time Card -->
          <div class="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/60">
            <div>
              <span class="font-bold text-slate-800 block">Focus Hours Card</span>
              <span class="text-[11px] text-slate-400">Hours recorded today against the daily target</span>
            </div>
            <input
              type="checkbox"
              [checked]="widgetConfig.config().showStudyTimeCard"
              (change)="toggleWidget('showStudyTimeCard')"
              class="w-4 h-4 text-brand-600 rounded cursor-pointer"
            />
          </div>

          <!-- Widget 5: Mock Exam Score Card -->
          <div class="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/60">
            <div>
              <span class="font-bold text-slate-800 block">Mock Exam Average Card</span>
              <span class="text-[11px] text-slate-400">Average score % across all mock attempts</span>
            </div>
            <input
              type="checkbox"
              [checked]="widgetConfig.config().showMockExamCard"
              (change)="toggleWidget('showMockExamCard')"
              class="w-4 h-4 text-brand-600 rounded cursor-pointer"
            />
          </div>

          <!-- Widget 6: Subject Progress Bars -->
          <div class="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/60">
            <div>
              <span class="font-bold text-slate-800 block">Subject-Wise Progress Bars</span>
              <span class="text-[11px] text-slate-400">Detailed subject breakdown with progress bars</span>
            </div>
            <input
              type="checkbox"
              [checked]="widgetConfig.config().showSubjectProgress"
              (change)="toggleWidget('showSubjectProgress')"
              class="w-4 h-4 text-brand-600 rounded cursor-pointer"
            />
          </div>

          <!-- Widget 7: Today's Tasks Checklist -->
          <div class="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/60">
            <div>
              <span class="font-bold text-slate-800 block">Today's Tasks Checklist</span>
              <span class="text-[11px] text-slate-400">Interactive checklist with instant completion toggle</span>
            </div>
            <input
              type="checkbox"
              [checked]="widgetConfig.config().showTodayChecklist"
              (change)="toggleWidget('showTodayChecklist')"
              class="w-4 h-4 text-brand-600 rounded cursor-pointer"
            />
          </div>

          <!-- Widget 8: Weekly Study Trend Bar Chart -->
          <div class="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/60">
            <div>
              <span class="font-bold text-slate-800 block">Last 7 Days Study Trend Chart</span>
              <span class="text-[11px] text-slate-400">Visual bar chart of daily study hours</span>
            </div>
            <input
              type="checkbox"
              [checked]="widgetConfig.config().showWeeklyTrend"
              (change)="toggleWidget('showWeeklyTrend')"
              class="w-4 h-4 text-brand-600 rounded cursor-pointer"
            />
          </div>

          <!-- Widget 9: Upcoming Deadlines -->
          <div class="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/60">
            <div>
              <span class="font-bold text-slate-800 block">Key Deadlines & Milestones</span>
              <span class="text-[11px] text-slate-400">Chronological upcoming deadlines</span>
            </div>
            <input
              type="checkbox"
              [checked]="widgetConfig.config().showUpcomingDeadlines"
              (change)="toggleWidget('showUpcomingDeadlines')"
              class="w-4 h-4 text-brand-600 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>

      <!-- Preparation Targets Card -->
      <div class="card space-y-4">
        <div class="pb-3 border-b border-slate-100">
          <h3 class="text-sm font-bold text-slate-900 tracking-tight">Study & Goal Targets</h3>
          <p class="text-xs text-slate-500">Benchmark values for your preparation routine</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Display Name</label>
            <input
              type="text"
              [(ngModel)]="displayName"
              placeholder="e.g. Rahul Sharma"
              class="input-field"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Timezone</label>
            <input
              type="text"
              [value]="timezone"
              disabled
              class="input-field bg-slate-50 text-slate-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Target Competitive Exam</label>
            <select [(ngModel)]="targetExamName" class="input-field text-xs font-bold">
              <option value="IBPS PO 2026">IBPS PO (Probationary Officer)</option>
              <option value="IBPS Clerk 2026">IBPS Clerk (Customer Support)</option>
              <option value="SBI PO 2026">SBI PO (State Bank of India)</option>
              <option value="SBI Clerk 2026">SBI Clerk (Junior Associates)</option>
              <option value="IBPS RRB Officer Scale-I 2026">IBPS RRB (Regional Rural Banks PO)</option>
              <option value="RBI Grade B Officer 2026">RBI Grade B Officer</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Target Exam Date</label>
            <input
              type="date"
              [(ngModel)]="targetExamDate"
              class="input-field text-xs font-bold"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Daily Study Hour Target (Hours)</label>
            <input
              type="number"
              step="0.5"
              min="1"
              max="16"
              [(ngModel)]="dailyTargetHours"
              class="input-field font-bold"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Daily Target Topics (Count)</label>
            <input
              type="number"
              min="1"
              max="15"
              [(ngModel)]="dailyTargetTopics"
              class="input-field font-bold"
            />
          </div>
        </div>

        <div class="pt-3 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            (click)="saveProfileSettings()"
            class="btn-primary text-xs py-2 px-5 font-semibold"
          >
            Save Targets
          </button>
        </div>
      </div>

      <!-- Live Supabase Connection Banner -->
      <div class="card space-y-4">
        <div class="pb-3 border-b border-slate-100">
          <h3 class="text-sm font-bold text-slate-900 tracking-tight">Supabase PostgreSQL Connection</h3>
          <p class="text-xs text-slate-500">Live PostgreSQL database & Row Level Security status</p>
        </div>

        <div class="p-4 rounded-xl border bg-emerald-50/80 border-emerald-200 text-emerald-950 flex items-start space-x-3.5">
          <svg class="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div class="text-xs">
            <h4 class="font-bold text-emerald-900">Connected to Live Supabase Project</h4>
            <p class="mt-1 font-mono text-[11px] text-emerald-800">
              Endpoint: https://bxzfrusibipifrhukpdx.supabase.co
            </p>
            <p class="mt-1 text-emerald-700">
              All syllabus topics, study logs, mock test attempts, and daily goals are persistent with Row Level Security.
            </p>
          </div>
        </div>
      </div>

      <!-- PWA Status Card -->
      <div class="card p-5 space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
          <div>
            <div class="flex items-center space-x-2 flex-wrap gap-y-1">
              <h4 class="text-sm font-bold text-slate-900">Progressive Web App (PWA)</h4>
              @if (pwaService.isInstalled()) {
                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Installed Standalone
                </span>
              } @else if (pwaService.canInstall()) {
                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Ready to Install
                </span>
              } @else {
                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                  Browser Mode
                </span>
              }

              @if (!pwaService.isOnline()) {
                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                  Offline
                </span>
              } @else {
                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Online
                </span>
              }
            </div>
            <p class="text-xs text-slate-500 mt-1">
              PrepTrack can be installed directly onto your Android, iPhone, Mac, or Windows desktop for standalone full-screen access.
            </p>
          </div>

          <div class="flex items-center space-x-2">
            @if (pwaService.isUpdateAvailable()) {
              <button
                type="button"
                (click)="pwaService.applyUpdate()"
                class="btn-primary text-xs py-2 px-3.5 whitespace-nowrap bg-indigo-600 hover:bg-indigo-700"
              >
                🔄 Apply Update
              </button>
            }

            @if (!pwaService.isInstalled()) {
              <button
                type="button"
                (click)="triggerPwaInstall()"
                class="btn-secondary text-xs py-2 px-3.5 whitespace-nowrap self-start sm:self-auto"
              >
                📱 Install App
              </button>
            } @else {
              <span class="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg">
                ✓ Installed
              </span>
            }
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div class="p-3 rounded-lg bg-slate-50 border border-slate-200/80">
            <span class="font-semibold text-slate-700 block">Offline Cache</span>
            <span class="text-slate-500 text-[11px]">Service Worker v3.0 active with dynamic asset caching</span>
          </div>
          <div class="p-3 rounded-lg bg-slate-50 border border-slate-200/80">
            <span class="font-semibold text-slate-700 block">Display Mode</span>
            <span class="text-slate-500 text-[11px]">{{ pwaService.isInstalled() ? 'Standalone Full Screen' : 'Browser View' }}</span>
          </div>
          <div class="p-3 rounded-lg bg-slate-50 border border-slate-200/80">
            <span class="font-semibold text-slate-700 block">Local Storage</span>
            <span class="text-slate-500 text-[11px]">IndexedDB Offline Sync active</span>
          </div>
        </div>
      </div>
    </div>
  `
})
export class SettingsComponent implements OnInit {
  public authService = inject(AuthService);
  public supabaseService = inject(SupabaseService);
  public widgetConfig = inject(WidgetConfigService);
  public pwaService = inject(PwaService);
  private dataStorage = inject(DataStorageService);
  private toast = inject(ToastService);

  public displayName: string = '';
  public timezone: string = 'Asia/Kolkata';
  public dailyTargetHours: number = 4.0;
  public dailyTargetTopics: number = 3;
  public targetExamName: string = 'IBPS PO 2026';
  public targetExamDate: string = '2026-10-18';

  ngOnInit(): void {
    const profile = this.authService.currentProfile();
    this.displayName = profile?.display_name || 'Bank Aspirant';
    this.timezone = profile?.timezone || 'Asia/Kolkata';
    this.dailyTargetHours = profile?.daily_target_hours || 4.0;
    this.dailyTargetTopics = profile?.daily_target_topics || 3;
    this.targetExamName = profile?.target_exam_name || 'IBPS PO 2026';
    this.targetExamDate = profile?.target_exam_date || '2026-10-18';
  }

  toggleWidget(key: keyof DashboardWidgetConfig): void {
    this.widgetConfig.toggleWidget(key);
    this.toast.info('Dashboard widgets updated');
  }

  resetWidgets(): void {
    this.widgetConfig.resetToDefaults();
    this.toast.info('Restored default dashboard widgets');
  }

  async saveProfileSettings(): Promise<void> {
    await this.authService.updateProfile(
      this.displayName,
      this.dailyTargetHours,
      this.dailyTargetTopics,
      null,
      this.targetExamDate,
      this.targetExamName,
      true
    );
  }

  triggerPwaInstall(): void {
    this.pwaService.promptInstall();
  }
}
