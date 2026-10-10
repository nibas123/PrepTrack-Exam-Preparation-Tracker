import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataStorageService } from '../../core/services/data-storage.service';
import { ToastService } from '../../core/services/toast.service';
import {
  MockExam,
  Exam,
} from '../../core/models/database.types';
import confetti from 'canvas-confetti';

@Component({
  selector: 'app-mock-exams',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
        <div>
          <h2 class="text-xl font-bold text-slate-900 tracking-tight">Mock Exam Analytics & Tracker</h2>
          <p class="text-xs text-slate-500 mt-0.5">Track your test series scores, percentiles, and weak topic patterns</p>
        </div>

        <button
          type="button"
          (click)="openAddMockModal()"
          class="btn-primary text-xs py-2 px-4 flex items-center space-x-1.5 self-start sm:self-auto"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>Log Mock Exam</span>
        </button>
      </div>

      <!-- Key Analytics Metrics Cards -->
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div class="card p-4">
          <span class="text-[11px] font-semibold text-slate-500 uppercase">Total Attended</span>
          <p class="text-2xl font-black text-slate-900 mt-1">{{ mockExams().length }}</p>
          <span class="text-[10px] text-slate-400">Total attempts</span>
        </div>

        <div class="card p-4">
          <span class="text-[11px] font-semibold text-slate-500 uppercase">Prelims / Mains</span>
          <p class="text-2xl font-black text-slate-900 mt-1">{{ prelimsCount() }} / {{ mainsCount() }}</p>
          <span class="text-[10px] text-slate-400">Stage breakdown</span>
        </div>

        <div class="card p-4">
          <span class="text-[11px] font-semibold text-slate-500 uppercase">Average Score</span>
          <p class="text-2xl font-black text-brand-600 mt-1">{{ averagePercentage() }}%</p>
          <span class="text-[10px] text-slate-400">Calculated per test</span>
        </div>

        <div class="card p-4">
          <span class="text-[11px] font-semibold text-slate-500 uppercase">Best Score</span>
          <p class="text-2xl font-black text-emerald-600 mt-1">{{ bestPercentage() }}%</p>
          <span class="text-[10px] text-slate-400">Peak performance</span>
        </div>

        <div class="card p-4 col-span-2 sm:col-span-1">
          <span class="text-[11px] font-semibold text-slate-500 uppercase">Latest Score</span>
          <p class="text-2xl font-black text-slate-900 mt-1">{{ latestScore() }}</p>
          <span class="text-[10px] text-slate-400">{{ latestAttemptDate() }}</span>
        </div>
      </div>

      <!-- Score Progression Chart Card -->
      @if (mockExams().length > 0) {
        <div class="card space-y-3">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 class="text-sm font-bold text-slate-900">Score Progression Over Time (%)</h3>
              <p class="text-xs text-slate-500">Visual trend across sequential attempts</p>
            </div>
            <span class="text-xs font-semibold text-brand-600">Aim for 70%+ in Prelims</span>
          </div>

          <!-- Trend Bars -->
          <div class="pt-4 flex items-end justify-between space-x-2 sm:space-x-4 h-48 px-2 overflow-x-auto">
            @for (m of chronologicalMocks(); track m.id) {
              <div class="flex flex-col items-center min-w-[3rem] flex-1">
                <span class="text-[11px] font-extrabold text-slate-800 mb-1">
                  {{ getMockPercentage(m) }}%
                </span>
                <div class="w-full bg-slate-100 rounded-t-lg h-32 relative flex items-end overflow-hidden">
                  <div
                    class="w-full rounded-t-lg transition-all duration-500"
                    [ngClass]="getMockPercentage(m) >= 65 ? 'bg-emerald-500' : (getMockPercentage(m) >= 50 ? 'bg-brand-500' : 'bg-amber-500')"
                    [style.height.%]="getMockPercentage(m)"
                  ></div>
                </div>
                <span class="text-[10px] font-bold text-slate-600 truncate max-w-[4.5rem] mt-1.5" title="{{ m.name }}">
                  {{ m.name }}
                </span>
                <span class="text-[9px] text-slate-400 uppercase font-semibold">
                  {{ m.exam_stage }}
                </span>
              </div>
            }
          </div>
        </div>
      }

      <!-- History Table & Filters -->
      <div class="card space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 class="text-base font-bold text-slate-900 tracking-tight">Mock Exam Records</h3>
            <p class="text-xs text-slate-500">Search and filter your past test attempts</p>
          </div>

          <!-- Filters -->
          <div class="flex items-center space-x-3">
            <select [(ngModel)]="stageFilter" class="input-field text-xs py-1.5 w-auto">
              <option value="all">All Stages</option>
              <option value="prelims">Prelims</option>
              <option value="mains">Mains</option>
            </select>

            <input
              type="text"
              [(ngModel)]="searchQuery"
              placeholder="Search mocks..."
              class="input-field text-xs py-1.5 w-44"
            />
          </div>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead>
              <tr class="border-b border-slate-200 text-slate-400 uppercase font-semibold">
                <th class="py-3 px-3">Date</th>
                <th class="py-3 px-3">Mock Name</th>
                <th class="py-3 px-3">Stage</th>
                <th class="py-3 px-3">Marks</th>
                <th class="py-3 px-3">Percentage</th>
                <th class="py-3 px-3">Accuracy</th>
                <th class="py-3 px-3">Weak Areas & Feedback</th>
                <th class="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-slate-700">
              @for (mock of filteredMocks(); track mock.id) {
                <tr class="hover:bg-slate-50/80 transition-colors">
                  <td class="py-3.5 px-3 font-semibold text-slate-900 whitespace-nowrap">
                    {{ mock.attended_at }}
                  </td>
                  <td class="py-3.5 px-3 font-bold text-slate-900">
                    {{ mock.name }}
                  </td>
                  <td class="py-3.5 px-3 whitespace-nowrap">
                    <span
                      class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase"
                      [ngClass]="mock.exam_stage === 'prelims' ? 'bg-sky-50 text-sky-700 border border-sky-200' : 'bg-purple-50 text-purple-700 border border-purple-200'"
                    >
                      {{ mock.exam_stage }}
                    </span>
                  </td>
                  <td class="py-3.5 px-3 font-extrabold text-slate-900 whitespace-nowrap">
                    {{ mock.marks_obtained }} / {{ mock.maximum_marks }}
                  </td>
                  <td class="py-3.5 px-3 whitespace-nowrap">
                    <span
                      class="px-2 py-0.5 rounded-md font-bold text-xs"
                      [ngClass]="getMockPercentage(mock) >= 65 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'"
                    >
                      {{ getMockPercentage(mock) }}%
                    </span>
                  </td>
                  <td class="py-3.5 px-3 whitespace-nowrap">
                    @if (getAccuracy(mock); as acc) {
                      <span class="font-semibold text-slate-700">{{ acc }}%</span>
                      <span class="block text-[10px] text-slate-400 font-normal">
                        ({{ mock.correct_answers }}/{{ mock.attempted_questions }})
                      </span>
                    } @else {
                      <span class="text-slate-400">—</span>
                    }
                  </td>
                  <td class="py-3.5 px-3 max-w-xs truncate text-slate-500">
                    {{ mock.weak_areas || mock.notes || '—' }}
                  </td>
                  <td class="py-3.5 px-3 text-right whitespace-nowrap">
                    <button
                      type="button"
                      (click)="openEditMockModal(mock)"
                      class="p-1 text-slate-400 hover:text-brand-600 rounded-lg hover:bg-slate-100 transition-colors mr-1"
                      title="Edit"
                    >
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      (click)="deleteMock(mock)"
                      class="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Delete"
                    >
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </td>
                </tr>
              }

              @if (filteredMocks().length === 0) {
                <tr>
                  <td colspan="8" class="py-12 text-center text-slate-400">
                    No mock exams match your query. Click "+ Log Mock Exam" to record your test score.
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <!-- LOG / EDIT MOCK EXAM MODAL -->
      @if (showMockModal()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div class="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 flex flex-col max-h-[90vh] overflow-y-auto">
            <div class="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 class="text-base font-bold text-slate-900">
                {{ editingMock() ? 'Edit Mock Exam Record' : 'Log New Mock Exam Attempt' }}
              </h3>
              <button (click)="showMockModal.set(false)" class="text-slate-400 hover:text-slate-600">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div class="mt-4 space-y-4">
              <div>
                <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Mock Exam Name *</label>
                <input
                  type="text"
                  [(ngModel)]="mockForm.name"
                  placeholder="e.g. IBPS PO Prelims 2026 - Testbook Mock 3"
                  class="input-field"
                />
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Exam Stage</label>
                  <select [(ngModel)]="mockForm.exam_stage" class="input-field">
                    <option value="prelims">Prelims</option>
                    <option value="mains">Mains</option>
                  </select>
                </div>

                <div>
                  <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Date Attended *</label>
                  <input type="date" [(ngModel)]="mockForm.attended_at" class="input-field text-xs" />
                </div>
              </div>

              <!-- Marks with Validation -->
              <div class="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Marks Obtained *</label>
                  <input
                    type="number"
                    step="0.25"
                    min="0"
                    [(ngModel)]="mockForm.marks_obtained"
                    class="input-field font-bold"
                  />
                </div>

                <div>
                  <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Maximum Marks *</label>
                  <input
                    type="number"
                    step="1"
                    min="1"
                    [(ngModel)]="mockForm.maximum_marks"
                    class="input-field font-bold"
                  />
                </div>

                @if (mockForm.marks_obtained > mockForm.maximum_marks) {
                  <p class="text-xs text-rose-600 col-span-2 font-medium">
                    ⚠️ Marks obtained cannot exceed maximum marks!
                  </p>
                }
              </div>

              <!-- Optional Questions & Accuracy Breakdown -->
              <div class="grid grid-cols-3 gap-2">
                <div>
                  <label class="block text-[11px] font-semibold text-slate-600 mb-1">Total Qs</label>
                  <input
                    type="number"
                    [(ngModel)]="mockForm.total_questions"
                    placeholder="100"
                    class="input-field text-xs text-center"
                  />
                </div>
                <div>
                  <label class="block text-[11px] font-semibold text-slate-600 mb-1">Attempted</label>
                  <input
                    type="number"
                    [(ngModel)]="mockForm.attempted_questions"
                    placeholder="82"
                    class="input-field text-xs text-center"
                  />
                </div>
                <div>
                  <label class="block text-[11px] font-semibold text-slate-600 mb-1">Correct</label>
                  <input
                    type="number"
                    [(ngModel)]="mockForm.correct_answers"
                    placeholder="74"
                    class="input-field text-xs text-center"
                  />
                </div>
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Weak Areas Identified</label>
                <textarea
                  [(ngModel)]="mockForm.weak_areas"
                  rows="2"
                  placeholder="e.g. Lost 5 minutes on Box puzzle, negative marking in English Cloze test..."
                  class="input-field text-xs"
                ></textarea>
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Strategy & Action Notes</label>
                <textarea
                  [(ngModel)]="mockForm.notes"
                  rows="2"
                  placeholder="e.g. Skip high variable puzzles in first 10 minutes..."
                  class="input-field text-xs"
                ></textarea>
              </div>
            </div>

            <div class="mt-6 flex justify-end space-x-3 pt-3 border-t border-slate-100">
              <button (click)="showMockModal.set(false)" class="btn-secondary text-xs py-2 px-3">Cancel</button>
              <button
                (click)="saveMockForm()"
                [disabled]="mockForm.marks_obtained < 0 || mockForm.marks_obtained > mockForm.maximum_marks"
                class="btn-primary text-xs py-2 px-4"
              >
                {{ editingMock() ? 'Update Record' : 'Save Mock Attempt' }}
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class MockExamsComponent implements OnInit {
  private dataStorage = inject(DataStorageService);
  private toast = inject(ToastService);

  public mockExams = signal<MockExam[]>([]);
  public exams = signal<Exam[]>([]);

  public stageFilter: string = 'all';
  public searchQuery: string = '';

  // Modal State
  public showMockModal = signal<boolean>(false);
  public editingMock = signal<MockExam | null>(null);
  public mockForm = {
    name: '',
    exam_stage: 'prelims' as 'prelims' | 'mains',
    attended_at: new Date().toISOString().split('T')[0],
    marks_obtained: 65.0,
    maximum_marks: 100.0,
    total_questions: 100 as number | null,
    attempted_questions: 80 as number | null,
    correct_answers: 70 as number | null,
    weak_areas: '',
    notes: ''
  };

  public prelimsCount = computed(() => {
    return this.mockExams().filter(m => m.exam_stage === 'prelims').length;
  });

  public mainsCount = computed(() => {
    return this.mockExams().filter(m => m.exam_stage === 'mains').length;
  });

  public averagePercentage = computed(() => {
    const list = this.mockExams();
    if (list.length === 0) return 0;
    const sum = list.reduce((acc, m) => acc + (m.marks_obtained / m.maximum_marks) * 100, 0);
    return Math.round((sum / list.length) * 10) / 10;
  });

  public bestPercentage = computed(() => {
    const list = this.mockExams();
    if (list.length === 0) return 0;
    const max = Math.max(...list.map(m => (m.marks_obtained / m.maximum_marks) * 100));
    return Math.round(max * 10) / 10;
  });

  public latestScore = computed(() => {
    const list = this.mockExams();
    if (list.length === 0) return '—';
    const first = list[0];
    return `${first.marks_obtained}/${first.maximum_marks}`;
  });

  public latestAttemptDate = computed(() => {
    const list = this.mockExams();
    return list.length > 0 ? list[0].attended_at : 'No attempts';
  });

  public chronologicalMocks = computed(() => {
    return [...this.mockExams()].reverse();
  });

  public filteredMocks = computed(() => {
    let result = this.mockExams();
    if (this.stageFilter !== 'all') {
      result = result.filter(m => m.exam_stage === this.stageFilter);
    }
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(m =>
        m.name.toLowerCase().includes(q) ||
        (m.weak_areas && m.weak_areas.toLowerCase().includes(q))
      );
    }
    return result;
  });

  async ngOnInit(): Promise<void> {
    await this.loadData();
  }

  async loadData(): Promise<void> {
    const [mocks, examsList] = await Promise.all([
      this.dataStorage.getMockExams(),
      this.dataStorage.getExams()
    ]);
    this.mockExams.set(mocks);
    this.exams.set(examsList);
  }

  getMockPercentage(m: MockExam): number {
    return Math.round((m.marks_obtained / m.maximum_marks) * 100 * 10) / 10;
  }

  getAccuracy(m: MockExam): number | null {
    if (!m.attempted_questions || !m.correct_answers || m.attempted_questions === 0) return null;
    return Math.round((m.correct_answers / m.attempted_questions) * 100 * 10) / 10;
  }

  openAddMockModal(): void {
    this.editingMock.set(null);
    this.mockForm = {
      name: '',
      exam_stage: 'prelims',
      attended_at: new Date().toISOString().split('T')[0],
      marks_obtained: 65.0,
      maximum_marks: 100.0,
      total_questions: 100,
      attempted_questions: 80,
      correct_answers: 70,
      weak_areas: '',
      notes: ''
    };
    this.showMockModal.set(true);
  }

  openEditMockModal(mock: MockExam): void {
    this.editingMock.set(mock);
    this.mockForm = {
      name: mock.name,
      exam_stage: mock.exam_stage,
      attended_at: mock.attended_at,
      marks_obtained: mock.marks_obtained,
      maximum_marks: mock.maximum_marks,
      total_questions: mock.total_questions || null,
      attempted_questions: mock.attempted_questions || null,
      correct_answers: mock.correct_answers || null,
      weak_areas: mock.weak_areas || '',
      notes: mock.notes || ''
    };
    this.showMockModal.set(true);
  }

  async saveMockForm(): Promise<void> {
    if (!this.mockForm.name.trim()) {
      this.toast.error('Please enter a mock test name');
      return;
    }
    if (this.mockForm.marks_obtained < 0 || this.mockForm.marks_obtained > this.mockForm.maximum_marks) {
      this.toast.error('Marks obtained must be between 0 and maximum marks');
      return;
    }

    const editing = this.editingMock();
    if (editing) {
      await this.dataStorage.saveMockExam({
        ...editing,
        ...this.mockForm
      });
      this.toast.success('Mock exam record updated');
    } else {
      await this.dataStorage.saveMockExam(this.mockForm);
      this.toast.success('Mock exam logged successfully!');
      try {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      } catch {}
    }

    this.showMockModal.set(false);
    await this.loadData();
  }

  async deleteMock(mock: MockExam): Promise<void> {
    if (confirm(`Delete mock attempt "${mock.name}"?`)) {
      await this.dataStorage.deleteMockExam(mock.id);
      this.toast.info('Record deleted');
      await this.loadData();
    }
  }
}
