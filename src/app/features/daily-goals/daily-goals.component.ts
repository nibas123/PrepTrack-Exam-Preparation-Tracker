import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DataStorageService } from '../../core/services/data-storage.service';
import { ToastService } from '../../core/services/toast.service';
import {
  DailyGoal,
  DailyGoalTopic,
  Topic,
  Subject,
} from '../../core/models/database.types';
import { ProgressBarComponent } from '../../shared/components/progress-bar/progress-bar.component';
import confetti from 'canvas-confetti';

@Component({
  selector: 'app-daily-goals',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ProgressBarComponent],
  template: `
    <div class="space-y-6">
      <!-- Date Navigator & Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
        <div>
          <h2 class="text-xl font-bold text-slate-900 tracking-tight">Daily Preparation Goals</h2>
          <p class="text-xs text-slate-500 mt-0.5">Plan your daily syllabus milestones and track task execution</p>
        </div>

        <!-- Date Stepper -->
        <div class="flex items-center space-x-2">
          <button
            type="button"
            (click)="changeDate(-1)"
            class="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 border border-slate-200"
            title="Previous Day"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <input
            type="date"
            [ngModel]="selectedDate()"
            (ngModelChange)="onDatePicked($event)"
            class="input-field text-xs py-1.5 font-semibold text-center w-auto cursor-pointer"
          />

          <button
            type="button"
            (click)="changeDate(1)"
            class="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 border border-slate-200"
            title="Next Day"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          @if (!isToday) {
            <button
              type="button"
              (click)="goToToday()"
              class="btn-secondary text-xs py-1.5 px-3"
            >
              Today
            </button>
          }
        </div>
      </div>

      <!-- Goal Target Settings & Daily Status Card -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Target Settings -->
        <div class="card md:col-span-1 space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 class="text-sm font-bold text-slate-900">Targets for {{ formattedSelectedDate }}</h3>
            <span
              class="text-[10px] font-bold px-2 py-0.5 rounded-full"
              [ngClass]="isToday ? 'bg-brand-50 text-brand-700 border border-brand-200' : 'bg-slate-100 text-slate-600'"
            >
              {{ isToday ? 'Active Day' : 'History' }}
            </span>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Target Topics / Day</label>
            <div class="flex items-center space-x-2">
              <input
                type="number"
                min="1"
                max="20"
                [(ngModel)]="targetTopicCount"
                class="input-field text-xs py-1.5 w-24 text-center font-bold"
              />
              <span class="text-xs text-slate-500">topics planned</span>
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Target Study Hours</label>
            <div class="flex items-center space-x-2">
              <input
                type="number"
                step="0.5"
                min="0.5"
                max="16"
                [(ngModel)]="targetHours"
                class="input-field text-xs py-1.5 w-24 text-center font-bold"
              />
              <span class="text-xs text-slate-500">hours ({{ targetHours * 60 }} mins)</span>
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Daily Notes / Focus</label>
            <textarea
              [(ngModel)]="goalNotes"
              rows="2"
              placeholder="e.g. Complete 5 floor puzzles and Revise Percentage"
              class="input-field text-xs"
            ></textarea>
          </div>

          <button
            type="button"
            (click)="saveTargets()"
            class="w-full btn-secondary text-xs py-2 font-semibold"
          >
            Save Target Settings
          </button>
        </div>

        <!-- Completion Progress & Summary -->
        <div class="card md:col-span-2 flex flex-col justify-between space-y-4">
          <div>
            <div class="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 class="text-sm font-bold text-slate-900">Daily Execution Progress</h3>
              <div class="text-right">
                <span class="text-xs font-extrabold text-brand-600">{{ completionPercentage() }}%</span>
                <span class="text-xs text-slate-500 ml-1">Achieved</span>
              </div>
            </div>

            <!-- Big Progress Bar -->
            <div class="mt-4">
              <app-progress-bar
                [percentage]="completionPercentage()"
                color="#16a34a"
                [showLabel]="false"
                size="lg"
              ></app-progress-bar>
            </div>

            <!-- Stats row -->
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
              <div class="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <span class="text-[11px] font-semibold text-slate-500 uppercase">Topics Done</span>
                <p class="text-xl font-extrabold text-slate-900 mt-0.5">
                  {{ completedTopicsCount() }} / {{ goalTopics().length }}
                </p>
                <span class="text-[10px] text-slate-400">Target: {{ targetTopicCount }}</span>
              </div>

              <div class="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <span class="text-[11px] font-semibold text-slate-500 uppercase">Remaining</span>
                <p class="text-xl font-extrabold text-slate-900 mt-0.5">
                  {{ remainingTopicsCount() }}
                </p>
                <span class="text-[10px] text-slate-400">Tasks to finish</span>
              </div>

              <div class="p-3 bg-slate-50 rounded-xl border border-slate-200/80 col-span-2 sm:col-span-1">
                <span class="text-[11px] font-semibold text-slate-500 uppercase">Day Outcome</span>
                <p class="text-sm font-extrabold mt-1" [ngClass]="dayOutcomeClass">
                  {{ dayOutcomeLabel }}
                </p>
              </div>
            </div>
          </div>

          <!-- Quick Action Buttons -->
          <div class="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              (click)="openTopicPickerModal()"
              class="btn-primary text-xs py-2 px-3.5 flex items-center space-x-1.5"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>+ Pick Topics from Syllabus</span>
            </button>

            @if (canCarryForward()) {
              <button
                type="button"
                (click)="carryForwardYesterday()"
                class="btn-secondary text-xs py-2 px-3 flex items-center space-x-1.5 text-brand-700 bg-brand-50 hover:bg-brand-100 border-brand-200"
              >
                <svg class="w-4 h-4 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
                <span>Carry Forward Yesterday's Unfinished</span>
              </button>
            }
          </div>
        </div>
      </div>

      <!-- Planned Topics Checklist -->
      <div class="card space-y-4">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 class="text-base font-bold text-slate-900 tracking-tight">Today's Topic Checklist</h3>
            <p class="text-xs text-slate-500">Check off completed topics to update your syllabus mastery</p>
          </div>
          <span class="text-xs text-slate-500 font-semibold">{{ goalTopics().length }} topics assigned</span>
        </div>

        <div class="space-y-2.5">
          @for (item of goalTopics(); track item.id) {
            <div
              class="flex items-center justify-between p-3.5 rounded-xl border transition-all"
              [ngClass]="item.is_completed ? 'bg-emerald-50/70 border-emerald-200' : 'bg-slate-50/70 border-slate-200/80 hover:bg-slate-50'"
            >
              <div class="flex items-center space-x-3.5 flex-1 min-w-0">
                <input
                  type="checkbox"
                  [checked]="item.is_completed"
                  (change)="toggleTopicCompletion(item)"
                  class="w-5 h-5 text-brand-600 rounded border-slate-300 focus:ring-brand-500 cursor-pointer"
                />

                <div class="flex-1 min-w-0">
                  <p
                    class="text-sm font-bold text-slate-900 truncate"
                    [class.line-through]="item.is_completed"
                    [class.text-slate-400]="item.is_completed"
                  >
                    {{ item.topic?.name || 'Topic' }}
                  </p>

                  <div class="flex items-center space-x-2 mt-0.5">
                    <span
                      class="text-[10px] font-semibold px-2 py-0.5 rounded-md text-white"
                      [style.background-color]="item.topic?.subject?.color || '#2563eb'"
                    >
                      {{ item.topic?.subject?.name || 'Subject' }}
                    </span>

                    @if (item.completed_at) {
                      <span class="text-[10px] text-emerald-700 font-medium">
                        ✓ Completed at {{ item.completed_at | date:'shortTime' }}
                      </span>
                    }
                  </div>
                </div>
              </div>

              <!-- Action buttons -->
              <div class="flex items-center space-x-2">
                <a
                  [routerLink]="['/study-sessions']"
                  [queryParams]="{ subjectId: item.topic?.subject_id, topicId: item.topic_id }"
                  class="p-1.5 text-slate-400 hover:text-brand-600 rounded-lg hover:bg-slate-100 transition-colors"
                  title="Start Timer for this topic"
                >
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </a>

                <button
                  type="button"
                  (click)="removeTopic(item)"
                  class="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                  title="Remove from today's plan"
                >
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          }

          @if (goalTopics().length === 0) {
            <div class="py-12 text-center">
              <div class="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-3">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h3 class="text-sm font-bold text-slate-800">No topics added to this plan</h3>
              <p class="text-xs text-slate-500 mt-1">Select topics from your syllabus to structure your day.</p>
              <button
                (click)="openTopicPickerModal()"
                class="btn-primary text-xs py-2 px-4 mt-4"
              >
                + Choose Topics from Syllabus
              </button>
            </div>
          }
        </div>
      </div>

      <!-- TOPIC PICKER MODAL -->
      @if (showTopicPickerModal()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div class="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 flex flex-col max-h-[85vh]">
            <div class="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 class="text-base font-bold text-slate-900">Select Topics from Syllabus</h3>
              <button (click)="showTopicPickerModal.set(false)" class="text-slate-400 hover:text-slate-600">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Subject filter chips inside modal -->
            <div class="flex flex-wrap gap-1.5 py-3 border-b border-slate-100">
              <button
                (click)="modalSubjectFilter.set(null)"
                class="px-2.5 py-1 text-xs font-semibold rounded-lg"
                [ngClass]="modalSubjectFilter() === null ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'"
              >
                All Subjects
              </button>
              @for (sub of subjects(); track sub.id) {
                <button
                  (click)="modalSubjectFilter.set(sub.id)"
                  class="px-2.5 py-1 text-xs font-semibold rounded-lg"
                  [ngClass]="modalSubjectFilter() === sub.id ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-700'"
                >
                  {{ sub.name }}
                </button>
              }
            </div>

            <!-- Available Topics List -->
            <div class="flex-1 overflow-y-auto py-3 space-y-2">
              @for (topic of unaddedAvailableTopics(); track topic.id) {
                <div class="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">
                  <div class="flex items-center space-x-2.5 flex-1 min-w-0 pr-2">
                    <span class="w-2.5 h-2.5 rounded-full flex-shrink-0" [style.background-color]="topic.subject?.color || '#2563eb'"></span>
                    <div class="truncate">
                      <p class="text-xs font-bold text-slate-800 truncate">{{ topic.name }}</p>
                      <span class="text-[10px] text-slate-500 capitalize">{{ topic.learning_status.replace('_', ' ') }}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    (click)="addTopicToPlan(topic)"
                    class="btn-primary text-xs py-1 px-3 flex-shrink-0"
                  >
                    + Add
                  </button>
                </div>
              }

              @if (unaddedAvailableTopics().length === 0) {
                <div class="py-8 text-center text-xs text-slate-400">
                  All available topics for this subject are already in your plan or completed!
                </div>
              }
            </div>

            <div class="pt-3 border-t border-slate-100 flex justify-end">
              <button (click)="showTopicPickerModal.set(false)" class="btn-secondary text-xs py-2 px-4">
                Done
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class DailyGoalsComponent implements OnInit {
  private dataStorage = inject(DataStorageService);
  private toast = inject(ToastService);

  public selectedDate = signal<string>(new Date().toISOString().split('T')[0]);
  public currentGoal = signal<DailyGoal | null>(null);
  public goalTopics = signal<DailyGoalTopic[]>([]);
  public allTopics = signal<Topic[]>([]);
  public subjects = signal<Subject[]>([]);

  // Config values
  public targetTopicCount: number = 3;
  public targetHours: number = 4.0;
  public goalNotes: string = '';

  // Topic picker modal state
  public showTopicPickerModal = signal<boolean>(false);
  public modalSubjectFilter = signal<string | null>(null);

  get isToday(): boolean {
    return this.selectedDate() === new Date().toISOString().split('T')[0];
  }

  get formattedSelectedDate(): string {
    const d = new Date(this.selectedDate());
    return d.toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }

  public completedTopicsCount = computed(() => {
    return this.goalTopics().filter(t => t.is_completed).length;
  });

  public remainingTopicsCount = computed(() => {
    return this.goalTopics().filter(t => !t.is_completed).length;
  });

  public completionPercentage = computed(() => {
    const total = this.goalTopics().length;
    if (total === 0) return 0;
    return Math.round((this.completedTopicsCount() / total) * 100);
  });

  get dayOutcomeLabel(): string {
    const total = this.goalTopics().length;
    if (total === 0) return 'Not Planned';
    const done = this.completedTopicsCount();
    if (done >= this.targetTopicCount) return '🎯 Target Achieved';
    if (done > 0) return '⚡ In Progress';
    return '⏳ Pending';
  }

  get dayOutcomeClass(): string {
    const total = this.goalTopics().length;
    if (total === 0) return 'text-slate-500';
    const done = this.completedTopicsCount();
    if (done >= this.targetTopicCount) return 'text-emerald-600';
    if (done > 0) return 'text-amber-600';
    return 'text-slate-600';
  }

  public unaddedAvailableTopics = computed(() => {
    const addedTopicIds = new Set(this.goalTopics().map(gt => gt.topic_id));
    const subId = this.modalSubjectFilter();

    return this.allTopics().filter(t => {
      if (addedTopicIds.has(t.id)) return false;
      if (subId && t.subject_id !== subId) return false;
      return true;
    });
  });

  async ngOnInit(): Promise<void> {
    await this.loadDayData();
  }

  changeDate(deltaDays: number): void {
    const current = new Date(this.selectedDate());
    current.setDate(current.getDate() + deltaDays);
    this.selectedDate.set(current.toISOString().split('T')[0]);
    this.loadDayData();
  }

  onDatePicked(newDate: string): void {
    if (newDate) {
      this.selectedDate.set(newDate);
      this.loadDayData();
    }
  }

  goToToday(): void {
    this.selectedDate.set(new Date().toISOString().split('T')[0]);
    this.loadDayData();
  }

  async loadDayData(): Promise<void> {
    const dateStr = this.selectedDate();
    const [goalData, topics, subs] = await Promise.all([
      this.dataStorage.getDailyGoal(dateStr),
      this.dataStorage.getTopics(),
      this.dataStorage.getSubjects()
    ]);

    this.currentGoal.set(goalData.goal);
    this.goalTopics.set(goalData.topics);
    this.allTopics.set(topics);
    this.subjects.set(subs);

    if (goalData.goal) {
      this.targetTopicCount = goalData.goal.target_topic_count;
      this.targetHours = goalData.goal.target_study_minutes / 60;
      this.goalNotes = goalData.goal.notes || '';
    } else {
      this.targetTopicCount = 3;
      this.targetHours = 4.0;
      this.goalNotes = '';
    }
  }

  async saveTargets(): Promise<void> {
    const dateStr = this.selectedDate();
    const targetMinutes = Math.round(this.targetHours * 60);

    const updated = await this.dataStorage.saveDailyGoal(
      dateStr,
      this.targetTopicCount,
      targetMinutes,
      this.goalNotes
    );

    this.currentGoal.set(updated);
    this.toast.success('Targets saved for ' + this.formattedSelectedDate);
  }

  async toggleTopicCompletion(item: DailyGoalTopic): Promise<void> {
    const newStatus = !item.is_completed;
    await this.dataStorage.toggleGoalTopicCompletion(item.id, newStatus);

    if (newStatus && item.topic_id) {
      await this.dataStorage.updateTopicStatus(item.topic_id, 'learned');
      this.toast.success(`Completed "${item.topic?.name || 'Topic'}"!`);
      try {
        confetti({ particleCount: 60, spread: 50, origin: { y: 0.6 } });
      } catch {}
    }

    await this.loadDayData();
  }

  async removeTopic(item: DailyGoalTopic): Promise<void> {
    await this.dataStorage.removeTopicFromDailyGoal(item.id);
    this.toast.info('Removed from plan');
    await this.loadDayData();
  }

  openTopicPickerModal(): void {
    this.modalSubjectFilter.set(null);
    this.showTopicPickerModal.set(true);
  }

  async addTopicToPlan(topic: Topic): Promise<void> {
    let goal = this.currentGoal();
    if (!goal) {
      goal = await this.dataStorage.saveDailyGoal(
        this.selectedDate(),
        this.targetTopicCount,
        Math.round(this.targetHours * 60),
        this.goalNotes
      );
      this.currentGoal.set(goal);
    }

    await this.dataStorage.addTopicToDailyGoal(goal.id, topic.id);
    this.toast.success(`Added "${topic.name}" to today's plan`);
    await this.loadDayData();
  }

  canCarryForward(): boolean {
    return this.isToday;
  }

  async carryForwardYesterday(): Promise<void> {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yStr = yesterday.toISOString().split('T')[0];

    const yData = await this.dataStorage.getDailyGoal(yStr);
    const unfinished = yData.topics.filter(t => !t.is_completed);

    if (unfinished.length === 0) {
      this.toast.info('No unfinished topics from yesterday to carry forward!');
      return;
    }

    let goal = this.currentGoal();
    if (!goal) {
      goal = await this.dataStorage.saveDailyGoal(
        this.selectedDate(),
        this.targetTopicCount,
        Math.round(this.targetHours * 60)
      );
      this.currentGoal.set(goal);
    }

    for (const item of unfinished) {
      await this.dataStorage.addTopicToDailyGoal(goal.id, item.topic_id);
    }

    this.toast.success(`Carried forward ${unfinished.length} unfinished topics!`);
    await this.loadDayData();
  }
}
