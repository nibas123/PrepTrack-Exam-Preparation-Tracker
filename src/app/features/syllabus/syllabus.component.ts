import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataStorageService } from '../../core/services/data-storage.service';
import { AnalyticsService } from '../../core/services/analytics.service';
import { ToastService } from '../../core/services/toast.service';
import {
  Topic,
  Subject,
  ExamSubject,
  LearningStatus,
  Priority,
  ExamStage,
} from '../../core/models/database.types';
import { ProgressBarComponent } from '../../shared/components/progress-bar/progress-bar.component';

@Component({
  selector: 'app-syllabus',
  standalone: true,
  imports: [CommonModule, FormsModule, ProgressBarComponent],
  template: `
    <div class="space-y-6">
      <!-- Header & Action Buttons -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
        <div>
          <h2 class="text-xl font-bold text-slate-900 tracking-tight">My Bank Exam Syllabus</h2>
          <p class="text-xs text-slate-500 mt-0.5">Manage and master topics across Prelims and Mains stages</p>
        </div>

        <div class="flex flex-wrap items-center gap-2.5">
          <!-- Add Subject Button -->
          <button
            type="button"
            (click)="openAddSubjectModal()"
            class="btn-secondary text-xs py-2 px-3 flex items-center space-x-1.5"
          >
            <svg class="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>Add Subject</span>
          </button>

          <!-- Add Topic Button -->
          <button
            type="button"
            (click)="openAddTopicModal()"
            class="btn-primary text-xs py-2 px-4 flex items-center space-x-1.5"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>Add Topic</span>
          </button>
        </div>
      <!-- Stage Progress Summary Bar -->
      <div class="card p-4">
        <div class="flex items-center justify-between text-xs font-bold mb-2">
          <span class="text-slate-800">Overall Stage Mastery ({{ selectedStage() | uppercase }})</span>
          <span class="text-brand-600">{{ stageCompletionPercentage() }}%</span>
        </div>
        <app-progress-bar
          [percentage]="stageCompletionPercentage()"
          color="#2563eb"
          [showLabel]="false"
          size="md"
        ></app-progress-bar>
      </div>

      <!-- Filters Toolbar -->
      <div class="card space-y-4">
        <!-- Stage Tabs & Search -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <!-- Stage Tabs -->
          <div class="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200/60 self-start">
            <button
              type="button"
              (click)="selectedStage.set('prelims')"
              class="px-4 py-1.5 text-xs font-bold rounded-lg transition-all"
              [ngClass]="selectedStage() === 'prelims' ? 'bg-white text-brand-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'"
            >
              Prelims
            </button>
            <button
              type="button"
              (click)="selectedStage.set('mains')"
              class="px-4 py-1.5 text-xs font-bold rounded-lg transition-all"
              [ngClass]="selectedStage() === 'mains' ? 'bg-white text-brand-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'"
            >
              Mains
            </button>
            <button
              type="button"
              (click)="selectedStage.set('both')"
              class="px-4 py-1.5 text-xs font-bold rounded-lg transition-all"
              [ngClass]="selectedStage() === 'both' ? 'bg-white text-brand-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'"
            >
              All Subjects
            </button>
          </div>

          <!-- Search Input -->
          <div class="relative w-full sm:w-72">
            <input
              type="text"
              [(ngModel)]="searchQuery"
              placeholder="Search topics (e.g. Puzzles)..."
              class="input-field pl-9 text-xs py-2"
            />
            <svg class="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <!-- Subject Pills Filter -->
        <div class="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            (click)="selectedSubjectId.set(null)"
            class="px-3 py-1 rounded-lg text-xs font-semibold transition-colors"
            [ngClass]="selectedSubjectId() === null ? 'bg-brand-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
          >
            All Subjects ({{ filteredByStageTopics().length }})
          </button>

          @for (sub of availableSubjects(); track sub.id) {
            <button
              type="button"
              (click)="selectedSubjectId.set(sub.id)"
              class="px-3 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors"
              [ngClass]="selectedSubjectId() === sub.id ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'"
            >
              <span class="w-2 h-2 rounded-full" [style.background-color]="sub.color"></span>
              <span>{{ sub.name }}</span>
            </button>
          }
        </div>

        <!-- Status & Priority Filters -->
        <div class="flex flex-wrap items-center gap-3 pt-2">
          <!-- Status Dropdown -->
          <select [(ngModel)]="statusFilter" class="input-field text-xs py-1.5 w-auto">
            <option value="all">All Statuses</option>
            <option value="not_started">Not Started</option>
            <option value="learning">Learning</option>
            <option value="learned">Learned</option>
            <option value="revision_completed">Revision Completed</option>
          </select>

          <!-- Priority Dropdown -->
          <select [(ngModel)]="priorityFilter" class="input-field text-xs py-1.5 w-auto">
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
        </div>
      </div>

      <!-- Topics List -->
      <div class="space-y-3">
        @for (topic of displayedTopics(); track topic.id) {
          <div class="card card-hover flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4">
            <!-- Left: Info -->
            <div class="flex items-start space-x-3.5 flex-1 min-w-0">
              <!-- Color Indicator -->
              <div
                class="w-3.5 h-3.5 rounded-full mt-1 flex-shrink-0"
                [style.background-color]="topic.subject?.color || '#2563eb'"
                title="{{ topic.subject?.name }}"
              ></div>

              <div class="flex-1 min-w-0">
                <div class="flex flex-wrap items-center gap-2">
                  <h4 class="text-sm font-bold text-slate-900 truncate">{{ topic.name }}</h4>

                  <!-- Subject Badge -->
                  <span
                    class="text-[10px] font-semibold px-2 py-0.5 rounded-md text-white"
                    [style.background-color]="topic.subject?.color || '#2563eb'"
                  >
                    {{ topic.subject?.name }}
                  </span>

                  <!-- Priority Badge -->
                  <span
                    class="text-[10px] font-semibold px-2 py-0.5 rounded-md"
                    [ngClass]="{
                      'bg-rose-50 text-rose-700 border border-rose-200': topic.priority === 'high',
                      'bg-amber-50 text-amber-700 border border-amber-200': topic.priority === 'medium',
                      'bg-slate-100 text-slate-600': topic.priority === 'low'
                    }"
                  >
                    {{ topic.priority | uppercase }}
                  </span>
                </div>

                @if (topic.description) {
                  <p class="text-xs text-slate-500 mt-1 line-clamp-1">{{ topic.description }}</p>
                }
              </div>
            </div>

            <!-- Right: Status Dropdown & Actions -->
            <div class="flex items-center space-x-3 self-end sm:self-auto">
              <!-- Status Selector -->
              <select
                [ngModel]="topic.learning_status"
                (ngModelChange)="onStatusChange(topic, $event)"
                class="text-xs font-semibold rounded-lg px-2.5 py-1.5 border cursor-pointer transition-colors focus:ring-1 focus:ring-brand-500 focus:outline-none"
                [ngClass]="getStatusBadgeClass(topic.learning_status)"
              >
                <option value="not_started">⚪ Not Started</option>
                <option value="learning">🟡 Learning</option>
                <option value="learned">🟢 Learned</option>
                <option value="revision_completed">🔵 Revision Completed</option>
              </select>

              <!-- Edit Action -->
              <button
                type="button"
                (click)="openEditTopicModal(topic)"
                class="p-1.5 text-slate-400 hover:text-brand-600 rounded-lg hover:bg-slate-100 transition-colors"
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

        <!-- Empty State -->
        @if (displayedTopics().length === 0) {
          <div class="card py-12 text-center">
            <div class="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-3">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 class="text-sm font-bold text-slate-800">No topics match your filters</h3>
            <p class="text-xs text-slate-500 mt-1 max-w-sm mx-auto">Try clearing your search query or add a new topic to this subject.</p>
            <button
              (click)="openAddTopicModal()"
              class="btn-primary text-xs py-2 px-4 mt-4 inline-flex items-center space-x-1.5"
            >
              <span>+ Add New Topic</span>
            </button>
          </div>
        }
      </div>

      <!-- ADD / EDIT TOPIC MODAL -->
      @if (showTopicModal()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div class="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
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
                <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Topic Name *</label>
                <input
                  type="text"
                  [(ngModel)]="topicForm.name"
                  placeholder="e.g. Circular Seating Arrangement"
                  class="input-field"
                />
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Subject *</label>
                <select [(ngModel)]="topicForm.subject_id" class="input-field">
                  @for (sub of allSubjects(); track sub.id) {
                    <option [value]="sub.id">{{ sub.name }}</option>
                  }
                </select>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Priority</label>
                  <select [(ngModel)]="topicForm.priority" class="input-field">
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>

                <div>
                  <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Status</label>
                  <select [(ngModel)]="topicForm.learning_status" class="input-field">
                    <option value="not_started">Not Started</option>
                    <option value="learning">Learning</option>
                    <option value="learned">Learned</option>
                    <option value="revision_completed">Revision Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Description / Notes</label>
                <textarea
                  [(ngModel)]="topicForm.description"
                  rows="2"
                  placeholder="Key concepts or weak spots..."
                  class="input-field"
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
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div class="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-200">
            <div class="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 class="text-base font-bold text-slate-900">Add Custom Subject</h3>
              <button (click)="showSubjectModal.set(false)" class="text-slate-400 hover:text-slate-600">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div class="mt-4 space-y-4">
              <div>
                <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Subject Name *</label>
                <input
                  type="text"
                  [(ngModel)]="subjectForm.name"
                  placeholder="e.g. Computer Aptitude, Descriptive English"
                  class="input-field"
                />
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Color Tag</label>
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
  private analytics = inject(AnalyticsService);
  private toast = inject(ToastService);

  public allTopics = signal<Topic[]>([]);
  public allSubjects = signal<Subject[]>([]);
  public examSubjects = signal<ExamSubject[]>([]);

  public selectedStage = signal<ExamStage>('prelims');
  public selectedSubjectId = signal<string | null>(null);
  public searchQuery = '';
  public statusFilter: string = 'all';
  public priorityFilter: string = 'all';

  // Modal states
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
    color: '#3b82f6'
  };

  // Filter subjects available in currently selected stage
  public availableSubjects = computed(() => {
    const stage = this.selectedStage();
    const subs = this.allSubjects();
    if (stage === 'both') return subs;

    const es = this.examSubjects().filter(item => item.stage === stage || item.stage === 'both');
    const validIds = new Set(es.map(item => item.subject_id));
    return subs.filter(s => validIds.has(s.id));
  });

  // Topics filtered by stage
  public filteredByStageTopics = computed(() => {
    const stage = this.selectedStage();
    const topics = this.allTopics();
    if (stage === 'both') return topics;

    const validSubIds = new Set(this.availableSubjects().map(s => s.id));
    return topics.filter(t => validSubIds.has(t.subject_id));
  });

  public stageCompletionPercentage = computed(() => {
    const list = this.filteredByStageTopics();
    if (list.length === 0) return 0;
    const completed = list.filter(t => t.learning_status === 'learned' || t.learning_status === 'revision_completed').length;
    return Math.round((completed / list.length) * 100);
  });

  // Final displayed topics after all filters
  public displayedTopics = computed(() => {
    let result = this.filteredByStageTopics();

    const subId = this.selectedSubjectId();
    if (subId) {
      result = result.filter(t => t.subject_id === subId);
    }

    if (this.statusFilter !== 'all') {
      result = result.filter(t => t.learning_status === this.statusFilter);
    }

    if (this.priorityFilter !== 'all') {
      result = result.filter(t => t.priority === this.priorityFilter);
    }

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(t =>
        t.name.toLowerCase().includes(q) ||
        (t.description && t.description.toLowerCase().includes(q)) ||
        (t.subject && t.subject.name.toLowerCase().includes(q))
      );
    }

    return result;
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
  }

  getStatusBadgeClass(status: LearningStatus): string {
    switch (status) {
      case 'not_started': return 'bg-slate-50 text-slate-700 border-slate-200';
      case 'learning': return 'bg-amber-50 text-amber-800 border-amber-300';
      case 'learned': return 'bg-emerald-50 text-emerald-800 border-emerald-300';
      case 'revision_completed': return 'bg-blue-50 text-blue-800 border-blue-300';
    }
  }

  async onStatusChange(topic: Topic, newStatus: LearningStatus): Promise<void> {
    await this.dataStorage.updateTopicStatus(topic.id, newStatus);
    this.toast.success(`Updated status for "${topic.name}"`);
    await this.loadData();
  }

  openAddTopicModal(): void {
    this.editingTopic.set(null);
    const firstSub = this.availableSubjects()[0]?.id || this.allSubjects()[0]?.id || '';
    this.topicForm = {
      name: '',
      subject_id: firstSub,
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
      this.toast.error('Please enter a topic name and choose a subject');
      return;
    }

    const editing = this.editingTopic();
    if (editing) {
      await this.dataStorage.saveTopic({
        ...editing,
        ...this.topicForm
      });
      this.toast.success('Topic updated successfully');
    } else {
      await this.dataStorage.saveTopic(this.topicForm);
      this.toast.success('New topic added to syllabus');
    }

    this.closeTopicModal();
    await this.loadData();
  }

  async confirmDeleteTopic(topic: Topic): Promise<void> {
    if (confirm(`Are you sure you want to delete topic "${topic.name}"?`)) {
      await this.dataStorage.deleteTopic(topic.id);
      this.toast.info(`Deleted "${topic.name}"`);
      await this.loadData();
    }
  }

  openAddSubjectModal(): void {
    this.subjectForm = { name: '', color: '#0284c7' };
    this.showSubjectModal.set(true);
  }

  async saveSubjectForm(): Promise<void> {
    if (!this.subjectForm.name.trim()) {
      this.toast.error('Please enter a subject name');
      return;
    }

    await this.dataStorage.saveSubject({
      name: this.subjectForm.name.trim(),
      color: this.subjectForm.color
    });

    this.toast.success(`Subject "${this.subjectForm.name}" created!`);
    this.showSubjectModal.set(false);
    await this.loadData();
  }
}
