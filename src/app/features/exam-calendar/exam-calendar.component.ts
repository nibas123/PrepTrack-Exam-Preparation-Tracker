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
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
        <div>
          <h2 class="text-xl font-bold text-slate-900 tracking-tight">Banking Exam Calendar & Deadlines</h2>
          <p class="text-xs text-slate-500 mt-0.5">Track application dates, admit cards, and countdown to exam day</p>
        </div>

        <button
          type="button"
          (click)="openAddEventModal()"
          class="btn-primary text-xs py-2 px-4 flex items-center space-x-1.5 self-start sm:self-auto"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>Add Exam Date / Deadline</span>
        </button>
      </div>

      <!-- Filters & Stats Bar -->
      <div class="card flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div class="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200/60 self-start">
          <button
            type="button"
            (click)="activeTab.set('upcoming')"
            class="px-4 py-1.5 text-xs font-bold rounded-lg transition-all"
            [ngClass]="activeTab() === 'upcoming' ? 'bg-white text-brand-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'"
          >
            Upcoming ({{ upcomingEvents().length }})
          </button>
          <button
            type="button"
            (click)="activeTab.set('past')"
            class="px-4 py-1.5 text-xs font-bold rounded-lg transition-all"
            [ngClass]="activeTab() === 'past' ? 'bg-white text-brand-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'"
          >
            Past Milestones ({{ pastEvents().length }})
          </button>
          <button
            type="button"
            (click)="activeTab.set('all')"
            class="px-4 py-1.5 text-xs font-bold rounded-lg transition-all"
            [ngClass]="activeTab() === 'all' ? 'bg-white text-brand-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'"
          >
            All ({{ events().length }})
          </button>
        </div>

        <div class="text-xs text-slate-500">
          Showing <span class="font-bold text-slate-800">{{ displayedEvents().length }}</span> milestone dates
        </div>
      </div>

      <!-- Events Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        @for (ev of displayedEvents(); track ev.id) {
          <div class="card card-hover flex flex-col justify-between p-5 space-y-4">
            <div>
              <!-- Top Row: Badge & Countdown -->
              <div class="flex items-start justify-between gap-2">
                <span
                  class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                  [ngClass]="getEventTypeBadgeClass(ev.event_type)"
                >
                  {{ getEventTypeLabel(ev.event_type) }}
                </span>

                <!-- Days Countdown Pill -->
                <span
                  class="px-2.5 py-1 rounded-full text-xs font-black shadow-2xs"
                  [ngClass]="getCountdownBadgeClass(ev.event_date)"
                >
                  {{ getCountdownText(ev.event_date) }}
                </span>
              </div>

              <!-- Title & Date -->
              <h3 class="text-base font-bold text-slate-900 mt-3 leading-snug">{{ ev.title }}</h3>
              <div class="flex items-center space-x-2 mt-1 text-xs text-slate-500">
                <svg class="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span class="font-semibold text-slate-800">{{ ev.event_date }}</span>
                <span>•</span>
                <span class="capitalize text-[11px] font-medium" [class.text-emerald-600]="ev.date_status === 'confirmed'" [class.text-amber-600]="ev.date_status === 'tentative'">
                  {{ ev.date_status }}
                </span>
              </div>

              @if (ev.description) {
                <p class="text-xs text-slate-500 mt-2.5 line-clamp-2 leading-relaxed">{{ ev.description }}</p>
              }
            </div>

            <!-- Bottom: Exam target & Actions -->
            <div class="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span class="text-slate-400 font-medium truncate max-w-[10rem]">
                {{ ev.exam?.name || 'General Exam' }}
              </span>

              <div class="flex items-center space-x-1.5">
                <button
                  type="button"
                  (click)="openEditEventModal(ev)"
                  class="p-1.5 text-slate-400 hover:text-brand-600 rounded-lg hover:bg-slate-100 transition-colors"
                  title="Edit Event"
                >
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>

                <button
                  type="button"
                  (click)="deleteEvent(ev)"
                  class="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                  title="Delete Event"
                >
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        }

        @if (displayedEvents().length === 0) {
          <div class="card col-span-full py-12 text-center">
            <div class="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-3">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 class="text-sm font-bold text-slate-800">No events found in this category</h3>
            <p class="text-xs text-slate-500 mt-1">Add your target exam dates and personal syllabus goals.</p>
            <button
              (click)="openAddEventModal()"
              class="btn-primary text-xs py-2 px-4 mt-4"
            >
              + Add Exam Date
            </button>
          </div>
        }
      </div>

      <!-- ADD / EDIT EVENT MODAL -->
      @if (showEventModal()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div class="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <div class="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 class="text-base font-bold text-slate-900">
                {{ editingEvent() ? 'Edit Calendar Milestone' : 'Add Exam Event or Deadline' }}
              </h3>
              <button (click)="showEventModal.set(false)" class="text-slate-400 hover:text-slate-600">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div class="mt-4 space-y-4">
              <div>
                <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Event Title *</label>
                <input
                  type="text"
                  [(ngModel)]="eventForm.title"
                  placeholder="e.g. IBPS PO Prelims 2026, SBI Clerk Admit Card"
                  class="input-field"
                />
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Event Type *</label>
                  <select [(ngModel)]="eventForm.event_type" class="input-field">
                    <option value="exam_date">Exam Date</option>
                    <option value="application_open">Application Open</option>
                    <option value="application_deadline">Application Deadline</option>
                    <option value="admit_card">Admit Card</option>
                    <option value="result">Result Date</option>
                    <option value="syllabus_deadline">Syllabus Target</option>
                    <option value="other">Other Milestone</option>
                  </select>
                </div>

                <div>
                  <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Date Status</label>
                  <select [(ngModel)]="eventForm.date_status" class="input-field">
                    <option value="tentative">Tentative</option>
                    <option value="confirmed">Confirmed</option>
                  </select>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Target Date *</label>
                  <input type="date" [(ngModel)]="eventForm.event_date" class="input-field text-xs" />
                </div>

                <div>
                  <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Associated Exam</label>
                  <select [(ngModel)]="eventForm.exam_id" class="input-field">
                    <option [value]="null">None</option>
                    @for (ex of exams(); track ex.id) {
                      <option [value]="ex.id">{{ ex.name }}</option>
                    }
                  </select>
                </div>
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Description / Notes</label>
                <textarea
                  [(ngModel)]="eventForm.description"
                  rows="2"
                  placeholder="Official notification link or notes..."
                  class="input-field text-xs"
                ></textarea>
              </div>

              <div class="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="reminder"
                  [(ngModel)]="eventForm.reminder_enabled"
                  class="w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500 cursor-pointer"
                />
                <label for="reminder" class="text-xs text-slate-700 font-medium cursor-pointer">
                  Enable high-priority dashboard countdown
                </label>
              </div>
            </div>

            <div class="mt-6 flex justify-end space-x-3 pt-3 border-t border-slate-100">
              <button (click)="showEventModal.set(false)" class="btn-secondary text-xs py-2 px-3">Cancel</button>
              <button (click)="saveEventForm()" class="btn-primary text-xs py-2 px-4">
                {{ editingEvent() ? 'Update Milestone' : 'Save Event' }}
              </button>
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
  public activeTab = signal<'upcoming' | 'past' | 'all'>('upcoming');

  // Modal State
  public showEventModal = signal<boolean>(false);
  public editingEvent = signal<ExamEvent | null>(null);
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
    switch (this.activeTab()) {
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

  getEventTypeLabel(type: EventType): string {
    switch (type) {
      case 'exam_date': return 'Exam Day';
      case 'application_open': return 'Application Open';
      case 'application_deadline': return 'Application Deadline';
      case 'admit_card': return 'Admit Card';
      case 'result': return 'Result Release';
      case 'syllabus_deadline': return 'Syllabus Milestone';
      default: return 'Milestone';
    }
  }

  getEventTypeBadgeClass(type: EventType): string {
    switch (type) {
      case 'exam_date': return 'bg-rose-50 text-rose-700 border border-rose-200';
      case 'application_deadline': return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'application_open': return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      case 'admit_card': return 'bg-sky-50 text-sky-700 border border-sky-200';
      default: return 'bg-slate-100 text-slate-700';
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

  openAddEventModal(): void {
    this.editingEvent.set(null);
    this.eventForm = {
      title: '',
      event_type: 'exam_date',
      event_date: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      date_status: 'tentative',
      exam_id: this.exams()[0]?.id || null,
      description: '',
      reminder_enabled: true
    };
    this.showEventModal.set(true);
  }

  openEditEventModal(ev: ExamEvent): void {
    this.editingEvent.set(ev);
    this.eventForm = {
      title: ev.title,
      event_type: ev.event_type,
      event_date: ev.event_date,
      date_status: ev.date_status,
      exam_id: ev.exam_id || null,
      description: ev.description || '',
      reminder_enabled: ev.reminder_enabled
    };
    this.showEventModal.set(true);
  }

  async saveEventForm(): Promise<void> {
    if (!this.eventForm.title.trim() || !this.eventForm.event_date) {
      this.toast.error('Please enter event title and date');
      return;
    }

    const editing = this.editingEvent();
    if (editing) {
      await this.dataStorage.saveExamEvent({
        ...editing,
        ...this.eventForm
      });
      this.toast.success('Event updated');
    } else {
      await this.dataStorage.saveExamEvent(this.eventForm);
      this.toast.success('Exam event scheduled!');
    }

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
