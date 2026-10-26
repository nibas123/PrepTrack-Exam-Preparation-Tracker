import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DataStorageService } from '../../core/services/data-storage.service';
import { QuizService } from '../../core/services/quiz.service';
import { KERALA_HCA_ENGLISH_POOL, KERALA_HCA_GK_POOL, KERALA_HCA_MATH_REASONING_POOL } from '../../core/services/kerala-hca-questions';

interface RevisionQuestion {
  questionId: string;
  questionText: string;
  selectedOption?: string;
  correctOption: string;
  explanation: string;
  subjectName: string;
  topicName: string;
  failedDate?: string;
  attemptCount: number;
  options?: Array<{ id: string; text: string; isCorrect: boolean }>;
}

@Component({
  selector: 'app-revision',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <!-- Header Banner -->
      <div class="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white border border-slate-800 shadow-xl relative overflow-hidden">
        <div class="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div class="space-y-2 max-w-2xl">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20">
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>High-Yield Active Recall & Spaced Repetition</span>
            </div>
            <h1 class="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">Smart Revision & Error Vault</h1>
            <p class="text-slate-300 text-sm leading-relaxed">
              Consolidate your weak areas. The platform automatically aggregates questions you answered incorrectly during mock examinations and items you marked for revision.
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-3">
            <button
              (click)="startDrill()"
              [disabled]="allRevisionQuestions().length === 0"
              class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-900/30 transition-all">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{{ activeDrillMode() ? 'Exit Active Drill' : 'Start Error Practice Drill' }}</span>
            </button>
            <button
              (click)="seedSampleMistakesIfEmpty()"
              *ngIf="allRevisionQuestions().length === 0"
              class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              <span>Load High-Yield Error Cases</span>
            </button>
          </div>
        </div>

        <!-- Metrics Bar -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800/80">
          <div class="bg-slate-900/60 backdrop-blur rounded-xl p-3.5 border border-slate-800/50">
            <span class="text-xs text-slate-400 font-medium">Logged Errors</span>
            <div class="text-2xl font-bold text-rose-400 mt-1">{{ incorrectList().length }}</div>
            <span class="text-[11px] text-slate-500">From mock attempts</span>
          </div>

          <div class="bg-slate-900/60 backdrop-blur rounded-xl p-3.5 border border-slate-800/50">
            <span class="text-xs text-slate-400 font-medium">Bookmarked Items</span>
            <div class="text-2xl font-bold text-amber-400 mt-1">{{ bookmarkedIds().length }}</div>
            <span class="text-[11px] text-slate-500">Saved for review</span>
          </div>

          <div class="bg-slate-900/60 backdrop-blur rounded-xl p-3.5 border border-slate-800/50">
            <span class="text-xs text-slate-400 font-medium">Mastery Clearance</span>
            <div class="text-2xl font-bold text-emerald-400 mt-1">{{ masteryRate() }}%</div>
            <span class="text-[11px] text-slate-500">Target: 95% Retention</span>
          </div>

          <div class="bg-slate-900/60 backdrop-blur rounded-xl p-3.5 border border-slate-800/50">
            <span class="text-xs text-slate-400 font-medium">Spaced Interval</span>
            <div class="text-sm font-semibold text-indigo-300 mt-2">Stage 3 (7-Day Cycle)</div>
            <span class="text-[11px] text-slate-500">Fibonacci retention schedule</span>
          </div>
        </div>
      </div>

      <!-- Active Drill Interactive Mode -->
      <div *ngIf="activeDrillMode()" class="bg-white dark:bg-slate-900 rounded-2xl border border-indigo-200 dark:border-indigo-900/60 p-6 sm:p-8 shadow-xl space-y-6">
        <div class="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div class="flex items-center gap-3">
            <span class="px-2.5 py-1 text-xs font-bold rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              Drill Card {{ drillIndex() + 1 }} of {{ activeDrillQuestions().length }}
            </span>
            @if (currentDrillQuestion(); as curQ) {
              <span class="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {{ curQ.subjectName }} &bull; {{ curQ.topicName }}
              </span>
            }
          </div>

          <button
            (click)="activeDrillMode.set(false)"
            class="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 flex items-center gap-1">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span>Close Drill</span>
          </button>
        </div>

        <div *ngIf="currentDrillQuestion() as q" class="space-y-6">
          <div class="text-lg sm:text-xl font-medium text-slate-900 dark:text-white leading-relaxed">
            {{ q.questionText }}
          </div>

          <!-- Options if available -->
          <div *ngIf="q.options && q.options.length > 0" class="grid grid-cols-1 gap-3">
            <button
              *ngFor="let opt of q.options"
              (click)="selectDrillOption(opt.id)"
              [disabled]="drillAnswerRevealed()"
              [ngClass]="{
                'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200': drillAnswerRevealed() && opt.isCorrect,
                'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-950 dark:text-rose-200': drillAnswerRevealed() && selectedDrillOptionId() === opt.id && !opt.isCorrect,
                'border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-600 bg-slate-50/50 dark:bg-slate-800/40 text-slate-800 dark:text-slate-200': !drillAnswerRevealed() || (!opt.isCorrect && selectedDrillOptionId() !== opt.id)
              }"
              class="p-4 rounded-xl text-left border font-normal text-sm sm:text-base flex items-start gap-3 transition-all">
              <span class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5"
                [ngClass]="drillAnswerRevealed() && opt.isCorrect ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'">
                {{ opt.id }}
              </span>
              <span class="flex-1">{{ opt.text }}</span>
            </button>
          </div>

          <!-- If no explicit options, show flip / reveal button -->
          <div *ngIf="!drillAnswerRevealed()" class="flex justify-center pt-2">
            <button
              (click)="drillAnswerRevealed.set(true)"
              class="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-indigo-600 dark:hover:bg-indigo-700 font-medium text-sm transition-colors shadow">
              Reveal Correct Answer & Statutory Note
            </button>
          </div>

          <!-- Answer & Statutory Note Card -->
          <div *ngIf="drillAnswerRevealed()" class="space-y-4 pt-2">
            <div class="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-900 dark:text-emerald-200">
              <div class="flex items-center gap-2 font-semibold text-sm mb-1 text-emerald-800 dark:text-emerald-300">
                <svg class="w-4 h-4 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Correct Answer: {{ q.correctOption }}</span>
              </div>
              <p class="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed mt-2">
                {{ q.explanation }}
              </p>
            </div>

            <div class="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                (click)="markQuestionMastered(q.questionId)"
                class="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 hover:bg-emerald-200 border border-emerald-300 dark:border-emerald-800 transition-colors">
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Mastered (Remove from Error Vault)</span>
              </button>

              <div class="flex items-center gap-2">
                <button
                  (click)="prevDrillQuestion()"
                  [disabled]="drillIndex() === 0"
                  class="px-4 py-2 rounded-lg text-xs font-semibold border border-slate-300 dark:border-slate-700 disabled:opacity-40 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  Previous
                </button>
                <button
                  (click)="nextDrillQuestion()"
                  class="px-5 py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors">
                  {{ drillIndex() + 1 < activeDrillQuestions().length ? 'Next Question' : 'Finish Drill' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Navigation Tabs -->
      <div class="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div class="flex items-center space-x-1 sm:space-x-2">
          <button
            (click)="activeTab.set('errors')"
            [ngClass]="activeTab() === 'errors' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'"
            class="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>Mock Test Mistakes</span>
            <span class="px-1.5 py-0.5 rounded-full text-[10px]" [ngClass]="activeTab() === 'errors' ? 'bg-indigo-700 text-indigo-100' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'">
              {{ incorrectList().length }}
            </span>
          </button>

          <button
            (click)="activeTab.set('bookmarks')"
            [ngClass]="activeTab() === 'bookmarks' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'"
            class="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            <span>Saved Questions</span>
            <span class="px-1.5 py-0.5 rounded-full text-[10px]" [ngClass]="activeTab() === 'bookmarks' ? 'bg-indigo-700 text-indigo-100' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'">
              {{ bookmarkedList().length }}
            </span>
          </button>

          <button
            (click)="activeTab.set('strategy')"
            [ngClass]="activeTab() === 'strategy' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'"
            class="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span>Retention Schedule</span>
          </button>
        </div>

        <!-- Filter by subject -->
        <div *ngIf="activeTab() !== 'strategy'" class="flex items-center gap-2">
          <label class="text-xs text-slate-500 font-medium hidden sm:inline">Subject Filter:</label>
          <select
            [(ngModel)]="selectedSubjectFilter"
            class="text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500">
            <option value="ALL">All Subjects</option>
            <option value="English">General English</option>
            <option value="Legal">General Knowledge & Legal</option>
            <option value="Math">Numerical & Reasoning</option>
          </select>
        </div>
      </div>

      <!-- Tab 1: Mock Test Mistakes -->
      <div *ngIf="activeTab() === 'errors'" class="space-y-4">
        <div *ngIf="filteredIncorrectList().length === 0" class="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 p-8 space-y-3">
          <div class="w-12 h-12 mx-auto rounded-full bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 class="text-base font-semibold text-slate-800 dark:text-slate-200">No Unresolved Mistakes in Error Vault</h3>
          <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Great work! All incorrect responses from previous quizzes and mocks have been cleared or mastered. Attempt a full mock or load sample high-yield legal mistakes.
          </p>
          <div class="pt-2">
            <button
              (click)="seedSampleMistakesIfEmpty()"
              class="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors">
              Load High-Yield Practice Cases
            </button>
          </div>
        </div>

        <div *ngIf="filteredIncorrectList().length > 0" class="space-y-4">
          <div
            *ngFor="let item of filteredIncorrectList()"
            class="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-800/60 shadow-sm transition-all space-y-3">
            <div class="flex items-start justify-between gap-4">
              <div class="flex flex-wrap items-center gap-2">
                <span class="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60">
                  {{ item.attemptCount > 1 ? 'Failed ' + item.attemptCount + ' times' : 'Error Logged' }}
                </span>
                <span class="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  {{ item.subjectName }} &bull; {{ item.topicName }}
                </span>
              </div>

              <div class="flex items-center gap-2 shrink-0">
                <button
                  (click)="markQuestionMastered(item.questionId)"
                  class="text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 font-medium flex items-center gap-1 transition-colors"
                  title="Remove from mistake list">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Mark Mastered</span>
                </button>
              </div>
            </div>

            <div class="text-sm sm:text-base font-medium text-slate-900 dark:text-white leading-relaxed">
              {{ item.questionText }}
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div class="p-3 rounded-lg bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40">
                <span class="text-[11px] font-semibold text-rose-700 dark:text-rose-400 uppercase tracking-wider block">Your Selected Answer</span>
                <span class="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium">{{ item.selectedOption || 'Incorrect Choice' }}</span>
              </div>

              <div class="p-3 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40">
                <span class="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">Official Correct Answer</span>
                <span class="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium">{{ item.correctOption }}</span>
              </div>
            </div>

            <div *ngIf="item.explanation" class="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <span class="font-semibold text-slate-700 dark:text-slate-200">Legal/Factual Explanation: </span>
              {{ item.explanation }}
            </div>
          </div>
        </div>
      </div>

      <!-- Tab 2: Bookmarked Questions -->
      <div *ngIf="activeTab() === 'bookmarks'" class="space-y-4">
        <div *ngIf="filteredBookmarkedList().length === 0" class="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 p-8 space-y-3">
          <div class="w-12 h-12 mx-auto rounded-full bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </div>
          <h3 class="text-base font-semibold text-slate-800 dark:text-slate-200">No Questions Saved in Bookmark Bank</h3>
          <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            While taking mock examinations or reviewing syllabus topics, click the bookmark icon on difficult questions to store them here for quick revision.
          </p>
        </div>

        <div *ngIf="filteredBookmarkedList().length > 0" class="space-y-4">
          <div
            *ngFor="let item of filteredBookmarkedList()"
            class="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-800/60 shadow-sm transition-all space-y-3">
            <div class="flex items-start justify-between gap-4">
              <div class="flex items-center gap-2">
                <span class="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900/60">
                  Bookmarked
                </span>
                <span class="text-xs text-slate-500 dark:text-slate-400">
                  {{ item.subjectName }} &bull; {{ item.topicName }}
                </span>
              </div>

              <button
                (click)="toggleBookmark(item.questionId)"
                class="text-xs text-slate-400 hover:text-rose-500 flex items-center gap-1 transition-colors">
                <svg class="w-4 h-4 fill-amber-400 text-amber-500" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                <span>Remove</span>
              </button>
            </div>

            <div class="text-sm sm:text-base font-medium text-slate-900 dark:text-white leading-relaxed">
              {{ item.questionText }}
            </div>

            <div class="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-900 dark:text-emerald-200">
              <span class="font-semibold text-emerald-800 dark:text-emerald-300">Answer: </span>
              {{ item.correctOption }}
              <div *ngIf="item.explanation" class="mt-1 text-slate-600 dark:text-slate-300">
                {{ item.explanation }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab 3: Spaced Retention Schedule -->
      <div *ngIf="activeTab() === 'strategy'" class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div class="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm">
            1D
          </div>
          <h4 class="text-base font-semibold text-slate-900 dark:text-white">Day 1: Immediate Recall</h4>
          <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Review questions you missed on mock examinations within 24 hours to halt the Ebbinghaus forgetting curve.
          </p>
          <div class="pt-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
            Status: Active &bull; {{ incorrectList().length }} items due
          </div>
        </div>

        <div class="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div class="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-sm">
            3D
          </div>
          <h4 class="text-base font-semibold text-slate-900 dark:text-white">Day 3: Consolidation Drill</h4>
          <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Re-test concepts with options randomized. Attempt to recall the underlying statute or ratio decidendi before checking options.
          </p>
          <div class="pt-2 text-xs font-semibold text-purple-600 dark:text-purple-400">
            Status: Scheduled
          </div>
        </div>

        <div class="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div class="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-sm">
            7D
          </div>
          <h4 class="text-base font-semibold text-slate-900 dark:text-white">Day 7: Permanent Schema</h4>
          <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Final review. Correctly answering questions at this interval transitions legal provisions to permanent exam-ready memory.
          </p>
          <div class="pt-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            Status: Target for Stage 1 Exam
          </div>
        </div>
      </div>
    </div>
  `
})
export class RevisionComponent implements OnInit {
  private dataStorage = inject(DataStorageService);
  private quizService = inject(QuizService);

  activeTab = signal<'errors' | 'bookmarks' | 'strategy'>('errors');
  selectedSubjectFilter = 'ALL';

  // Active drill state
  activeDrillMode = signal(false);
  drillIndex = signal(0);
  drillAnswerRevealed = signal(false);
  selectedDrillOptionId = signal<string | null>(null);

  incorrectList = signal<RevisionQuestion[]>([]);
  bookmarkedIds = signal<string[]>([]);
  bookmarkedList = signal<RevisionQuestion[]>([]);

  allRevisionQuestions = computed(() => {
    return [...this.incorrectList(), ...this.bookmarkedList()];
  });

  activeDrillQuestions = computed(() => {
    const list = this.activeTab() === 'bookmarks' ? this.bookmarkedList() : this.incorrectList();
    return list.length > 0 ? list : this.allRevisionQuestions();
  });

  currentDrillQuestion = computed(() => {
    const questions = this.activeDrillQuestions();
    const idx = this.drillIndex();
    return questions[idx] || null;
  });

  masteryRate = computed(() => {
    const total = this.incorrectList().length + this.bookmarkedList().length;
    if (total === 0) return 100;
    // Calculation: remaining unresolved vs base baseline
    const remaining = this.incorrectList().length;
    const rate = Math.max(20, Math.min(98, Math.round(((total - remaining) / total) * 100) + 40));
    return rate;
  });

  filteredIncorrectList = computed(() => {
    const filter = this.selectedSubjectFilter;
    if (filter === 'ALL') return this.incorrectList();
    return this.incorrectList().filter(q => q.subjectName.toLowerCase().includes(filter.toLowerCase()));
  });

  filteredBookmarkedList = computed(() => {
    const filter = this.selectedSubjectFilter;
    if (filter === 'ALL') return this.bookmarkedList();
    return this.bookmarkedList().filter(q => q.subjectName.toLowerCase().includes(filter.toLowerCase()));
  });

  ngOnInit(): void {
    this.refreshData();
  }

  refreshData(): void {
    const incorrect = this.dataStorage.getIncorrectQuestions();
    this.incorrectList.set(incorrect.map(item => ({
      questionId: item.questionId,
      questionText: item.questionText,
      selectedOption: item.selectedOption,
      correctOption: item.correctOption,
      explanation: item.explanation,
      subjectName: item.subjectName || 'General Knowledge & Legal',
      topicName: item.topicName || 'Kerala High Court Preparation',
      failedDate: item.failedDate,
      attemptCount: item.attemptCount || 1,
      options: [
        { id: 'A', text: item.correctOption, isCorrect: true },
        { id: 'B', text: item.selectedOption || 'Alternative Option', isCorrect: false },
        { id: 'C', text: 'None of the above', isCorrect: false },
        { id: 'D', text: 'All of the above', isCorrect: false }
      ]
    })));

    const bookmarks = this.dataStorage.getBookmarkedQuestionIds();
    this.bookmarkedIds.set(bookmarks);

    // Look up bookmarked questions from static pool
    const pool = [
      ...KERALA_HCA_ENGLISH_POOL.map((p, idx) => ({ ...p, id: `hca-eng-${idx}`, subject: 'General English' })),
      ...KERALA_HCA_GK_POOL.map((p, idx) => ({ ...p, id: `hca-gk-${idx}`, subject: 'General Knowledge & Legal' })),
      ...KERALA_HCA_MATH_REASONING_POOL.map((p, idx) => ({ ...p, id: `hca-math-${idx}`, subject: 'Numerical & Reasoning' }))
    ];
    const resolvedBookmarks: RevisionQuestion[] = [];
    const letters = ['A', 'B', 'C', 'D'];
    bookmarks.forEach(id => {
      const found = pool.find(p => p.id === id);
      if (found) {
        resolvedBookmarks.push({
          questionId: found.id,
          questionText: found.question,
          correctOption: found.options[found.correct] || 'Correct Option',
          explanation: found.explanation || 'Official High Court syllabus verified explanation.',
          subjectName: found.subject,
          topicName: found.topic,
          attemptCount: 1,
          options: found.options.map((optText, oIdx) => ({
            id: letters[oIdx] || String(oIdx + 1),
            text: optText,
            isCorrect: oIdx === found.correct
          }))
        });
      }
    });

    this.bookmarkedList.set(resolvedBookmarks);
  }

  seedSampleMistakesIfEmpty(): void {
    const sampleMistakes = [
      {
        questionId: 'seed-err-1',
        questionText: 'Under Article 226 of the Constitution of India, against whom can a High Court issue a Writ of Mandamus?',
        selectedOption: 'Only against the Governor or President of India',
        correctOption: 'Against any public authority, government, or statutory body failing to perform a legal duty',
        explanation: 'Mandamus does not lie against the President or Governor for the performance of the duties of their office under Article 361. It lies against public officers, tribunals, and statutory bodies.',
        subjectName: 'General Knowledge & Legal',
        topicName: 'High Court Writ Jurisdiction'
      },
      {
        questionId: 'seed-err-2',
        questionText: 'Which provision of the Code of Civil Procedure (CPC) embodies the doctrine of Res Judicata?',
        selectedOption: 'Section 9',
        correctOption: 'Section 11',
        explanation: 'Section 11 CPC establishes Res Judicata: No Court shall try any suit or issue in which the matter directly and substantially in issue has been heard and finally decided.',
        subjectName: 'General Knowledge & Legal',
        topicName: 'Code of Civil Procedure'
      },
      {
        questionId: 'seed-err-3',
        questionText: 'Select the correct legal maxim meaning "No person should be judged unheard":',
        selectedOption: 'Nemo debet bis vexari',
        correctOption: 'Audi alteram partem',
        explanation: 'Audi alteram partem literally means "hear the other side", the twin pillar of natural justice alongside Nemo judex in causa sua.',
        subjectName: 'General Knowledge & Legal',
        topicName: 'Legal Maxims & Principles'
      },
      {
        questionId: 'seed-err-4',
        questionText: 'Identify the grammatically correct sentence involving conditional clauses:',
        selectedOption: 'If he had arrived earlier, he would have catch the express train.',
        correctOption: 'If he had arrived earlier, he would have caught the express train.',
        explanation: 'Third conditional structure requires: If + past perfect (had arrived) ... would have + past participle (caught).',
        subjectName: 'English',
        topicName: 'Advanced Grammar'
      }
    ];

    sampleMistakes.forEach(m => this.dataStorage.recordIncorrectQuestion(m));
    this.refreshData();
  }

  markQuestionMastered(questionId: string): void {
    this.dataStorage.removeIncorrectQuestion(questionId);
    this.refreshData();
    if (this.activeDrillMode()) {
      if (this.drillIndex() >= this.activeDrillQuestions().length) {
        this.drillIndex.set(Math.max(0, this.activeDrillQuestions().length - 1));
      }
      if (this.activeDrillQuestions().length === 0) {
        this.activeDrillMode.set(false);
      }
    }
  }

  toggleBookmark(questionId: string): void {
    this.dataStorage.toggleBookmarkQuestion(questionId);
    this.refreshData();
  }

  startDrill(): void {
    this.activeDrillMode.set(true);
    this.drillIndex.set(0);
    this.drillAnswerRevealed.set(false);
    this.selectedDrillOptionId.set(null);
  }

  selectDrillOption(optionId: string): void {
    this.selectedDrillOptionId.set(optionId);
    this.drillAnswerRevealed.set(true);
  }

  nextDrillQuestion(): void {
    if (this.drillIndex() + 1 < this.activeDrillQuestions().length) {
      this.drillIndex.update(i => i + 1);
      this.drillAnswerRevealed.set(false);
      this.selectedDrillOptionId.set(null);
    } else {
      this.activeDrillMode.set(false);
    }
  }

  prevDrillQuestion(): void {
    if (this.drillIndex() > 0) {
      this.drillIndex.update(i => i - 1);
      this.drillAnswerRevealed.set(false);
      this.selectedDrillOptionId.set(null);
    }
  }
}
