import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MockExamSimulatorService } from '../../../../core/services/mock-exam-simulator.service';
import { ExamQuestionItem } from '../../../../core/models/database.types';
import confetti from 'canvas-confetti';

@Component({
  selector: 'app-exam-scorecard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6 animate-fade-in text-slate-800">
      
      <!-- TOP RESULT HERO BANNER -->
      <div class="card p-6 bg-gradient-to-br from-slate-900 via-slate-800 to-brand-950 text-white border-0 shadow-lg relative overflow-hidden">
        <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div class="space-y-2">
            <div class="flex items-center space-x-2.5">
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-brand-500/20 text-brand-300 border border-brand-400/30">
                Official Mock Evaluation
              </span>
              <span class="text-xs text-slate-400">{{ attempt()?.completed_at | date:'medium' }}</span>
            </div>
            <h2 class="text-2xl font-black tracking-tight text-white">
              {{ attempt()?.mock_name }}
            </h2>
            <p class="text-xs text-slate-300 max-w-xl">
              Evaluation based on standard IBPS formula: (+1.00 for correct, -0.25 for incorrect, 0 for unattempted).
            </p>
          </div>

          <!-- Total Score Hero Circle -->
          <div class="flex items-center space-x-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 self-start md:self-auto">
            <div class="text-right">
              <span class="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block">Total Marks</span>
              <div class="text-3xl font-black text-white flex items-baseline justify-end space-x-1">
                <span>{{ attempt()?.total_score }}</span>
                <span class="text-sm font-semibold text-slate-400">/ {{ attempt()?.maximum_marks }}</span>
              </div>
            </div>

            <div class="h-10 w-px bg-white/20"></div>

            <div class="text-left">
              <span class="text-[10px] font-semibold text-slate-300 uppercase tracking-wider block">Cutoff Status</span>
              @if (attempt()?.cutoff_status === 'cleared') {
                <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  🎉 CLEARED ({{ attempt()?.target_cutoff }})
                </span>
              } @else {
                <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-black bg-rose-500/20 text-rose-300 border border-rose-400/30">
                  ⚠️ MISSED ({{ attempt()?.target_cutoff }})
                </span>
              }
            </div>
          </div>
        </div>
      </div>

      <!-- KEY PERFORMANCE KPIs -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div class="card p-4">
          <span class="text-[11px] font-semibold text-slate-500 uppercase">Estimated Percentile</span>
          <p class="text-2xl font-black text-brand-600 mt-1">~{{ attempt()?.percentile_estimate }}%</p>
          <span class="text-[10px] text-slate-400">All-India simulation</span>
        </div>

        <div class="card p-4">
          <span class="text-[11px] font-semibold text-slate-500 uppercase">Accuracy Rate</span>
          <p class="text-2xl font-black text-emerald-600 mt-1">{{ attempt()?.accuracy_percentage }}%</p>
          <span class="text-[10px] text-slate-400">{{ attempt()?.correct_answers }} correct of {{ attempt()?.attempted_questions }} attempted</span>
        </div>

        <div class="card p-4">
          <span class="text-[11px] font-semibold text-slate-500 uppercase">Negative Deduction</span>
          <p class="text-2xl font-black text-rose-600 mt-1">-{{ negativeDeduction() }}</p>
          <span class="text-[10px] text-slate-400">{{ attempt()?.incorrect_answers }} wrong responses</span>
        </div>

        <div class="card p-4">
          <span class="text-[11px] font-semibold text-slate-500 uppercase">Time Utilized</span>
          <p class="text-2xl font-black text-slate-900 mt-1">{{ formatDuration(attempt()?.time_spent_seconds || 0) }}</p>
          <span class="text-[10px] text-slate-400">Total duration spent</span>
        </div>
      </div>

      <!-- SECTION-WISE BREAKDOWN TABLE -->
      <div class="card space-y-4">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 class="text-sm font-bold text-slate-900">Sectional Performance Breakdown</h3>
            <p class="text-xs text-slate-500">Subject-wise marks, accuracy, and cut-off clearance</p>
          </div>
        </div>

        <div class="overflow-x-auto rounded-xl border border-slate-200">
          <table class="w-full text-xs text-left">
            <thead class="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th class="p-3">Section</th>
                <th class="p-3 text-center">Questions</th>
                <th class="p-3 text-center text-brand-700">Attempted</th>
                <th class="p-3 text-center text-emerald-700">Correct</th>
                <th class="p-3 text-center text-rose-700">Wrong</th>
                <th class="p-3 text-center">Marks Scored</th>
                <th class="p-3 text-center">Accuracy</th>
                <th class="p-3 text-center">Sectional Cutoff</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 font-medium">
              @for (sec of attempt()?.section_breakdown; track sec.sectionCode) {
                <tr>
                  <td class="p-3 font-bold text-slate-900">{{ sec.sectionName }}</td>
                  <td class="p-3 text-center text-slate-600">{{ sec.totalQuestions }}</td>
                  <td class="p-3 text-center font-bold text-brand-600">{{ sec.attempted }}</td>
                  <td class="p-3 text-center font-bold text-emerald-600">{{ sec.correct }}</td>
                  <td class="p-3 text-center font-bold text-rose-600">{{ sec.incorrect }}</td>
                  <td class="p-3 text-center font-black text-slate-900">
                    {{ sec.marksObtained }} / {{ sec.maximumMarks }}
                  </td>
                  <td class="p-3 text-center font-bold"
                      [ngClass]="sec.accuracy >= 80 ? 'text-emerald-600' : (sec.accuracy >= 60 ? 'text-amber-600' : 'text-rose-600')">
                    {{ sec.accuracy }}%
                  </td>
                  <td class="p-3 text-center">
                    @if (sec.sectionalCutoff) {
                      <span class="px-2 py-0.5 rounded text-[10px] font-bold"
                            [ngClass]="sec.cutoffCleared ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'">
                        {{ sec.cutoffCleared ? 'Cleared' : 'Missed' }} ({{ sec.sectionalCutoff }})
                      </span>
                    } @else {
                      <span class="text-slate-400">-</span>
                    }
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <!-- INTERACTIVE SOLUTIONS & EXPLANATIONS REVIEW CONSOLE -->
      <div class="card space-y-5">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 class="text-sm font-bold text-slate-900">Step-by-Step Question & Solution Review</h3>
            <p class="text-xs text-slate-500">Examine answers, detailed derivations, and explanations</p>
          </div>

          <!-- Question Filters -->
          <div class="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              (click)="activeFilter.set('all')"
              class="px-2.5 py-1 rounded-lg text-xs font-bold transition-all"
              [ngClass]="activeFilter() === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
            >
              All ({{ questionsList().length }})
            </button>
            <button
              type="button"
              (click)="activeFilter.set('incorrect')"
              class="px-2.5 py-1 rounded-lg text-xs font-bold transition-all"
              [ngClass]="activeFilter() === 'incorrect' ? 'bg-rose-600 text-white' : 'bg-rose-50 text-rose-700 hover:bg-rose-100'"
            >
              Incorrect ({{ attempt()?.incorrect_answers }})
            </button>
            <button
              type="button"
              (click)="activeFilter.set('unattempted')"
              class="px-2.5 py-1 rounded-lg text-xs font-bold transition-all"
              [ngClass]="activeFilter() === 'unattempted' ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-700 hover:bg-amber-100'"
            >
              Unattempted ({{ (attempt()?.total_questions || 0) - (attempt()?.attempted_questions || 0) }})
            </button>
            <button
              type="button"
              (click)="activeFilter.set('correct')"
              class="px-2.5 py-1 rounded-lg text-xs font-bold transition-all"
              [ngClass]="activeFilter() === 'correct' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'"
            >
              Correct ({{ attempt()?.correct_answers }})
            </button>
          </div>
        </div>

        <!-- Filtered Questions List -->
        <div class="space-y-4">
          @for (q of filteredQuestions(); track q.id; let qIdx = $index) {
            <div class="p-4 rounded-xl border border-slate-200 space-y-3 bg-white hover:border-slate-300 transition-all shadow-2xs">
              
              <!-- Question Header -->
              <div class="flex items-center justify-between text-xs pb-2 border-b border-slate-100">
                <div class="flex items-center space-x-2">
                  <span class="font-extrabold px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                    Q{{ q.questionNumber }}
                  </span>
                  <span class="font-bold text-slate-700">{{ q.sectionName }}</span>
                  <span class="text-slate-400">•</span>
                  <span class="text-slate-500 font-medium">{{ q.topicName }}</span>
                </div>

                <div>
                  @if (getUserSelected(q.id) === null) {
                    <span class="px-2 py-0.5 rounded-full font-bold text-[10px] bg-slate-100 text-slate-500">
                      Unattempted
                    </span>
                  } @else if (getUserSelected(q.id) === q.correctOptionIndex) {
                    <span class="px-2 py-0.5 rounded-full font-bold text-[10px] bg-emerald-100 text-emerald-800">
                      ✓ Correct (+1.00)
                    </span>
                  } @else {
                    <span class="px-2 py-0.5 rounded-full font-bold text-[10px] bg-rose-100 text-rose-800">
                      ✗ Incorrect (-0.25)
                    </span>
                  }
                </div>
              </div>

              <!-- Optional Context / Table -->
              @if (q.passageText) {
                <div class="p-3 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs text-slate-700 whitespace-pre-line leading-relaxed">
                  {{ q.passageText }}
                </div>
              }

              <!-- Question Text -->
              <p class="font-medium text-slate-900 text-sm whitespace-pre-line">
                {{ q.questionText }}
              </p>

              <!-- 5 Options with Candidate vs Correct Highlights -->
              <div class="space-y-2 pt-1">
                @for (opt of q.options; track $index; let optIdx = $index) {
                  <div
                    class="p-2.5 rounded-lg border text-xs flex items-center justify-between transition-all"
                    [ngClass]="getOptionClass(q, optIdx)"
                  >
                    <div class="flex items-center space-x-2">
                      <span class="font-black w-6">{{ optionLetters[optIdx] }}</span>
                      <span class="font-medium">{{ opt }}</span>
                    </div>

                    <div class="font-bold text-[10px] flex items-center space-x-1.5">
                      @if (optIdx === q.correctOptionIndex) {
                        <span class="px-2 py-0.5 rounded bg-emerald-600 text-white font-extrabold">Correct Answer</span>
                      }
                      @if (optIdx === getUserSelected(q.id) && optIdx !== q.correctOptionIndex) {
                        <span class="px-2 py-0.5 rounded bg-rose-600 text-white font-extrabold">Your Choice</span>
                      }
                      @if (optIdx === getUserSelected(q.id) && optIdx === q.correctOptionIndex) {
                        <span class="px-2 py-0.5 rounded bg-emerald-700 text-white font-extrabold">Your Choice ✓</span>
                      }
                    </div>
                  </div>
                }
              </div>

              <!-- Step-by-Step Detailed Solution -->
              <div class="p-3.5 bg-emerald-50/70 border border-emerald-200/80 rounded-xl space-y-1.5 text-xs text-slate-800">
                <span class="font-bold text-emerald-900 block flex items-center space-x-1.5">
                  <svg class="w-3.5 h-3.5 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Step-by-Step Solution:</span>
                </span>
                <p class="whitespace-pre-line text-slate-700 leading-relaxed font-sans">
                  {{ q.explanation }}
                </p>
              </div>

            </div>
          }
        </div>
      </div>

    </div>
  `
})
export class ExamScorecardComponent implements OnInit {
  readonly simulator = inject(MockExamSimulatorService);

  readonly optionLetters = ['(A)', '(B)', '(C)', '(D)', '(E)'];
  readonly activeFilter = signal<'all' | 'incorrect' | 'unattempted' | 'correct'>('all');

  readonly attempt = computed(() => this.simulator.lastAttempt());
  readonly questionsList = computed(() => this.attempt()?.questions_payload || []);

  readonly negativeDeduction = computed(() => {
    const wrong = this.attempt()?.incorrect_answers || 0;
    return (wrong * 0.25).toFixed(2);
  });

  readonly filteredQuestions = computed(() => {
    const filter = this.activeFilter();
    const qs = this.questionsList();
    const responses = this.attempt()?.user_responses || {};

    if (filter === 'all') return qs;

    return qs.filter(q => {
      const resp = responses[q.id];
      const selected = resp ? resp.selectedOptionIndex : null;

      if (filter === 'unattempted') return selected === null;
      if (filter === 'correct') return selected === q.correctOptionIndex;
      if (filter === 'incorrect') return selected !== null && selected !== q.correctOptionIndex;
      return true;
    });
  });

  ngOnInit(): void {
    const att = this.attempt();
    if (att && att.cutoff_status === 'cleared') {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // Safe fallback in test environment
      }
    }
  }

  getUserSelected(qId: string): number | null {
    const resp = this.attempt()?.user_responses?.[qId];
    return resp ? resp.selectedOptionIndex : null;
  }

  getOptionClass(q: ExamQuestionItem, optIdx: number): string {
    const userSelected = this.getUserSelected(q.id);
    const isCorrect = optIdx === q.correctOptionIndex;
    const isSelected = optIdx === userSelected;

    if (isCorrect) {
      return 'border-emerald-500 bg-emerald-50/80 text-emerald-950 font-semibold ring-1 ring-emerald-400';
    }
    if (isSelected && !isCorrect) {
      return 'border-rose-400 bg-rose-50 text-rose-950 font-semibold ring-1 ring-rose-300';
    }
    return 'border-slate-200 bg-white text-slate-700';
  }

  formatDuration(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  }
}
