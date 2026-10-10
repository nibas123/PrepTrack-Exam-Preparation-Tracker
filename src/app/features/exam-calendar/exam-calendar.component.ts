import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataStorageService } from '../../core/services/data-storage.service';
import { ToastService } from '../../core/services/toast.service';
import {
  ExamEvent,
  Exam,
  EventType,
  DateStatus,
} from '../../core/models/database.types';

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
            <h2 class="text-xl font-bold text-slate-900 tracking-tight">Bank Exam Hub & Deadlines</h2>
            <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-brand-50 text-brand-700 border border-brand-100">
              {{ activeView() === 'announced' ? 'Announced Exams' : 'Deadlines Calendar' }}
            </span>
          </div>
          <p class="text-xs text-slate-500 mt-0.5">Track officially announced bank exams, registration windows, and countdowns</p>
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

      <!-- Main Navigation Tabs: Announced Exams vs Deadlines Calendar -->
      <div class="flex items-center space-x-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          (click)="activeView.set('announced')"
          class="px-4 py-2 rounded-xl text-xs font-bold transition-all"
          [ngClass]="activeView() === 'announced' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'"
        >
          🏆 Announced Exams ({{ exams().length }})
        </button>

        <button
          type="button"
          (click)="activeView.set('calendar')"
          class="px-4 py-2 rounded-xl text-xs font-bold transition-all"
          [ngClass]="activeView() === 'calendar' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'"
        >
          📅 Deadlines & Milestones ({{ events().length }})
        </button>
      </div>

      <!-- VIEW 1: ANNOUNCED BANK EXAMS TRACKER -->
      @if (activeView() === 'announced') {
        <div class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            @for (exam of exams(); track exam.id) {
              <div class="card card-hover p-5 space-y-4 flex flex-col justify-between relative">
                <div>
                  <!-- Header: Name & Tracking Toggle -->
                  <div class="flex items-start justify-between gap-3">
                    <div>
                      <div class="flex items-center space-x-2">
                        <span class="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-brand-50 text-brand-700 border border-brand-200">
                          {{ exam.conducting_body || 'IBPS' }}
                        </span>

                        @if (exam.vacancies) {
                          <span class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {{ exam.vacancies | number }} Vacancies
                          </span>
                        }
                      </div>

                      <h3 class="text-base font-bold text-slate-900 mt-2">{{ exam.name }}</h3>
                      @if (exam.description) {
                        <p class="text-xs text-slate-500 mt-0.5">{{ exam.description }}</p>
                      }
                    </div>

                    <!-- Tracking Toggle Button -->
                    <button
                      type="button"
                      (click)="toggleTracking(exam)"
                      class="px-3 py-1 rounded-full text-xs font-bold transition-colors border"
                      [ngClass]="exam.is_active ? 'bg-emerald-50 text-emerald-700 border-emerald-300' : 'bg-slate-100 text-slate-500 border-slate-200'"
                      title="Toggle actively targeting this exam"
                    >
                      {{ exam.is_active ? '✓ Tracking' : 'Paused' }}
                    </button>
                  </div>

                  <!-- Key Exam Schedule Grid -->
                  <div class="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 text-xs">
                    <div class="p-2.5 bg-slate-50 rounded-xl">
                      <span class="text-[10px] uppercase font-bold text-slate-400 block">Prelims Date</span>
                      <span class="font-bold text-slate-800">{{ exam.prelims_date || 'Tentative / TBA' }}</span>
                    </div>

                    <div class="p-2.5 bg-slate-50 rounded-xl">
                      <span class="text-[10px] uppercase font-bold text-slate-400 block">Mains Date</span>
                      <span class="font-bold text-slate-800">{{ exam.mains_date || 'Tentative / TBA' }}</span>
                    </div>

                    @if (exam.application_end_date) {
                      <div class="p-2.5 bg-amber-50/60 rounded-xl col-span-2 border border-amber-200/60 flex items-center justify-between">
                        <div>
                          <span class="text-[10px] uppercase font-bold text-amber-700 block">Application Deadline</span>
                          <span class="font-bold text-amber-900">{{ exam.application_end_date }}</span>
                        </div>
                        <span class="text-[11px] font-bold text-amber-800">
                          {{ getCountdownText(exam.application_end_date) }}
                        </span>
                      </div>
                    }
                  </div>
                </div>

                <!-- Footer: Actions & Website Link -->
                <div class="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  @if (exam.official_url) {
                    <a
                      [href]="exam.official_url"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="text-brand-600 hover:text-brand-700 font-semibold flex items-center space-x-1"
                    >
                      <span>Official Portal</span>
                      <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  } @else {
                    <span class="text-slate-400 text-[11px]">Official notification tracked</span>
                  }

                  <div class="flex items-center space-x-1.5">
                    <button
                      type="button"
                      (click)="deleteExam(exam)"
                      class="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Remove exam"
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
            <div class="mt-3 p-3 bg-brand-50/60 rounded-xl border border-brand-100">
              <span class="text-[11px] font-bold text-brand-800 uppercase block mb-1.5">⚡ Popular Exam Templates</span>
              <div class="flex flex-wrap gap-1.5">
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
                  (click)="applyExamTemplate('SBI Clerk 2026', 'SBI', 8283, '2026-10-25', '2026-12-06', 'https://sbi.bank/web/careers')"
                  class="px-2.5 py-1 text-[11px] font-bold bg-white text-brand-700 rounded-lg border border-brand-200 hover:bg-brand-50"
                >
                  + SBI Clerk
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

  public events = signal<ExamEvent[]>([]);
  public exams = signal<Exam[]>([]);

  public activeView = signal<'announced' | 'calendar'>('announced');
  public calendarFilter = signal<'upcoming' | 'past' | 'all'>('upcoming');

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

  public upcomingEvents = computed(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return this.events().filter(e => {
      const d = new Date(e.event_date);
      d.setHours(0, 0, 0, 0);
      return d.getTime() >= today.getTime();
    });
  });

  public pastEvents = computed(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return this.events().filter(e => {
      const d = new Date(e.event_date);
      d.setHours(0, 0, 0, 0);
      return d.getTime() < today.getTime();
    });
  });

  public displayedEvents = computed(() => {
    switch (this.calendarFilter()) {
      case 'upcoming': return this.upcomingEvents();
      case 'past': return this.pastEvents();
      default: return this.events();
    }
  });

  async ngOnInit(): Promise<void> {
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
