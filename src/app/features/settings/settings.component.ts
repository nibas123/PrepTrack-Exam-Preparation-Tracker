import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth/auth.service';
import { SupabaseService } from '../../core/services/supabase.service';
import { DataStorageService } from '../../core/services/data-storage.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6 max-w-4xl mx-auto">
      <!-- Header -->
      <div class="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
        <h2 class="text-xl font-bold text-slate-900 tracking-tight">Account & Preparation Settings</h2>
        <p class="text-xs text-slate-500 mt-0.5">Configure your study targets, exam preferences, and database synchronization</p>
      </div>

      <!-- Preparation Targets Card -->
      <div class="card space-y-4">
        <div class="pb-3 border-b border-slate-100">
          <h3 class="text-base font-bold text-slate-900 tracking-tight">Study & Goal Targets</h3>
          <p class="text-xs text-slate-500">Default benchmarks applied to your daily prep routines</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Display Name</label>
            <input
              type="text"
              [(ngModel)]="displayName"
              placeholder="e.g. Rahul Sharma"
              class="input-field"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Timezone</label>
            <input
              type="text"
              [value]="timezone"
              disabled
              class="input-field bg-slate-50 text-slate-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Daily Study Hour Target (Hours)</label>
            <input
              type="number"
              step="0.5"
              min="1"
              max="16"
              [(ngModel)]="dailyTargetHours"
              class="input-field font-bold"
            />
            <p class="text-[11px] text-slate-400 mt-1">Recommended: 4 to 6 hours for banking aspirants</p>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Daily Target Topics (Count)</label>
            <input
              type="number"
              min="1"
              max="15"
              [(ngModel)]="dailyTargetTopics"
              class="input-field font-bold"
            />
            <p class="text-[11px] text-slate-400 mt-1">Number of topics planned per day</p>
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

      <!-- Supabase Connection & Multi-User Architecture Status -->
      <div class="card space-y-4">
        <div class="pb-3 border-b border-slate-100">
          <h3 class="text-base font-bold text-slate-900 tracking-tight">Database & Security Architecture</h3>
          <p class="text-xs text-slate-500">Supabase PostgreSQL connection and Row Level Security status</p>
        </div>

        <!-- Connection Status Banner -->
        <div
          class="p-4 rounded-xl border flex items-start space-x-3.5"
          [ngClass]="supabaseService.isRealSupabaseConfigured ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950' : 'bg-brand-50/80 border-brand-200 text-brand-950'"
        >
          <div class="mt-0.5">
            @if (supabaseService.isRealSupabaseConfigured) {
              <svg class="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            } @else {
              <svg class="w-5 h-5 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          </div>

          <div>
            <h4 class="text-sm font-bold">
              {{ supabaseService.isRealSupabaseConfigured ? 'Connected to Live Supabase Project' : 'Running in Local Demonstration Mode' }}
            </h4>
            <p class="text-xs mt-1 opacity-90 leading-relaxed">
              @if (supabaseService.isRealSupabaseConfigured) {
                All topics, study logs, mock exam attempts, and daily targets are synchronized directly with your Supabase PostgreSQL cluster with Row Level Security.
              } @else {
                PrepTrack is running with full interactive persistence in local storage with the complete Indian Banking Exam catalog. To sync with your remote Supabase cloud database, provide your Supabase URL and Anon Key in <code class="bg-white/80 px-1 py-0.5 rounded font-mono">src/environments/environment.ts</code>.
              }
            </p>
          </div>
        </div>

        <!-- Migration instructions -->
        <div class="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-2">
          <p class="font-bold text-slate-800">Database Schema & Migration File:</p>
          <p>
            The production PostgreSQL schema migration script is located at:
            <code class="block bg-slate-200/80 text-slate-800 px-2 py-1 rounded font-mono mt-1 select-all">
              supabase/migrations/20261010_initial_schema.sql
            </code>
          </p>
          <p>
            It creates all 11 normalized tables, applies Row Level Security (RLS) on each table with user isolation, and seeds the default IBPS & SBI syllabus automatically on signup.
          </p>
        </div>
      </div>

      <!-- Syllabus Catalog Reset -->
      <div class="card p-5 border-rose-200 bg-rose-50/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 class="text-sm font-bold text-rose-900">Re-seed Banking Exam Syllabus</h4>
          <p class="text-xs text-rose-700/80 mt-0.5">Restores standard bank exam topics (Reasoning, Quant, English, GA, Banking Awareness).</p>
        </div>

        <button
          type="button"
          (click)="reseedCatalog()"
          class="btn-outline-danger text-xs py-2 px-3 self-start sm:self-auto"
        >
          Reset & Re-seed
        </button>
      </div>
    </div>
  `
})
export class SettingsComponent implements OnInit {
  public authService = inject(AuthService);
  public supabaseService = inject(SupabaseService);
  private dataStorage = inject(DataStorageService);
  private toast = inject(ToastService);

  public displayName: string = '';
  public timezone: string = 'Asia/Kolkata';
  public dailyTargetHours: number = 4.0;
  public dailyTargetTopics: number = 3;

  ngOnInit(): void {
    const profile = this.authService.currentProfile();
    this.displayName = profile?.display_name || 'Bank Aspirant';
    this.timezone = profile?.timezone || 'Asia/Kolkata';
    this.dailyTargetHours = profile?.daily_target_hours || 4.0;
    this.dailyTargetTopics = profile?.daily_target_topics || 3;
  }

  async saveProfileSettings(): Promise<void> {
    await this.authService.updateProfile(this.displayName, this.dailyTargetHours, this.dailyTargetTopics);
  }

  reseedCatalog(): void {
    if (confirm('Re-seed the default bank exam subjects and topics?')) {
      localStorage.removeItem(`preptrack_${this.authService.currentUser()?.id || 'demo-user-12345'}_initialized`);
      this.dataStorage.ensureInitializedLocalData();
      this.toast.success('Banking syllabus re-seeded successfully!');
    }
  }
}
