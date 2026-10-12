import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MockExamSimulatorService } from '../../../../core/services/mock-exam-simulator.service';
import { ExamQuestionItem, ExamUserResponse } from '../../../../core/models/database.types';

@Component({
  selector: 'app-exam-console',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed inset-0 z-50 bg-slate-900 flex flex-col font-sans select-none overflow-hidden text-slate-800">
      
      <!-- TOP TCS iON SIMULATOR BAR -->
      <header class="bg-slate-950 text-white px-4 py-2.5 flex items-center justify-between border-b border-slate-800 shrink-0">
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center font-black text-white text-sm shadow-sm">
            PT
          </div>
          <div>
            <h1 class="text-sm font-bold tracking-tight text-white flex items-center gap-2">
              {{ simulator.activeBlueprint()?.title }}
              <span class="text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider bg-brand-950 text-brand-300 border border-brand-800/80">
                {{ simulator.isStrictSectionalMode() ? 'Strict Exam Mode' : 'Practice Mode' }}
              </span>
            </h1>
            <p class="text-[11px] text-slate-400">IBPS / TCS iON Examination Interface</p>
          </div>
        </div>

        <!-- Sectional Countdown Timer -->
        <div class="flex items-center space-x-4">
          <div class="flex items-center space-x-2 bg-slate-900 border border-slate-700/80 px-3.5 py-1.5 rounded-lg shadow-inner">
            <svg class="w-4 h-4 text-amber-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div class="text-right">
              <span class="text-[10px] font-semibold text-slate-400 block leading-tight">
                {{ simulator.isStrictSectionalMode() ? 'Section Time Left' : 'Time Remaining' }}
              </span>
              <span class="text-base font-black tracking-widest font-mono text-amber-300">
                {{ formattedTime() }}
              </span>
            </div>
          </div>

          <!-- Quick Action to Open Submit Confirmation -->
          <button
            type="button"
            (click)="simulator.openSummaryModal()"
            class="hidden sm:inline-flex items-center px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all"
          >
            Submit Test
          </button>
        </div>
      </header>

      <!-- SECTION TABS ROW -->
      <nav class="bg-slate-900 border-b border-slate-800 px-4 py-1.5 flex items-center justify-between shrink-0 overflow-x-auto">
        <div class="flex items-center space-x-2">
          <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-2 hidden md:inline">Sections:</span>
          @for (sec of simulator.activeBlueprint()?.sections_config; track sec.code; let sIdx = $index) {
            <button
              type="button"
              (click)="onSectionTabClick(sIdx)"
              [disabled]="simulator.isStrictSectionalMode() && sIdx !== simulator.currentSectionIndex()"
              class="px-3 py-1.5 rounded-md text-xs font-bold flex items-center space-x-2 transition-all border"
              [ngClass]="sIdx === simulator.currentSectionIndex() 
                ? 'bg-brand-600 text-white border-brand-500 shadow-sm' 
                : (simulator.isStrictSectionalMode() 
                    ? 'bg-slate-800/40 text-slate-500 border-slate-800 cursor-not-allowed opacity-60' 
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700')"
            >
              <span>{{ sec.name }}</span>
              <span class="text-[10px] px-1.5 py-0.2 rounded-full"
                    [ngClass]="sIdx === simulator.currentSectionIndex() ? 'bg-brand-800 text-brand-100' : 'bg-slate-700 text-slate-300'">
                {{ sec.questionsCount }}
              </span>
            </button>
          }
        </div>

        <div class="text-[11px] text-slate-400 hidden lg:flex items-center space-x-2">
          <span>Marks: <b class="text-emerald-400">+{{ currentQ()?.marks || 1.00 }}</b></span>
          <span>|</span>
          <span>Negative: <b class="text-rose-400">-{{ currentQ()?.negativeMarks || 0.25 }}</b></span>
        </div>
      </nav>

      <!-- MAIN EXAM WORKSPACE: Question Area (Left) + Palette Pane (Right) -->
      <main class="flex-1 flex flex-col md:flex-row overflow-hidden bg-slate-100">
        
        <!-- LEFT: QUESTION PANE -->
        <div class="flex-1 flex flex-col bg-white border-r border-slate-200 overflow-hidden">
          
          <!-- Question Header & Breadcrumb -->
          <div class="px-5 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
            <div class="flex items-center space-x-3">
              <span class="bg-brand-100 text-brand-800 font-extrabold text-xs px-2.5 py-1 rounded-md">
                Question {{ currentQ()?.questionNumber }}
              </span>
              <span class="text-xs text-slate-600 font-semibold truncate max-w-md">
                {{ currentQ()?.topicName }}
              </span>
            </div>

            <div class="flex items-center space-x-2">
              <span class="text-[11px] px-2 py-0.5 rounded font-medium"
                    [ngClass]="{
                      'bg-emerald-100 text-emerald-800': currentQ()?.difficulty === 'easy',
                      'bg-amber-100 text-amber-800': currentQ()?.difficulty === 'medium',
                      'bg-rose-100 text-rose-800': currentQ()?.difficulty === 'hard'
                    }">
                {{ currentQ()?.difficulty | uppercase }}
              </span>
            </div>
          </div>

          <!-- Question Content Scrollable Area -->
          <div class="flex-1 p-5 overflow-y-auto space-y-5 text-slate-900 leading-relaxed text-sm">
            
            <!-- Optional Context Passage or Data Interpretation Table -->
            @if (currentQ()?.passageText) {
              <div class="p-4 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs text-slate-700 whitespace-pre-line leading-relaxed shadow-xs">
                {{ currentQ()?.passageText }}
              </div>
            }

            <!-- Question Statement -->
            <div class="font-medium text-base text-slate-900 whitespace-pre-line">
              {{ currentQ()?.questionText }}
            </div>

            <!-- 5 Multiple Choice Options (A, B, C, D, E) -->
            <div class="space-y-3 pt-2">
              @for (opt of currentQ()?.options; track $index; let optIdx = $index) {
                <label
                  (click)="onOptionSelect(optIdx)"
                  class="flex items-start space-x-3.5 p-3.5 rounded-xl border transition-all cursor-pointer"
                  [ngClass]="selectedOption() === optIdx 
                    ? 'border-brand-600 bg-brand-50/80 shadow-xs ring-1 ring-brand-500' 
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/70 bg-white'"
                >
                  <div class="flex items-center h-5">
                    <input
                      type="radio"
                      name="exam-option"
                      [checked]="selectedOption() === optIdx"
                      class="w-4 h-4 text-brand-600 border-slate-300 focus:ring-brand-500 cursor-pointer"
                    />
                  </div>
                  <div class="flex-1 flex items-baseline space-x-2">
                    <span class="font-bold text-xs px-1.5 py-0.5 rounded"
                          [ngClass]="selectedOption() === optIdx ? 'bg-brand-600 text-white' : 'bg-slate-200 text-slate-700'">
                      {{ optionLetters[optIdx] }}
                    </span>
                    <span class="text-slate-800 font-medium text-sm">{{ opt }}</span>
                  </div>
                </label>
              }
            </div>
          </div>

          <!-- BOTTOM ACTION TOOLBAR -->
          <footer class="p-3 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 shrink-0">
            <div class="flex items-center space-x-2">
              <button
                type="button"
                (click)="simulator.markForReviewAndNext()"
                class="px-3.5 py-2 rounded-lg text-xs font-bold bg-purple-100 hover:bg-purple-200 text-purple-800 border border-purple-300 transition-all active:scale-95 flex items-center space-x-1.5"
              >
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                <span>Mark for Review & Next</span>
              </button>

              <button
                type="button"
                (click)="simulator.clearResponse()"
                class="px-3.5 py-2 rounded-lg text-xs font-semibold bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 transition-all active:scale-95"
              >
                Clear Response
              </button>
            </div>

            <div class="flex items-center space-x-2">
              <button
                type="button"
                (click)="simulator.saveAndNext()"
                class="px-5 py-2 rounded-lg text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-xs transition-all active:scale-95 flex items-center space-x-1.5"
              >
                <span>Save & Next</span>
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </footer>
        </div>

        <!-- RIGHT: CANDIDATE PALETTE DRAWER -->
        <aside class="w-full md:w-80 lg:w-96 bg-white flex flex-col shrink-0 border-t md:border-t-0 md:border-l border-slate-200 overflow-hidden max-h-72 md:max-h-none">
          
          <!-- Candidate Mini Profile -->
          <div class="p-3 bg-slate-50 border-b border-slate-200 flex items-center space-x-3 shrink-0">
            <div class="w-9 h-9 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              BA
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="text-xs font-bold text-slate-900 truncate">Candidate: Bank Aspirant</h3>
              <p class="text-[10px] text-slate-500">Roll No: 2026-IBPS-{{ simulator.activeBlueprint()?.exam_category }}</p>
            </div>
          </div>

          <!-- Color Palette Legend Summary -->
          <div class="p-3 bg-white border-b border-slate-200 grid grid-cols-2 gap-2 text-[11px] shrink-0 font-medium">
            <div class="flex items-center space-x-2">
              <span class="w-4 h-4 rounded-sm bg-emerald-600 text-white text-[9px] font-bold flex items-center justify-center">
                {{ simulator.paletteCounts().answered }}
              </span>
              <span class="text-slate-600">Answered</span>
            </div>
            <div class="flex items-center space-x-2">
              <span class="w-4 h-4 rounded-sm bg-rose-600 text-white text-[9px] font-bold flex items-center justify-center">
                {{ simulator.paletteCounts().notAnswered }}
              </span>
              <span class="text-slate-600">Not Answered</span>
            </div>
            <div class="flex items-center space-x-2">
              <span class="w-4 h-4 rounded-sm bg-slate-200 text-slate-700 text-[9px] font-bold flex items-center justify-center border border-slate-300">
                {{ simulator.paletteCounts().notVisited }}
              </span>
              <span class="text-slate-600">Not Visited</span>
            </div>
            <div class="flex items-center space-x-2">
              <span class="w-4 h-4 rounded-sm bg-purple-600 text-white text-[9px] font-bold flex items-center justify-center">
                {{ simulator.paletteCounts().markedReview }}
              </span>
              <span class="text-slate-600">Marked for Review</span>
            </div>
            <div class="col-span-2 flex items-center space-x-2 pt-1 border-t border-slate-100">
              <div class="relative w-4 h-4 rounded-sm bg-purple-600 text-white flex items-center justify-center">
                <span class="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 ring-1 ring-white"></span>
              </div>
              <span class="text-slate-600">Answered & Marked (Evaluated) ({{ simulator.paletteCounts().answeredMarked }})</span>
            </div>
          </div>

          <!-- Question Grid -->
          <div class="flex-1 p-3 overflow-y-auto">
            <div class="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Section: {{ simulator.currentSection()?.name }}</span>
              <span>Total: {{ currentSectionQs().length }}</span>
            </div>

            <div class="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-5 lg:grid-cols-6 gap-2">
              @for (q of currentSectionQs(); track q.id) {
                <button
                  type="button"
                  (click)="onPaletteButtonClick(q)"
                  class="h-8 rounded font-bold text-xs flex items-center justify-center transition-all relative shadow-2xs"
                  [ngClass]="getPaletteButtonClass(q)"
                  [title]="'Question ' + q.questionNumber"
                >
                  {{ q.questionNumber }}
                  @if (getQuestionResponse(q.id)?.status === 'answered_marked') {
                    <span class="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-400 ring-1 ring-white"></span>
                  }
                </button>
              }
            </div>
          </div>

          <!-- Submit Button in Drawer -->
          <div class="p-3 bg-slate-50 border-t border-slate-200 shrink-0">
            <button
              type="button"
              (click)="simulator.openSummaryModal()"
              class="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center space-x-2"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>Submit Entire Exam</span>
            </button>
          </div>
        </aside>
      </main>

      <!-- SUBMISSION CONFIRMATION MODAL -->
      @if (simulator.isSummaryModalOpen()) {
        <div class="fixed inset-0 z-60 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div class="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 text-slate-900">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
                ⚠️
              </div>
              <div>
                <h3 class="text-base font-bold text-slate-900">Exam Submission Summary</h3>
                <p class="text-xs text-slate-500">Please review your section-wise status before final submission</p>
              </div>
            </div>

            <!-- Summary Table -->
            <div class="overflow-x-auto rounded-xl border border-slate-200">
              <table class="w-full text-xs text-left">
                <thead class="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th class="p-2.5">Section</th>
                    <th class="p-2.5 text-center">Total</th>
                    <th class="p-2.5 text-center text-emerald-600">Answered</th>
                    <th class="p-2.5 text-center text-rose-600">Not Answered</th>
                    <th class="p-2.5 text-center text-purple-600">Marked</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 font-medium">
                  @for (sec of simulator.activeBlueprint()?.sections_config; track sec.code) {
                    <tr>
                      <td class="p-2.5 font-bold text-slate-800">{{ sec.name }}</td>
                      <td class="p-2.5 text-center text-slate-600">{{ sec.questionsCount }}</td>
                      <td class="p-2.5 text-center font-bold text-emerald-700">{{ getSectionAnsweredCount(sec.code) }}</td>
                      <td class="p-2.5 text-center font-bold text-rose-600">{{ getSectionNotAnsweredCount(sec.code) }}</td>
                      <td class="p-2.5 text-center font-bold text-purple-700">{{ getSectionMarkedCount(sec.code) }}</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>

            <p class="text-xs text-slate-600 bg-amber-50 p-3 rounded-lg border border-amber-200 leading-relaxed">
              <b>Important:</b> Once submitted, your answers will be evaluated with <b>+1.00</b> for correct answers and <b>-0.25</b> negative marking for incorrect answers. You will immediately receive your comprehensive scorecard and step-by-step solutions review.
            </p>

            <div class="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                (click)="simulator.closeSummaryModal()"
                class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all"
              >
                Return to Exam
              </button>
              <button
                type="button"
                (click)="simulator.submitExam()"
                class="px-5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-sm transition-all"
              >
                Yes, Final Submit
              </button>
            </div>
          </div>
        </div>
      }

    </div>
  `
})
export class ExamConsoleComponent {
  readonly simulator = inject(MockExamSimulatorService);

  readonly optionLetters = ['(A)', '(B)', '(C)', '(D)', '(E)'];

  readonly currentQ = computed(() => this.simulator.currentQuestion());
  readonly currentSectionQs = computed(() => this.simulator.currentSectionQuestions());

  readonly selectedOption = computed(() => {
    return this.simulator.currentResponse()?.selectedOptionIndex ?? null;
  });

  readonly formattedTime = computed(() => {
    const totalSec = this.simulator.remainingSectionSeconds();
    const minutes = Math.floor(totalSec / 60);
    const seconds = totalSec % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  });

  onOptionSelect(idx: number): void {
    this.simulator.selectOption(idx);
  }

  onSectionTabClick(sectionIndex: number): void {
    this.simulator.switchSection(sectionIndex);
  }

  onPaletteButtonClick(q: ExamQuestionItem): void {
    const allQuestions = this.simulator.questions();
    const globalIdx = allQuestions.findIndex(item => item.id === q.id);
    if (globalIdx >= 0) {
      this.simulator.jumpToQuestion(globalIdx);
    }
  }

  getQuestionResponse(qId: string): ExamUserResponse | undefined {
    return this.simulator.responses()[qId];
  }

  getPaletteButtonClass(q: ExamQuestionItem): string {
    const isCurrent = this.currentQ()?.id === q.id;
    const resp = this.getQuestionResponse(q.id);
    const status = resp?.status || 'not_visited';

    let colorClass = 'bg-slate-100 text-slate-600 border border-slate-300';

    switch (status) {
      case 'answered':
        colorClass = 'bg-emerald-600 text-white';
        break;
      case 'not_answered':
        colorClass = 'bg-rose-600 text-white';
        break;
      case 'marked_review':
        colorClass = 'bg-purple-600 text-white';
        break;
      case 'answered_marked':
        colorClass = 'bg-purple-600 text-white';
        break;
      case 'not_visited':
      default:
        colorClass = 'bg-slate-100 text-slate-700 border border-slate-300 hover:bg-slate-200';
        break;
    }

    if (isCurrent) {
      return `${colorClass} ring-2 ring-brand-500 ring-offset-2 scale-105 z-10`;
    }

    return colorClass;
  }

  getSectionAnsweredCount(sectionCode: string): number {
    const secQs = this.simulator.questions().filter(q => q.sectionCode === sectionCode);
    const respMap = this.simulator.responses();
    return secQs.filter(q => {
      const st = respMap[q.id]?.status;
      return st === 'answered' || st === 'answered_marked';
    }).length;
  }

  getSectionNotAnsweredCount(sectionCode: string): number {
    const secQs = this.simulator.questions().filter(q => q.sectionCode === sectionCode);
    const respMap = this.simulator.responses();
    return secQs.filter(q => {
      const st = respMap[q.id]?.status;
      return st === 'not_answered';
    }).length;
  }

  getSectionMarkedCount(sectionCode: string): number {
    const secQs = this.simulator.questions().filter(q => q.sectionCode === sectionCode);
    const respMap = this.simulator.responses();
    return secQs.filter(q => {
      const st = respMap[q.id]?.status;
      return st === 'marked_review' || st === 'answered_marked';
    }).length;
  }
}
