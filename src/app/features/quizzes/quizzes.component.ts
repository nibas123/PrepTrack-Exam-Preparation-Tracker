import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { QuizService } from '../../core/services/quiz.service';
import { DataStorageService } from '../../core/services/data-storage.service';
import { ToastService } from '../../core/services/toast.service';
import { QuizQuestion, QuizAttempt, PreviousPaper, Subject } from '../../core/models/database.types';
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
        </div>
      </div>

      <!-- VIEW 1: ACTIVE QUIZ IN PROGRESS -->
      @if (quizActive()) {
        <div class="card p-6 space-y-6">
          <!-- Top Quiz Progress Bar & Timer Header -->
          <div class="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Question {{ currentQuestionIndex() + 1 }} of {{ activeQuestions().length }}
              </span>
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
            <p class="text-base font-semibold text-slate-800 whitespace-pre-line leading-relaxed">
              {{ activeQuestions()[currentQuestionIndex()]?.question_text }}
            </p>

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
                <div class="flex items-start justify-between gap-2">
                  <div class="font-bold text-slate-800">
                    Q{{ i + 1 }}. {{ q.question_text }}
                  </div>
                  <span class="px-2 py-0.5 rounded-md font-bold text-[10px] uppercase" [ngClass]="lastAttempt()?.answers?.[i]?.is_correct ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'">
                    {{ lastAttempt()?.answers?.[i]?.is_correct ? 'Correct' : 'Incorrect' }}
                  </span>
                </div>

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
                  @for (sub of subjects(); track sub.id) {
                    <button
                      type="button"
                      (click)="selectedSubjectId.set(sub.id); selectedTopicName.set('')"
                      class="p-2.5 rounded-xl border text-left font-semibold transition-all flex items-center space-x-2"
                      [ngClass]="selectedSubjectId() === sub.id ? 'bg-brand-50 border-brand-500 text-brand-700 ring-1 ring-brand-500' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'"
                    >
                      <span class="w-2.5 h-2.5 rounded-full" [style.background-color]="sub.color"></span>
                      <span class="truncate">{{ sub.name }}</span>
                    </button>
                  }
                  <button
                    type="button"
                    (click)="selectedSubjectId.set('all'); selectedTopicName.set('')"
                    class="p-2.5 rounded-xl border text-left font-semibold transition-all flex items-center space-x-2"
                    [ngClass]="selectedSubjectId() === 'all' ? 'bg-brand-50 border-brand-500 text-brand-700 ring-1 ring-brand-500' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'"
                  >
                    <span class="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
                    <span>All Subjects (Mixed)</span>
                  </button>
                </div>
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
                  class="btn-primary text-xs py-2.5 px-6 font-bold shadow-xs flex items-center space-x-1.5"
                >
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  </svg>
                  <span>Start {{ questionCount() }}-Question Drill</span>
                </button>
              </div>
            </div>

            <!-- Quiz Features & Tips (Right Column) -->
            <div class="card p-5 space-y-4">
              <h4 class="text-sm font-bold text-slate-900">Drill Rules & Accuracy</h4>
              <ul class="text-xs text-slate-600 space-y-3">
                <li class="flex items-start space-x-2">
                  <span class="text-brand-600 font-bold">•</span>
                  <span><strong>45 Seconds Per Question:</strong> Trains sectional speed necessary for IBPS and SBI Prelims.</span>
                </li>
                <li class="flex items-start space-x-2">
                  <span class="text-brand-600 font-bold">•</span>
                  <span><strong>Dynamic Math Formulas:</strong> Quantitative Aptitude questions use randomized numerical seeds with mathematically computed answers.</span>
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
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            @for (paper of previousPapers(); track paper.id) {
              <div class="card p-5 flex flex-col justify-between space-y-4">
                <div>
                  <div class="flex items-center justify-between">
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-brand-50 text-brand-700 border border-brand-200">
                      {{ paper.stage }} ({{ paper.year }})
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

  public activeTab = signal<'builder' | 'papers' | 'history'>('builder');
  public subjects = signal<Subject[]>([]);
  public previousPapers = signal<PreviousPaper[]>([]);
  public pastAttempts = signal<QuizAttempt[]>([]);

  // Builder configuration
  public selectedSubjectId = signal<string>('all');
  public selectedTopicName = signal<string>('');
  public questionCount = signal<number>(5);

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
    const [subs, papers, attempts] = await Promise.all([
      this.dataStorage.getSubjects(),
      this.quizService.getPreviousPapers(),
      this.quizService.getQuizAttempts()
    ]);
    this.subjects.set(subs);
    this.previousPapers.set(papers);
    this.pastAttempts.set(attempts);

    // Check query params if user clicked "Take Quiz" from syllabus topic
    this.route.queryParams.subscribe(params => {
      if (params['topicName']) {
        this.selectedTopicName.set(params['topicName']);
        this.startQuiz();
      }
    });
  }

  async startQuiz(): Promise<void> {
    const selectedSub = this.subjects().find(s => s.id === this.selectedSubjectId());
    const subFilter = this.selectedSubjectId() === 'all' ? undefined : (selectedSub?.name || this.selectedSubjectId());
    const questions = await this.quizService.getQuestions(subFilter, this.selectedTopicName() || undefined, this.questionCount());

    if (questions.length === 0) {
      this.toast.error('Could not assemble questions for this selection.');
      return;
    }

    this.activeQuestions.set(questions);
    this.currentQuestionIndex.set(0);
    this.selectedOptionIndex.set(null);
    this.recordedAnswers = [];
    this.quizStartTime = Date.now();
    this.quizCompleted.set(false);
    this.quizActive.set(true);

    this.startQuestionTimer();
  }

  startPreviousPaper(paper: PreviousPaper): void {
    this.activeQuestions.set(paper.questions);
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

    const attempt = await this.quizService.saveQuizAttempt({
      quiz_type: this.selectedTopicName() ? 'topic' : 'subject',
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

  quitQuiz(): void {
    clearInterval(this.timerInterval);
    this.quizActive.set(false);
    this.toast.info('Quiz session cancelled.');
  }
}
