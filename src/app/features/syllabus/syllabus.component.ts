import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DataStorageService } from '../../core/services/data-storage.service';
import { ToastService } from '../../core/services/toast.service';
import {
  Topic,
  Subject,
  ExamSubject,
  LearningStatus,
  ExamStage,
} from '../../core/models/database.types';
import confetti from 'canvas-confetti';

@Component({
  selector: 'app-syllabus',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="space-y-6 max-w-6xl mx-auto">
      <!-- Clean Minimalist Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div class="flex items-center space-x-2.5">
            <h2 class="text-xl font-bold text-slate-900 tracking-tight">Syllabus Tracker</h2>
            <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-brand-50 text-brand-700 border border-brand-100">
              {{ selectedStage() | uppercase }}
            </span>
          </div>
          <p class="text-xs text-slate-500 mt-0.5">Master topics systematically for Indian Bank Prelims & Mains</p>
        </div>

        <!-- Right: Actions & Stage Toggle -->
        <div class="flex flex-wrap items-center gap-3">
          <!-- Stage Switcher -->
          <div class="inline-flex p-1 bg-slate-100/80 rounded-xl border border-slate-200/50">
            <button
              type="button"
              (click)="selectStage('prelims')"
              class="px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all"
              [ngClass]="selectedStage() === 'prelims' ? 'bg-white text-brand-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'"
            >
              Prelims (3 Subjects)
            </button>
            <button
              type="button"
              (click)="selectStage('mains')"
              class="px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all"
              [ngClass]="selectedStage() === 'mains' ? 'bg-white text-brand-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'"
            >
              Mains (5 Subjects)
            </button>
          </div>

          <!-- Add Topic Button -->
          <button
            type="button"
            (click)="openAddTopicModal()"
            class="btn-primary text-xs py-2 px-3.5 flex items-center space-x-1.5 shadow-xs"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
            </svg>
            <span>Add Topic</span>
          </button>
        </div>
      </div>

      <!-- Stage Mastery Meter Banner (Clean & Spacious) -->
      <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Preparation Progress</span>
            <div class="flex items-baseline space-x-2 mt-0.5">
              <span class="text-3xl font-black text-slate-900 tracking-tight">{{ stageCompletionPercentage() }}%</span>
              <span class="text-xs text-slate-500 font-medium">
                ({{ completedTopicsCount() }} of {{ stageTopics().length }} topics completed)
              </span>
            </div>
          </div>

          <!-- Status Quick Filter Pills -->
          <div class="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              (click)="statusFilter.set('all')"
              class="px-3 py-1 rounded-lg text-xs font-bold transition-all"
              [ngClass]="statusFilter() === 'all' ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'"
            >
              All ({{ stageTopics().length }})
            </button>
            <button
              type="button"
              (click)="statusFilter.set('learned')"
              class="px-3 py-1 rounded-lg text-xs font-bold transition-all"
              [ngClass]="statusFilter() === 'learned' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'"
            >
              Mastered ({{ masteredCount() }})
            </button>
            <button
              type="button"
              (click)="statusFilter.set('learning')"
              class="px-3 py-1 rounded-lg text-xs font-bold transition-all"
              [ngClass]="statusFilter() === 'learning' ? 'bg-amber-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'"
            >
              Learning ({{ learningCount() }})
            </button>
            <button
              type="button"
              (click)="statusFilter.set('not_started')"
              class="px-3 py-1 rounded-lg text-xs font-bold transition-all"
              [ngClass]="statusFilter() === 'not_started' ? 'bg-slate-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'"
            >
              Not Started ({{ notStartedCount() }})
            </button>
          </div>
        </div>

        <!-- Sleek Slim Progress Line -->
        <div class="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-4">
          <div
            class="h-full bg-brand-600 rounded-full transition-all duration-700 ease-out"
            [style.width.%]="stageCompletionPercentage()"
          ></div>
        </div>
      </div>

      <!-- Subject Tabs & Search -->
      <div class="space-y-3">
        <!-- Horizontal Subject Tabs -->
        <div class="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
          @for (sub of stageSubjects(); track sub.id) {
            <button
              type="button"
              (click)="activeSubjectId.set(sub.id)"
              class="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border"
              [ngClass]="activeSubjectId() === sub.id ? 'bg-white text-slate-900 border-slate-300 shadow-xs' : 'bg-white/60 text-slate-600 border-slate-200/70 hover:bg-white hover:text-slate-900'"
            >
              <span class="w-2.5 h-2.5 rounded-full" [style.background-color]="sub.color"></span>
              <span>{{ sub.name }}</span>
              <span
                class="px-1.5 py-0.5 rounded-md text-[10px] font-bold"
                [ngClass]="activeSubjectId() === sub.id ? 'bg-slate-100 text-slate-800' : 'bg-slate-100/80 text-slate-500'"
              >
                {{ getSubjectCompletedCount(sub.id) }}/{{ getSubjectTotalCount(sub.id) }}
              </span>
            </button>
          }

          <button
            type="button"
            (click)="openAddSubjectModal()"
            class="px-3 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-white border border-dashed border-slate-300 transition-colors whitespace-nowrap"
          >
            + Add Subject
          </button>
        </div>

        <!-- Search Bar within Subject -->
        <div class="relative">
          <input
            type="text"
            [(ngModel)]="searchQuery"
            placeholder="Filter topics in this subject (e.g. Puzzles, Simplification, Syllogism)..."
            class="w-full bg-white border border-slate-200/80 rounded-xl px-4 py-2.5 pl-10 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-500 shadow-2xs"
          />
          <svg class="w-4 h-4 text-slate-400 absolute left-3.5 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <!-- Clean Elegant Topic Rows -->
      <div class="bg-white rounded-2xl border border-slate-200/80 shadow-xs divide-y divide-slate-100 overflow-hidden">
        @for (topic of displayedSubjectTopics(); track topic.id) {
          <div class="p-4 sm:px-6 hover:bg-slate-50/70 transition-colors flex items-center justify-between gap-4 group">
            <!-- Left: Interactive Status Cycle Button & Title -->
            <div class="flex items-center space-x-3.5 flex-1 min-w-0">
              <!-- Clickable Status Icon -->
              <button
                type="button"
                (click)="cycleTopicStatus(topic)"
                class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-transform active:scale-95 border"
                [ngClass]="getStatusButtonClass(topic.learning_status)"
                [title]="'Current: ' + formatStatusName(topic.learning_status) + ' (Click to change status)'"
              >
                @if (topic.learning_status === 'learned' || topic.learning_status === 'revision_completed') {
                  <svg class="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                } @else if (topic.learning_status === 'learning') {
                  <span class="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
                } @else {
                  <span class="w-2 h-2 rounded-full bg-slate-300"></span>
                }
              </button>

              <div class="flex-1 min-w-0">
                <div class="flex items-center space-x-2">
                  <h4
                    class="text-sm font-bold text-slate-900 truncate"
                    [class.line-through]="topic.learning_status === 'learned' || topic.learning_status === 'revision_completed'"
                    [class.text-slate-400]="topic.learning_status === 'learned' || topic.learning_status === 'revision_completed'"
                  >
                    {{ topic.name }}
                  </h4>

                  <!-- Subtle Priority Pill -->
                  <span
                    class="text-[10px] font-bold px-2 py-0.2 rounded-full"
                    [ngClass]="{
                      'bg-rose-50 text-rose-700': topic.priority === 'high',
                      'bg-amber-50 text-amber-700': topic.priority === 'medium',
                      'bg-slate-100 text-slate-500': topic.priority === 'low'
                    }"
                  >
                    {{ topic.priority | uppercase }}
                  </span>
                </div>

                @if (topic.description) {
                  <p class="text-xs text-slate-500 mt-0.5 truncate">{{ topic.description }}</p>
                }
              </div>
            </div>

            <!-- Right: Status Dropdown & Actions -->
            <div class="flex items-center space-x-3 flex-shrink-0">
              <!-- Clean Status Pill Selector -->
              <select
                [ngModel]="topic.learning_status"
                (ngModelChange)="onStatusSelected(topic, $event)"
                class="text-xs font-bold rounded-lg px-2.5 py-1.5 border border-slate-200/80 bg-white text-slate-700 cursor-pointer focus:ring-1 focus:ring-brand-500 focus:outline-none"
              >
                <option value="not_started">⚪ Not Started</option>
                <option value="learning">🟡 Learning</option>
                <option value="learned">🟢 Learned</option>
                <option value="revision_completed">🔵 Revision Completed</option>
              </select>

              <!-- Focus Stopwatch Quick Launch -->
              <a
                [routerLink]="['/study-sessions']"
                [queryParams]="{ subjectId: topic.subject_id, topicId: topic.id }"
                class="p-1.5 text-slate-400 hover:text-brand-600 rounded-lg hover:bg-brand-50 transition-colors"
                title="Start Stopwatch for this topic"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </a>

              <!-- Practice Quiz Quick Launch -->
              <a
                [routerLink]="['/quizzes']"
                [queryParams]="{ topicName: topic.name }"
                class="p-1.5 text-slate-400 hover:text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors"
                title="Start Practice Quiz Drill on this topic"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </a>

              <!-- Edit Action -->
              <button
                type="button"
                (click)="openEditTopicModal(topic)"
                class="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                title="Edit Topic"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>

              <!-- Delete Action -->
              <button
                type="button"
                (click)="confirmDeleteTopic(topic)"
                class="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                title="Delete Topic"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        }

        <!-- Empty State in Subject -->
        @if (displayedSubjectTopics().length === 0) {
          <div class="py-16 text-center px-4">
            <div class="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-3">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h4 class="text-sm font-bold text-slate-800">No topics match your criteria</h4>
            <p class="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Add your first topic to this subject or clear your filter.
            </p>
            <button
              (click)="openAddTopicModal()"
              class="btn-primary text-xs py-2 px-4 mt-4"
            >
              + Add Topic to {{ activeSubjectName() }}
            </button>
          </div>
        }
      </div>

      <!-- ADD / EDIT TOPIC MODAL -->
      @if (showTopicModal()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div class="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div class="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 class="text-base font-bold text-slate-900">{{ editingTopic() ? 'Edit Topic' : 'Add New Topic' }}</h3>
              <button (click)="closeTopicModal()" class="text-slate-400 hover:text-slate-600">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div class="mt-4 space-y-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Topic Name *</label>
                <input
                  type="text"
                  [(ngModel)]="topicForm.name"
                  placeholder="e.g. Floor and Flat Puzzles"
                  class="input-field"
                />
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Subject</label>
                <select [(ngModel)]="topicForm.subject_id" class="input-field">
                  @for (sub of stageSubjects(); track sub.id) {
                    <option [value]="sub.id">{{ sub.name }}</option>
                  }
                </select>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Priority</label>
                  <select [(ngModel)]="topicForm.priority" class="input-field">
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </select>
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Status</label>
                  <select [(ngModel)]="topicForm.learning_status" class="input-field">
                    <option value="not_started">Not Started</option>
                    <option value="learning">Learning</option>
                    <option value="learned">Learned</option>
                    <option value="revision_completed">Revision Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Description / Notes (Optional)</label>
                <textarea
                  [(ngModel)]="topicForm.description"
                  rows="2"
                  placeholder="Formulas, trick notes, or question types..."
                  class="input-field text-xs"
                ></textarea>
              </div>
            </div>

            <div class="mt-6 flex justify-end space-x-3 pt-3 border-t border-slate-100">
              <button (click)="closeTopicModal()" class="btn-secondary text-xs py-2 px-3">Cancel</button>
              <button (click)="saveTopicForm()" class="btn-primary text-xs py-2 px-4">
                {{ editingTopic() ? 'Save Changes' : 'Create Topic' }}
              </button>
            </div>
          </div>
        </div>
      }

      <!-- ADD CUSTOM SUBJECT MODAL -->
      @if (showSubjectModal()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div class="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200">
            <div class="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 class="text-base font-bold text-slate-900">Add New Subject</h3>
              <button (click)="showSubjectModal.set(false)" class="text-slate-400 hover:text-slate-600">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div class="mt-4 space-y-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Subject Name *</label>
                <input
                  type="text"
                  [(ngModel)]="subjectForm.name"
                  placeholder="e.g. Computer Aptitude, Descriptive English"
                  class="input-field"
                />
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Color Tag</label>
                <div class="flex items-center space-x-2">
                  <input
                    type="color"
                    [(ngModel)]="subjectForm.color"
                    class="w-10 h-9 p-1 rounded-lg border border-slate-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    [(ngModel)]="subjectForm.color"
                    class="input-field flex-1"
                  />
                </div>
              </div>
            </div>

            <div class="mt-6 flex justify-end space-x-3 pt-3 border-t border-slate-100">
              <button (click)="showSubjectModal.set(false)" class="btn-secondary text-xs py-2 px-3">Cancel</button>
              <button (click)="saveSubjectForm()" class="btn-primary text-xs py-2 px-4">Create Subject</button>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class SyllabusComponent implements OnInit {
  private dataStorage = inject(DataStorageService);
  private toast = inject(ToastService);

  public allTopics = signal<Topic[]>([]);
  public allSubjects = signal<Subject[]>([]);
  public examSubjects = signal<ExamSubject[]>([]);

  public selectedStage = signal<ExamStage>('prelims');
  public activeSubjectId = signal<string>('');
  public statusFilter = signal<string>('all');
  public searchQuery = '';

  // Modals
  public showTopicModal = signal<boolean>(false);
  public editingTopic = signal<Topic | null>(null);
  public topicForm: Partial<Topic> = {
    name: '',
    subject_id: '',
    priority: 'medium',
    learning_status: 'not_started',
    description: ''
  };

  public showSubjectModal = signal<boolean>(false);
  public subjectForm = {
    name: '',
    color: '#0891b2'
  };

  // Subjects available for current stage
  public stageSubjects = computed(() => {
    const stage = this.selectedStage();
    const subs = this.allSubjects();
    const es = this.examSubjects().filter(item => item.stage === stage || item.stage === 'both');
    const validIds = new Set(es.map(item => item.subject_id));
    const filtered = subs.filter(s => validIds.has(s.id));
    return filtered.length > 0 ? filtered : subs;
  });

  // Topics for current stage
  public stageTopics = computed(() => {
    const validSubIds = new Set(this.stageSubjects().map(s => s.id));
    return this.allTopics().filter(t => validSubIds.has(t.subject_id));
  });

  public completedTopicsCount = computed(() => {
    return this.stageTopics().filter(t => t.learning_status === 'learned' || t.learning_status === 'revision_completed').length;
  });

  public masteredCount = computed(() => {
    return this.stageTopics().filter(t => t.learning_status === 'learned' || t.learning_status === 'revision_completed').length;
  });

  public learningCount = computed(() => {
    return this.stageTopics().filter(t => t.learning_status === 'learning').length;
  });

  public notStartedCount = computed(() => {
    return this.stageTopics().filter(t => t.learning_status === 'not_started').length;
  });

  public stageCompletionPercentage = computed(() => {
    const total = this.stageTopics().length;
    if (total === 0) return 0;
    return Math.round((this.completedTopicsCount() / total) * 100);
  });

  public activeSubjectName = computed(() => {
    const sub = this.stageSubjects().find(s => s.id === this.activeSubjectId());
    return sub?.name || 'Subject';
  });

  // Final displayed topics for active subject & filters
  public displayedSubjectTopics = computed(() => {
    const subId = this.activeSubjectId();
    let list = this.stageTopics().filter(t => t.subject_id === subId);

    const sFilter = this.statusFilter();
    if (sFilter === 'learned') {
      list = list.filter(t => t.learning_status === 'learned' || t.learning_status === 'revision_completed');
    } else if (sFilter !== 'all') {
      list = list.filter(t => t.learning_status === sFilter);
    }

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      list = list.filter(t =>
        t.name.toLowerCase().includes(q) ||
        (t.description && t.description.toLowerCase().includes(q))
      );
    }

    return list;
  });

  async ngOnInit(): Promise<void> {
    await this.loadData();
  }

  async loadData(): Promise<void> {
    const [topics, subjects, examSubs] = await Promise.all([
      this.dataStorage.getTopics(),
      this.dataStorage.getSubjects(),
      this.dataStorage.getExamSubjects(),
    ]);

    this.allTopics.set(topics);
    this.allSubjects.set(subjects);
    this.examSubjects.set(examSubs);

    // Default active subject if not set or invalid
    const available = this.stageSubjects();
    if (available.length > 0 && (!this.activeSubjectId() || !available.some(s => s.id === this.activeSubjectId()))) {
      this.activeSubjectId.set(available[0].id);
    }
  }

  selectStage(stage: ExamStage): void {
    this.selectedStage.set(stage);
    const available = this.stageSubjects();
    if (available.length > 0) {
      this.activeSubjectId.set(available[0].id);
    }
  }

  getSubjectTotalCount(subId: string): number {
    return this.stageTopics().filter(t => t.subject_id === subId).length;
  }

  getSubjectCompletedCount(subId: string): number {
    return this.stageTopics().filter(t => t.subject_id === subId && (t.learning_status === 'learned' || t.learning_status === 'revision_completed')).length;
  }

  formatStatusName(status: LearningStatus): string {
    switch (status) {
      case 'not_started': return 'Not Started';
      case 'learning': return 'Learning';
      case 'learned': return 'Learned';
      case 'revision_completed': return 'Revision Done';
    }
  }

  getStatusButtonClass(status: LearningStatus): string {
    switch (status) {
      case 'learned':
      case 'revision_completed':
        return 'bg-emerald-50 border-emerald-300';
      case 'learning':
        return 'bg-amber-50 border-amber-300';
      case 'not_started':
      default:
        return 'bg-slate-50 border-slate-200 hover:border-slate-300';
    }
  }

  // Quick 1-click status cycling: not_started -> learning -> learned -> not_started
  async cycleTopicStatus(topic: Topic): Promise<void> {
    let next: LearningStatus;
    switch (topic.learning_status) {
      case 'not_started': next = 'learning'; break;
      case 'learning': next = 'learned'; break;
      case 'learned': next = 'revision_completed'; break;
      default: next = 'not_started'; break;
    }

    await this.dataStorage.updateTopicStatus(topic.id, next);

    if (next === 'learned' || next === 'revision_completed') {
      this.toast.success(`Marked "${topic.name}" as Completed!`);
      try {
        confetti({ particleCount: 40, spread: 45, origin: { y: 0.6 } });
      } catch {}
    } else {
      this.toast.info(`Updated "${topic.name}" to ${this.formatStatusName(next)}`);
    }

    await this.loadData();
  }

  async onStatusSelected(topic: Topic, newStatus: LearningStatus): Promise<void> {
    await this.dataStorage.updateTopicStatus(topic.id, newStatus);
    this.toast.success(`Updated "${topic.name}" to ${this.formatStatusName(newStatus)}`);
    await this.loadData();
  }

  openAddTopicModal(): void {
    this.editingTopic.set(null);
    this.topicForm = {
      name: '',
      subject_id: this.activeSubjectId() || this.stageSubjects()[0]?.id || '',
      priority: 'medium',
      learning_status: 'not_started',
      description: ''
    };
    this.showTopicModal.set(true);
  }

  openEditTopicModal(topic: Topic): void {
    this.editingTopic.set(topic);
    this.topicForm = {
      name: topic.name,
      subject_id: topic.subject_id,
      priority: topic.priority,
      learning_status: topic.learning_status,
      description: topic.description || ''
    };
    this.showTopicModal.set(true);
  }

  closeTopicModal(): void {
    this.showTopicModal.set(false);
    this.editingTopic.set(null);
  }

  async saveTopicForm(): Promise<void> {
    if (!this.topicForm.name?.trim() || !this.topicForm.subject_id) {
      this.toast.error('Please enter topic name and select subject');
      return;
    }

    const editing = this.editingTopic();
    if (editing) {
      await this.dataStorage.saveTopic({
        ...editing,
        ...this.topicForm
      });
      this.toast.success('Topic updated');
    } else {
      await this.dataStorage.saveTopic(this.topicForm);
      this.toast.success('Topic added to syllabus');
    }

    this.closeTopicModal();
    await this.loadData();
  }

  async confirmDeleteTopic(topic: Topic): Promise<void> {
    if (confirm(`Delete topic "${topic.name}"?`)) {
      await this.dataStorage.deleteTopic(topic.id);
      this.toast.info(`Deleted "${topic.name}"`);
      await this.loadData();
    }
  }

  openAddSubjectModal(): void {
    this.subjectForm = { name: '', color: '#0891b2' };
    this.showSubjectModal.set(true);
  }

  async saveSubjectForm(): Promise<void> {
    if (!this.subjectForm.name.trim()) {
      this.toast.error('Please enter a subject name');
      return;
    }

    const created = await this.dataStorage.saveSubject({
      name: this.subjectForm.name.trim(),
      color: this.subjectForm.color
    });

    this.toast.success(`Subject "${created.name}" created!`);
    this.showSubjectModal.set(false);
    await this.loadData();
    this.activeSubjectId.set(created.id);
  }
}
