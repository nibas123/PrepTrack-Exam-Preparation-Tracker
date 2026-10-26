import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DataStorageService } from '../../core/services/data-storage.service';
import { ToastService } from '../../core/services/toast.service';
import {
  ExamEvent,
  Exam,
  EventType,
  DateStatus,
} from '../../core/models/database.types';
import { ExamTrackService } from '../../core/services/exam-track.service';

@Component({
  selector: 'app-exam-calendar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6 max-w-6xl mx-auto">
      <!-- Top Header & Primary Action -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div class="flex items-center space-x-2.5">
            <h2 class="text-xl font-bold text-slate-900 tracking-tight">Competitive Exam Hub & Deadlines</h2>
            <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-brand-50 text-brand-700 border border-brand-100">
              {{ activeView() === 'announced' ? 'Announced Exams' : 'Deadlines Calendar' }}
            </span>
          </div>
          <p class="text-xs text-slate-500 mt-0.5">Track officially announced bank exams, Kerala High Court Assistant, and regulatory countdowns</p>
        </div>

        <div class="flex items-center space-x-2.5">
          <!-- Add Announced Exam -->
          <button
            type="button"
            (click)="openAddAnnouncedExamModal()"
            class="btn-primary text-xs py-2 px-3.5 flex items-center space-x-1.5 shadow-xs"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
            </svg>
            <span>+ Track New Exam</span>
          </button>

          <!-- Add Milestone Event -->
          <button
            type="button"
            (click)="openAddEventModal()"
            class="btn-secondary text-xs py-2 px-3 flex items-center space-x-1.5"
          >
            <svg class="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Add Date</span>
          </button>
        </div>
      </div>

      <!-- Main Navigation Tabs & Exam Track Filter Bar -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div class="flex items-center space-x-2">
          <button
            type="button"
            (click)="activeView.set('announced')"
            class="px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5"
            [ngClass]="activeView() === 'announced' ? 'bg-slate-900 text-white shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'"
          >
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/></svg>
            <span>Announced Exams ({{ filteredExams().length }})</span>
          </button>

          <button
            type="button"
            (click)="activeView.set('calendar')"
            class="px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5"
            [ngClass]="activeView() === 'calendar' ? 'bg-slate-900 text-white shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'"
          >
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            <span>Deadlines & Milestones ({{ filteredEvents().length }})</span>
          </button>
        </div>

        @if (examTrack.isAll()) {
          <!-- Track Filter Pills (Only shown in 'all' multi-exam mode) -->
          <div class="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200/60 text-xs">
            <button
              type="button"
              (click)="trackFilter.set('all')"
              class="px-3 py-1 rounded-lg font-semibold transition-all"
              [ngClass]="trackFilter() === 'all' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'"
            >
              All Tracks
            </button>
            <button
              type="button"
              (click)="trackFilter.set('bank')"
              class="px-3 py-1 rounded-lg font-semibold transition-all"
              [ngClass]="trackFilter() === 'bank' ? 'bg-white text-brand-900 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'"
            >
              Banking
            </button>
            <button
              type="button"
              (click)="trackFilter.set('kerala_hca')"
              class="px-3 py-1 rounded-lg font-semibold transition-all"
              [ngClass]="trackFilter() === 'kerala_hca' ? 'bg-white text-court-700 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'"
            >
              Kerala High Court
            </button>
          </div>
        }
      </div>

      <!-- VIEW 1: ANNOUNCED BANK & HIGH COURT EXAMS TRACKER -->
      @if (activeView() === 'announced') {
        <div class="space-y-6">
          <!-- Summary Status Strip -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div class="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
              <span class="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Targeted Recruits</span>
              <span class="text-2xl font-bold text-slate-900 dark:text-white mt-1 block">{{ filteredExams().length }}</span>
              <span class="text-[11px] text-slate-400">Total verified posts</span>
            </div>
            <div class="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
              <span class="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider block">Active Preparation</span>
              <span class="text-2xl font-bold text-emerald-600 mt-1 block">{{ countActiveTargetedExams() }}</span>
              <span class="text-[11px] text-slate-400">Actively tracking syllabus</span>
            </div>
            <div class="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
              <span class="text-[11px] font-semibold text-amber-600 uppercase tracking-wider block">High Court Posts</span>
              <span class="text-2xl font-bold text-amber-700 dark:text-amber-400 mt-1 block">{{ countHighCourtExams() }}</span>
              <span class="text-[11px] text-slate-400">Judicial recruitment</span>
            </div>
            <div class="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
              <span class="text-[11px] font-semibold text-indigo-600 uppercase tracking-wider block">Banking Suite</span>
              <span class="text-2xl font-bold text-indigo-700 dark:text-indigo-400 mt-1 block">{{ filteredExams().length - countHighCourtExams() }}</span>
              <span class="text-[11px] text-slate-400">IBPS, SBI & RBI</span>
            </div>
          </div>

          <!-- Exams Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            @for (exam of filteredExams(); track exam.id) {
              <div
                class="rounded-2xl transition-all duration-200 flex flex-col justify-between relative overflow-hidden border shadow-sm hover:shadow-md"
                [ngClass]="isHighCourtExam(exam) 
                  ? 'bg-gradient-to-br from-amber-500/5 via-white to-amber-500/10 dark:from-amber-950/20 dark:via-slate-900 dark:to-slate-900 border-amber-300/80 dark:border-amber-700/60' 
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-800'"
              >
                <!-- Card Header Accent Line -->
                <div class="h-1.5 w-full"
                  [ngClass]="isHighCourtExam(exam) ? 'bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700' : 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-slate-700'">
                </div>

                <div class="p-5 sm:p-6 space-y-4 flex-1">
                  <!-- Category, Authority & Status Badge Row -->
                  <div class="flex items-start justify-between gap-3">
                    <div class="flex flex-wrap items-center gap-1.5">
                      <span
                        class="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"
                        [ngClass]="isHighCourtExam(exam) ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'">
                        @if (isHighCourtExam(exam)) {
                          <svg class="w-3 h-3 text-amber-700 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                          </svg>
                        }
                        <span>{{ exam.conducting_body || 'Recruitment Board' }}</span>
                      </span>

                      @if (exam.vacancies) {
                        <span class="px-2.5 py-1 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                          {{ exam.vacancies | number }} Vacancies
                        </span>
                      }
                    </div>

                    <!-- Clear Status Indicator -->
                    <div class="shrink-0">
                      @if (exam.is_active) {
                        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                          <span>Ongoing Prep</span>
                        </span>
                      } @else {
                        <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                          <span>Available</span>
                        </span>
                      }
                    </div>
                  </div>

                  <!-- Exam Title & Description -->
                  <div>
                    <h3 class="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                      {{ exam.name }}
                    </h3>
                    @if (exam.description) {
                      <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mt-1 line-clamp-2">
                        {{ exam.description }}
                      </p>
                    }
                  </div>

                  <!-- Selection Stages Pathway -->
                  <div class="p-2.5 rounded-xl bg-slate-100/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 space-y-1.5">
                    <span class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                      Recruitment Selection Stages
                    </span>
                    <div class="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
                      @if (isHighCourtExam(exam)) {
                        <span class="px-2 py-0.5 rounded bg-white dark:bg-slate-900 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-[11px]">
                          Stage 1: Objective (100 M)
                        </span>
                        <span class="text-slate-400">&rarr;</span>
                        <span class="px-2 py-0.5 rounded bg-white dark:bg-slate-900 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-[11px]">
                          Stage 2: Descriptive (60 M)
                        </span>
                        <span class="text-slate-400">&rarr;</span>
                        <span class="px-2 py-0.5 rounded bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-[11px]">
                          Viva-Voce (10 M)
                        </span>
                      } @else {
                        <span class="px-2 py-0.5 rounded bg-white dark:bg-slate-900 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-[11px]">
                          Prelims Examination (100 M)
                        </span>
                        <span class="text-slate-400">&rarr;</span>
                        <span class="px-2 py-0.5 rounded bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-[11px]">
                          Mains Examination (200 M)
                        </span>
                        <span class="text-slate-400">&rarr;</span>
                        <span class="px-2 py-0.5 rounded bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-[11px]">
                          Interview / GD
                        </span>
                      }
                    </div>
                  </div>

                  <!-- Key Exam Schedule Grid -->
                  <div class="grid grid-cols-2 gap-2 text-xs">
                    <div class="p-3 bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200/70 dark:border-slate-700/70">
                      <span class="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-400 block">
                        {{ isHighCourtExam(exam) ? 'Stage 1 Written Date' : 'Preliminary Exam' }}
                      </span>
                      <span class="font-bold text-slate-800 dark:text-slate-200 block mt-0.5">
                        {{ exam.prelims_date || 'Tentative / TBA' }}
                      </span>
                    </div>

                    <div class="p-3 bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200/70 dark:border-slate-700/70">
                      <span class="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-400 block">
                        {{ isHighCourtExam(exam) ? 'Stage 2 Descriptive' : 'Mains Examination' }}
                      </span>
                      <span class="font-bold text-slate-800 dark:text-slate-200 block mt-0.5">
                        {{ exam.mains_date || 'Tentative / TBA' }}
                      </span>
                    </div>

                    @if (exam.application_end_date) {
                      <div class="p-3 bg-amber-50/70 dark:bg-amber-950/40 rounded-xl col-span-2 border border-amber-200/70 dark:border-amber-900/60 flex items-center justify-between">
                        <div>
                          <span class="text-[10px] uppercase font-bold text-amber-800 dark:text-amber-300 block">Registration Deadline</span>
                          <span class="font-bold text-amber-950 dark:text-amber-200">{{ exam.application_end_date }}</span>
                        </div>
                        <span class="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-200/70 dark:bg-amber-900 text-amber-900 dark:text-amber-200">
                          {{ getCountdownText(exam.application_end_date) }}
                        </span>
                      </div>
                    }
                  </div>
                </div>

                <!-- Footer: Primary Action Buttons & Status Toggle -->
                <div class="px-5 py-3.5 bg-slate-50/80 dark:bg-slate-800/40 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3 text-xs">
                  <div class="flex items-center gap-2">
                    @if (isHighCourtExam(exam)) {
                      <a
                        routerLink="/kerala-high-court"
                        class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg font-semibold bg-amber-600 hover:bg-amber-700 text-white transition-colors shadow-xs"
                      >
                        <span>Open Prep Hub</span>
                        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </a>
                    } @else {
                      <a
                        routerLink="/syllabus"
                        class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shadow-xs"
                      >
                        <span>View Syllabus</span>
                        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </a>
                    }

                    @if (exam.official_url) {
                      <a
                        [href]="exam.official_url"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium flex items-center gap-1 transition-colors px-2 py-1"
                        title="Official portal & notifications"
                      >
                        <span>Official Portal</span>
                        <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    }
                  </div>

                  <div class="flex items-center gap-2">
                    <button
                      type="button"
                      (click)="toggleTracking(exam)"
                      class="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all"
                      [ngClass]="exam.is_active 
                        ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 hover:bg-emerald-200' 
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-100'"
                    >
                      {{ exam.is_active ? '✓ Active Target' : '+ Target Exam' }}
                    </button>

                    <button
                      type="button"
                      (click)="deleteExam(exam)"
                      class="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      title="Remove exam from list"
                    >
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      }

      <!-- VIEW 2: DEADLINES & COUNTDOWN CALENDAR -->
      @if (activeView() === 'calendar') {
        <div class="space-y-4">
          <!-- Calendar Filter Chips -->
          <div class="flex items-center space-x-2">
            <button
              type="button"
              (click)="calendarFilter.set('upcoming')"
              class="px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors"
              [ngClass]="calendarFilter() === 'upcoming' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border border-slate-200'"
            >
              Upcoming ({{ upcomingEvents().length }})
            </button>
            <button
              type="button"
              (click)="calendarFilter.set('past')"
              class="px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors"
              [ngClass]="calendarFilter() === 'past' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border border-slate-200'"
            >
              Past Milestones ({{ pastEvents().length }})
            </button>
            <button
              type="button"
              (click)="calendarFilter.set('all')"
              class="px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors"
              [ngClass]="calendarFilter() === 'all' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border border-slate-200'"
            >
              All ({{ events().length }})
            </button>
          </div>

          <!-- Milestones List -->
          <div class="bg-white rounded-2xl border border-slate-200/80 shadow-xs divide-y divide-slate-100 overflow-hidden">
            @for (ev of displayedEvents(); track ev.id) {
              <div class="p-4 sm:px-6 hover:bg-slate-50/70 transition-colors flex items-center justify-between gap-4">
                <div class="flex items-center space-x-3.5 flex-1 min-w-0">
                  <div
                    class="w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs border flex-shrink-0"
                    [ngClass]="getEventTypeBadgeClass(ev.event_type)"
                  >
                    {{ getEventTypeShort(ev.event_type) }}
                  </div>

                  <div class="flex-1 min-w-0">
                    <div class="flex items-center space-x-2">
                      <h4 class="text-sm font-bold text-slate-900 truncate">{{ ev.title }}</h4>
                      <span class="text-[10px] font-bold text-slate-500 capitalize">
                        ({{ ev.date_status }})
                      </span>
                    </div>
                    <div class="flex items-center space-x-2 text-xs text-slate-500 mt-0.5">
                      <span>{{ ev.event_date }}</span>
                      @if (ev.exam?.name) {
                        <span>•</span>
                        <span class="font-semibold text-slate-700">{{ ev.exam?.name }}</span>
                      }
                    </div>
                  </div>
                </div>

                <!-- Right Countdown & Actions -->
                <div class="flex items-center space-x-3 flex-shrink-0">
                  <span
                    class="px-3 py-1 rounded-full text-xs font-black shadow-2xs"
                    [ngClass]="getCountdownBadgeClass(ev.event_date)"
                  >
                    {{ getCountdownText(ev.event_date) }}
                  </span>

                  <button
                    type="button"
                    (click)="deleteEvent(ev)"
                    class="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                    title="Delete milestone"
                  >
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            }

            @if (displayedEvents().length === 0) {
              <div class="py-12 text-center text-slate-400 text-xs">
                No milestone events recorded in this category.
              </div>
            }
          </div>
        </div>
      }

      <!-- MODAL 1: ADD NEWLY ANNOUNCED EXAM -->
      @if (showAnnounceExamModal()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div class="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 flex flex-col max-h-[90vh] overflow-y-auto">
            <div class="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 class="text-base font-bold text-slate-900">Track Newly Announced Bank Exam</h3>
              <button (click)="showAnnounceExamModal.set(false)" class="text-slate-400 hover:text-slate-600">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Quick Template Pickers -->
            <div class="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span class="text-[11px] font-bold text-slate-800 uppercase block mb-1.5">⚡ Popular Exam Templates</span>
              <div class="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  (click)="applyExamTemplate('Kerala High Court Assistant 2026', 'High Court of Kerala', 45, '2026-09-15', '2026-11-20', 'https://hckrecruitment.keralacourts.in')"
                  class="px-2.5 py-1 text-[11px] font-bold bg-amber-50 text-amber-800 rounded-lg border border-amber-300 hover:bg-amber-100"
                >
                  + Kerala High Court Assistant
                </button>
                <button
                  type="button"
                  (click)="applyExamTemplate('Kerala Judicial Service (Munsiff-Magistrate) 2026', 'High Court of Kerala', 52, '2026-08-20', '2026-11-10', 'https://hckrecruitment.keralacourts.in')"
                  class="px-2.5 py-1 text-[11px] font-bold bg-amber-50 text-amber-800 rounded-lg border border-amber-300 hover:bg-amber-100"
                >
                  + Judicial Service (Munsiff)
                </button>
                <button
                  type="button"
                  (click)="applyExamTemplate('High Court Confidential Assistant / Steno 2026', 'High Court of Kerala', 28, '2026-09-01', '2026-10-15', 'https://hckrecruitment.keralacourts.in')"
                  class="px-2.5 py-1 text-[11px] font-bold bg-amber-50 text-amber-800 rounded-lg border border-amber-300 hover:bg-amber-100"
                >
                  + HC Stenographer
                </button>
                <button
                  type="button"
                  (click)="applyExamTemplate('IBPS PO 2026', 'IBPS', 4455, '2026-10-18', '2026-11-29', 'https://ibps.in')"
                  class="px-2.5 py-1 text-[11px] font-bold bg-white text-brand-700 rounded-lg border border-brand-200 hover:bg-brand-50"
                >
                  + IBPS PO
                </button>
                <button
                  type="button"
                  (click)="applyExamTemplate('SBI PO 2026', 'SBI', 2000, '2026-11-01', '2026-12-15', 'https://sbi.bank/web/careers')"
                  class="px-2.5 py-1 text-[11px] font-bold bg-white text-brand-700 rounded-lg border border-brand-200 hover:bg-brand-50"
                >
                  + SBI PO
                </button>
                <button
                  type="button"
                  (click)="applyExamTemplate('IBPS Clerk 2026', 'IBPS', 6128, '2026-10-10', '2026-11-23', 'https://ibps.in')"
                  class="px-2.5 py-1 text-[11px] font-bold bg-white text-brand-700 rounded-lg border border-brand-200 hover:bg-brand-50"
                >
                  + IBPS Clerk
                </button>
                <button
                  type="button"
                  (click)="applyExamTemplate('IBPS RRB Officer Scale-I 2026', 'IBPS', 5500, '2026-08-03', '2026-09-29', 'https://ibps.in')"
                  class="px-2.5 py-1 text-[11px] font-bold bg-white text-brand-700 rounded-lg border border-brand-200 hover:bg-brand-50"
                >
                  + IBPS RRB PO
                </button>
                <button
                  type="button"
                  (click)="applyExamTemplate('IBPS RRB Clerk 2026', 'IBPS', 6000, '2026-08-10', '2026-10-06', 'https://ibps.in')"
                  class="px-2.5 py-1 text-[11px] font-bold bg-white text-brand-700 rounded-lg border border-brand-200 hover:bg-brand-50"
                >
                  + IBPS RRB Clerk
                </button>
                <button
                  type="button"
                  (click)="applyExamTemplate('RBI Grade B Officer 2026', 'RBI', 291, '2026-09-08', '2026-10-19', 'https://opportunities.rbi.org.in')"
                  class="px-2.5 py-1 text-[11px] font-bold bg-white text-brand-700 rounded-lg border border-brand-200 hover:bg-brand-50"
                >
                  + RBI Grade B
                </button>
                <button
                  type="button"
                  (click)="applyExamTemplate('RBI Assistant 2026', 'RBI', 450, '2026-11-15', '2026-12-28', 'https://opportunities.rbi.org.in')"
                  class="px-2.5 py-1 text-[11px] font-bold bg-white text-brand-700 rounded-lg border border-brand-200 hover:bg-brand-50"
                >
                  + RBI Assistant
                </button>
                <button
                  type="button"
                  (click)="applyExamTemplate('IBPS SO 2026', 'IBPS', 1400, '2026-11-09', '2026-12-14', 'https://ibps.in')"
                  class="px-2.5 py-1 text-[11px] font-bold bg-white text-brand-700 rounded-lg border border-brand-200 hover:bg-brand-50"
                >
                  + IBPS SO
                </button>
                <button
                  type="button"
                  (click)="applyExamTemplate('NABARD Grade A 2026', 'NABARD', 150, '2026-10-20', '2026-11-30', 'https://nabard.org')"
                  class="px-2.5 py-1 text-[11px] font-bold bg-white text-brand-700 rounded-lg border border-brand-200 hover:bg-brand-50"
                >
                  + NABARD Grade A
                </button>
              </div>
            </div>

            <div class="mt-4 space-y-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Exam Name *</label>
                <input
                  type="text"
                  [(ngModel)]="newExamForm.name"
                  placeholder="e.g. IBPS RRB Officer Scale-I 2026, SBI Clerk 2026"
                  class="input-field"
                />
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Conducting Body</label>
                  <select [(ngModel)]="newExamForm.conducting_body" class="input-field">
                    <option value="IBPS">IBPS</option>
                    <option value="SBI">State Bank of India</option>
                    <option value="RBI">Reserve Bank of India</option>
                    <option value="LIC">LIC / Insurance</option>
                    <option value="NABARD">NABARD / Regulatory</option>
                    <option value="Other">Other Bank</option>
                  </select>
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Total Vacancies</label>
                  <input
                    type="number"
                    [(ngModel)]="newExamForm.vacancies"
                    placeholder="e.g. 4500"
                    class="input-field font-bold"
                  />
                </div>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Prelims Exam Date</label>
                  <input type="date" [(ngModel)]="newExamForm.prelims_date" class="input-field text-xs" />
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Mains Exam Date</label>
                  <input type="date" [(ngModel)]="newExamForm.mains_date" class="input-field text-xs" />
                </div>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Application Start Date</label>
                  <input type="date" [(ngModel)]="newExamForm.application_start_date" class="input-field text-xs" />
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Application Deadline</label>
                  <input type="date" [(ngModel)]="newExamForm.application_end_date" class="input-field text-xs" />
                </div>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Official Portal URL</label>
                <input
                  type="url"
                  [(ngModel)]="newExamForm.official_url"
                  placeholder="https://ibps.in or https://sbi.co.in/careers"
                  class="input-field text-xs"
                />
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Description / Notes</label>
                <textarea
                  [(ngModel)]="newExamForm.description"
                  rows="2"
                  placeholder="Eligibility criteria, salary pay scale, age limit..."
                  class="input-field text-xs"
                ></textarea>
              </div>
            </div>

            <div class="mt-6 flex justify-end space-x-3 pt-3 border-t border-slate-100">
              <button (click)="showAnnounceExamModal.set(false)" class="btn-secondary text-xs py-2 px-3">Cancel</button>
              <button (click)="saveAnnouncedExam()" class="btn-primary text-xs py-2 px-4">
                Save & Track Exam
              </button>
            </div>
          </div>
        </div>
      }

      <!-- MODAL 2: ADD CUSTOM EVENT / MILESTONE -->
      @if (showEventModal()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div class="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div class="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 class="text-base font-bold text-slate-900">Add Milestone Date</h3>
              <button (click)="showEventModal.set(false)" class="text-slate-400 hover:text-slate-600">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div class="mt-4 space-y-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Milestone Title *</label>
                <input
                  type="text"
                  [(ngModel)]="eventForm.title"
                  placeholder="e.g. Finish Quant Arithmetic, Mock 10 Date"
                  class="input-field"
                />
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Type</label>
                  <select [(ngModel)]="eventForm.event_type" class="input-field">
                    <option value="exam_date">Exam Date</option>
                    <option value="application_deadline">Application Deadline</option>
                    <option value="admit_card">Admit Card</option>
                    <option value="syllabus_deadline">Syllabus Target</option>
                    <option value="other">Other Milestone</option>
                  </select>
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Date *</label>
                  <input type="date" [(ngModel)]="eventForm.event_date" class="input-field text-xs" />
                </div>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Associated Exam</label>
                <select [(ngModel)]="eventForm.exam_id" class="input-field">
                  <option [value]="null">General</option>
                  @for (ex of exams(); track ex.id) {
                    <option [value]="ex.id">{{ ex.name }}</option>
                  }
                </select>
              </div>
            </div>

            <div class="mt-6 flex justify-end space-x-3 pt-3 border-t border-slate-100">
              <button (click)="showEventModal.set(false)" class="btn-secondary text-xs py-2 px-3">Cancel</button>
              <button (click)="saveEventForm()" class="btn-primary text-xs py-2 px-4">Save Milestone</button>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class ExamCalendarComponent implements OnInit {
  private dataStorage = inject(DataStorageService);
  private toast = inject(ToastService);
  public examTrack = inject(ExamTrackService);

  public events = signal<ExamEvent[]>([]);
  public exams = signal<Exam[]>([]);

  public activeView = signal<'announced' | 'calendar'>('announced');
  public calendarFilter = signal<'upcoming' | 'past' | 'all'>('upcoming');
  public trackFilter = signal<'all' | 'bank' | 'kerala_hca'>('all');

  // Modals
  public showAnnounceExamModal = signal<boolean>(false);
  public showEventModal = signal<boolean>(false);

  public newExamForm: Partial<Exam> = {
    name: '',
    conducting_body: 'IBPS',
    vacancies: 4000,
    prelims_date: '',
    mains_date: '',
    application_start_date: '',
    application_end_date: '',
    official_url: '',
    description: ''
  };

  public eventForm = {
    title: '',
    event_type: 'exam_date' as EventType,
    event_date: new Date().toISOString().split('T')[0],
    date_status: 'tentative' as DateStatus,
    exam_id: null as string | null,
    description: '',
    reminder_enabled: true
  };

  public filteredExams = computed(() => {
    const list = this.exams();
    const activeTrack = this.examTrack.activeTrack();
    const filter = activeTrack === 'all' ? this.trackFilter() : activeTrack;
    if (filter === 'kerala_hca') {
      return list.filter(e => e.conducting_body === 'High Court of Kerala' || e.name.toLowerCase().includes('high court'));
    } else if (filter === 'bank') {
      return list.filter(e => e.conducting_body !== 'High Court of Kerala' && !e.name.toLowerCase().includes('high court'));
    }
    return list;
  });

  isHighCourtExam(exam: Exam): boolean {
    if (!exam) return false;
    const body = (exam.conducting_body || '').toLowerCase();
    const name = (exam.name || '').toLowerCase();
    return body.includes('high court') || name.includes('high court') || name.includes('hca') || name.includes('judicial');
  }

  countActiveTargetedExams(): number {
    return this.filteredExams().filter(e => e.is_active).length;
  }

  countHighCourtExams(): number {
    return this.filteredExams().filter(e => this.isHighCourtExam(e)).length;
  }

  public filteredEvents = computed(() => {
    const list = this.events();
    const activeTrack = this.examTrack.activeTrack();
    const filter = activeTrack === 'all' ? this.trackFilter() : activeTrack;
    if (filter === 'kerala_hca') {
      return list.filter(e => e.title.toLowerCase().includes('high court') || e.title.toLowerCase().includes('hca'));
    } else if (filter === 'bank') {
      return list.filter(e => !e.title.toLowerCase().includes('high court') && !e.title.toLowerCase().includes('hca'));
    }
    return list;
  });

  public upcomingEvents = computed(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return this.filteredEvents().filter(e => {
      const d = new Date(e.event_date);
      d.setHours(0, 0, 0, 0);
      return d.getTime() >= today.getTime();
    });
  });

  public pastEvents = computed(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return this.filteredEvents().filter(e => {
      const d = new Date(e.event_date);
      d.setHours(0, 0, 0, 0);
      return d.getTime() < today.getTime();
    });
  });

  public displayedEvents = computed(() => {
    switch (this.calendarFilter()) {
      case 'upcoming': return this.upcomingEvents();
      case 'past': return this.pastEvents();
      default: return this.filteredEvents();
    }
  });

  async ngOnInit(): Promise<void> {
    this.trackFilter.set(this.examTrack.activeTrack());
    await this.loadData();
  }

  async loadData(): Promise<void> {
    const [evs, exList] = await Promise.all([
      this.dataStorage.getExamEvents(),
      this.dataStorage.getExams()
    ]);
    this.events.set(evs);
    this.exams.set(exList);
  }

  getEventTypeShort(type: EventType): string {
    switch (type) {
      case 'exam_date': return 'EXAM';
      case 'application_open': return 'START';
      case 'application_deadline': return 'LAST';
      case 'admit_card': return 'CARD';
      default: return 'DATE';
    }
  }

  getEventTypeBadgeClass(type: EventType): string {
    switch (type) {
      case 'exam_date': return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'application_deadline': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'application_open': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'admit_card': return 'bg-sky-50 text-sky-700 border-sky-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  }

  getCountdownText(dateStr: string): string {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const ev = new Date(dateStr);
    ev.setHours(0, 0, 0, 0);
    const diff = Math.round((ev.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (diff === 0) return 'Today!';
    if (diff === 1) return 'Tomorrow';
    if (diff > 1) return `${diff} days left`;
    return `${Math.abs(diff)} days ago`;
  }

  getCountdownBadgeClass(dateStr: string): string {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const ev = new Date(dateStr);
    ev.setHours(0, 0, 0, 0);
    const diff = Math.round((ev.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (diff < 0) return 'bg-slate-100 text-slate-500';
    if (diff <= 7) return 'bg-rose-100 text-rose-800 animate-pulse';
    if (diff <= 30) return 'bg-amber-100 text-amber-800';
    return 'bg-brand-50 text-brand-700';
  }

  openAddAnnouncedExamModal(): void {
    this.newExamForm = {
      name: '',
      conducting_body: 'IBPS',
      vacancies: 4000,
      prelims_date: new Date(Date.now() + 60 * 86400000).toISOString().split('T')[0],
      mains_date: new Date(Date.now() + 110 * 86400000).toISOString().split('T')[0],
      application_start_date: new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0],
      application_end_date: new Date(Date.now() + 31 * 86400000).toISOString().split('T')[0],
      official_url: 'https://ibps.in',
      description: 'Official recruitment cycle'
    };
    this.showAnnounceExamModal.set(true);
  }

  applyExamTemplate(name: string, body: string, vacancies: number, prelims?: string, mains?: string, url?: string): void {
    this.newExamForm.name = name;
    this.newExamForm.conducting_body = body;
    this.newExamForm.vacancies = vacancies;
    if (prelims) this.newExamForm.prelims_date = prelims;
    if (mains) this.newExamForm.mains_date = mains;
    if (url) this.newExamForm.official_url = url;
    else if (body === 'IBPS') this.newExamForm.official_url = 'https://ibps.in';
    else if (body === 'RBI') this.newExamForm.official_url = 'https://opportunities.rbi.org.in';
    else if (body === 'SBI') this.newExamForm.official_url = 'https://sbi.bank/web/careers';
  }

  async saveAnnouncedExam(): Promise<void> {
    if (!this.newExamForm.name?.trim()) {
      this.toast.error('Please enter the exam name');
      return;
    }

    await this.dataStorage.announceAndTrackNewExam(this.newExamForm);
    this.toast.success(`Exam "${this.newExamForm.name}" added to tracker and calendar!`);
    this.showAnnounceExamModal.set(false);
    await this.loadData();
  }

  async toggleTracking(exam: Exam): Promise<void> {
    const newState = !exam.is_active;
    await this.dataStorage.toggleExamTracking(exam.id, newState);
    this.toast.info(`${exam.name}: Tracking ${newState ? 'enabled' : 'paused'}`);
    await this.loadData();
  }

  async deleteExam(exam: Exam): Promise<void> {
    if (confirm(`Remove exam "${exam.name}" from tracker?`)) {
      await this.dataStorage.deleteExam(exam.id);
      this.toast.info(`Removed "${exam.name}"`);
      await this.loadData();
    }
  }

  openAddEventModal(): void {
    this.eventForm = {
      title: '',
      event_type: 'exam_date',
      event_date: new Date().toISOString().split('T')[0],
      date_status: 'tentative',
      exam_id: this.exams()[0]?.id || null,
      description: '',
      reminder_enabled: true
    };
    this.showEventModal.set(true);
  }

  async saveEventForm(): Promise<void> {
    if (!this.eventForm.title.trim() || !this.eventForm.event_date) {
      this.toast.error('Please enter title and date');
      return;
    }

    await this.dataStorage.saveExamEvent(this.eventForm);
    this.toast.success('Milestone saved!');
    this.showEventModal.set(false);
    await this.loadData();
  }

  async deleteEvent(ev: ExamEvent): Promise<void> {
    if (confirm(`Delete milestone "${ev.title}"?`)) {
      await this.dataStorage.deleteExamEvent(ev.id);
      this.toast.info('Milestone deleted');
      await this.loadData();
    }
  }
}
