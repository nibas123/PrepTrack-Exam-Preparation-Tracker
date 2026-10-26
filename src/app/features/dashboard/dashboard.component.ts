import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AnalyticsService } from '../../core/services/analytics.service';
import { DataStorageService } from '../../core/services/data-storage.service';
import { TimerService } from '../../core/services/timer.service';
import { ToastService } from '../../core/services/toast.service';
import { WidgetConfigService } from '../../core/services/widget-config.service';
import {
  DashboardSummary,
  SubjectProgress,
  ExamStage,
  DailyGoalTopic,
  ExamEvent,
} from '../../core/models/database.types';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component';
import { ProgressBarComponent } from '../../shared/components/progress-bar/progress-bar.component';
import { ExamTrackService } from '../../core/services/exam-track.service';
import confetti from 'canvas-confetti';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, StatCardComponent, ProgressBarComponent],
  template: `
    <div class="space-y-6 max-w-6xl mx-auto">
      <!-- Clean Top Bar: Exam Stage Switcher & Widget Settings Shortcut -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div class="flex items-center space-x-2.5">
            <h2 class="text-xl font-bold text-slate-900 tracking-tight flex items-center space-x-2">
              @if (examTrack.isKeralaHca()) {
                <svg class="w-5 h-5 text-court-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>
                <span>Kerala High Court Assistant</span>
              } @else if (examTrack.isBank()) {
                <svg class="w-5 h-5 text-brand-900" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                <span>Banking Prep Dashboard</span>
              } @else {
                <svg class="w-5 h-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                <span>Multi-Exam Preparation Dashboard</span>
              }
            </h2>
            <span class="w-2 h-2 rounded-full bg-emerald-500" title="Live Synced"></span>
            @if (examTrack.isKeralaHca()) {
              <a
                routerLink="/kerala-high-court"
                class="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-court-50 text-court-800 border border-court-200 hover:bg-court-100 transition-colors flex items-center space-x-1"
              >
                <span>HCA Portal</span>
                <span>→</span>
              </a>
            }
          </div>
          <p class="text-xs text-slate-500 mt-0.5">
            @if (examTrack.isKeralaHca()) {
              High Court of Kerala: Objective (100M, 75m), Descriptive English (60M) & Viva
            } @else if (examTrack.isBank()) {
              Track your readiness for IBPS PO, SBI PO, and Clerk examinations
            } @else {
              Unified readiness tracking across Banking Exams & Kerala High Court Assistant
            }
          </p>
        </div>

        <div class="flex items-center space-x-2.5">
          <!-- Stage Switcher: Dynamic based on Track -->
          <div class="inline-flex p-1 bg-slate-100/80 rounded-xl border border-slate-200/50">
            @if (examTrack.isKeralaHca()) {
              <button
                type="button"
                (click)="switchStage('objective')"
                class="px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all"
                [ngClass]="activeStage() === 'objective' ? 'bg-white text-brand-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'"
              >
                Objective (100M)
              </button>
              <button
                type="button"
                (click)="switchStage('descriptive')"
                class="px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all"
                [ngClass]="activeStage() === 'descriptive' ? 'bg-white text-brand-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'"
              >
                Descriptive (60M)
              </button>
            } @else if (examTrack.isBank()) {
              <button
                type="button"
                (click)="switchStage('prelims')"
                class="px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all"
                [ngClass]="activeStage() === 'prelims' ? 'bg-white text-brand-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'"
              >
                Prelims
              </button>
              <button
                type="button"
                (click)="switchStage('mains')"
                class="px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all"
                [ngClass]="activeStage() === 'mains' ? 'bg-white text-brand-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'"
              >
                Mains
              </button>
            } @else {
              <button
                type="button"
                (click)="switchStage('both')"
                class="px-3 py-1.5 text-xs font-bold rounded-lg transition-all"
                [ngClass]="activeStage() === 'both' ? 'bg-white text-brand-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'"
              >
                All
              </button>
              <button
                type="button"
                (click)="switchStage('prelims')"
                class="px-3 py-1.5 text-xs font-bold rounded-lg transition-all"
                [ngClass]="activeStage() === 'prelims' ? 'bg-white text-brand-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'"
              >
                Prelims / Obj
              </button>
              <button
                type="button"
                (click)="switchStage('mains')"
                class="px-3 py-1.5 text-xs font-bold rounded-lg transition-all"
                [ngClass]="activeStage() === 'mains' ? 'bg-white text-brand-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'"
              >
                Mains / Desc
              </button>
            }
          </div>

          <!-- Configure Widgets Shortcut -->
          <a
            routerLink="/settings"
            class="p-2 text-slate-400 hover:text-slate-700 rounded-xl border border-slate-200/70 hover:bg-slate-50 transition-colors"
            title="Configure Dashboard Widgets"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            </svg>
          </a>
        </div>
      </div>

      <!-- WIDGET 1: Urgent Exam Countdown Banner -->
      @if (widgetConfig.config().showNextExamBanner && summary()?.nextExam; as exam) {
        <div class="rounded-2xl p-5 text-white shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
             [ngClass]="examTrack.isKeralaHca() ? 'bg-court-900 border border-court-800' : 'bg-brand-900 border border-brand-800'">
          <div class="flex items-center space-x-3.5">
            <div class="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center text-white border border-white/15">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <div class="flex items-center space-x-2">
                <span class="text-[10px] uppercase tracking-wider font-semibold text-slate-300">Next Target Milestone</span>
                <span class="text-[10px] px-2 py-0.5 rounded bg-white/15 text-white font-medium capitalize">{{ exam.status }}</span>
              </div>
              <h3 class="text-base font-bold mt-0.5">{{ exam.title }}</h3>
              <p class="text-xs text-slate-300">Target examination date: {{ exam.date }}</p>
            </div>
          </div>

          <div class="flex items-center space-x-4 self-end sm:self-auto">
            <div class="text-right">
              <div class="text-2xl font-black tracking-tight">{{ exam.daysRemaining }}</div>
              <div class="text-[10px] uppercase tracking-wider text-slate-300 font-semibold">Days Remaining</div>
            </div>
            <a
              routerLink="/exam-calendar"
              class="px-3.5 py-1.5 rounded-lg bg-white text-slate-900 text-xs font-semibold hover:bg-slate-100 transition-colors shadow-2xs flex items-center space-x-1"
            >
              <span>View Deadlines</span>
              <span>→</span>
            </a>
          </div>
        </div>
      }

      <!-- WIDGETS: Configurable Key Metrics Cards Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <!-- Syllabus Progress Card -->
        @if (widgetConfig.config().showSyllabusCard) {
          <app-stat-card
            title="Syllabus Mastery"
            [value]="(summary()?.syllabusCompletionPercentage || 0) + '%'"
            [subtitle]="(summary()?.completedTopics || 0) + ' done / ' + (summary()?.remainingTopics || 0) + ' remaining'"
            iconBgColor="#eff6ff"
            iconColor="#2563eb"
          >
            <div card-icon>
              <svg class="w-5 h-5 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </app-stat-card>
        }

        <!-- Today's Plan Progress Card -->
        @if (widgetConfig.config().showTodayPlanCard) {
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
        }

        <!-- Study Time Card -->
        @if (widgetConfig.config().showStudyTimeCard) {
          <app-stat-card
            title="Focus Hours Today"
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
        }

        <!-- Study Streak Card -->
        <app-stat-card
          title="Daily Study Streak"
          [value]="studyStreak() + ' Days'"
          [subtitle]="studyStreak() > 0 ? 'Consistency unlocked! Keep going' : 'Log a session today to start streak'"
          iconBgColor="#fff1f2"
          iconColor="#e11d48"
        >
          <div card-icon>
            <svg class="w-5 h-5 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
            </svg>
          </div>
        </app-stat-card>
      </div>

      <!-- Main Columns: Subject Progress & Today's Checklist -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Subject Progress (2 cols) -->
        @if (widgetConfig.config().showSubjectProgress) {
          <div
            class="card"
            [ngClass]="widgetConfig.config().showTodayChecklist ? 'lg:col-span-2' : 'lg:col-span-3'"
          >
            <div class="flex items-center justify-between pb-3.5 border-b border-slate-100">
              <div>
                <h3 class="text-sm font-bold text-slate-900 tracking-tight">Subject-Wise Completion</h3>
                <p class="text-xs text-slate-500">Calculated for {{ activeStage() | uppercase }}</p>
              </div>
              <a routerLink="/syllabus" class="text-xs font-semibold text-brand-600 hover:text-brand-700">Open Syllabus →</a>
            </div>

            <div class="mt-4 space-y-4">
              @for (sub of subjectProgress(); track sub.subjectId) {
                <div>
                  <div class="flex items-center justify-between text-xs mb-1.5">
                    <div class="flex items-center space-x-2">
                      <span class="w-2.5 h-2.5 rounded-full" [style.background-color]="sub.subjectColor"></span>
                      <span class="font-bold text-slate-800">{{ sub.subjectName }}</span>
                    </div>
                    <div class="text-slate-500 font-medium">
                      <span class="font-bold text-slate-800">{{ sub.completedTopics }}</span> / {{ sub.totalTopics }} topics
                      <span class="font-bold text-slate-700 ml-1">({{ sub.percentage }}%)</span>
                    </div>
                  </div>
                  <app-progress-bar
                    [percentage]="sub.percentage"
                    [color]="sub.subjectColor"
                    [showLabel]="false"
                    size="sm"
                  ></app-progress-bar>
                </div>
              }
            </div>
          </div>
        }

        <!-- Today's Plan Checklist -->
        @if (widgetConfig.config().showTodayChecklist) {
          <div
            class="card flex flex-col justify-between"
            [ngClass]="widgetConfig.config().showSubjectProgress ? 'lg:col-span-1' : 'lg:col-span-3'"
          >
            <div>
              <div class="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 class="text-sm font-bold text-slate-900 tracking-tight">Today's Tasks</h3>
                  <p class="text-xs text-slate-500">{{ todayFormatted }}</p>
                </div>
                <a routerLink="/daily-goals" class="text-xs font-semibold text-brand-600 hover:text-brand-700">Goals →</a>
              </div>

              <!-- Checklist -->
              <div class="mt-3 space-y-2">
                @for (item of todayTopics(); track item.id) {
                  <div
                    class="flex items-center space-x-2.5 p-2 rounded-xl border transition-all text-xs"
                    [ngClass]="item.is_completed ? 'bg-emerald-50/60 border-emerald-200' : 'bg-slate-50/70 border-slate-200/70'"
                  >
                    <input
                      type="checkbox"
                      [checked]="item.is_completed"
                      (change)="toggleTopicCompletion(item)"
                      class="w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500 cursor-pointer"
                    />
                    <div class="flex-1 min-w-0">
                      <p
                        class="font-semibold text-slate-800 truncate"
                        [class.line-through]="item.is_completed"
                        [class.text-slate-400]="item.is_completed"
                      >
                        {{ item.topic?.name || 'Topic' }}
                      </p>
                      <span class="text-[10px] text-slate-400">
                        {{ item.topic?.subject?.name }}
                      </span>
                    </div>
                  </div>
                }

                @if (todayTopics().length === 0) {
                  <div class="py-8 text-center text-xs text-slate-400">
                    No topics scheduled today.
                    <a routerLink="/daily-goals" class="block font-bold text-brand-600 mt-1">Pick Topics →</a>
                  </div>
                }
              </div>
            </div>

            <!-- Bottom Focus Timer Launch -->
            <div class="mt-4 pt-3 border-t border-slate-100">
              <a
                routerLink="/study-sessions"
                class="w-full btn-primary text-xs py-2 flex items-center justify-center space-x-1.5 shadow-2xs"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                </svg>
                <span>Focus Stopwatch</span>
              </a>
            </div>
          </div>
        }
      </div>

      <!-- Recommended Study Tasks Panel (3 Actionable Tasks) -->
      <div class="card p-5 space-y-3.5">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 class="text-sm font-bold text-slate-900 tracking-tight">3 Recommended Study Tasks</h3>
            <p class="text-xs text-slate-500">Curated next actions based on your exam syllabus weightage and streak</p>
          </div>
          <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-50 text-brand-700 border border-brand-100">
            Smart Recommendations
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
          @for (task of recommendedTasks(); track task.id) {
            <a
              [routerLink]="task.route"
              class="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-brand-500 hover:shadow-xs transition-all flex flex-col justify-between space-y-2 group"
            >
              <div>
                <span class="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 group-hover:border-brand-300 group-hover:text-brand-700">
                  {{ task.badge }}
                </span>
                <h4 class="text-xs font-bold text-slate-900 mt-2 group-hover:text-brand-600 transition-colors">
                  {{ task.title }}
                </h4>
                <p class="text-[11px] text-slate-500 mt-0.5">
                  {{ task.subtitle }}
                </p>
              </div>

              <div class="flex items-center text-[11px] font-bold text-brand-600 space-x-1 pt-1">
                <span>Start Now</span>
                <svg class="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </a>
          }
        </div>
      </div>

      <!-- Bottom Row: Weekly Study Trend & Deadlines Highlights -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Weekly Trend Bar Chart -->
        @if (widgetConfig.config().showWeeklyTrend) {
          <div class="card">
            <div class="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 class="text-sm font-bold text-slate-900 tracking-tight">Last 7 Days Study Hours</h3>
                <p class="text-xs text-slate-500">Consistent daily prep rhythm</p>
              </div>
              <a routerLink="/study-sessions" class="text-xs font-semibold text-brand-600 hover:text-brand-700">Logs →</a>
            </div>

            <div class="mt-4 flex items-end justify-between h-36 pt-2 px-2">
              @for (day of weeklyStats(); track day.date) {
                <div class="flex flex-col items-center flex-1 space-y-1.5">
                  <span class="text-[10px] font-bold text-slate-700">{{ day.hours }}h</span>
                  <div class="w-7 sm:w-8 bg-slate-100 rounded-t-lg h-24 relative flex items-end overflow-hidden">
                    <div
                      class="w-full bg-brand-600 rounded-t-lg transition-all duration-500"
                      [style.height.%]="getBarHeight(day.hours)"
                    ></div>
                  </div>
                  <span class="text-[10px] font-semibold text-slate-500">{{ day.day }}</span>
                </div>
              }
            </div>
          </div>
        }

        <!-- Upcoming Exam Deadlines -->
        @if (widgetConfig.config().showUpcomingDeadlines) {
          <div class="card">
            <div class="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 class="text-sm font-bold text-slate-900 tracking-tight">Key Deadlines & Milestones</h3>
                <p class="text-xs text-slate-500">Chronological schedule countdown</p>
              </div>
              <a routerLink="/exam-calendar" class="text-xs font-semibold text-brand-600 hover:text-brand-700">View All →</a>
            </div>

            <div class="mt-3 space-y-2">
              @for (ev of upcomingEvents(); track ev.id) {
                <div class="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/70 border border-slate-200/70 text-xs">
                  <div>
                    <h4 class="font-bold text-slate-800 leading-snug">{{ ev.title }}</h4>
                    <p class="text-[11px] text-slate-400">{{ ev.event_date }}</p>
                  </div>
                  <span class="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-brand-50 text-brand-700 border border-brand-100">
                    {{ getCountdownLabel(ev.event_date) }}
                  </span>
                </div>
              }

              @if (upcomingEvents().length === 0) {
                <div class="py-8 text-center text-slate-400 text-xs">
                  No upcoming deadlines recorded.
                </div>
              }
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  public widgetConfig = inject(WidgetConfigService);
  public examTrack = inject(ExamTrackService);
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
  public studyStreak = signal<number>(0);
  public recommendedTasks = signal<{ id: string; title: string; subtitle: string; route: string; badge: string }[]>([]);

  get todayFormatted(): string {
    return new Date().toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  }

  async ngOnInit(): Promise<void> {
    if (this.examTrack.isKeralaHca()) {
      this.activeStage.set('objective');
    } else {
      this.activeStage.set('prelims');
    }
    await this.loadDashboardData();
  }

  async switchStage(stage: ExamStage): Promise<void> {
    this.activeStage.set(stage);
    await this.loadDashboardData();
  }

  async loadDashboardData(): Promise<void> {
    const stage = this.activeStage();
    const todayStr = new Date().toISOString().split('T')[0];

    const [summaryData, subjectsData, todayData, weeklyData, eventsData, streak, recTasks] = await Promise.all([
      this.analytics.getDashboardSummary(stage),
      this.analytics.getSubjectProgress(stage),
      this.dataStorage.getDailyGoal(todayStr),
      this.analytics.getWeeklyStudyStats(),
      this.dataStorage.getExamEvents(),
      this.analytics.calculateStudyStreak(),
      this.analytics.getRecommendedTasks()
    ]);

    this.summary.set(summaryData);
    this.subjectProgress.set(subjectsData);
    this.todayTopics.set(todayData.topics);
    this.weeklyStats.set(weeklyData);
    this.studyStreak.set(streak);
    this.recommendedTasks.set(recTasks);

    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);

    const filteredEvents = eventsData
      .filter(e => {
        const d = new Date(e.event_date);
        d.setHours(0, 0, 0, 0);
        if (d.getTime() < todayDate.getTime()) return false;
        if (this.examTrack.isKeralaHca()) {
          return e.title.toLowerCase().includes('high court') || e.title.toLowerCase().includes('hca');
        } else if (this.examTrack.isBank()) {
          return !e.title.toLowerCase().includes('high court') && !e.title.toLowerCase().includes('hca');
        }
        return true;
      })
      .slice(0, 3);

    this.upcomingEvents.set(filteredEvents);
  }

  async toggleTopicCompletion(item: DailyGoalTopic): Promise<void> {
    const newStatus = !item.is_completed;
    await this.dataStorage.toggleGoalTopicCompletion(item.id, newStatus);

    if (newStatus && item.topic_id) {
      await this.dataStorage.updateTopicStatus(item.topic_id, 'learned');
      this.toast.success(`Completed "${item.topic?.name || 'Topic'}"!`);
      try {
        confetti({ particleCount: 40, spread: 45, origin: { y: 0.6 } });
      } catch {}
    }

    await this.loadDashboardData();
  }

  formatStudyTime(seconds: number): string {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    if (hrs > 0) return `${hrs}h ${mins}m`;
    if (mins > 0) return `${mins}m`;
    if (secs > 0) return `${secs}s`;
    return '0m';
  }

  getBarHeight(hours: number): number {
    const max = 6.0;
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
    return `${diff}d left`;
  }
}
