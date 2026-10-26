import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  StudyMaterialsService,
  DescriptiveEssayModel,
  PrecisExercise,
  TranslationExercise
} from '../../core/services/study-materials.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-descriptive-lab',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="space-y-6 max-w-7xl mx-auto pb-12">
      <!-- HEADER BANNER -->
      <div class="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div class="flex items-center space-x-2">
            <span class="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-court-100 text-court-800 border border-court-200 flex items-center space-x-1">
              <svg class="w-3.5 h-3.5 text-court-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span>Descriptive Exam Lab (Stage II - 60 Marks)</span>
            </span>
            <span class="text-xs text-slate-400 font-medium">High Court Recruitment Pattern</span>
          </div>
          <h2 class="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1">
            Answer-Writing, Précis & Legal Essay Masterclass
          </h2>
          <p class="text-xs text-slate-500 mt-0.5">
            Master the 60-mark written test: Précis drafting workbench, model legal essays, comprehension guides, and evaluation rubrics.
          </p>
        </div>

        <div class="flex items-center space-x-2">
          <a
            routerLink="/study-library"
            class="btn-secondary text-xs py-2 px-3.5 font-semibold flex items-center space-x-1.5"
          >
            <span>← Legal Library</span>
          </a>
          <button
            type="button"
            (click)="printLabNotes()"
            class="btn-primary text-xs py-2 px-3.5 font-semibold flex items-center space-x-1.5"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            <span>Print Guides</span>
          </button>
        </div>
      </div>

      <!-- TABS: PRÉCIS BENCH vs ESSAYS vs RUBRICS & SCORING -->
      <div class="flex items-center space-x-2 border-b border-slate-200 pb-3 overflow-x-auto scrollbar-none">
        <button
          type="button"
          (click)="activeTab.set('precis')"
          class="px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center space-x-1.5"
          [ngClass]="activeTab() === 'precis' ? 'bg-slate-900 text-white shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'"
        >
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
          <span>Précis Writing Workbench ({{ precisExercises().length }} Solved)</span>
        </button>

        <button
          type="button"
          (click)="activeTab.set('essays')"
          class="px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center space-x-1.5"
          [ngClass]="activeTab() === 'essays' ? 'bg-slate-900 text-white shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'"
        >
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
          <span>Model Legal Essays ({{ modelEssays().length }})</span>
        </button>

        <button
          type="button"
          (click)="activeTab.set('rubric')"
          class="px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center space-x-1.5"
          [ngClass]="activeTab() === 'rubric' ? 'bg-slate-900 text-white shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'"
        >
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          <span>Official Scoring Rubric & Calculator</span>
        </button>
      </div>

      <!-- ================================================================= -->
      <!-- TAB 1: PRÉCIS WRITING WORKBENCH                                   -->
      <!-- ================================================================= -->
      @if (activeTab() === 'precis') {
        <div class="space-y-6">
          <!-- Official Rules Card -->
          <div class="card p-5 bg-court-50/70 border-court-200 text-court-950 space-y-2">
            <div class="flex items-center space-x-2">
              <span class="font-bold text-xs uppercase tracking-wider text-court-800">
                Official High Court Précis Writing Instructions
              </span>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs pt-1">
              <div class="bg-white p-3 rounded-xl border border-court-200/80 shadow-2xs">
                <span class="font-bold block text-court-900">1. Strict 1/3rd Length</span>
                <span class="text-slate-500 text-[11px]">Divide total words by 3 (± 5 words allowed). Exceeding deducts marks.</span>
              </div>
              <div class="bg-white p-3 rounded-xl border border-court-200/80 shadow-2xs">
                <span class="font-bold block text-court-900">2. Compulsory Title</span>
                <span class="text-slate-500 text-[11px]">A concise, relevant title carries 2 to 3 marks. Never forget to provide one.</span>
              </div>
              <div class="bg-white p-3 rounded-xl border border-court-200/80 shadow-2xs">
                <span class="font-bold block text-court-900">3. Indirect & Third Person</span>
                <span class="text-slate-500 text-[11px]">Never write "I" or "In my opinion". Use reported, indirect past speech.</span>
              </div>
              <div class="bg-white p-3 rounded-xl border border-court-200/80 shadow-2xs">
                <span class="font-bold block text-court-900">4. Own Words Only</span>
                <span class="text-slate-500 text-[11px]">Copying exact sentences from the passage results in a zero score for expression.</span>
              </div>
            </div>
          </div>

          <!-- Exercise Selector -->
          <div class="flex items-center space-x-2">
            @for (ex of precisExercises(); track ex.id; let idx = $index) {
              <button
                type="button"
                (click)="selectedPrecisIndex.set(idx)"
                class="px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all"
                [ngClass]="selectedPrecisIndex() === idx ? 'bg-brand-900 text-white shadow-2xs font-bold' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'"
              >
                Exercise {{ idx + 1 }}: {{ ex.title.split(':')[0] }}
              </button>
            }
          </div>

          <!-- Active Exercise Workspace -->
          @if (currentPrecis(); as ex) {
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <!-- Left Column: Original Passage -->
              <div class="card p-5 space-y-3 bg-white">
                <div class="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span class="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Original Examination Passage
                  </span>
                  <span class="text-xs font-mono font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    Word Count: {{ ex.originalWords }} Words
                  </span>
                </div>
                <h4 class="text-sm font-bold text-slate-900">{{ ex.title }}</h4>
                <div class="text-xs text-slate-700 leading-relaxed space-y-2 max-h-80 overflow-y-auto pr-1">
                  {{ ex.originalText }}
                </div>
                <div class="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
                  <span class="font-bold block mb-1">Target Précis Word Range:</span>
                  <span>Aim for approximately <b>{{ ex.targetWordsRange }}</b>.</span>
                </div>
              </div>

              <!-- Right Column: Interactive Practice Sandbox & Model Solution -->
              <div class="space-y-4">
                <div class="card p-5 space-y-3 bg-white">
                  <div class="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span class="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Your Draft Workbench
                    </span>
                    <span class="text-xs font-mono font-bold"
                          [ngClass]="userPrecisWordCount() >= 55 && userPrecisWordCount() <= 70 ? 'text-emerald-700' : 'text-slate-500'">
                      Words: {{ userPrecisWordCount() }}
                    </span>
                  </div>

                  <div>
                    <label class="block text-[11px] font-semibold text-slate-700 uppercase mb-1">Proposed Title *</label>
                    <input
                      type="text"
                      [(ngModel)]="userTitleDraft"
                      placeholder="e.g. Independence of the Judiciary in Constitutional Democracy"
                      class="input-field text-xs"
                    />
                  </div>

                  <div>
                    <label class="block text-[11px] font-semibold text-slate-700 uppercase mb-1">Draft Précis Text *</label>
                    <textarea
                      [(ngModel)]="userPrecisDraft"
                      rows="6"
                      placeholder="Write your condensed summary in your own words (third person, past tense)..."
                      class="input-field text-xs leading-relaxed"
                    ></textarea>
                  </div>

                  <div class="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      (click)="showModelAnswer.set(!showModelAnswer())"
                      class="btn-primary text-xs py-1.5 px-3 font-semibold"
                    >
                      {{ showModelAnswer() ? 'Hide Model Précis' : 'Compare with Model Précis' }}
                    </button>
                    @if (userPrecisWordCount() > 0) {
                      <span class="text-[11px] text-slate-500">
                        {{ userPrecisWordCount() >= 58 && userPrecisWordCount() <= 68 ? '✓ Length optimal' : 'Target: ' + ex.targetWordsRange }}
                      </span>
                    }
                  </div>
                </div>

                <!-- Model Solution Display -->
                @if (showModelAnswer()) {
                  <div class="card p-5 space-y-3 bg-emerald-50/70 border-emerald-200 text-emerald-950 animate-in fade-in duration-200">
                    <div class="flex items-center justify-between">
                      <span class="font-bold text-xs uppercase tracking-wider text-emerald-900">
                        Official Model Précis Solution ({{ ex.modelWords }} Words)
                      </span>
                      <span class="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        100% Score Benchmark
                      </span>
                    </div>

                    <div class="bg-white p-3.5 rounded-xl border border-emerald-200/80 shadow-2xs space-y-1.5">
                      <span class="text-xs font-bold text-slate-900 block">Suggested Titles:</span>
                      <ul class="text-xs text-slate-700 list-disc list-inside">
                        @for (title of ex.suggestedTitles; track title) {
                          <li>"{{ title }}"</li>
                        }
                      </ul>
                    </div>

                    <div class="bg-white p-3.5 rounded-xl border border-emerald-200/80 shadow-2xs space-y-1">
                      <span class="text-xs font-bold text-slate-900 block">Model Text:</span>
                      <p class="text-xs text-slate-800 leading-relaxed font-serif">
                        {{ ex.modelPrecis }}
                      </p>
                    </div>

                    <div class="space-y-1 text-xs">
                      <span class="font-bold text-emerald-900 block text-[11px] uppercase">Points Preserved:</span>
                      <ul class="space-y-1 text-emerald-800 text-[11px]">
                        @for (pt of ex.keyPointsPreserved; track pt) {
                          <li>• {{ pt }}</li>
                        }
                      </ul>
                    </div>
                  </div>
                }
              </div>
            </div>
          }
        </div>
      }

      <!-- ================================================================= -->
      <!-- TAB 2: MODEL LEGAL & CONTEMPORARY ESSAYS                          -->
      <!-- ================================================================= -->
      @if (activeTab() === 'essays') {
        <div class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            @for (essay of modelEssays(); track essay.id) {
              <div class="card p-5 space-y-3 bg-white border border-slate-200 shadow-2xs flex flex-col justify-between">
                <div class="space-y-2">
                  <div class="flex items-center justify-between">
                    <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-800">
                      {{ essay.category }}
                    </span>
                    <span class="text-xs font-mono text-slate-500 font-semibold">
                      Target: {{ essay.targetWords }} Words
                    </span>
                  </div>

                  <h3 class="text-base font-bold text-slate-900 leading-snug">{{ essay.title }}</h3>

                  <!-- Outline Breakdown -->
                  <div class="space-y-1.5 pt-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                    <span class="font-bold text-slate-800 uppercase tracking-wider text-[10px] block">
                      Recommended High-Scoring Outline:
                    </span>
                    <p><b>1. Introduction:</b> {{ essay.outline.introduction }}</p>
                    <p><b>2. Constitutional Anchor:</b> {{ essay.outline.constitutionalLegalContext }}</p>
                    <p><b>3. Precedents:</b> {{ essay.outline.judicialPrecedents }}</p>
                    <p><b>4. Way Forward:</b> {{ essay.outline.recommendationsWayForward }}</p>
                  </div>
                </div>

                <div class="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div class="flex flex-wrap gap-1">
                    @for (cite of essay.keyLegalCitations; track cite) {
                      <span class="text-[10px] bg-court-50 text-court-800 px-2 py-0.5 rounded border border-court-200 font-mono">
                        {{ cite }}
                      </span>
                    }
                  </div>
                  <button
                    type="button"
                    (click)="selectedEssayForModal.set(essay)"
                    class="btn-primary text-xs py-1.5 px-3 font-semibold whitespace-nowrap"
                  >
                    Read Full Essay →
                  </button>
                </div>
              </div>
            }
          </div>
        </div>
      }

      <!-- ================================================================= -->
      <!-- TAB 3: OFFICIAL SCORING RUBRIC & CALCULATOR                       -->
      <!-- ================================================================= -->
      @if (activeTab() === 'rubric') {
        <div class="space-y-6">
          <div class="card p-6 bg-white space-y-4">
            <div>
              <h3 class="text-base font-bold text-slate-900">High Court Descriptive Evaluation Rubric</h3>
              <p class="text-xs text-slate-500">Official marking criteria applied by examiners for the 60-mark Descriptive Paper</p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div class="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span class="font-bold text-slate-900 block text-sm">1. Content & Legal Thought (40%)</span>
                <span class="text-slate-500 block leading-relaxed">
                  Relevance to the topic, depth of legal analysis, constitutional grounding, and factual accuracy.
                </span>
                <span class="text-[11px] font-bold text-brand-800 mt-2 block">Weightage: 24 / 60 Marks</span>
              </div>

              <div class="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span class="font-bold text-slate-900 block text-sm">2. Grammatical Accuracy (25%)</span>
                <span class="text-slate-500 block leading-relaxed">
                  Sentence syntax, tense consistency, punctuation, correct prepositions, and spelling of legal terms.
                </span>
                <span class="text-[11px] font-bold text-brand-800 mt-2 block">Weightage: 15 / 60 Marks</span>
              </div>

              <div class="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span class="font-bold text-slate-900 block text-sm">3. Structure & Coherence (20%)</span>
                <span class="text-slate-500 block leading-relaxed">
                  Logical paragraphing, seamless transitions, persuasive opening, and balanced conclusion.
                </span>
                <span class="text-[11px] font-bold text-brand-800 mt-2 block">Weightage: 12 / 60 Marks</span>
              </div>

              <div class="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span class="font-bold text-slate-900 block text-sm">4. Brevity & Register (15%)</span>
                <span class="text-slate-500 block leading-relaxed">
                  Strict adherence to word counts, appropriate legal register without colloquial slang, neat presentation.
                </span>
                <span class="text-[11px] font-bold text-brand-800 mt-2 block">Weightage: 9 / 60 Marks</span>
              </div>
            </div>
          </div>
        </div>
      }

      <!-- ESSAY READING MODAL -->
      @if (selectedEssayForModal(); as essay) {
        <div class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div class="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] flex flex-col">
            <div class="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span class="text-[10px] font-bold uppercase tracking-wider text-court-800 bg-court-50 px-2 py-0.5 rounded">
                  {{ essay.category }}
                </span>
                <h3 class="text-lg font-bold text-slate-900 mt-1">{{ essay.title }}</h3>
              </div>
              <button
                type="button"
                (click)="selectedEssayForModal.set(null)"
                class="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div class="flex-1 overflow-y-auto space-y-4 text-xs leading-relaxed text-slate-800 pr-2">
              <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap gap-2 items-center text-[11px]">
                <span class="font-semibold text-slate-700">Key Citations:</span>
                @for (c of essay.keyLegalCitations; track c) {
                  <span class="bg-white border px-2 py-0.5 rounded font-mono font-bold text-slate-800">{{ c }}</span>
                }
              </div>

              <div class="whitespace-pre-line text-slate-800 font-serif leading-relaxed text-[13px] bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                {{ essay.modelContent }}
              </div>
            </div>

            <div class="pt-3 border-t border-slate-100 flex items-center justify-end">
              <button
                type="button"
                (click)="selectedEssayForModal.set(null)"
                class="btn-secondary text-xs py-2 px-4"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class DescriptiveLabComponent implements OnInit {
  private materialsService = inject(StudyMaterialsService);
  private toast = inject(ToastService);

  public activeTab = signal<'precis' | 'essays' | 'rubric'>('precis');

  public precisExercises = signal<PrecisExercise[]>([]);
  public modelEssays = signal<DescriptiveEssayModel[]>([]);

  public selectedPrecisIndex = signal<number>(0);
  public showModelAnswer = signal<boolean>(false);

  public userTitleDraft = '';
  public userPrecisDraft = '';

  public selectedEssayForModal = signal<DescriptiveEssayModel | null>(null);

  ngOnInit(): void {
    this.precisExercises.set(this.materialsService.getPrecisExercises());
    this.modelEssays.set(this.materialsService.getModelEssays());
  }

  public currentPrecis = computed(() => {
    const list = this.precisExercises();
    const idx = this.selectedPrecisIndex();
    return list[idx] || list[0] || null;
  });

  public userPrecisWordCount = computed(() => {
    const text = this.userPrecisDraft.trim();
    if (!text) return 0;
    return text.split(/\s+/).length;
  });

  printLabNotes(): void {
    window.print();
  }
}
