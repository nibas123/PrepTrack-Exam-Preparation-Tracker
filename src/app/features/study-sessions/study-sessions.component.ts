import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TimerService } from '../../core/services/timer.service';
import { DataStorageService } from '../../core/services/data-storage.service';
import { ToastService } from '../../core/services/toast.service';
import {
  Subject,
  Topic,
  StudySession,
} from '../../core/models/database.types';

@Component({
  selector: 'app-study-sessions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
        <div>
          <h2 class="text-xl font-bold text-slate-900 tracking-tight">Study Sessions & Focus Timer</h2>
          <p class="text-xs text-slate-500 mt-0.5">Track focused preparation hours with timestamp-resilient stopwatch</p>
        </div>

        <button
          type="button"
          (click)="openManualModal()"
          class="btn-secondary text-xs py-2 px-3.5 flex items-center space-x-1.5 self-start sm:self-auto"
        >
          <svg class="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>Log Past Session Manually</span>
        </button>
      </div>

      <!-- Main Focus Timer Hero Card -->
      <div class="bg-gradient-to-b from-slate-900 to-slate-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <!-- Background subtle glow -->
        <div class="absolute -right-16 -top-16 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div class="max-w-xl mx-auto flex flex-col items-center text-center">
          <!-- Session Tagging Dropdowns (Only editable when not running) -->
          @if (!timerService.isRunning() && !timerService.activeTimer()) {
            <div class="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              <div>
                <label class="block text-[11px] font-semibold text-slate-400 uppercase text-left mb-1">Subject</label>
                <select
                  [ngModel]="selectedSubjectId()"
                  (ngModelChange)="onSubjectSelect($event)"
                  class="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:ring-brand-500 focus:outline-none"
                >
                  @for (sub of subjects(); track sub.id) {
                    <option [value]="sub.id">{{ sub.name }}</option>
                  }
                </select>
              </div>

              <div>
                <label class="block text-[11px] font-semibold text-slate-400 uppercase text-left mb-1">Topic (Optional)</label>
                <select
                  [ngModel]="selectedTopicId()"
                  (ngModelChange)="selectedTopicId.set($event)"
                  class="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:ring-brand-500 focus:outline-none"
                >
                  <option [ngValue]="null">No specific topic (General)</option>
                  @for (top of filteredTopics(); track top.id) {
                    <option [value]="top.id">{{ top.name }}</option>
                  }
                </select>
              </div>
            </div>
          } @else {
            <!-- Active Subject / Topic Banner -->
            <div class="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/10 text-brand-200 text-xs font-semibold mb-6 border border-white/15">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>Studying: {{ activeSubjectName() }}</span>
              @if (activeTopicName()) {
                <span class="opacity-75">• {{ activeTopicName() }}</span>
              }
            </div>
          }

          <!-- Digital Clock Display -->
          <div class="text-5xl sm:text-7xl font-mono font-black tracking-widest my-4 text-white drop-shadow-sm select-none">
            {{ formattedTimerDisplay() }}
          </div>

          <!-- Status line -->
          <p class="text-xs text-slate-400 mb-6">
            @if (timerService.isRunning()) {
              <span class="text-emerald-400 font-semibold">● Session in progress</span> — Calculating continuously from timestamps
            } @else if (timerService.activeTimer()) {
              <span class="text-amber-400 font-semibold">❚❚ Paused</span> — Click Resume to continue
            } @else {
              Choose subject and start your study stopwatch
            }
          </p>

          <!-- Action Buttons -->
          <div class="flex items-center justify-center space-x-3">
            @if (!timerService.activeTimer()) {
              <!-- Start Timer Button -->
              <button
                type="button"
                (click)="startTimer()"
                class="px-8 py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm shadow-lg shadow-brand-500/30 transition-all transform hover:scale-105 flex items-center space-x-2"
              >
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                </svg>
                <span>Start Session</span>
              </button>
            } @else {
              <!-- Running / Paused controls -->
              @if (timerService.isRunning()) {
                <button
                  type="button"
                  (click)="timerService.pauseTimer()"
                  class="px-6 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-semibold text-xs transition-colors flex items-center space-x-2"
                >
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6" />
                  </svg>
                  <span>Pause</span>
                </button>
              } @else {
                <button
                  type="button"
                  (click)="timerService.resumeTimer()"
                  class="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs transition-colors flex items-center space-x-2"
                >
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  </svg>
                  <span>Resume</span>
                </button>
              }

              <!-- Finish and Save Session -->
              <button
                type="button"
                [disabled]="timerService.isSaving()"
                (click)="finishSession()"
                class="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors flex items-center space-x-2 shadow-md shadow-emerald-600/30 disabled:opacity-50"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Finish & Record</span>
              </button>

              <!-- Discard -->
              <button
                type="button"
                (click)="timerService.discardTimer()"
                class="p-3 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                title="Discard Session"
              >
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            }
          </div>
        </div>
      </div>

      <!-- Quick Metrics Overview -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="card p-4">
          <span class="text-xs font-semibold text-slate-500 uppercase">Today's Total Study Time</span>
          <p class="text-2xl font-black text-slate-900 mt-1">{{ formatHoursMinutes(todayStudySeconds()) }}</p>
          <span class="text-[11px] text-slate-400">Total sessions: {{ todaySessionsCount() }}</span>
        </div>

        <div class="card p-4">
          <span class="text-xs font-semibold text-slate-500 uppercase">Past 7 Days Study Time</span>
          <p class="text-2xl font-black text-slate-900 mt-1">{{ formatHoursMinutes(weeklyStudySeconds()) }}</p>
          <span class="text-[11px] text-slate-400">Avg {{ formatHoursMinutes(weeklyStudySeconds() / 7) }}/day</span>
        </div>

        <div class="card p-4">
          <span class="text-xs font-semibold text-slate-500 uppercase">Total Lifetime Sessions</span>
          <p class="text-2xl font-black text-slate-900 mt-1">{{ sessions().length }}</p>
          <span class="text-[11px] text-slate-400">Recorded study logs</span>
        </div>
      </div>

      <!-- Study Sessions History Table -->
      <div class="card space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 class="text-base font-bold text-slate-900 tracking-tight">Session History</h3>
            <p class="text-xs text-slate-500">Every study session logged to persistent database</p>
          </div>

          <!-- Subject Filter -->
          <div class="w-full sm:w-56">
            <select [ngModel]="historySubjectFilter()" (ngModelChange)="historySubjectFilter.set($event)" class="input-field text-xs py-1.5">
              <option value="all">All Subjects</option>
              @for (sub of subjects(); track sub.id) {
                <option [value]="sub.id">{{ sub.name }}</option>
              }
            </select>
          </div>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead>
              <tr class="border-b border-slate-200 text-slate-400 uppercase font-semibold">
                <th class="py-3 px-3">Date & Time</th>
                <th class="py-3 px-3">Subject</th>
                <th class="py-3 px-3">Topic</th>
                <th class="py-3 px-3">Duration</th>
                <th class="py-3 px-3">Notes</th>
                <th class="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-slate-700">
              @for (sess of filteredSessions(); track sess.id) {
                <tr class="hover:bg-slate-50/80 transition-colors">
                  <td class="py-3 px-3 font-semibold text-slate-900 whitespace-nowrap">
                    {{ sess.started_at | date:'mediumDate' }}
                    <span class="block text-[10px] text-slate-400 font-normal">
                      {{ sess.started_at | date:'shortTime' }}
                    </span>
                  </td>
                  <td class="py-3 px-3 whitespace-nowrap">
                    <span
                      class="inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold text-white"
                      [style.background-color]="sess.subject?.color || '#2563eb'"
                    >
                      {{ sess.subject?.name || 'Subject' }}
                    </span>
                  </td>
                  <td class="py-3 px-3 max-w-xs truncate font-medium">
                    {{ sess.topic?.name || '—' }}
                  </td>
                  <td class="py-3 px-3 font-extrabold text-slate-900 whitespace-nowrap">
                    {{ formatHoursMinutes(sess.duration_seconds) }}
                  </td>
                  <td class="py-3 px-3 max-w-xs text-slate-500 truncate">
                    {{ sess.notes || '—' }}
                  </td>
                  <td class="py-3 px-3 text-right whitespace-nowrap">
                    <button
                      type="button"
                      (click)="deleteSession(sess)"
                      class="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Delete record"
                    >
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </td>
                </tr>
              }

              @if (filteredSessions().length === 0) {
                <tr>
                  <td colspan="6" class="py-10 text-center text-slate-400">
                    No study sessions recorded yet. Start the stopwatch above or log a manual session.
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <!-- MANUAL SESSION ENTRY MODAL -->
      @if (showManualModal()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div class="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <div class="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 class="text-base font-bold text-slate-900">Log Past Study Session</h3>
              <button (click)="showManualModal.set(false)" class="text-slate-400 hover:text-slate-600">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div class="mt-4 space-y-4">
              <div>
                <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Subject *</label>
                <select
                  [ngModel]="manualSubjectId()"
                  (ngModelChange)="onManualSubjectChange($event)"
                  class="input-field"
                >
                  @for (sub of subjects(); track sub.id) {
                    <option [value]="sub.id">{{ sub.name }}</option>
                  }
                </select>
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Topic (Optional)</label>
                <select
                  [ngModel]="manualTopicId()"
                  (ngModelChange)="manualTopicId.set($event)"
                  class="input-field"
                >
                  <option [ngValue]="null">None</option>
                  @for (top of manualTopics(); track top.id) {
                    <option [value]="top.id">{{ top.name }}</option>
                  }
                </select>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Date</label>
                  <input
                    type="date"
                    [ngModel]="manualDate()"
                    (ngModelChange)="manualDate.set($event)"
                    class="input-field text-xs"
                  />
                </div>

                <div>
                  <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Duration (Minutes) *</label>
                  <input
                    type="number"
                    min="5"
                    max="720"
                    [ngModel]="manualDurationMinutes()"
                    (ngModelChange)="manualDurationMinutes.set($event)"
                    class="input-field text-xs font-bold"
                  />
                </div>
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Notes / Description</label>
                <textarea
                  [ngModel]="manualNotes()"
                  (ngModelChange)="manualNotes.set($event)"
                  rows="2"
                  placeholder="e.g. Practiced 50 arithmetic questions from R.S. Aggarwal"
                  class="input-field text-xs"
                ></textarea>
              </div>
            </div>

            <div class="mt-6 flex justify-end space-x-3 pt-3 border-t border-slate-100">
              <button (click)="showManualModal.set(false)" class="btn-secondary text-xs py-2 px-3">Cancel</button>
              <button (click)="saveManualSession()" class="btn-primary text-xs py-2 px-4">Record Session</button>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class StudySessionsComponent implements OnInit {
  public timerService = inject(TimerService);
  private dataStorage = inject(DataStorageService);
  private toast = inject(ToastService);
  private route = inject(ActivatedRoute);

  public subjects = signal<Subject[]>([]);
  public allTopics = signal<Topic[]>([]);
  public sessions = signal<StudySession[]>([]);

  public selectedSubjectId = signal<string>('');
  public selectedTopicId = signal<string | null>(null);
  public historySubjectFilter = signal<string>('all');

  // Manual modal state signals
  public showManualModal = signal<boolean>(false);
  public manualSubjectId = signal<string>('');
  public manualTopicId = signal<string | null>(null);
  public manualDate = signal<string>(new Date().toISOString().split('T')[0]);
  public manualDurationMinutes = signal<number>(60);
  public manualNotes = signal<string>('');

  public filteredTopics = computed(() => {
    const subId = this.selectedSubjectId();
    if (!subId) return [];
    return this.allTopics().filter(t => t.subject_id === subId);
  });

  public manualTopics = computed(() => {
    const subId = this.manualSubjectId();
    if (!subId) return [];
    return this.allTopics().filter(t => t.subject_id === subId);
  });

  public filteredSessions = computed(() => {
    const filter = this.historySubjectFilter();
    if (filter === 'all') return this.sessions();
    return this.sessions().filter(s => s.subject_id === filter);
  });

  public todayStudySeconds = computed(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const start = new Date(todayStr).getTime();
    const end = start + 86400000;
    return this.sessions()
      .filter(s => {
        const t = new Date(s.started_at).getTime();
        return t >= start && t < end;
      })
      .reduce((sum, s) => sum + s.duration_seconds, 0);
  });

  public todaySessionsCount = computed(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const start = new Date(todayStr).getTime();
    const end = start + 86400000;
    return this.sessions().filter(s => {
      const t = new Date(s.started_at).getTime();
      return t >= start && t < end;
    }).length;
  });

  public weeklyStudySeconds = computed(() => {
    const sevenDaysAgo = Date.now() - 7 * 86400000;
    return this.sessions()
      .filter(s => new Date(s.started_at).getTime() >= sevenDaysAgo)
      .reduce((sum, s) => sum + s.duration_seconds, 0);
  });

  public formattedTimerDisplay = computed(() => {
    return this.timerService.formattedElapsed();
  });

  public activeSubjectName = computed(() => {
    const active = this.timerService.activeTimer();
    if (!active) return '';
    const sub = this.subjects().find(s => s.id === active.subjectId);
    return sub?.name || 'Subject';
  });

  public activeTopicName = computed(() => {
    const active = this.timerService.activeTimer();
    if (!active || !active.topicId) return null;
    const top = this.allTopics().find(t => t.id === active.topicId);
    return top?.name || null;
  });

  async ngOnInit(): Promise<void> {
    // Read snapshot query params immediately
    const snap = this.route.snapshot.queryParams;
    if (snap['subjectId']) {
      this.selectedSubjectId.set(snap['subjectId']);
    }
    if (snap['topicId']) {
      this.selectedTopicId.set(snap['topicId']);
    }

    this.route.queryParams.subscribe(params => {
      if (params['subjectId']) {
        this.selectedSubjectId.set(params['subjectId']);
      }
      if (params['topicId']) {
        this.selectedTopicId.set(params['topicId']);
      }
    });

    await this.loadData();
  }

  async loadData(): Promise<void> {
    const [subs, topics, sess] = await Promise.all([
      this.dataStorage.getSubjects(),
      this.dataStorage.getTopics(),
      this.dataStorage.getStudySessions(),
    ]);

    this.subjects.set(subs);
    this.allTopics.set(topics);
    this.sessions.set(sess);

    if (subs.length > 0 && (!this.selectedSubjectId() || !subs.some(s => s.id === this.selectedSubjectId()))) {
      this.selectedSubjectId.set(subs[0].id);
    }
  }

  onSubjectSelect(newSubId: string): void {
    this.selectedSubjectId.set(newSubId);
    this.selectedTopicId.set(null);
  }

  startTimer(): void {
    const subId = this.selectedSubjectId();
    if (!subId) {
      this.toast.error('Please choose a subject');
      return;
    }
    this.timerService.startTimer(subId, this.selectedTopicId());
  }

  async finishSession(): Promise<void> {
    const success = await this.timerService.finishSession();
    if (success) {
      await this.loadData();
    }
  }

  async deleteSession(sess: StudySession): Promise<void> {
    if (confirm('Delete this study session record?')) {
      await this.dataStorage.deleteStudySession(sess.id);
      this.toast.info('Session record deleted');
      await this.loadData();
    }
  }

  openManualModal(): void {
    const subId = this.subjects()[0]?.id || '';
    this.manualSubjectId.set(subId);
    this.manualTopicId.set(null);
    this.manualDate.set(new Date().toISOString().split('T')[0]);
    this.manualDurationMinutes.set(60);
    this.manualNotes.set('');
    this.showManualModal.set(true);
  }

  onManualSubjectChange(newSubId: string): void {
    this.manualSubjectId.set(newSubId);
    this.manualTopicId.set(null);
  }

  async saveManualSession(): Promise<void> {
    const subId = this.manualSubjectId();
    const duration = this.manualDurationMinutes();
    if (!subId || duration <= 0) {
      this.toast.error('Please specify subject and duration in minutes');
      return;
    }

    const durationSeconds = Math.round(duration * 60);
    const dateObj = new Date(this.manualDate());
    const startTime = new Date(dateObj.getTime() + 10 * 3600000); // 10:00 AM on that date
    const endTime = new Date(startTime.getTime() + durationSeconds * 1000);

    await this.dataStorage.saveStudySession({
      subject_id: subId,
      topic_id: this.manualTopicId(),
      started_at: startTime.toISOString(),
      ended_at: endTime.toISOString(),
      duration_seconds: durationSeconds,
      notes: this.manualNotes() || null
    });

    this.toast.success(`Logged ${duration} mins study session!`);
    this.showManualModal.set(false);
    await this.loadData();
  }

  formatHoursMinutes(seconds: number): string {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    if (hrs > 0) return `${hrs}h ${mins}m`;
    if (mins > 0) return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
    if (secs > 0) return `${secs}s`;
    return '0m';
  }
}
