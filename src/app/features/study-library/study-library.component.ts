import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import {
  StudyMaterialsService,
  LegalConceptTopic,
  LandmarkJudgment,
  LegalMaxim,
  FlashcardItem
} from '../../core/services/study-materials.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-study-library',
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
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span>Legal Reference Library</span>
            </span>
            <span class="text-xs text-slate-400 font-medium">Verified Official Syllabus Notes</span>
          </div>
          <h2 class="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1">
            Study Materials & Landmark Precedents
          </h2>
          <p class="text-xs text-slate-500 mt-0.5">
            Systematic topic notes covering Indian Constitution, Criminal & Civil Law, Evidence, Kerala High Court Rules, and Legal Maxims.
          </p>
        </div>

        <!-- Print / Quick Actions -->
        <div class="flex items-center space-x-2.5">
          <button
            type="button"
            (click)="printStudyNotes()"
            class="btn-secondary text-xs py-2 px-3.5 font-semibold flex items-center space-x-1.5"
            title="Print or save notes as PDF"
          >
            <svg class="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            <span>Print / Save PDF</span>
          </button>

          <a
            routerLink="/descriptive-lab"
            class="btn-primary text-xs py-2 px-3.5 font-semibold flex items-center space-x-1.5"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span>Descriptive Writing Lab →</span>
          </a>
        </div>
      </div>

      <!-- MAIN TABS: CONCEPTS vs PRECEDENTS vs MAXIMS vs FLASHCARDS -->
      <div class="flex items-center space-x-2 border-b border-slate-200 pb-3 overflow-x-auto scrollbar-none">
        <button
          type="button"
          (click)="activeTab.set('concepts')"
          class="px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center space-x-1.5"
          [ngClass]="activeTab() === 'concepts' ? 'bg-slate-900 text-white shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'"
        >
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>Statutory & Constitutional Notes ({{ legalTopics().length }})</span>
        </button>

        <button
          type="button"
          (click)="activeTab.set('judgments')"
          class="px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center space-x-1.5"
          [ngClass]="activeTab() === 'judgments' ? 'bg-slate-900 text-white shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'"
        >
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
          </svg>
          <span>Landmark Judgments ({{ landmarkJudgments().length }})</span>
        </button>

        <button
          type="button"
          (click)="activeTab.set('maxims')"
          class="px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center space-x-1.5"
          [ngClass]="activeTab() === 'maxims' ? 'bg-slate-900 text-white shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'"
        >
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
          <span>Legal Maxims & Glossary ({{ legalMaxims().length }})</span>
        </button>

        <button
          type="button"
          (click)="activeTab.set('flashcards')"
          class="px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center space-x-1.5"
          [ngClass]="activeTab() === 'flashcards' ? 'bg-slate-900 text-white shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'"
        >
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          <span>Interactive Flashcards ({{ flashcards().length }})</span>
        </button>
      </div>

      <!-- SEARCH & FILTER BAR -->
      <div class="flex flex-col sm:flex-row items-center gap-3">
        <div class="relative flex-1 w-full">
          <input
            type="text"
            [(ngModel)]="searchQuery"
            placeholder="Search statutes, landmark rulings, legal maxims, or articles (e.g. Article 226, Res Judicata, Kesavananda)..."
            class="input-field pl-10 text-xs"
          />
          <svg class="w-4 h-4 text-slate-400 absolute left-3.5 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        @if (activeTab() === 'concepts') {
          <div class="flex items-center space-x-2 w-full sm:w-auto">
            <select [(ngModel)]="categoryFilter" class="input-field text-xs font-medium w-full sm:w-48">
              <option value="all">All Subject Categories</option>
              <option value="constitution">Indian Constitution</option>
              <option value="cpc">Civil Procedure Code (CPC)</option>
              <option value="crpc_bnss">CrPC & BNSS</option>
              <option value="evidence_bsa">Law of Evidence (BSA)</option>
              <option value="high_court_rules">Kerala High Court Act</option>
            </select>
          </div>
        }
      </div>

      <!-- ================================================================= -->
      <!-- TAB 1: STATUTORY & CONSTITUTIONAL CONCEPT TOPICS                   -->
      <!-- ================================================================= -->
      @if (activeTab() === 'concepts') {
        <div class="space-y-4">
          @for (topic of filteredTopics(); track topic.id) {
            <div class="card p-6 space-y-4 border-l-4 transition-all"
                 [ngClass]="topic.category === 'constitution' ? 'border-l-court-600' : (topic.category === 'high_court_rules' ? 'border-l-brand-800' : 'border-l-slate-700')">
              <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div class="space-y-1">
                  <div class="flex items-center space-x-2 flex-wrap gap-y-1">
                    <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-800 border border-slate-200">
                      {{ topic.subject }}
                    </span>
                    <span class="px-2 py-0.5 rounded text-[10px] font-semibold"
                          [ngClass]="topic.difficulty === 'Advanced' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'">
                      {{ topic.difficulty }}
                    </span>
                    @for (tag of topic.examTags; track tag) {
                      <span class="px-2 py-0.5 rounded text-[10px] bg-slate-50 text-slate-600 border border-slate-200">
                        {{ tag }}
                      </span>
                    }
                  </div>
                  <h3 class="text-lg font-bold text-slate-900 tracking-tight">{{ topic.title }}</h3>
                </div>

                <div class="flex items-center space-x-2 shrink-0">
                  <button
                    type="button"
                    (click)="takePracticeQuiz(topic.title)"
                    class="btn-primary text-xs py-1.5 px-3 font-semibold flex items-center space-x-1"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>Practice Quiz</span>
                  </button>
                </div>
              </div>

              <!-- Summary -->
              <p class="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200/70">
                {{ topic.summary }}
              </p>

              <!-- Sections & Key Principles -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div class="space-y-2">
                  <span class="font-bold text-slate-900 uppercase tracking-wider text-[11px] block">
                    Key Legal Principles
                  </span>
                  <ul class="space-y-1.5 text-slate-600 list-disc list-inside">
                    @for (principle of topic.keyPrinciples; track principle) {
                      <li>{{ principle }}</li>
                    }
                  </ul>
                </div>

                <div class="space-y-2">
                  <span class="font-bold text-slate-900 uppercase tracking-wider text-[11px] block">
                    Landmark Precedents
                  </span>
                  <ul class="space-y-1.5 text-slate-700 font-medium">
                    @for (judgment of topic.landmarkJudgments; track judgment) {
                      <li class="p-2 rounded-lg bg-court-50 border border-court-200/80 text-[11px] text-court-950">
                        {{ judgment }}
                      </li>
                    }
                  </ul>
                </div>
              </div>

              <!-- Revision Takeaways -->
              <div class="pt-3 border-t border-slate-100 flex flex-wrap gap-2 text-[11px] text-slate-600">
                <span class="font-semibold text-slate-700">Exam Notes:</span>
                @for (note of topic.revisionNotes; track note) {
                  <span class="inline-block bg-slate-100 px-2.5 py-1 rounded-md text-slate-700">
                    • {{ note }}
                  </span>
                }
              </div>
            </div>
          }
        </div>
      }

      <!-- ================================================================= -->
      <!-- TAB 2: LANDMARK JUDGMENTS DIRECTORY                               -->
      <!-- ================================================================= -->
      @if (activeTab() === 'judgments') {
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          @for (lj of filteredJudgments(); track lj.id) {
            <div class="card p-5 space-y-3 bg-white border border-slate-200 shadow-2xs flex flex-col justify-between">
              <div class="space-y-2">
                <div class="flex items-center justify-between text-[11px]">
                  <span class="font-bold text-court-800 bg-court-50 px-2 py-0.5 rounded border border-court-200">
                    {{ lj.year }} • {{ lj.bench }}
                  </span>
                  <span class="font-mono text-slate-500 font-semibold">{{ lj.articlesOrSections }}</span>
                </div>
                <h4 class="text-base font-bold text-slate-900 leading-snug">{{ lj.caseName }}</h4>
                <div class="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                  <span class="font-bold text-slate-900 block mb-1">Ratio Decidendi:</span>
                  {{ lj.ratioDecidendi }}
                </div>
              </div>

              <div class="pt-2 border-t border-slate-100 text-[11px] space-y-1">
                <p class="text-slate-500"><b>Constitutional Impact:</b> {{ lj.constitutionalSignificance }}</p>
                <p class="text-brand-900 font-medium"><b>Exam Takeaway:</b> {{ lj.examTakeaway }}</p>
              </div>
            </div>
          }
        </div>
      }

      <!-- ================================================================= -->
      <!-- TAB 3: LEGAL MAXIMS & GLOSSARY                                    -->
      <!-- ================================================================= -->
      @if (activeTab() === 'maxims') {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          @for (lm of filteredMaxims(); track lm.id) {
            <div class="card p-4 space-y-2.5 bg-white border border-slate-200 shadow-2xs hover:border-court-500 transition-all">
              <div class="flex items-center justify-between">
                <span class="text-[10px] font-bold uppercase tracking-wider text-court-700 bg-court-50 px-2 py-0.5 rounded border border-court-200">
                  Legal Maxim
                </span>
                <span class="text-[10px] text-slate-400 font-medium">{{ lm.subjectArea }}</span>
              </div>
              <h4 class="text-sm font-bold text-slate-900 italic font-serif tracking-tight">"{{ lm.latin }}"</h4>
              <p class="text-xs text-slate-800 font-semibold">{{ lm.englishMeaning }}</p>
              <p class="text-[11px] text-slate-500 leading-relaxed border-t border-slate-100 pt-2">
                {{ lm.application }}
              </p>
            </div>
          }
        </div>
      }

      <!-- ================================================================= -->
      <!-- TAB 4: INTERACTIVE REVISION FLASHCARDS                            -->
      <!-- ================================================================= -->
      @if (activeTab() === 'flashcards') {
        <div class="space-y-4">
          <div class="flex items-center justify-between bg-slate-100 p-3.5 rounded-xl border border-slate-200 text-xs">
            <span class="font-medium text-slate-700">
              Click any flashcard to flip between prompt and statutory explanation. Mark items as mastered as you revise.
            </span>
            <span class="font-bold text-slate-900">
              Mastered: {{ masteredFlashcardsCount() }} / {{ flashcards().length }}
            </span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            @for (fc of flashcards(); track fc.id; let idx = $index) {
              <div
                (click)="toggleFlashcard(idx)"
                class="card p-5 cursor-pointer min-h-56 flex flex-col justify-between transition-all select-none border"
                [ngClass]="flippedCards()[idx] ? 'bg-slate-900 text-white border-slate-800 shadow-md' : 'bg-white text-slate-900 border-slate-200 hover:border-slate-300 shadow-2xs'"
              >
                <div>
                  <div class="flex items-center justify-between pb-2 border-b"
                       [ngClass]="flippedCards()[idx] ? 'border-slate-800 text-slate-400' : 'border-slate-100 text-slate-500'">
                    <span class="text-[10px] font-bold uppercase tracking-wider">{{ fc.category }}</span>
                    <span class="text-[10px] px-2 py-0.5 rounded font-mono font-semibold"
                          [ngClass]="flippedCards()[idx] ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'">
                      {{ fc.citationOrSection }}
                    </span>
                  </div>

                  <div class="py-4">
                    @if (!flippedCards()[idx]) {
                      <p class="text-xs font-semibold leading-relaxed text-slate-800">
                        {{ fc.questionOrPrompt }}
                      </p>
                      <span class="text-[10px] text-slate-400 mt-2 block font-medium">Click to reveal answer ↻</span>
                    } @else {
                      <p class="text-xs font-normal leading-relaxed text-slate-200">
                        {{ fc.answerOrExplanation }}
                      </p>
                      <span class="text-[10px] text-slate-400 mt-2 block font-medium">Click to flip back ↻</span>
                    }
                  </div>
                </div>

                <div class="pt-2 border-t flex items-center justify-between text-xs"
                     [ngClass]="flippedCards()[idx] ? 'border-slate-800' : 'border-slate-100'">
                  <button
                    type="button"
                    (click)="$event.stopPropagation(); toggleMastered(fc.id)"
                    class="px-2.5 py-1 rounded text-[11px] font-semibold transition-colors"
                    [ngClass]="isMastered(fc.id) ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
                  >
                    {{ isMastered(fc.id) ? '✓ Mastered' : 'Mark Mastered' }}
                  </button>
                  <span class="text-[10px] text-slate-400 font-mono">Card #{{ idx + 1 }}</span>
                </div>
              </div>
            }
          </div>
        </div>
      }
    </div>
  `
})
export class StudyLibraryComponent implements OnInit {
  private materialsService = inject(StudyMaterialsService);
  private toast = inject(ToastService);
  private router = inject(Router);

  public activeTab = signal<'concepts' | 'judgments' | 'maxims' | 'flashcards'>('concepts');
  public searchQuery = '';
  public categoryFilter = 'all';

  public legalTopics = signal<LegalConceptTopic[]>([]);
  public landmarkJudgments = signal<LandmarkJudgment[]>([]);
  public legalMaxims = signal<LegalMaxim[]>([]);
  public flashcards = signal<FlashcardItem[]>([]);

  public flippedCards = signal<Record<number, boolean>>({});
  public masteredIds = signal<Set<string>>(new Set<string>());

  ngOnInit(): void {
    this.legalTopics.set(this.materialsService.getAllLegalTopics());
    this.landmarkJudgments.set(this.materialsService.getLandmarkJudgments());
    this.legalMaxims.set(this.materialsService.getLegalMaxims());
    this.flashcards.set(this.materialsService.getFlashcards());
  }

  public filteredTopics = computed(() => {
    const list = this.legalTopics();
    const query = this.searchQuery.toLowerCase().trim();
    const cat = this.categoryFilter;

    return list.filter(t => {
      if (cat !== 'all' && t.category !== cat) return false;
      if (!query) return true;
      return (
        t.title.toLowerCase().includes(query) ||
        t.summary.toLowerCase().includes(query) ||
        t.subject.toLowerCase().includes(query) ||
        t.sectionsOrArticles.some(s => s.toLowerCase().includes(query)) ||
        t.landmarkJudgments.some(j => j.toLowerCase().includes(query))
      );
    });
  });

  public filteredJudgments = computed(() => {
    const list = this.landmarkJudgments();
    const query = this.searchQuery.toLowerCase().trim();
    if (!query) return list;
    return list.filter(j =>
      j.caseName.toLowerCase().includes(query) ||
      j.ratioDecidendi.toLowerCase().includes(query) ||
      j.articlesOrSections.toLowerCase().includes(query)
    );
  });

  public filteredMaxims = computed(() => {
    const list = this.legalMaxims();
    const query = this.searchQuery.toLowerCase().trim();
    if (!query) return list;
    return list.filter(m =>
      m.latin.toLowerCase().includes(query) ||
      m.englishMeaning.toLowerCase().includes(query) ||
      m.subjectArea.toLowerCase().includes(query)
    );
  });

  public masteredFlashcardsCount = computed(() => {
    return this.masteredIds().size;
  });

  toggleFlashcard(idx: number): void {
    this.flippedCards.update(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  }

  isMastered(id: string): boolean {
    return this.masteredIds().has(id);
  }

  toggleMastered(id: string): void {
    this.masteredIds.update(set => {
      const next = new Set(set);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  takePracticeQuiz(topicName: string): void {
    this.router.navigate(['/quizzes'], {
      queryParams: { topicName }
    });
  }

  printStudyNotes(): void {
    window.print();
  }
}
