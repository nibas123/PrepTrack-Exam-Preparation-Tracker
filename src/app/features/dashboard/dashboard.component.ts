import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AnalyticsService } from '../../core/services/analytics.service';
import { DataStorageService } from '../../core/services/data-storage.service';
import { TimerService } from '../../core/services/timer.service';
import { ToastService } from '../../core/services/toast.service';
import {
  DashboardSummary,
  SubjectProgress,
  ExamStage,
  DailyGoalTopic,
  ExamEvent,
} from '../../core/models/database.types';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component';
import { ProgressBarComponent } from '../../shared/components/progress-bar/progress-bar.component';
import confetti from 'canvas-confetti';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, StatCardComponent, ProgressBarComponent],
  template: `
    <div class="space-y-6">
      <!-- Top Bar: Exam Stage Switcher & Welcome Banner -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs">
        <div>
          <h2 class="text-xl font-bold text-slate-900 tracking-tight">Banking Exam Prep Headquarters</h2>
          <p class="text-xs text-slate-500 mt-0.5">Track your progress across IBPS PO, SBI PO, and Clerk exams</p>
        </div>

        <!-- Stage Toggle: Prelims vs Mains -->
        <div class="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200/60 self-start sm:self-auto">
          <button
            type="button"
            (click)="switchStage('prelims')"
            class="px-4 py-1.5 text-xs font-bold rounded-lg transition-all"
            [ngClass]="activeStage() === 'prelims' ? 'bg-white text-brand-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'"
          >
            Prelims (3 Subjects)
          </button>
          <button
            type="button"
            (click)="switchStage('mains')"
            class="px-4 py-1.5 text-xs font-bold rounded-lg transition-all"
            [ngClass]="activeStage() === 'mains' ? 'bg-white text-brand-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'"
          >
            Mains (5 Subjects)
          </button>
        </div>
      </div>

      <!-- Urgent Exam Countdown Banner (if upcoming exam exists) -->
      @if (summary()?.nextExam; as exam) {
        <div class="bg-gradient-to-r from-brand-600 to-indigo-700 rounded-2xl p-5 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div class="flex items-center space-x-3.5">
            <div class="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <div class="flex items-center space-x-2">
                <span class="text-xs uppercase tracking-wider font-semibold text-brand-200">Next Upcoming Milestone</span>
                <span class="text-[10px] px-2 py-0.5 rounded-full bg-white/20 text-white font-medium capitalize">{{ exam.status }}</span>
              </div>
              <h3 class="text-lg font-bold mt-0.5">{{ exam.title }}</h3>
              <p class="text-xs text-brand-100">Scheduled on {{ exam.date }}</p>
            </div>
          </div>

          <div class="flex items-center space-x-4 self-end sm:self-auto">
            <div class="text-right">
              <div class="text-3xl font-extrabold tracking-tight">{{ exam.daysRemaining }}</div>
              <div class="text-[10px] uppercase tracking-wider text-brand-200 font-medium">Days Remaining</div>
            </div>
            <a
              routerLink="/exam-calendar"
              class="px-3.5 py-2 rounded-lg bg-white text-brand-700 text-xs font-bold hover:bg-brand-50 transition-colors shadow-sm"
            >
              View Calendar
            </a>
          </div>
        </div>
      }

      <!-- 8 Key Summary Cards Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- 1. Overall Syllabus Progress -->
        <app-stat-card
          title="Syllabus Completed"
          [value]="(summary()?.syllabusCompletionPercentage || 0) + '%'"
          [subtitle]="(summary()?.completedTopics || 0) + ' completed / ' + (summary()?.remainingTopics || 0) + ' remaining'"
          iconBgColor="#eff6ff"
          iconColor="#2563eb"
        >
          <div card-icon>
            <svg class="w-5 h-5 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </app-stat-card>

        <!-- 2. Today's Plan Progress -->
        <app-stat-card
          title="Today's Topics Plan"
          [value]="(summary()?.todayCompletedTopics || 0) + ' / ' + (summary()?.todayPlannedTopics || 0)"
          [subtitle]="((summary()?.todayPlannedTopics || 0) - (summary()?.todayCompletedTopics || 0)) + ' topics left today'"
          iconBgColor="#f0fdf4"
          iconColor="#16a34a"
        >
          <div card-icon>
            <svg class="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
        </app-stat-card>

        <!-- 3. Study Hours Recorded Today -->
        <app-stat-card
          title="Study Time Today"
          [value]="formatStudyTime(summary()?.todayStudySeconds || 0)"
          [subtitle]="'Target: ' + formatStudyTime(summary()?.dailyTargetStudySeconds || 14400)"
          iconBgColor="#fef3c7"
          iconColor="#d97706"
        >
          <div card-icon>
            <svg class="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </app-stat-card>

        <!-- 4. Mock Exams Attended & Avg Score -->
        <app-stat-card
          title="Mock Exams Average"
          [value]="(summary()?.averageMockPercentage || 0) + '%'"
          [subtitle]="(summary()?.totalMockExams || 0) + ' attempts (Best: ' + (summary()?.bestMockPercentage || 0) + '%)'"
          iconBgColor="#f3e8ff"
          iconColor="#7c3aed"
        >
          <div card-icon>
            <svg class="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
        </app-stat-card>
      </div>

      <!-- Main Grid: Subject Progress & Today's Plan -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Subject-Wise Progress (2 Cols) -->
        <div class="lg:col-span-2 card">
          <div class="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 class="text-base font-bold text-slate-900 tracking-tight">Subject-Wise Syllabus Completion</h3>
              <p class="text-xs text-slate-500">Calculated dynamically for {{ activeStage() | uppercase }}</p>
            </div>
            <a routerLink="/syllabus" class="text-xs font-semibold text-brand-600 hover:text-brand-700">Manage Syllabus →</a>
          </div>

          <div class="mt-5 space-y-5">
            @for (sub of subjectProgress(); track sub.subjectId) {
              <div>
                <div class="flex items-center justify-between text-xs mb-1.5">
                  <div class="flex items-center space-x-2">
                    <span class="w-3 h-3 rounded-full" [style.background-color]="sub.subjectColor"></span>
                    <span class="font-bold text-slate-800">{{ sub.subjectName }}</span>
                  </div>
                  <div class="text-slate-500 font-medium">
                    <span class="font-bold text-slate-800">{{ sub.completedTopics }}</span> / {{ sub.totalTopics }} topics
                    <span class="font-bold text-slate-700 ml-1.5">({{ sub.percentage }}%)</span>
                  </div>
                </div>
                <app-progress-bar
                  [percentage]="sub.percentage"
                  [color]="sub.subjectColor"
                  [showLabel]="false"
                  size="md"
                ></app-progress-bar>
              </div>
            }

            @if (subjectProgress().length === 0) {
              <div class="py-8 text-center text-slate-400 text-xs">
                No subjects found for this stage. Add subjects in My Syllabus.
              </div>
            }
          </div>
        </div>

        <!-- Today's Plan Checklist (1 Col) -->
        <div class="card flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 class="text-base font-bold text-slate-900 tracking-tight">Today's Study Plan</h3>
                <p class="text-xs text-slate-500">{{ todayFormatted }}</p>
              </div>
              <a routerLink="/daily-goals" class="text-xs font-semibold text-brand-600 hover:text-brand-700">All Goals →</a>
            </div>

            <!-- Checklist Items -->
            <div class="mt-4 space-y-2.5">
              @for (item of todayTopics(); track item.id) {
                <div
                  class="flex items-start space-x-3 p-2.5 rounded-xl border transition-all"
                  [ngClass]="item.is_completed ? 'bg-emerald-50/60 border-emerald-200' : 'bg-slate-50/70 border-slate-200/80 hover:bg-slate-50'"
                >
                  <input
                    type="checkbox"
                    [checked]="item.is_completed"
                    (change)="toggleTopicCompletion(item)"
                    class="mt-1 w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500 cursor-pointer"
                  />
                  <div class="flex-1 min-w-0">
                    <p
                      class="text-xs font-semibold text-slate-800 leading-snug"
                      [class.line-through]="item.is_completed"
                      [class.text-slate-400]="item.is_completed"
                    >
                      {{ item.topic?.name || 'Topic' }}
                    </p>
                    <span
                      class="inline-block mt-0.5 text-[10px] font-medium px-2 py-0.5 rounded-md text-white"
                      [style.background-color]="item.topic?.subject?.color || '#2563eb'"
                    >
                      {{ item.topic?.subject?.name || 'Subject' }}
                    </span>
                  </div>
                </div>
              }

              @if (todayTopics().length === 0) {
                <div class="py-10 text-center">
                  <div class="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-2">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <p class="text-xs font-medium text-slate-500">No topics planned for today yet.</p>
                  <a
                    routerLink="/daily-goals"
                    class="inline-block mt-3 text-xs font-bold text-brand-600 hover:text-brand-700 bg-brand-50 px-3 py-1.5 rounded-lg border border-brand-200"
                  >
                    + Pick Topics for Today
                  </a>
                </div>
              }
            </div>
          </div>

          <!-- Bottom quick button to start timer -->
          <div class="mt-4 pt-3 border-t border-slate-100">
            <a
              routerLink="/study-sessions"
              class="w-full btn-primary text-xs py-2 flex items-center justify-center space-x-2"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Launch Focus Stopwatch</span>
            </a>
          </div>
        </div>
      </div>

      <!-- Bottom Row: Weekly Study Trend & Upcoming Important Dates -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Weekly Study Breakdown -->
        <div class="card">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 class="text-base font-bold text-slate-900 tracking-tight">Last 7 Days Study Hours</h3>
              <p class="text-xs text-slate-500">Consistent effort builds selection confidence</p>
            </div>
            <a routerLink="/study-sessions" class="text-xs font-semibold text-brand-600 hover:text-brand-700">Study Log →</a>
          </div>

          <div class="mt-6 flex items-end justify-between h-40 pt-4 px-2">
            @for (day of weeklyStats(); track day.date) {
              <div class="flex flex-col items-center flex-1 space-y-2">
                <span class="text-[11px] font-bold text-slate-700">{{ day.hours }}h</span>
                <div class="w-7 sm:w-9 bg-slate-100 rounded-t-lg h-28 relative flex items-end overflow-hidden">
                  <div
                    class="w-full bg-brand-600 rounded-t-lg transition-all duration-500"
                    [style.height.%]="getBarHeight(day.hours)"
                  ></div>
                </div>
                <span class="text-[11px] font-semibold text-slate-500">{{ day.day }}</span>
              </div>
            }
          </div>
        </div>

        <!-- Upcoming Exam Calendar Highlights -->
        <div class="card">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 class="text-base font-bold text-slate-900 tracking-tight">Upcoming Key Deadlines</h3>
              <p class="text-xs text-slate-500">Chronological exam schedule & application dates</p>
            </div>
            <a routerLink="/exam-calendar" class="text-xs font-semibold text-brand-600 hover:text-brand-700">Full Calendar →</a>
          </div>

          <div class="mt-4 space-y-3">
            @for (ev of upcomingEvents(); track ev.id) {
              <div class="flex items-center justify-between p-3 rounded-xl bg-slate-50/70 border border-slate-200/80">
                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 rounded-lg bg-brand-50 text-brand-700 flex items-center justify-center font-bold text-xs border border-brand-200">
                    {{ getEventBadgeIcon(ev.event_type) }}
                  </div>
                  <div>
                    <h4 class="text-xs font-bold text-slate-900">{{ ev.title }}</h4>
                    <p class="text-[11px] text-slate-500">{{ ev.event_date }} ({{ ev.date_status }})</p>
                  </div>
                </div>

                <div class="text-right">
                  <span class="inline-block px-2.5 py-1 rounded-full text-xs font-extrabold bg-brand-100 text-brand-800">
                    {{ getCountdownLabel(ev.event_date) }}
                  </span>
                </div>
              </div>
            }

            @if (upcomingEvents().length === 0) {
              <div class="py-8 text-center text-slate-400 text-xs">
                No future exam events recorded. Add dates in Exam Calendar.
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  private analytics = inject(AnalyticsService);
  private dataStorage = inject(DataStorageService);
  private timerService = inject(TimerService);
  private toast = inject(ToastService);

  public activeStage = signal<ExamStage>('prelims');
  public summary = signal<DashboardSummary | null>(null);
  public subjectProgress = signal<SubjectProgress[]>([]);
  public todayTopics = signal<DailyGoalTopic[]>([]);
  public weeklyStats = signal<{ day: string; date: string; seconds: number; hours: number }[]>([]);
  public upcomingEvents = signal<ExamEvent[]>([]);

  get todayFormatted(): string {
    return new Date().toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }

  async ngOnInit(): Promise<void> {
    await this.loadDashboardData();
  }

  async switchStage(stage: ExamStage): Promise<void> {
    this.activeStage.set(stage);
    await this.loadDashboardData();
  }

  async loadDashboardData(): Promise<void> {
    const stage = this.activeStage();
    const todayStr = new Date().toISOString().split('T')[0];

    const [summaryData, subjectsData, todayData, weeklyData, eventsData] = await Promise.all([
      this.analytics.getDashboardSummary(stage),
      this.analytics.getSubjectProgress(stage),
      this.dataStorage.getDailyGoal(todayStr),
      this.analytics.getWeeklyStudyStats(),
      this.dataStorage.getExamEvents(),
    ]);

    this.summary.set(summaryData);
    this.subjectProgress.set(subjectsData);
    this.todayTopics.set(todayData.topics);
    this.weeklyStats.set(weeklyData);

    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);

    const filteredEvents = eventsData
      .filter(e => {
        const d = new Date(e.event_date);
        d.setHours(0, 0, 0, 0);
        return d.getTime() >= todayDate.getTime();
      })
      .slice(0, 4);

    this.upcomingEvents.set(filteredEvents);
  }

  async toggleTopicCompletion(item: DailyGoalTopic): Promise<void> {
    const newStatus = !item.is_completed;
    await this.dataStorage.toggleGoalTopicCompletion(item.id, newStatus);

    // If marked completed, also advance topic status in syllabus to 'learned'
    if (newStatus && item.topic_id) {
      await this.dataStorage.updateTopicStatus(item.topic_id, 'learned');
      this.toast.success(`Completed "${item.topic?.name || 'Topic'}"!`);
      try {
        confetti({ particleCount: 50, spread: 45, origin: { y: 0.6 } });
      } catch {}
    }

    await this.loadDashboardData();
  }

  formatStudyTime(seconds: number): string {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hrs > 0) return `${hrs}h ${mins}m`;
    return `${mins}m`;
  }

  getBarHeight(hours: number): number {
    const max = 6.0; // 6 hours scale
    return Math.min(100, Math.max(8, Math.round((hours / max) * 100)));
  }

  getCountdownLabel(dateStr: string): string {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const ev = new Date(dateStr);
    ev.setHours(0, 0, 0, 0);
    const diff = Math.round((ev.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (diff === 0) return 'Today!';
    if (diff === 1) return 'Tomorrow';
    return `${diff} days`;
  }

  getEventBadgeIcon(type: string): string {
    switch (type) {
      case 'exam_date': return 'EXAM';
      case 'application_open': return 'APP';
      case 'application_deadline': return 'LAST';
      case 'admit_card': return 'CARD';
      default: return 'DATE';
    }
  }
}
