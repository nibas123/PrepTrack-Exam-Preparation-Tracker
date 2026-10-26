import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { QuizService } from '../../core/services/quiz.service';
import { DataStorageService } from '../../core/services/data-storage.service';
import { ToastService } from '../../core/services/toast.service';
import { QuizQuestion, QuizAttempt, PreviousPaper, Subject, Topic } from '../../core/models/database.types';
import { ExamTrackService } from '../../core/services/exam-track.service';
import confetti from 'canvas-confetti';

@Component({
  selector: 'app-quizzes',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="space-y-6 max-w-6xl mx-auto">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
        <div>
          <div class="flex items-center space-x-2">
            <h2 class="text-xl font-bold text-slate-900 tracking-tight">Practice Quizzes & Previous Papers</h2>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-50 text-brand-700 border border-brand-100">
              45s / Question
            </span>
          </div>
          <p class="text-xs text-slate-500 mt-0.5">Custom speed drills with automatic scoring, explanations, and weak-area tracking</p>
        </div>

        <!-- Navigation Tabs: Quiz Builder vs Previous Papers vs Past Results -->
        <div class="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200/70">
          <button
            type="button"
            (click)="activeTab.set('builder')"
            class="px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all"
            [ngClass]="activeTab() === 'builder' ? 'bg-white text-brand-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'"
          >
            Quiz Builder
          </button>
          <button
            type="button"
            (click)="activeTab.set('papers')"
            class="px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all"
            [ngClass]="activeTab() === 'papers' ? 'bg-white text-brand-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'"
          >
            Previous Papers
          </button>
          <button
            type="button"
            (click)="activeTab.set('history')"
            class="px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all"
            [ngClass]="activeTab() === 'history' ? 'bg-white text-brand-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'"
          >
            Quiz History ({{ pastAttempts().length }})
          </button>
          <a
            routerLink="/growth-stats"
            class="px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all text-slate-700 hover:text-slate-900 hover:bg-white/60 flex items-center space-x-1.5"
          >
            <svg class="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
            <span>Growth & Outside Stats</span>
          </a>
        </div>
      </div>

      <!-- VIEW 1: ACTIVE QUIZ IN PROGRESS -->
      @if (quizActive()) {
        <div class="card p-6 space-y-6">
          <!-- Top Quiz Progress Bar & Timer Header -->
          <div class="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <div class="flex items-center space-x-2">
                <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Question {{ currentQuestionIndex() + 1 }} of {{ activeQuestions().length }}
                </span>
                @if (activeQuestions()[currentQuestionIndex()]?.difficulty; as diff) {
                  <span class="px-1.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider"
                    [ngClass]="{
                      'bg-emerald-50 text-emerald-700 border border-emerald-200': diff === 'easy',
                      'bg-amber-50 text-amber-700 border border-amber-200': diff === 'medium',
                      'bg-rose-50 text-rose-700 border border-rose-200': diff === 'hard'
                    }"
                  >
                    {{ diff }}
                  </span>
                }
              </div>
              <h3 class="text-base font-bold text-slate-900 mt-0.5">
                {{ activeQuestions()[currentQuestionIndex()]?.topic_name || 'Speed Drill' }}
              </h3>
            </div>

            <!-- 45-Second Question Timer -->
            <div class="flex items-center space-x-2 px-3 py-1.5 rounded-xl border" [ngClass]="questionTimeRemaining() <= 10 ? 'bg-rose-50 border-rose-200 text-rose-700 animate-pulse' : 'bg-slate-50 border-slate-200 text-slate-700'">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span class="font-mono text-sm font-black">{{ questionTimeRemaining() }}s</span>
            </div>
          </div>

          <!-- Question Content -->
          <div class="space-y-4">
            @if (getQuestionDisplay(activeQuestions()[currentQuestionIndex()]); as qDisplay) {
              @if (qDisplay.passage) {
                <div class="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs leading-relaxed space-y-2 shadow-2xs max-h-72 overflow-y-auto">
                  <div class="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1.5">
                    <span class="flex items-center space-x-1.5">
                      <svg class="w-3.5 h-3.5 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      <span>Reading Passage</span>
                    </span>
                    <span class="text-slate-400 font-medium">Scroll to read full context</span>
                  </div>
                  <div class="whitespace-pre-line text-slate-700 font-normal leading-relaxed text-xs">
                    {{ qDisplay.passage }}
                  </div>
                </div>
              }

              <p class="text-base font-semibold text-slate-800 whitespace-pre-line leading-relaxed">
                {{ qDisplay.question }}
              </p>
            }

            <!-- Options Radio List -->
            <div class="space-y-2.5 pt-2">
              @for (opt of activeQuestions()[currentQuestionIndex()]?.options || []; track $index) {
                <button
                  type="button"
                  (click)="selectAnswer($index)"
                  class="w-full text-left p-3.5 rounded-xl border transition-all text-xs flex items-center justify-between"
                  [ngClass]="selectedOptionIndex() === $index ? 'bg-brand-50/80 border-brand-500 text-brand-900 font-bold ring-1 ring-brand-500' : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'"
                >
                  <div class="flex items-center space-x-3">
                    <span class="w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs" [ngClass]="selectedOptionIndex() === $index ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'">
                      {{ ['A', 'B', 'C', 'D'][$index] }}
                    </span>
                    <span>{{ opt }}</span>
                  </div>
                </button>
              }
            </div>
          </div>

          <!-- Quiz Action Buttons -->
          <div class="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              (click)="quitQuiz()"
              class="btn-secondary text-xs py-2 px-3 text-slate-500 hover:text-rose-600"
            >
              Quit Quiz
            </button>

            <button
              type="button"
              (click)="nextQuestion()"
              class="btn-primary text-xs py-2 px-5 font-bold"
            >
              {{ currentQuestionIndex() + 1 === activeQuestions().length ? 'Finish & Score' : 'Next Question →' }}
            </button>
          </div>
        </div>
      }

      <!-- VIEW 2: QUIZ COMPLETED REVIEW SCREEN -->
      @else if (quizCompleted()) {
        <div class="card p-6 space-y-6">
          <div class="text-center py-4 border-b border-slate-100">
            <div class="w-16 h-16 mx-auto rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mb-3">
              <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-black text-slate-900">Quiz Completed!</h3>
            <p class="text-xs text-slate-500 mt-1">Here is your speed performance breakdown and answer explanations</p>

            <div class="mt-4 inline-flex items-center space-x-6 px-6 py-3 rounded-2xl bg-slate-50 border border-slate-200">
              <div>
                <span class="text-[10px] uppercase font-bold text-slate-400">Score</span>
                <p class="text-2xl font-black text-brand-600">{{ lastAttempt()?.correct_answers }} / {{ lastAttempt()?.total_questions }}</p>
              </div>
              <div class="w-px h-8 bg-slate-200"></div>
              <div>
                <span class="text-[10px] uppercase font-bold text-slate-400">Accuracy</span>
                <p class="text-2xl font-black text-emerald-600">{{ lastAttempt()?.score_percentage }}%</p>
              </div>
              <div class="w-px h-8 bg-slate-200"></div>
              <div>
                <span class="text-[10px] uppercase font-bold text-slate-400">Time Taken</span>
                <p class="text-2xl font-black text-slate-700">{{ lastAttempt()?.total_time_seconds }}s</p>
              </div>
            </div>
          </div>

          <!-- Question-by-Question Review with Explanations -->
          <div class="space-y-4">
            <h4 class="text-sm font-bold text-slate-900">Detailed Answer Review</h4>
            @for (q of activeQuestions(); track q.id; let i = $index) {
              <div class="p-4 rounded-xl border text-xs space-y-2" [ngClass]="lastAttempt()?.answers?.[i]?.is_correct ? 'bg-emerald-50/40 border-emerald-200' : 'bg-rose-50/40 border-rose-200'">
                @if (getQuestionDisplay(q); as qDisplay) {
                  @if (qDisplay.passage) {
                    <div class="p-3 bg-white/90 border border-slate-200 rounded-lg text-slate-600 text-xs whitespace-pre-line leading-relaxed max-h-40 overflow-y-auto mb-2">
                      <div class="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Passage Reference:</div>
                      {{ qDisplay.passage }}
                    </div>
                  }
                  <div class="flex items-start justify-between gap-2">
                    <div class="font-bold text-slate-800">
                      Q{{ i + 1 }}. {{ qDisplay.question }}
                    </div>
                    <span class="px-2 py-0.5 rounded-md font-bold text-[10px] uppercase" [ngClass]="lastAttempt()?.answers?.[i]?.is_correct ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'">
                      {{ lastAttempt()?.answers?.[i]?.is_correct ? 'Correct' : 'Incorrect' }}
                    </span>
                  </div>
                }

                <div class="text-[11px] text-slate-600 mt-2 space-y-1">
                  <div>
                    <span class="font-semibold">Your Answer:</span>
                    <span [class.text-rose-600]="!lastAttempt()?.answers?.[i]?.is_correct" [class.text-emerald-700]="lastAttempt()?.answers?.[i]?.is_correct">
                      {{ lastAttempt()?.answers?.[i]?.selected_option_index !== null ? q.options[lastAttempt()!.answers[i].selected_option_index!] : 'Skipped / Timed Out' }}
                    </span>
                  </div>
                  <div>
                    <span class="font-semibold">Correct Answer:</span>
                    <span class="text-emerald-700 font-bold">{{ q.options[q.correct_option_index] }}</span>
                  </div>
                </div>

                <div class="p-2.5 rounded-lg bg-white border border-slate-200/80 text-[11px] text-slate-700 mt-2">
                  <span class="font-bold text-slate-900 block mb-0.5">Explanation:</span>
                  {{ q.explanation }}
                </div>
              </div>
            }
          </div>

          <div class="flex justify-end space-x-3 pt-3 border-t border-slate-100">
            <button (click)="activeTab.set('builder'); quizCompleted.set(false)" class="btn-primary text-xs py-2 px-4 font-bold">
              Start Another Quiz
            </button>
          </div>
        </div>
      }

      <!-- VIEW 3: BUILDER, PREVIOUS PAPERS, AND HISTORY TABS -->
      @else {
        @if (activeTab() === 'builder') {
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Builder Options Form (Left 2 Cols) -->
            <div class="card md:col-span-2 space-y-5">
              <div class="pb-3 border-b border-slate-100">
                <h3 class="text-base font-bold text-slate-900">Configure Practice Drill</h3>
                <p class="text-xs text-slate-500">Pick subject or topic, choose 5 or 10 questions, and test under 45-second timed conditions</p>
              </div>

              <!-- Subject Picker -->
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase mb-1.5">Subject</label>
                <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  @for (sub of filteredSubjects(); track sub.id) {
                    <button
                      type="button"
                      (click)="selectedSubjectId.set(sub.id); clearTopicFilter()"
                      class="p-2.5 rounded-xl border text-left font-semibold transition-all flex items-center space-x-2"
                      [ngClass]="selectedSubjectId() === sub.id ? 'bg-brand-50 border-brand-500 text-brand-700 ring-1 ring-brand-500' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'"
                    >
                      <span class="w-2.5 h-2.5 rounded-full" [style.background-color]="sub.color"></span>
                      <span class="truncate">{{ sub.name }}</span>
                    </button>
                  }
                  <button
                    type="button"
                    (click)="selectedSubjectId.set('all'); clearTopicFilter()"
                    class="p-2.5 rounded-xl border text-left font-semibold transition-all flex items-center space-x-2"
                    [ngClass]="selectedSubjectId() === 'all' ? 'bg-brand-50 border-brand-500 text-brand-700 ring-1 ring-brand-500' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'"
                  >
                    <span class="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
                    <span>All Subjects (Mixed)</span>
                  </button>
                </div>
              </div>

              <!-- Topic Selector (Specific Chapter Focus like Percentage, Syllogisms, etc.) -->
              <div class="p-3.5 rounded-xl border border-slate-200/90 bg-slate-50/70 space-y-3">
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-2">
                    <span class="w-6 h-6 rounded-lg bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-bold">
                      <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 4a6 6 0 100 12 6 6 0 000-12zm0 4a2 2 0 100 4 2 2 0 000-4z" />
                      </svg>
                    </span>
                    <div>
                      <div class="flex items-center space-x-2">
                        <label class="block text-xs font-bold text-slate-800 uppercase tracking-wide">Target Topic Practice (Optional)</label>
                        @if (selectedTopicNames().length > 0) {
                          <span class="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-100 text-brand-800 border border-brand-200">
                            {{ selectedTopicNames().length }} Selected
                          </span>
                        }
                      </div>
                      <p class="text-[11px] text-slate-500">Practice questions from one or multiple chapters simultaneously (e.g. Percentage + Profit & Loss)</p>
                    </div>
                  </div>
                  @if (selectedTopicNames().length > 0 || topicSearchQuery()) {
                    <button
                      type="button"
                      (click)="clearTopicFilter()"
                      class="inline-flex items-center space-x-1 text-[11px] font-bold text-rose-600 hover:text-rose-700 bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-200 transition-colors"
                    >
                      <span>✕ Clear All Topics</span>
                    </button>
                  }
                </div>

                <!-- Active Multi-Topic Selected Tags/Chips -->
                @if (selectedTopicNames().length > 0) {
                  <div class="flex flex-wrap items-center gap-1.5 p-2 rounded-xl bg-white border border-brand-200 shadow-2xs animate-in fade-in duration-150">
                    <span class="text-[11px] font-semibold text-slate-400 mr-1">Active:</span>
                    @for (top of selectedTopicNames(); track top) {
                      <span class="inline-flex items-center space-x-1.5 pl-2.5 pr-1.5 py-1 rounded-lg bg-brand-50 border border-brand-200 text-xs font-semibold text-brand-900 group">
                        <span>{{ top }}</span>
                        <button
                          type="button"
                          (click)="removeTopic(top)"
                          class="w-4 h-4 rounded-full flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-100 transition-colors"
                          [title]="'Remove ' + top"
                        >
                          ✕
                        </button>
                      </span>
                    }
                    <button
                      type="button"
                      (click)="clearTopicFilter()"
                      class="text-[11px] font-semibold text-slate-400 hover:text-rose-600 ml-auto transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                }

                <!-- Search Input with Dropdown Combobox -->
                <div class="relative">
                  <div class="relative flex items-center">
                    <span class="absolute left-3 text-slate-400 pointer-events-none">
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </span>

                    <input
                      type="text"
                      [ngModel]="topicSearchQuery()"
                      (ngModelChange)="onSearchInputChange($event)"
                      (focus)="isTopicDropdownOpen.set(true)"
                      (keydown.enter)="onSearchEnterKey($event)"
                      (keydown.escape)="isTopicDropdownOpen.set(false)"
                      placeholder="Search & add topics (e.g. Percentage, Profit & Loss, Syllogisms)..."
                      class="w-full text-xs font-semibold rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-20 text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 shadow-2xs transition-all"
                    />

                    <div class="absolute right-2 flex items-center space-x-1">
                      @if (topicSearchQuery()) {
                        <button
                          type="button"
                          (click)="topicSearchQuery.set('')"
                          class="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-slate-100 transition-colors"
                          title="Clear input text"
                        >
                          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      }

                      <button
                        type="button"
                        (click)="toggleTopicDropdown()"
                        class="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                        title="Toggle topic options"
                      >
                        <svg class="w-4 h-4 transition-transform duration-200" [class.rotate-180]="isTopicDropdownOpen()" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <!-- Dropdown List for Matching Topics -->
                  @if (isTopicDropdownOpen()) {
                    <div
                      class="fixed inset-0 z-20"
                      (click)="isTopicDropdownOpen.set(false)"
                    ></div>

                    <div class="absolute left-0 right-0 top-full mt-1.5 z-30 max-h-64 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl space-y-0.5 text-xs animate-in fade-in duration-150">
                      <!-- All Topics / Reset Option -->
                      <button
                        type="button"
                        (click)="clearTopicFilter()"
                        class="w-full text-left px-3 py-2 rounded-lg font-semibold flex items-center justify-between hover:bg-slate-50 transition-colors"
                        [ngClass]="selectedTopicNames().length === 0 ? 'bg-slate-100 text-slate-900 font-bold' : 'text-slate-600'"
                      >
                        <span>-- All Topics (Mixed {{ selectedSubjectId() === 'all' ? 'All Subjects' : 'Subject' }}) --</span>
                        @if (selectedTopicNames().length === 0) {
                          <span class="text-emerald-600 text-xs font-bold">✓ Active</span>
                        }
                      </button>

                      <!-- Filtered Topic Matches with Checkbox Status -->
                      @for (top of filteredTopics(); track top.id) {
                        <button
                          type="button"
                          (click)="toggleTopic(top.name)"
                          class="w-full text-left px-3 py-2 rounded-lg flex items-center justify-between hover:bg-brand-50/70 transition-colors group"
                          [ngClass]="isTopicSelected(top.name) ? 'bg-brand-50 text-brand-900 font-bold' : 'text-slate-700'"
                        >
                          <div class="flex items-center space-x-2 min-w-0">
                            <span class="w-4 h-4 rounded flex items-center justify-center border text-[10px]"
                              [ngClass]="isTopicSelected(top.name) ? 'bg-brand-600 text-white border-brand-600' : 'bg-white border-slate-300 text-transparent'">
                              ✓
                            </span>
                            <span class="truncate font-medium">{{ top.name }}</span>
                            @if (getSubjectNameForTopic(top)) {
                              <span class="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500 group-hover:bg-brand-100 group-hover:text-brand-700 transition-colors">
                                {{ getSubjectNameForTopic(top) }}
                              </span>
                            }
                          </div>
                          @if (isTopicSelected(top.name)) {
                            <span class="text-brand-600 text-[11px] font-bold">Selected</span>
                          }
                        </button>
                      }

                      <!-- Practice Custom Typed Topic -->
                      @if (isCustomTopicAvailable()) {
                        <button
                          type="button"
                          (click)="selectTopic(topicSearchQuery().trim())"
                          class="w-full text-left px-3 py-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-800 transition-colors flex items-center justify-between border border-slate-200 mt-1"
                        >
                          <div class="flex items-center space-x-2">
                            <svg class="w-3.5 h-3.5 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                            </svg>
                            <span>Add chapter: <strong class="underline font-bold text-slate-900">"{{ topicSearchQuery().trim() }}"</strong></span>
                          </div>
                          <span class="text-[10px] uppercase font-bold text-slate-600 bg-white px-1.5 py-0.5 rounded border border-slate-200">Press Enter ↵</span>
                        </button>
                      }

                      @if (filteredTopics().length === 0 && !isCustomTopicAvailable()) {
                        <div class="py-4 text-center text-xs text-slate-400">
                          No matching topics found.
                        </div>
                      }
                    </div>
                  }
                </div>

                <!-- Quick Selection Topic Pills (Toggleable) -->
                <div>
                  <div class="flex items-center justify-between mb-1.5">
                    <span class="text-[10px] uppercase font-bold text-slate-400">Quick Select Chapters (Tap to toggle):</span>
                    @if (filteredPopularSuggestions().length > 0 && topicSearchQuery().trim()) {
                      <span class="text-[10px] text-brand-600 font-semibold">{{ filteredPopularSuggestions().length }} matching shortcuts</span>
                    }
                  </div>
                  <div class="flex flex-wrap gap-1.5">
                    @for (topName of filteredPopularSuggestions(); track topName) {
                      <button
                        type="button"
                        (click)="toggleTopic(topName)"
                        class="px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all border inline-flex items-center space-x-1"
                        [ngClass]="isTopicSelected(topName) ? 'bg-brand-600 text-white border-brand-600 shadow-xs' : 'bg-white text-slate-700 border-slate-200 hover:border-brand-300 hover:bg-brand-50/50'"
                      >
                        @if (isTopicSelected(topName)) {
                          <span class="text-[10px]">✓</span>
                        }
                        <span>{{ topName }}</span>
                      </button>
                    }
                  </div>
                </div>
              </div>

              <!-- AI Question Generator Toggle & Difficulty Selector -->
              <div class="p-4 rounded-xl border border-slate-200/90 bg-white space-y-3 shadow-2xs">
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-2.5">
                    <span class="w-8 h-8 rounded-lg flex items-center justify-center text-xs shadow-2xs" [ngClass]="aiPowered() ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-700'">
                      @if (aiPowered()) {
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      } @else {
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      }
                    </span>
                    <div>
                      <div class="flex items-center space-x-2">
                        <h4 class="text-xs font-bold text-slate-900">
                          {{ aiPowered() ? 'Gemini AI Adaptive Generator' : 'Algorithmic Pattern Engine (Offline)' }}
                        </h4>
                        <span class="text-[10px] font-bold px-2 py-0.5 rounded-full border" [ngClass]="aiPowered() ? 'bg-brand-50 text-brand-800 border-brand-200' : 'bg-emerald-50 text-emerald-800 border-emerald-200'">
                          {{ aiPowered() ? 'AI Active' : '0 Tokens / Offline' }}
                        </span>
                      </div>
                      <p class="text-[11px] text-slate-500 mt-0.5">
                        {{ aiPowered() ? 'Synthesizes novel questions via Gemini API' : 'Instant client-side parametric & syllabus questions with zero token usage' }}
                      </p>
                    </div>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" [ngModel]="aiPowered()" (ngModelChange)="aiPowered.set($event)" class="sr-only peer">
                    <div class="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-600"></div>
                  </label>
                </div>

                @if (aiPowered()) {
                  <div class="pt-3 border-t border-slate-100">
                    <label class="block text-[11px] font-bold text-slate-700 uppercase mb-1.5">Question Difficulty</label>
                    <div class="grid grid-cols-4 gap-2 text-xs">
                      @for (diff of difficulties; track diff.value) {
                        <button
                          type="button"
                          (click)="selectedDifficulty.set(diff.value)"
                          class="py-2 px-2.5 rounded-lg border text-center font-bold transition-all text-xs flex flex-col items-center justify-center"
                          [ngClass]="selectedDifficulty() === diff.value ? 'bg-brand-600 text-white border-brand-600 shadow-xs' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'"
                        >
                          <span>{{ diff.label }}</span>
                          <span class="text-[10px] font-normal opacity-80">{{ diff.desc }}</span>
                        </button>
                      }
                    </div>
                  </div>
                }
              </div>

              <!-- Question Count Selection (5 or 10) -->
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase mb-1.5">Questions Count</label>
                <div class="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold">
                  <button
                    type="button"
                    (click)="questionCount.set(5)"
                    class="px-4 py-2 rounded-lg transition-all"
                    [ngClass]="questionCount() === 5 ? 'bg-white text-brand-700 shadow-xs' : 'text-slate-600'"
                  >
                    5 Questions (3m 45s)
                  </button>
                  <button
                    type="button"
                    (click)="questionCount.set(10)"
                    class="px-4 py-2 rounded-lg transition-all"
                    [ngClass]="questionCount() === 10 ? 'bg-white text-brand-700 shadow-xs' : 'text-slate-600'"
                  >
                    10 Questions (7m 30s)
                  </button>
                </div>
              </div>

              <!-- Launch Action -->
              <div class="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span class="text-xs text-slate-400 font-medium">Timer starts immediately when clicking Start Drill</span>
                <button
                  type="button"
                  (click)="startQuiz()"
                  [disabled]="isGeneratingQuestions()"
                  class="btn-primary text-xs py-2.5 px-6 font-bold shadow-xs flex items-center space-x-1.5 disabled:opacity-75"
                >
                  @if (isGeneratingQuestions()) {
                    <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                    </svg>
                    <span>Generating Questions...</span>
                  } @else {
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    </svg>
                    <span>Start {{ questionCount() }}-Question Drill</span>
                  }
                </button>
              </div>
            </div>

            <!-- Quiz Features & Tips (Right Column) -->
            <div class="card p-5 space-y-4">
              <h4 class="text-sm font-bold text-slate-900">Adaptive Mastery & Drill Rules</h4>
              <ul class="text-xs text-slate-600 space-y-3">
                <li class="flex items-start space-x-2">
                  <span class="text-brand-600 font-bold">•</span>
                  <span><strong>45 Seconds Per Question:</strong> Trains sectional speed necessary for IBPS and SBI Prelims.</span>
                </li>
                <li class="flex items-start space-x-2">
                  <span class="text-indigo-600 font-bold">•</span>
                  <span><strong>Spaced Repetition & Mastery:</strong> Questions solved correctly increment your mastery counter and are retired. Mistakes are rescheduled for review after a cooldown interval.</span>
                </li>
                <li class="flex items-start space-x-2">
                  <span class="text-emerald-600 font-bold">•</span>
                  <span><strong>Frugal AI Generation:</strong> Gemini AI is only triggered when you need fresh questions or have exhausted your active bank, preserving your API quota.</span>
                </li>
                <li class="flex items-start space-x-2">
                  <span class="text-brand-600 font-bold">•</span>
                  <span><strong>Offline Capable:</strong> Quizzes work offline via IndexedDB caching and sync score records automatically.</span>
                </li>
              </ul>
            </div>
          </div>
        }

        @if (activeTab() === 'papers') {
          <div class="space-y-4">
            <!-- Track Filter Buttons (Only shown in 'all' multi-exam mode) -->
            @if (examTrack.isAll()) {
              <div class="flex items-center space-x-2">
                <button
                  type="button"
                  (click)="paperTrackFilter.set('all')"
                  class="px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all"
                  [ngClass]="paperTrackFilter() === 'all' ? 'bg-slate-900 text-white shadow-2xs' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'"
                >
                  All Papers ({{ previousPapers().length }})
                </button>
                <button
                  type="button"
                  (click)="paperTrackFilter.set('bank')"
                  class="px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all"
                  [ngClass]="paperTrackFilter() === 'bank' ? 'bg-brand-900 text-white shadow-2xs' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'"
                >
                  Banking Papers
                </button>
                <button
                  type="button"
                  (click)="paperTrackFilter.set('kerala_hca')"
                  class="px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all"
                  [ngClass]="paperTrackFilter() === 'kerala_hca' ? 'bg-court-700 text-white shadow-2xs' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'"
                >
                  Kerala High Court Assistant
                </button>
              </div>
            }

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              @for (paper of filteredPreviousPapers(); track paper.id) {
                <div class="card p-5 flex flex-col justify-between space-y-4">
                  <div>
                    <div class="flex items-center justify-between">
                      <span class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase"
                        [ngClass]="paper.id.includes('kerala-hca') ? 'bg-amber-50 text-amber-800 border border-amber-200' : 'bg-brand-50 text-brand-700 border border-brand-200'">
                        {{ paper.id.includes('kerala-hca') ? 'High Court of Kerala' : paper.stage }} ({{ paper.year }})
                      </span>
                      <span class="text-xs font-bold text-slate-700">{{ paper.duration_minutes }} mins</span>
                    </div>
                    <h3 class="text-sm font-bold text-slate-900 mt-2">{{ paper.exam_name }}</h3>
                    <p class="text-[11px] text-slate-400 mt-0.5">License: {{ paper.official_source_license }}</p>

                    <div class="mt-3 space-y-1 text-xs text-slate-600">
                      @for (sec of paper.sections; track sec.subject_name) {
                        <div class="flex justify-between text-[11px]">
                          <span>{{ sec.subject_name }}</span>
                          <span class="font-bold">{{ sec.questions_count }} Qs</span>
                        </div>
                      }
                    </div>
                  </div>

                  <div class="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <button
                      type="button"
                      (click)="startPreviousPaper(paper)"
                      class="w-full btn-primary text-xs py-2 font-bold text-center"
                    >
                      Start Timed Mock Paper
                    </button>
                  </div>
                </div>
              }
            </div>
          </div>
        }

        @if (activeTab() === 'history') {
          <div class="card space-y-4">
            <div class="pb-3 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 class="text-base font-bold text-slate-900">Personal Quiz Ledger</h3>
                <p class="text-xs text-slate-500">Log of all practice attempts and weak-area flags</p>
              </div>
              <span class="text-xs font-bold text-brand-600">{{ pastAttempts().length }} Attempts Total</span>
            </div>

            @if (pastAttempts().length === 0) {
              <div class="py-12 text-center text-xs text-slate-400">
                No quizzes attempted yet. Start your first speed drill from the Quiz Builder tab!
              </div>
            } @else {
              <div class="overflow-x-auto">
                <table class="w-full text-left text-xs">
                  <thead>
                    <tr class="border-b border-slate-200 text-slate-400 uppercase font-semibold">
                      <th class="py-3 px-3">Date</th>
                      <th class="py-3 px-3">Type</th>
                      <th class="py-3 px-3">Score</th>
                      <th class="py-3 px-3">Accuracy</th>
                      <th class="py-3 px-3">Time</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100 text-slate-700">
                    @for (item of pastAttempts(); track item.id) {
                      <tr class="hover:bg-slate-50/80 transition-colors">
                        <td class="py-3 px-3 whitespace-nowrap font-medium text-slate-900">
                          {{ item.created_at | date:'mediumDate' }}
                        </td>
                        <td class="py-3 px-3 capitalize">
                          {{ item.topic_name || item.quiz_type }}
                        </td>
                        <td class="py-3 px-3 font-bold text-slate-900">
                          {{ item.correct_answers }} / {{ item.total_questions }}
                        </td>
                        <td class="py-3 px-3">
                          <span class="px-2 py-0.5 rounded-md font-bold text-[11px]" [ngClass]="item.score_percentage >= 70 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'">
                            {{ item.score_percentage }}%
                          </span>
                        </td>
                        <td class="py-3 px-3 font-mono">
                          {{ item.total_time_seconds }}s
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            }
          </div>
        }
      }
    </div>
  `
})
export class QuizzesComponent implements OnInit {
  private quizService = inject(QuizService);
  private dataStorage = inject(DataStorageService);
  private toast = inject(ToastService);
  private route = inject(ActivatedRoute);
  public examTrack = inject(ExamTrackService);

  public activeTab = signal<'builder' | 'papers' | 'history'>('builder');
  public subjects = signal<Subject[]>([]);
  public topics = signal<Topic[]>([]);
  public previousPapers = signal<PreviousPaper[]>([]);
  public pastAttempts = signal<QuizAttempt[]>([]);
  public paperTrackFilter = signal<'all' | 'bank' | 'kerala_hca'>('all');

  // Filtered Subjects based on active track
  public filteredSubjects = computed(() => {
    const all = this.subjects();
    const track = this.examTrack.activeTrack();
    if (track === 'kerala_hca') {
      return all.filter(s => s.id.includes('hca') || s.name.toLowerCase().includes('kerala') || s.name.toLowerCase().includes('constitution'));
    } else if (track === 'bank') {
      return all.filter(s => !s.id.includes('hca') && !s.name.toLowerCase().includes('kerala'));
    }
    return all;
  });

  // Filtered Previous Papers based on selected paper track filter
  public filteredPreviousPapers = computed(() => {
    const list = this.previousPapers();
    const isKerala = this.examTrack.isKeralaHca();
    const isBank = this.examTrack.isBank();

    if (isKerala) {
      return list.filter(p => p.id.includes('kerala-hca') || p.exam_name.toLowerCase().includes('high court'));
    }
    if (isBank) {
      return list.filter(p => !p.id.includes('kerala-hca') && !p.exam_name.toLowerCase().includes('high court'));
    }

    const filter = this.paperTrackFilter();
    if (filter === 'kerala_hca') {
      return list.filter(p => p.id.includes('kerala-hca') || p.exam_name.toLowerCase().includes('high court'));
    } else if (filter === 'bank') {
      return list.filter(p => !p.id.includes('kerala-hca') && !p.exam_name.toLowerCase().includes('high court'));
    }
    return list;
  });

  // Builder configuration
  public selectedSubjectId = signal<string>('all');
  public selectedTopicNames = signal<string[]>([]);
  public selectedTopicName = computed(() => this.selectedTopicNames().join(', '));
  public questionCount = signal<number>(5);
  public aiPowered = signal<boolean>(this.quizService.aiConfig.getAiDefaultToggleState());
  public selectedDifficulty = signal<'easy' | 'medium' | 'hard' | 'mixed'>('mixed');
  public isGeneratingQuestions = signal<boolean>(false);

  public readonly difficulties: { value: 'easy' | 'medium' | 'hard' | 'mixed'; label: string; desc: string }[] = [
    { value: 'mixed', label: 'Mixed', desc: 'Real Exam' },
    { value: 'easy', label: 'Easy', desc: 'Foundation' },
    { value: 'medium', label: 'Medium', desc: 'Moderate' },
    { value: 'hard', label: 'Hard', desc: 'Advanced' },
  ];

  // Topic search & combobox
  public topicSearchQuery = signal<string>('');
  public isTopicDropdownOpen = signal<boolean>(false);

  public availableTopics = computed(() => {
    const subId = this.selectedSubjectId();
    const all = this.topics();
    if (subId === 'all') {
      if (this.examTrack.isKeralaHca()) {
        return all.filter(t => t.subject_id.includes('hca') || (t as any).is_hca);
      }
      return all;
    }
    return all.filter(t => t.subject_id === subId);
  });

  public filteredTopics = computed(() => {
    const query = this.topicSearchQuery().trim().toLowerCase();
    const available = this.availableTopics();
    if (!query) {
      return available;
    }
    return available.filter(t => {
      const matchName = t.name.toLowerCase().includes(query);
      const sub = this.subjects().find(s => s.id === t.subject_id);
      const matchSubject = sub ? sub.name.toLowerCase().includes(query) : false;
      return matchName || matchSubject;
    });
  });

  public isCustomTopicAvailable = computed(() => {
    const q = this.topicSearchQuery().trim();
    if (!q) return false;
    const exists = this.availableTopics().some(t => t.name.toLowerCase() === q.toLowerCase());
    return !exists;
  });

  public popularTopicSuggestions = computed(() => {
    const curSubId = this.selectedSubjectId();
    if (this.examTrack.isKeralaHca() && curSubId === 'all') {
      return [
        'Articles 226 & 227 (High Court Writs)',
        'Fundamental Rights & DPSP',
        'Kerala Renaissance & Reformers',
        'Direct & Indirect Speech',
        'Idioms & Phrases',
        'Prepositions & Phrasal Verbs',
        'Legal Glossary & Latin Maxims',
        'Basic Arithmetic & Reasoning'
      ];
    }
    if (curSubId === 'all') {
      return [
        'Percentage',
        'Simplification & Approximation',
        'Profit & Loss',
        'Simple & Compound Interest',
        'Number Series',
        'Syllogisms',
        'Coding-Decoding',
        'Reading Comprehension',
        'Banking & Financial Awareness'
      ];
    }
    return this.availableTopics().slice(0, 8).map(t => t.name);
  });

  public filteredPopularSuggestions = computed(() => {
    const suggestions = this.popularTopicSuggestions();
    const query = this.topicSearchQuery().trim().toLowerCase();
    if (!query) {
      return suggestions;
    }
    const matching = suggestions.filter(s => s.toLowerCase().includes(query));
    return matching.length > 0 ? matching : suggestions;
  });

  // Active quiz state
  public quizActive = signal<boolean>(false);
  public quizCompleted = signal<boolean>(false);
  public activeQuestions = signal<QuizQuestion[]>([]);
  public currentQuestionIndex = signal<number>(0);
  public selectedOptionIndex = signal<number | null>(null);
  public questionTimeRemaining = signal<number>(45);
  public lastAttempt = signal<QuizAttempt | null>(null);

  private timerInterval: any = null;
  private recordedAnswers: {
    question_id: string;
    selected_option_index: number | null;
    is_correct: boolean;
    time_spent_seconds: number;
  }[] = [];
  private quizStartTime: number = 0;

  async ngOnInit(): Promise<void> {
    const [subs, allTopics, papers, attempts] = await Promise.all([
      this.dataStorage.getSubjects(),
      this.dataStorage.getTopics(),
      this.quizService.getPreviousPapers(),
      this.quizService.getQuizAttempts()
    ]);
    this.subjects.set(subs);
    this.topics.set(allTopics);
    this.previousPapers.set(papers);
    this.pastAttempts.set(attempts);
    this.paperTrackFilter.set(this.examTrack.activeTrack());

    // Check query params if user clicked "Take Quiz" from syllabus topic
    this.route.queryParams.subscribe(params => {
      if (params['topicName']) {
        const topName = params['topicName'];
        this.selectedTopicNames.set([topName]);
        this.activeTab.set('builder');
        const matched = allTopics.find(t => t.name.toLowerCase() === topName.toLowerCase());
        if (matched) {
          this.selectedSubjectId.set(matched.subject_id);
        } else if (params['subjectId']) {
          this.selectedSubjectId.set(params['subjectId']);
        }
      }
    });
  }

  public getSubjectNameForTopic(top: Topic): string {
    const sub = this.subjects().find(s => s.id === top.subject_id);
    return sub ? sub.name : '';
  }

  public isTopicSelected(topicName: string): boolean {
    if (!topicName) return false;
    const lower = topicName.trim().toLowerCase();
    return this.selectedTopicNames().some(t => t.toLowerCase() === lower);
  }

  public toggleTopic(topicName: string): void {
    const trimmed = topicName.trim();
    if (!trimmed) return;
    const lower = trimmed.toLowerCase();
    const current = this.selectedTopicNames();
    const exists = current.some(t => t.toLowerCase() === lower);
    if (exists) {
      this.selectedTopicNames.set(current.filter(t => t.toLowerCase() !== lower));
    } else {
      this.selectedTopicNames.set([...current, trimmed]);
      const matched = this.topics().find(t => t.name.toLowerCase() === lower);
      if (matched && this.selectedSubjectId() === 'all' && current.length === 0) {
        this.selectedSubjectId.set(matched.subject_id);
      }
    }
  }

  public removeTopic(topicName: string): void {
    const lower = topicName.trim().toLowerCase();
    this.selectedTopicNames.update(list => list.filter(t => t.toLowerCase() !== lower));
  }

  public onSearchInputChange(query: string): void {
    this.topicSearchQuery.set(query);
    this.isTopicDropdownOpen.set(true);
  }

  public toggleTopicDropdown(): void {
    this.isTopicDropdownOpen.update(v => !v);
  }

  public onSearchEnterKey(event: Event): void {
    event.preventDefault();
    const q = this.topicSearchQuery().trim();
    if (!q) {
      return;
    }
    const matches = this.filteredTopics();
    if (matches.length > 0) {
      const exact = matches.find(m => m.name.toLowerCase() === q.toLowerCase());
      this.toggleTopic(exact ? exact.name : matches[0].name);
    } else {
      this.toggleTopic(q);
    }
    this.topicSearchQuery.set('');
  }

  public selectTopic(topicName: string): void {
    if (!topicName) {
      this.clearTopicFilter();
      return;
    }
    this.toggleTopic(topicName);
    this.topicSearchQuery.set('');
  }

  public selectTopicPill(topicName: string): void {
    this.toggleTopic(topicName);
  }

  public clearTopicFilter(): void {
    this.selectedTopicNames.set([]);
    this.topicSearchQuery.set('');
    this.isTopicDropdownOpen.set(false);
  }

  async startQuiz(): Promise<void> {
    const selectedSub = this.subjects().find(s => s.id === this.selectedSubjectId());
    const subFilter = this.selectedSubjectId() === 'all' ? undefined : (selectedSub?.name || this.selectedSubjectId());
    
    this.isGeneratingQuestions.set(true);
    try {
      const topicFilter = this.selectedTopicNames().length > 0 ? this.selectedTopicNames() : undefined;
      const questions = await this.quizService.getQuestions(
        subFilter,
        topicFilter,
        this.questionCount(),
        this.selectedDifficulty(),
        this.aiPowered()
      );

      if (!questions || questions.length === 0) {
        this.toast.error('Could not assemble questions for this selection.');
        return;
      }

      const unique = this.quizService.deduplicateQuestions(questions);
      this.activeQuestions.set(unique);
      this.currentQuestionIndex.set(0);
      this.selectedOptionIndex.set(null);
      this.recordedAnswers = [];
      this.quizStartTime = Date.now();
      this.quizCompleted.set(false);
      this.quizActive.set(true);

      this.startQuestionTimer();
    } catch (err) {
      console.error('Quiz start error:', err);
      this.toast.error('An error occurred while preparing your quiz.');
    } finally {
      this.isGeneratingQuestions.set(false);
    }
  }

  startPreviousPaper(paper: PreviousPaper): void {
    const unique = this.quizService.deduplicateQuestions(paper.questions);
    this.activeQuestions.set(unique);
    this.currentQuestionIndex.set(0);
    this.selectedOptionIndex.set(null);
    this.recordedAnswers = [];
    this.quizStartTime = Date.now();
    this.quizCompleted.set(false);
    this.quizActive.set(true);

    this.startQuestionTimer();
  }

  startQuestionTimer(): void {
    clearInterval(this.timerInterval);
    this.questionTimeRemaining.set(45);

    this.timerInterval = setInterval(() => {
      const rem = this.questionTimeRemaining() - 1;
      this.questionTimeRemaining.set(rem);

      if (rem <= 0) {
        // Time out on this question, auto-advance
        this.recordCurrentQuestionAnswer();
        if (this.currentQuestionIndex() + 1 < this.activeQuestions().length) {
          this.currentQuestionIndex.update(i => i + 1);
          this.selectedOptionIndex.set(null);
          this.questionTimeRemaining.set(45);
        } else {
          this.finishQuiz();
        }
      }
    }, 1000);
  }

  selectAnswer(idx: number): void {
    this.selectedOptionIndex.set(idx);
  }

  nextQuestion(): void {
    this.recordCurrentQuestionAnswer();

    if (this.currentQuestionIndex() + 1 < this.activeQuestions().length) {
      this.currentQuestionIndex.update(i => i + 1);
      this.selectedOptionIndex.set(null);
      this.startQuestionTimer();
    } else {
      this.finishQuiz();
    }
  }

  private recordCurrentQuestionAnswer(): void {
    const q = this.activeQuestions()[this.currentQuestionIndex()];
    const sel = this.selectedOptionIndex();
    const isCorrect = sel !== null && sel === q.correct_option_index;
    const timeSpent = 45 - this.questionTimeRemaining();

    this.recordedAnswers.push({
      question_id: q.id,
      selected_option_index: sel,
      is_correct: isCorrect,
      time_spent_seconds: Math.max(1, timeSpent)
    });
  }

  async finishQuiz(): Promise<void> {
    clearInterval(this.timerInterval);
    const totalSeconds = Math.round((Date.now() - this.quizStartTime) / 1000);
    const correctCount = this.recordedAnswers.filter(a => a.is_correct).length;
    const totalCount = this.recordedAnswers.length;
    const percentage = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;

    const weakTopics = this.activeQuestions()
      .filter((q, idx) => !this.recordedAnswers[idx]?.is_correct && q.topic_name)
      .map(q => q.topic_name!);

    const matchedTopic = this.topics().find(
      t => t.name.toLowerCase() === (this.selectedTopicName() || '').toLowerCase()
    );
    const resolvedSubjectId = this.selectedSubjectId() === 'all'
      ? (matchedTopic?.subject_id || (this.activeQuestions()[0]?.subject_id || null))
      : this.selectedSubjectId();

    const attempt = await this.quizService.saveQuizAttempt({
      quiz_type: this.selectedTopicName() ? 'topic' : (this.selectedSubjectId() === 'all' ? 'mixed' : 'subject'),
      subject_id: resolvedSubjectId,
      topic_id: matchedTopic?.id || null,
      total_questions: totalCount,
      correct_answers: correctCount,
      score_percentage: percentage,
      total_time_seconds: totalSeconds,
      weak_topics: Array.from(new Set(weakTopics)),
      answers: this.recordedAnswers,
      topic_name: this.selectedTopicName() || (this.selectedSubjectId() === 'all' ? 'Mixed Drill' : 'Subject Drill')
    });

    this.lastAttempt.set(attempt);
    this.quizActive.set(false);
    this.quizCompleted.set(true);

    const updatedAttempts = await this.quizService.getQuizAttempts();
    this.pastAttempts.set(updatedAttempts);

    if (percentage >= 70) {
      try {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      } catch {}
    }
  }

  public getQuestionDisplay(q: QuizQuestion | undefined): { passage: string | null; question: string } {
    if (!q) return { passage: null, question: '' };
    if (q.passage_text) {
      let qText = (q.question_text || '').trim();
      const pText = q.passage_text.trim();
      if (qText.startsWith(pText)) {
        qText = qText.substring(pText.length).trim();
      }
      return { passage: q.passage_text, question: qText || q.question_text };
    }

    const text = q.question_text || '';
    if (text.includes('Directions') && (text.includes('\n\nAccording') || text.includes('\n\nWhich') || text.includes('\n\nWhat') || text.includes('\n\nWhy') || text.includes('\n\nSelect') || text.includes('\n\nQuestion:'))) {
      const parts = text.split(/\n\n(?=According|Which|What|Why|Select|Question:)/i);
      if (parts.length >= 2) {
        return {
          passage: parts[0].trim(),
          question: parts.slice(1).join('\n\n').trim()
        };
      }
    }

    return { passage: null, question: text };
  }

  quitQuiz(): void {
    clearInterval(this.timerInterval);
    this.quizActive.set(false);
    this.toast.info('Quiz session cancelled.');
  }
}
