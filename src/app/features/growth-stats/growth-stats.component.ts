import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { QuizService } from '../../core/services/quiz.service';
import { ToastService } from '../../core/services/toast.service';
import { ManualQuestionLog, QuizAttempt, QuizQuestion } from '../../core/models/database.types';

@Component({
  selector: 'app-growth-stats',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="space-y-6 max-w-6xl mx-auto">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
        <div>
          <div class="flex items-center space-x-2">
            <h2 class="text-xl font-bold text-slate-900 tracking-tight">Question Practice & Growth Analytics</h2>
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              Unified Growth
            </span>
          </div>
          <p class="text-xs text-slate-500 mt-0.5">Comprehensive tracking of questions solved inside quizzes and logged from external books / mocks</p>
        </div>

        <!-- Quick Log Outside Questions Button -->
        <button
          type="button"
          (click)="openLogModal.set(true)"
          class="btn-primary text-xs py-2 px-4 font-bold flex items-center space-x-1.5 shadow-xs"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>+ Log Outside Practice</span>
        </button>
      </div>

      <!-- Top KPI Metric Cards (In-App + Outside Practice Combined) -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Total Questions Solved -->
        <div class="card p-4 space-y-1">
          <div class="flex items-center justify-between text-slate-500">
            <span class="text-xs font-semibold">Total Solved</span>
            <div class="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p class="text-2xl font-black text-slate-900">{{ totalQuestionsSolved() }}</p>
          <div class="flex items-center space-x-2 text-[11px] text-slate-500">
            <span>{{ inAppQuestionsCount() }} in-app</span>
            <span>•</span>
            <span class="text-indigo-600 font-semibold">{{ outsideQuestionsCount() }} outside</span>
          </div>
        </div>

        <!-- Overall Accuracy -->
        <div class="card p-4 space-y-1">
          <div class="flex items-center justify-between text-slate-500">
            <span class="text-xs font-semibold">Overall Accuracy</span>
            <div class="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
          <p class="text-2xl font-black text-emerald-600">{{ overallAccuracy() }}%</p>
          <p class="text-[11px] text-slate-500">{{ totalCorrectSolved() }} correct / {{ totalQuestionsSolved() }} attempted</p>
        </div>

        <!-- Mastered Questions in Bank -->
        <div class="card p-4 space-y-1">
          <div class="flex items-center justify-between text-slate-500">
            <span class="text-xs font-semibold">Mastered Questions</span>
            <div class="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
          </div>
          <p class="text-2xl font-black text-amber-600">{{ masteredQuestionsCount() }}</p>
          <p class="text-[11px] text-slate-500">Correctly solved 2+ times (Retired)</p>
        </div>

        <!-- External Time Invested -->
        <div class="card p-4 space-y-1">
          <div class="flex items-center justify-between text-slate-500">
            <span class="text-xs font-semibold">Outside Study Logged</span>
            <div class="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p class="text-2xl font-black text-slate-800">{{ totalOutsideMinutes() }}m</p>
          <p class="text-[11px] text-slate-500">Across {{ manualLogs().length }} external sessions</p>
        </div>
      </div>

      <!-- Sectional Growth Breakdown & Part Analysis -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Subject & Section Part Growth (2 Cols) -->
        <div class="card p-5 lg:col-span-2 space-y-5">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 class="text-sm font-bold text-slate-900">Performance by Subject & Section Part</h3>
              <p class="text-[11px] text-slate-500">Track volume and accuracy across Arithmetic, DI, Puzzles, Grammar, and GA</p>
            </div>
          </div>

          <!-- Subjects Progress Bars -->
          <div class="space-y-4">
            @for (subj of subjectStats(); track subj.name) {
              <div class="space-y-1.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div class="flex items-center justify-between text-xs">
                  <div class="flex items-center space-x-2">
                    <span class="w-2.5 h-2.5 rounded-full" [style.background-color]="subj.color"></span>
                    <span class="font-bold text-slate-800">{{ subj.name }}</span>
                    <span class="text-[10px] px-1.5 py-0.2 rounded bg-white border border-slate-200 text-slate-500">
                      {{ subj.total }} questions
                    </span>
                  </div>
                  <div class="font-bold" [ngClass]="subj.accuracy >= 70 ? 'text-emerald-600' : (subj.accuracy >= 50 ? 'text-amber-600' : 'text-rose-600')">
                    {{ subj.accuracy }}% Accuracy
                  </div>
                </div>

                <!-- Progress Bar -->
                <div class="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    class="h-full rounded-full transition-all duration-500"
                    [style.width.%]="subj.accuracy"
                    [style.background-color]="subj.color"
                  ></div>
                </div>

                <div class="flex justify-between text-[10px] text-slate-500 pt-0.5">
                  <span>{{ subj.correct }} Correct</span>
                  <span>{{ subj.incorrect }} Mistakes / Review Needed</span>
                </div>
              </div>
            }
          </div>

          <!-- Section Part Breakdown Pills -->
          <div class="pt-2">
            <h4 class="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">Specific Section Part Volume</h4>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              @for (part of sectionPartStats(); track part.name) {
                <div class="p-2.5 rounded-xl border border-slate-100 bg-white shadow-2xs flex flex-col justify-between">
                  <span class="font-semibold text-slate-800 text-[11px] truncate">{{ part.name }}</span>
                  <div class="flex items-baseline justify-between mt-1">
                    <span class="text-base font-black text-slate-900">{{ part.count }}</span>
                    <span class="text-[10px] font-bold" [ngClass]="part.accuracy >= 70 ? 'text-emerald-600' : 'text-slate-500'">
                      {{ part.accuracy }}%
                    </span>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>

        <!-- Outside Practice Source Breakdown (Right Col) -->
        <div class="card p-5 space-y-4">
          <div class="pb-3 border-b border-slate-100">
            <h3 class="text-sm font-bold text-slate-900">External Practice Sources</h3>
            <p class="text-[11px] text-slate-500">Where you practiced questions outside</p>
          </div>

          <div class="space-y-3">
            @for (src of sourceBreakdown(); track src.label) {
              <div class="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <div class="flex items-center space-x-2.5">
                  <span class="text-base">{{ src.icon }}</span>
                  <div>
                    <span class="font-bold text-slate-800 block leading-tight">{{ src.label }}</span>
                    <span class="text-[10px] text-slate-400">{{ src.sessions }} log entries</span>
                  </div>
                </div>
                <div class="text-right">
                  <span class="font-black text-slate-900 block leading-tight">{{ src.totalQuestions }}</span>
                  <span class="text-[10px] text-slate-400">questions</span>
                </div>
              </div>
            }
            @if (sourceBreakdown().length === 0) {
              <div class="text-center py-8 text-slate-400 text-xs">
                No outside questions logged yet.<br>Click <strong>+ Log Outside Practice</strong> to start tracking!
              </div>
            }
          </div>
        </div>
      </div>

      <!-- External Practice History Logs Table -->
      <div class="card p-5 space-y-4">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 class="text-sm font-bold text-slate-900">Logged Outside Practice Entries</h3>
            <p class="text-[11px] text-slate-500">All questions solved from offline books, mock series, and coaching material</p>
          </div>
          <span class="text-xs font-bold text-slate-400">
            {{ manualLogs().length }} Records
          </span>
        </div>

        @if (manualLogs().length === 0) {
          <div class="text-center py-10 text-slate-400 text-xs">
            No outside question logs recorded yet. You can log anytime using the button above.
          </div>
        } @else {
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs text-slate-600">
              <thead class="bg-slate-50 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-100">
                <tr>
                  <th class="py-2.5 px-3">Date</th>
                  <th class="py-2.5 px-3">Subject / Topic</th>
                  <th class="py-2.5 px-3">Part Type</th>
                  <th class="py-2.5 px-3">Source</th>
                  <th class="py-2.5 px-3">Questions (Correct/Total)</th>
                  <th class="py-2.5 px-3">Accuracy</th>
                  <th class="py-2.5 px-3">Notes</th>
                  <th class="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                @for (entry of manualLogs(); track entry.id) {
                  <tr class="hover:bg-slate-50/50">
                    <td class="py-3 px-3 font-medium text-slate-700 whitespace-nowrap">
                      {{ entry.logged_at | date:'mediumDate' }}
                    </td>
                    <td class="py-3 px-3">
                      <span class="font-bold text-slate-800 block">{{ entry.subject_name }}</span>
                      <span class="text-[10px] text-slate-400">{{ entry.topic_name }}</span>
                    </td>
                    <td class="py-3 px-3">
                      <span class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        {{ entry.section_part }}
                      </span>
                    </td>
                    <td class="py-3 px-3 font-semibold text-slate-700">
                      {{ formatSource(entry.source_type) }}
                    </td>
                    <td class="py-3 px-3 font-mono font-bold">
                      <span class="text-emerald-600">{{ entry.correct_count }}</span>
                      <span class="text-slate-400"> / </span>
                      <span class="text-slate-900">{{ entry.questions_count }}</span>
                    </td>
                    <td class="py-3 px-3 font-bold" [ngClass]="(entry.correct_count / entry.questions_count) >= 0.7 ? 'text-emerald-600' : 'text-amber-600'">
                      {{ Math.round((entry.correct_count / (entry.questions_count || 1)) * 100) }}%
                    </td>
                    <td class="py-3 px-3 text-[11px] text-slate-500 max-w-xs truncate">
                      {{ entry.notes || '—' }}
                    </td>
                    <td class="py-3 px-3 text-right">
                      <button
                        type="button"
                        (click)="deleteEntry(entry.id)"
                        class="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                        title="Delete log"
                      >
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </div>

      <!-- MODAL: LOG OUTSIDE PRACTICE QUESTIONS -->
      @if (openLogModal()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
          <div class="bg-white rounded-2xl border border-slate-200/90 shadow-xl max-w-lg w-full p-6 space-y-4">
            <div class="flex items-center justify-between pb-3 border-b border-slate-100">
              <div class="flex items-center space-x-2">
                <span class="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-bold">
                  📝
                </span>
                <h3 class="text-base font-bold text-slate-900">Log Outside Practice Questions</h3>
              </div>
              <button
                type="button"
                (click)="openLogModal.set(false)"
                class="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div class="space-y-3.5 text-xs">
              <!-- Subject -->
              <div>
                <label class="block font-bold text-slate-700 uppercase tracking-wider mb-1">Subject</label>
                <select
                  [(ngModel)]="newLog.subject_name"
                  class="w-full p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-brand-500 font-semibold"
                >
                  <option value="Quantitative Aptitude">Quantitative Aptitude</option>
                  <option value="Reasoning Ability">Reasoning Ability</option>
                  <option value="English Language">English Language</option>
                  <option value="General & Banking Awareness">General & Banking Awareness</option>
                  <option value="Computer Aptitude">Computer Aptitude</option>
                </select>
              </div>

              <!-- Section Part -->
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block font-bold text-slate-700 uppercase tracking-wider mb-1">Section Part Type</label>
                  <select
                    [(ngModel)]="newLog.section_part"
                    class="w-full p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-brand-500 font-semibold"
                  >
                    <option value="Arithmetic">Arithmetic</option>
                    <option value="DI">Data Interpretation (DI)</option>
                    <option value="Puzzles">Puzzles</option>
                    <option value="Seating Arrangement">Seating Arrangement</option>
                    <option value="Grammar">Grammar & Error Spotting</option>
                    <option value="Reading Comprehension">Reading Comprehension</option>
                    <option value="Static Banking">Static Banking & RBI</option>
                    <option value="Current Affairs">Current Affairs</option>
                    <option value="Computer">Computer Knowledge</option>
                    <option value="General">General / Mixed</option>
                  </select>
                </div>

                <!-- Topic Name -->
                <div>
                  <label class="block font-bold text-slate-700 uppercase tracking-wider mb-1">Topic Name (Optional)</label>
                  <input
                    type="text"
                    [(ngModel)]="newLog.topic_name"
                    placeholder="e.g. Syllogism, Floor Puzzle"
                    class="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>
              </div>

              <!-- Source Type -->
              <div>
                <label class="block font-bold text-slate-700 uppercase tracking-wider mb-1">Practice Source</label>
                <select
                  [(ngModel)]="newLog.source_type"
                  class="w-full p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-brand-500 font-semibold"
                >
                  <option value="offline_book">Offline Book (RS Aggarwal / Adda247 / Arun Sharma)</option>
                  <option value="mock_platform">Other Mock Test Platform (Testbook / Oliveboard)</option>
                  <option value="coaching_class">Coaching Class Assignment / DPP</option>
                  <option value="newspaper">The Hindu / Indian Express Editorial</option>
                  <option value="telegram_quiz">Telegram / WhatsApp Quiz</option>
                  <option value="other">Other Outside Source</option>
                </select>
              </div>

              <!-- Question Numbers: Total vs Correct -->
              <div class="grid grid-cols-3 gap-3">
                <div>
                  <label class="block font-bold text-slate-700 uppercase tracking-wider mb-1">Total Solved</label>
                  <input
                    type="number"
                    min="1"
                    [(ngModel)]="newLog.questions_count"
                    class="w-full p-2.5 rounded-xl border border-slate-200 font-mono font-bold focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label class="block font-bold text-slate-700 uppercase tracking-wider mb-1">Correct Count</label>
                  <input
                    type="number"
                    min="0"
                    [max]="newLog.questions_count || 100"
                    [(ngModel)]="newLog.correct_count"
                    class="w-full p-2.5 rounded-xl border border-slate-200 font-mono font-bold text-emerald-600 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label class="block font-bold text-slate-700 uppercase tracking-wider mb-1">Time (Minutes)</label>
                  <input
                    type="number"
                    min="1"
                    [(ngModel)]="newLog.time_spent_minutes"
                    class="w-full p-2.5 rounded-xl border border-slate-200 font-mono focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>
              </div>

              <!-- Notes -->
              <div>
                <label class="block font-bold text-slate-700 uppercase tracking-wider mb-1">Notes / Key Takeaways</label>
                <input
                  type="text"
                  [(ngModel)]="newLog.notes"
                  placeholder="e.g. struggled on 3-variable puzzle conditions"
                  class="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>
            </div>

            <!-- Modal Actions -->
            <div class="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                (click)="openLogModal.set(false)"
                class="btn-secondary text-xs py-2 px-4"
              >
                Cancel
              </button>
              <button
                type="button"
                (click)="submitLog()"
                class="btn-primary text-xs py-2 px-5 font-bold shadow-xs"
              >
                Save Practice Log
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class GrowthStatsComponent implements OnInit {
  private quizService = inject(QuizService);
  private toast = inject(ToastService);

  public Math = Math;

  public inAppAttempts = signal<QuizAttempt[]>([]);
  public manualLogs = signal<ManualQuestionLog[]>([]);
  public questionBank = signal<QuizQuestion[]>([]);

  public openLogModal = signal<boolean>(false);

  public newLog: Partial<ManualQuestionLog> = {
    subject_name: 'Quantitative Aptitude',
    topic_name: '',
    section_part: 'Arithmetic',
    source_type: 'offline_book',
    questions_count: 10,
    correct_count: 8,
    time_spent_minutes: 15,
    notes: '',
    logged_at: new Date().toISOString()
  };

  async ngOnInit(): Promise<void> {
    await this.refreshData();
  }

  async refreshData(): Promise<void> {
    const [attempts, logs] = await Promise.all([
      this.quizService.getQuizAttempts(),
      this.quizService.getManualQuestionLogs()
    ]);
    this.inAppAttempts.set(attempts);
    this.manualLogs.set(logs);
    this.questionBank.set(this.quizService.getStoredQuestionBank());
  }

  // --- COMPUTED AGGREGATES ---
  public inAppQuestionsCount = computed(() => {
    return this.inAppAttempts().reduce((acc, curr) => acc + (curr.total_questions || 0), 0);
  });

  public outsideQuestionsCount = computed(() => {
    return this.manualLogs().reduce((acc, curr) => acc + (curr.questions_count || 0), 0);
  });

  public totalQuestionsSolved = computed(() => {
    return this.inAppQuestionsCount() + this.outsideQuestionsCount();
  });

  public inAppCorrectCount = computed(() => {
    return this.inAppAttempts().reduce((acc, curr) => acc + (curr.correct_answers || 0), 0);
  });

  public outsideCorrectCount = computed(() => {
    return this.manualLogs().reduce((acc, curr) => acc + (curr.correct_count || 0), 0);
  });

  public totalCorrectSolved = computed(() => {
    return this.inAppCorrectCount() + this.outsideCorrectCount();
  });

  public overallAccuracy = computed(() => {
    const total = this.totalQuestionsSolved();
    if (total === 0) return 0;
    return Math.round((this.totalCorrectSolved() / total) * 100);
  });

  public masteredQuestionsCount = computed(() => {
    return this.questionBank().filter(q => (q.correct_count || 0) >= 2).length;
  });

  public totalOutsideMinutes = computed(() => {
    return this.manualLogs().reduce((acc, curr) => acc + (curr.time_spent_minutes || 0), 0);
  });

  // --- BREAKDOWNS ---
  public subjectStats = computed(() => {
    const subjects = [
      { name: 'Quantitative Aptitude', color: '#3b82f6' },
      { name: 'Reasoning Ability', color: '#8b5cf6' },
      { name: 'English Language', color: '#10b981' },
      { name: 'General & Banking Awareness', color: '#f59e0b' },
      { name: 'Computer Aptitude', color: '#06b6d4' }
    ];

    return subjects.map(sub => {
      // In-app matches
      const subInApp = this.inAppAttempts().filter(a => {
        const top = (a.topic_name || '').toLowerCase();
        const sId = (a.subject_id || '').toLowerCase();
        return top.includes(sub.name.toLowerCase()) || sId.includes(sub.name.toLowerCase());
      });
      const inAppTotal = subInApp.reduce((acc, c) => acc + c.total_questions, 0);
      const inAppCorrect = subInApp.reduce((acc, c) => acc + c.correct_answers, 0);

      // Outside matches
      const subOutside = this.manualLogs().filter(m => m.subject_name === sub.name);
      const outTotal = subOutside.reduce((acc, c) => acc + c.questions_count, 0);
      const outCorrect = subOutside.reduce((acc, c) => acc + c.correct_count, 0);

      const total = inAppTotal + outTotal;
      const correct = inAppCorrect + outCorrect;
      const incorrect = Math.max(0, total - correct);
      const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

      return {
        name: sub.name,
        color: sub.color,
        total,
        correct,
        incorrect,
        accuracy
      };
    });
  });

  public sectionPartStats = computed(() => {
    const parts = [
      'Arithmetic', 'DI', 'Puzzles', 'Seating Arrangement',
      'Grammar', 'Reading Comprehension', 'Static Banking', 'Current Affairs', 'Computer'
    ];

    return parts.map(p => {
      const logs = this.manualLogs().filter(l => l.section_part === p);
      const count = logs.reduce((acc, c) => acc + c.questions_count, 0);
      const correct = logs.reduce((acc, c) => acc + c.correct_count, 0);
      const accuracy = count > 0 ? Math.round((correct / count) * 100) : 0;
      return { name: p, count, accuracy };
    });
  });

  public sourceBreakdown = computed(() => {
    const map = new Map<string, { totalQuestions: number; sessions: number }>();
    for (const log of this.manualLogs()) {
      const current = map.get(log.source_type) || { totalQuestions: 0, sessions: 0 };
      current.totalQuestions += log.questions_count;
      current.sessions += 1;
      map.set(log.source_type, current);
    }

    const icons: Record<string, string> = {
      offline_book: '📚',
      mock_platform: '💻',
      coaching_class: '🏫',
      newspaper: '📰',
      telegram_quiz: '💬',
      other: '✏️'
    };

    return Array.from(map.entries()).map(([key, val]) => ({
      label: this.formatSource(key),
      icon: icons[key] || '📋',
      totalQuestions: val.totalQuestions,
      sessions: val.sessions
    }));
  });

  formatSource(src: string): string {
    const names: Record<string, string> = {
      offline_book: 'Offline Book',
      mock_platform: 'Mock Platform',
      coaching_class: 'Coaching / DPP',
      newspaper: 'Newspaper / Editorial',
      telegram_quiz: 'Telegram Quiz',
      other: 'Other'
    };
    return names[src] || src;
  }

  async submitLog(): Promise<void> {
    if (!this.newLog.questions_count || this.newLog.questions_count <= 0) {
      this.toast.error('Please enter a valid questions count.');
      return;
    }

    try {
      await this.quizService.saveManualQuestionLog(this.newLog);
      this.toast.success(`Logged ${this.newLog.questions_count} questions successfully!`);
      this.openLogModal.set(false);
      await this.refreshData();

      // Reset
      this.newLog = {
        subject_name: 'Quantitative Aptitude',
        topic_name: '',
        section_part: 'Arithmetic',
        source_type: 'offline_book',
        questions_count: 10,
        correct_count: 8,
        time_spent_minutes: 15,
        notes: '',
        logged_at: new Date().toISOString()
      };
    } catch {
      this.toast.error('Failed to save practice log.');
    }
  }

  async deleteEntry(id: string): Promise<void> {
    if (confirm('Are you sure you want to delete this practice log?')) {
      await this.quizService.deleteManualQuestionLog(id);
      this.toast.info('Log entry removed.');
      await this.refreshData();
    }
  }
}
