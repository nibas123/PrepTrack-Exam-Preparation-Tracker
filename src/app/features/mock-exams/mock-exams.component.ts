import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataStorageService } from '../../core/services/data-storage.service';
import { ToastService } from '../../core/services/toast.service';
import { MockExamSimulatorService } from '../../core/services/mock-exam-simulator.service';
import { QuestionPatternEngineService } from '../../core/services/question-pattern-engine.service';
import { ExamConsoleComponent } from './components/exam-console/exam-console.component';
import { ExamScorecardComponent } from './components/exam-scorecard/exam-scorecard.component';
import {
  MockExam,
  Exam,
  MockExamBlueprint,
  QuestionPattern,
  MockExamAttempt
} from '../../core/models/database.types';
import confetti from 'canvas-confetti';

@Component({
  selector: 'app-mock-exams',
  standalone: true,
  imports: [CommonModule, FormsModule, ExamConsoleComponent, ExamScorecardComponent],
  template: `
    <!-- FULLSCREEN EXAM CONSOLE (When Live Exam Active) -->
    @if (simulator.isExamActive()) {
      <app-exam-console></app-exam-console>
    }

    <!-- MAIN PAGE CONTAINER (When not taking exam) -->
    <div class="space-y-6 text-slate-800">
      
      <!-- PAGE HEADER & NAVIGATION TABS -->
      <div class="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div class="flex items-center space-x-2">
            <h2 class="text-xl font-bold text-slate-900 tracking-tight">Mock Exam Hub & Simulator</h2>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-brand-50 text-brand-700 border border-brand-200">
              TCS iON Engine
            </span>
          </div>
          <p class="text-xs text-slate-500 mt-0.5">
            Full-fledged bank exam player with parametric question patterns, strict sectional timers, and performance analytics
          </p>
        </div>

        <!-- Top Tabs Switcher -->
        <div class="flex items-center bg-slate-100 p-1 rounded-xl self-start md:self-auto border border-slate-200">
          <button
            type="button"
            (click)="activeTab.set('simulator')"
            class="px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5"
            [ngClass]="activeTab() === 'simulator' ? 'bg-white text-brand-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'"
          >
            <span>🎯 Live Exam Simulator</span>
          </button>

          <button
            type="button"
            (click)="activeTab.set('analytics')"
            class="px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5"
            [ngClass]="activeTab() === 'analytics' ? 'bg-white text-brand-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'"
          >
            <span>📊 Analytics & Records</span>
          </button>

          <button
            type="button"
            (click)="activeTab.set('patterns')"
            class="px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5"
            [ngClass]="activeTab() === 'patterns' ? 'bg-white text-brand-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'"
          >
            <span>🧩 Question Patterns</span>
          </button>
        </div>
      </div>

      <!-- ================================================================= -->
      <!-- TAB 1: LIVE MOCK EXAM SIMULATOR                                   -->
      <!-- ================================================================= -->
      @if (activeTab() === 'simulator') {
        
        <!-- CASE A: Viewing Scorecard of Most Recent Exam -->
        @if (simulator.isExamSubmitted() && simulator.lastAttempt()) {
          <div class="space-y-4">
            <div class="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <span class="text-xs font-semibold text-slate-600">
                Viewing scorecard for: <b>{{ simulator.lastAttempt()?.mock_name }}</b>
              </span>
              <button
                type="button"
                (click)="exitScorecardView()"
                class="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-all"
              >
                Back to Simulator Hub
              </button>
            </div>
            
            <app-exam-scorecard></app-exam-scorecard>
          </div>
        }

        <!-- CASE B: Simulator Hub & Blueprint Selector -->
        @else {
          <div class="space-y-6">
            
            <!-- Exam Mode Controls & Guidelines Card -->
            <div class="card p-5 bg-gradient-to-r from-brand-900 to-slate-900 text-white border-0 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div class="space-y-1.5 max-w-xl">
                <span class="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wide bg-brand-500/20 text-brand-300 border border-brand-400/30">
                  Authentic TCS iON Environment
                </span>
                <h3 class="text-lg font-bold text-white">Choose Your Examination Blueprint</h3>
                <p class="text-xs text-slate-300 leading-relaxed">
                  Questions are generated deterministically using the built-in algorithmic pattern engine. Every test offers mixed fresh numbers, identical to actual banking exam distributions with <b>zero API token usage</b>.
                </p>
              </div>

              <!-- Strict Mode Toggle -->
              <div class="bg-white/10 backdrop-blur-md p-3.5 rounded-xl border border-white/15 flex items-center space-x-3 shrink-0">
                <div class="text-right">
                  <span class="text-xs font-bold text-white block">Strict Sectional Timer</span>
                  <span class="text-[10px] text-slate-300">20 mins fixed / section</span>
                </div>
                <input
                  type="checkbox"
                  [checked]="strictSectionalMode()"
                  (change)="strictSectionalMode.set(!strictSectionalMode())"
                  class="w-5 h-5 text-brand-600 rounded cursor-pointer"
                />
              </div>
            </div>

            <!-- Available Blueprint Cards Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              @for (bp of blueprints(); track bp.id) {
                <div class="card p-5 hover:border-brand-500 transition-all flex flex-col justify-between space-y-4 group">
                  <div class="space-y-2">
                    <div class="flex items-center justify-between">
                      <span class="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase"
                            [ngClass]="{
                              'bg-brand-50 text-brand-700 border border-brand-200': bp.exam_category === 'IBPS_PO',
                              'bg-purple-50 text-purple-700 border border-purple-200': bp.exam_category === 'SBI_PO',
                              'bg-emerald-50 text-emerald-700 border border-emerald-200': bp.exam_category === 'IBPS_CLERK',
                              'bg-amber-50 text-amber-700 border border-amber-200': bp.exam_category === 'MIXED_SPRINT'
                            }">
                        {{ bp.exam_category }} • {{ bp.exam_stage | uppercase }}
                      </span>
                      <span class="text-xs font-bold text-slate-500">
                        {{ bp.total_duration_minutes }} Mins
                      </span>
                    </div>

                    <h4 class="text-base font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                      {{ bp.title }}
                    </h4>
                    <p class="text-xs text-slate-500 leading-relaxed">
                      {{ bp.description }}
                    </p>

                    <!-- Section breakdown pills -->
                    <div class="flex flex-wrap gap-1.5 pt-1">
                      @for (sec of bp.sections_config; track sec.code) {
                        <span class="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-semibold">
                          {{ sec.name }}: {{ sec.questionsCount }} Qs
                        </span>
                      }
                    </div>
                  </div>

                  <div class="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div class="text-xs text-slate-500">
                      Marks: <b>{{ bp.total_marks }}</b> | Target: <b>{{ bp.target_cutoff }}</b>
                    </div>
                    <button
                      type="button"
                      (click)="openInstructionsModal(bp)"
                      class="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all active:scale-95 flex items-center space-x-1.5"
                    >
                      <span>Take Live Exam</span>
                      <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                  </div>
                </div>
              }
            </div>

            <!-- Recent Simulator Attempts History -->
            @if (simulatorAttempts().length > 0) {
              <div class="card space-y-4">
                <div class="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 class="text-sm font-bold text-slate-900">Recent Live Mock Attempts</h3>
                    <p class="text-xs text-slate-500">Revisit past scores and solution reviews</p>
                  </div>
                </div>

                <div class="overflow-x-auto rounded-xl border border-slate-200">
                  <table class="w-full text-xs text-left">
                    <thead class="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th class="p-3">Date</th>
                        <th class="p-3">Exam Name</th>
                        <th class="p-3 text-center">Score</th>
                        <th class="p-3 text-center">Cutoff Status</th>
                        <th class="p-3 text-center">Accuracy</th>
                        <th class="p-3 text-center">Percentile</th>
                        <th class="p-3 text-right">Solutions</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 font-medium">
                      @for (att of simulatorAttempts(); track att.id) {
                        <tr class="hover:bg-slate-50/70 transition-colors">
                          <td class="p-3 text-slate-600 whitespace-nowrap">{{ att.completed_at | date:'short' }}</td>
                          <td class="p-3 font-bold text-slate-900">{{ att.mock_name }}</td>
                          <td class="p-3 text-center font-black text-slate-900 whitespace-nowrap">
                            {{ att.total_score }} / {{ att.maximum_marks }}
                          </td>
                          <td class="p-3 text-center whitespace-nowrap">
                            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold"
                                  [ngClass]="att.cutoff_status === 'cleared' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'">
                              {{ att.cutoff_status | uppercase }}
                            </span>
                          </td>
                          <td class="p-3 text-center font-bold text-emerald-600">{{ att.accuracy_percentage }}%</td>
                          <td class="p-3 text-center font-bold text-brand-600">~{{ att.percentile_estimate }}%</td>
                          <td class="p-3 text-right whitespace-nowrap">
                            <button
                              type="button"
                              (click)="viewAttemptScorecard(att)"
                              class="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition-all"
                            >
                              Review Solutions
                            </button>
                          </td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            }

          </div>
        }
      }

      <!-- ================================================================= -->
      <!-- TAB 2: ANALYTICS & PAST RECORDS (EXISTING TRACKER)                -->
      <!-- ================================================================= -->
      @if (activeTab() === 'analytics') {
        <div class="space-y-6">
          
          <div class="flex items-center justify-between">
            <span class="text-xs text-slate-500">Comprehensive score logging and visual progress tracker</span>
            <button
              type="button"
              (click)="openAddMockModal()"
              class="btn-primary text-xs py-2 px-4 flex items-center space-x-1.5"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              <span>Log Manual Mock Score</span>
            </button>
          </div>

          <!-- Key Analytics Metrics Cards -->
          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            <div class="card p-4">
              <span class="text-[11px] font-semibold text-slate-500 uppercase">Total Attended</span>
              <p class="text-2xl font-black text-slate-900 mt-1">{{ mockExams().length }}</p>
              <span class="text-[10px] text-slate-400">Total logged attempts</span>
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
                          class="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition-colors"
                          title="Delete"
                        >
                          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      }

      <!-- ================================================================= -->
      <!-- TAB 3: QUESTION PATTERN BANK                                      -->
      <!-- ================================================================= -->
      @if (activeTab() === 'patterns') {
        <div class="space-y-6">
          <div class="card p-5 bg-slate-900 text-white space-y-2">
            <h3 class="text-base font-bold text-white">Algorithmic Question Patterns Library</h3>
            <p class="text-xs text-slate-300 leading-relaxed max-w-2xl">
              These patterns define how the simulator generates randomized math problems, reasoning deductions, and grammar tests without calling external AI APIs. Each pattern enforces valid formulas, plausible distractors, and verifiable solutions.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            @for (p of questionPatterns(); track p.id) {
              <div class="card p-4 space-y-3 hover:border-slate-300 transition-all">
                <div class="flex items-center justify-between">
                  <span class="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase"
                        [ngClass]="{
                          'bg-sky-50 text-sky-700 border border-sky-200': p.subject_code === 'quant',
                          'bg-purple-50 text-purple-700 border border-purple-200': p.subject_code === 'reasoning',
                          'bg-amber-50 text-amber-700 border border-amber-200': p.subject_code === 'english',
                          'bg-emerald-50 text-emerald-700 border border-emerald-200': p.subject_code === 'ga'
                        }">
                    {{ p.subject_code | uppercase }}
                  </span>
                  <span class="text-[10px] text-slate-400 font-mono">{{ p.pattern_code }}</span>
                </div>

                <div>
                  <h4 class="text-sm font-bold text-slate-900">{{ p.topic_name }}</h4>
                  <p class="text-xs text-slate-500 mt-1 leading-relaxed">
                    {{ p.explanation_template }}
                  </p>
                </div>

                <div class="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Type: <b class="text-slate-700">{{ p.pattern_type }}</b></span>
                  <span class="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold">Active</span>
                </div>
              </div>
            }
          </div>
        </div>
      }

    </div>

    <!-- INSTRUCTIONS MODAL (Before launching live exam) -->
    @if (selectedBlueprintForModal()) {
      <div class="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
        <div class="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 text-slate-900">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center font-bold">
              📋
            </div>
            <div>
              <h3 class="text-base font-bold text-slate-900">{{ selectedBlueprintForModal()?.title }}</h3>
              <p class="text-xs text-slate-500">Candidate Examination Instructions & Guidelines</p>
            </div>
          </div>

          <div class="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2.5 text-slate-700 leading-relaxed">
            <p>• <b>Total Questions:</b> {{ selectedBlueprintForModal()?.sections_config | json }} questions across {{ selectedBlueprintForModal()?.sections_config?.length }} sections.</p>
            <p>• <b>Marking Scheme:</b> <b>+1.00</b> mark for each correct answer; <b>-0.25</b> negative mark for every incorrect answer.</p>
            <p>• <b>Sectional Timing:</b> @if (strictSectionalMode()) { <b>Active (20 mins per section).</b> You cannot switch sections until the timer expires. } @else { <b>Practice Mode.</b> Free navigation allowed across all sections. }</p>
            <p>• <b>Question Palette:</b> 🟢 Answered, 🔴 Not Answered, ⚪ Not Visited, 🟣 Marked for Review.</p>
            <p>• <b>Offline Engine:</b> 100% token-free deterministic generator. No internet or AI quota needed.</p>
          </div>

          <div class="flex items-center justify-end space-x-3 pt-2">
            <button
              type="button"
              (click)="selectedBlueprintForModal.set(null)"
              class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all"
            >
              Cancel
            </button>
            <button
              type="button"
              (click)="startLiveExam()"
              class="px-5 py-2 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 shadow-sm transition-all"
            >
              I Am Ready to Begin
            </button>
          </div>
        </div>
      </div>
    }

    <!-- MANUAL MOCK LOG MODAL -->
    @if (showMockModal()) {
      <div class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 class="text-base font-bold text-slate-900">
              {{ editingMock() ? 'Edit Mock Exam Record' : 'Log Mock Exam Result' }}
            </h3>
            <button
              type="button"
              (click)="showMockModal.set(false)"
              class="text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          </div>

          <form (ngSubmit)="saveMockForm()" class="space-y-4 text-xs">
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Test Name *</label>
              <input
                type="text"
                [(ngModel)]="mockForm.name"
                name="name"
                placeholder="e.g. IBPS PO Prelims Test #3"
                required
                class="input-field"
              />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block font-semibold text-slate-700 mb-1">Stage *</label>
                <select [(ngModel)]="mockForm.exam_stage" name="stage" class="input-field">
                  <option value="prelims">Prelims</option>
                  <option value="mains">Mains</option>
                </select>
              </div>

              <div>
                <label class="block font-semibold text-slate-700 mb-1">Date Attended *</label>
                <input
                  type="date"
                  [(ngModel)]="mockForm.attended_at"
                  name="attended_at"
                  required
                  class="input-field"
                />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block font-semibold text-slate-700 mb-1">Marks Obtained *</label>
                <input
                  type="number"
                  step="0.25"
                  [(ngModel)]="mockForm.marks_obtained"
                  name="marks_obtained"
                  required
                  class="input-field"
                />
              </div>

              <div>
                <label class="block font-semibold text-slate-700 mb-1">Maximum Marks *</label>
                <input
                  type="number"
                  [(ngModel)]="mockForm.maximum_marks"
                  name="maximum_marks"
                  required
                  class="input-field"
                />
              </div>
            </div>

            <div class="grid grid-cols-3 gap-3">
              <div>
                <label class="block font-semibold text-slate-700 mb-1">Total Qs</label>
                <input
                  type="number"
                  [(ngModel)]="mockForm.total_questions"
                  name="total_questions"
                  class="input-field"
                />
              </div>

              <div>
                <label class="block font-semibold text-slate-700 mb-1">Attempted</label>
                <input
                  type="number"
                  [(ngModel)]="mockForm.attempted_questions"
                  name="attempted_questions"
                  class="input-field"
                />
              </div>

              <div>
                <label class="block font-semibold text-slate-700 mb-1">Correct</label>
                <input
                  type="number"
                  [(ngModel)]="mockForm.correct_answers"
                  name="correct_answers"
                  class="input-field"
                />
              </div>
            </div>

            <div>
              <label class="block font-semibold text-slate-700 mb-1">Weak Areas / Feedback</label>
              <textarea
                [(ngModel)]="mockForm.weak_areas"
                name="weak_areas"
                rows="2"
                placeholder="e.g. Lost marks in Syllogisms and Quadratic equations"
                class="input-field"
              ></textarea>
            </div>

            <div class="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                (click)="showMockModal.set(false)"
                class="btn-secondary py-2 px-4"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="btn-primary py-2 px-4"
              >
                Save Record
              </button>
            </div>
          </form>
        </div>
      </div>
    }
  `
})
export class MockExamsComponent implements OnInit {
  private dataStorage = inject(DataStorageService);
  private toast = inject(ToastService);
  readonly simulator = inject(MockExamSimulatorService);
  readonly patternEngine = inject(QuestionPatternEngineService);

  readonly activeTab = signal<'simulator' | 'analytics' | 'patterns'>('simulator');
  readonly strictSectionalMode = signal<boolean>(true);
  readonly selectedBlueprintForModal = signal<MockExamBlueprint | null>(null);

  readonly blueprints = signal<MockExamBlueprint[]>([]);
  readonly questionPatterns = signal<QuestionPattern[]>([]);
  readonly simulatorAttempts = signal<MockExamAttempt[]>([]);

  // Existing Analytics Data
  readonly mockExams = signal<MockExam[]>([]);
  readonly exams = signal<Exam[]>([]);

  stageFilter = 'all';
  searchQuery = '';
  showMockModal = signal(false);
  editingMock = signal<MockExam | null>(null);

  mockForm = {
    name: '',
    exam_stage: 'prelims' as 'prelims' | 'mains',
    attended_at: new Date().toISOString().split('T')[0],
    marks_obtained: 65.0,
    maximum_marks: 100.0,
    total_questions: 100,
    attempted_questions: 80,
    correct_answers: 70,
    weak_areas: '',
    notes: ''
  };

  // Computeds
  readonly prelimsCount = computed(() => this.mockExams().filter(m => m.exam_stage === 'prelims').length);
  readonly mainsCount = computed(() => this.mockExams().filter(m => m.exam_stage === 'mains').length);

  readonly averagePercentage = computed(() => {
    const list = this.mockExams();
    if (list.length === 0) return 0;
    const sum = list.reduce((acc, m) => acc + (m.marks_obtained / m.maximum_marks) * 100, 0);
    return Math.round((sum / list.length) * 10) / 10;
  });

  readonly bestPercentage = computed(() => {
    const list = this.mockExams();
    if (list.length === 0) return 0;
    const max = Math.max(...list.map(m => (m.marks_obtained / m.maximum_marks) * 100));
    return Math.round(max * 10) / 10;
  });

  readonly latestScore = computed(() => {
    const list = this.mockExams();
    if (list.length === 0) return '—';
    const latest = list[0];
    return `${latest.marks_obtained} / ${latest.maximum_marks}`;
  });

  readonly latestAttemptDate = computed(() => {
    const list = this.mockExams();
    return list.length > 0 ? list[0].attended_at : 'No attempts';
  });

  readonly chronologicalMocks = computed(() => {
    return [...this.mockExams()].reverse().slice(-10);
  });

  readonly filteredMocks = computed(() => {
    let result = this.mockExams();
    if (this.stageFilter !== 'all') {
      result = result.filter(m => m.exam_stage === this.stageFilter);
    }
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(m => m.name.toLowerCase().includes(q) || (m.weak_areas || '').toLowerCase().includes(q));
    }
    return result;
  });

  async ngOnInit(): Promise<void> {
    this.blueprints.set(this.patternEngine.getDefaultBlueprints());
    this.questionPatterns.set(this.patternEngine.getPatternsLibrary());
    await this.loadData();
  }

  async loadData(): Promise<void> {
    const [mocks, examsList, attempts] = await Promise.all([
      this.dataStorage.getMockExams(),
      this.dataStorage.getExams(),
      this.dataStorage.getMockExamSimulatorAttempts()
    ]);
    this.mockExams.set(mocks);
    this.exams.set(examsList);
    this.simulatorAttempts.set(attempts);
  }

  openInstructionsModal(bp: MockExamBlueprint): void {
    this.selectedBlueprintForModal.set(bp);
  }

  startLiveExam(): void {
    const bp = this.selectedBlueprintForModal();
    if (!bp) return;

    this.selectedBlueprintForModal.set(null);
    this.simulator.startExam(bp, this.strictSectionalMode());
  }

  exitScorecardView(): void {
    this.simulator.lastAttempt.set(null);
    this.simulator.isExamSubmitted.set(false);
    this.loadData();
  }

  viewAttemptScorecard(att: MockExamAttempt): void {
    this.simulator.lastAttempt.set(att);
    this.simulator.isExamSubmitted.set(true);
    this.activeTab.set('simulator');
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
      total_questions: mock.total_questions || 100,
      attempted_questions: mock.attempted_questions || 80,
      correct_answers: mock.correct_answers || 70,
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
