import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { DataStorageService } from '../../core/services/data-storage.service';
import { MockExamSimulatorService } from '../../core/services/mock-exam-simulator.service';
import { QuestionPatternEngineService } from '../../core/services/question-pattern-engine.service';
import { ExamTrackService } from '../../core/services/exam-track.service';
import { StudyMaterialsService, HighCourtPostPlan } from '../../core/services/study-materials.service';

@Component({
  selector: 'app-kerala-hca',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="space-y-8 max-w-6xl mx-auto">
      <!-- HERO BANNER -->
      <div class="rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 border border-amber-900/40 text-white p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div class="absolute -right-10 -bottom-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div class="relative z-10 space-y-4">
          <div class="flex flex-wrap items-center gap-2">
            <span class="px-2.5 py-1 rounded-md text-xs font-bold tracking-wider uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center space-x-1.5">
              <svg class="w-3.5 h-3.5 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
              <span>High Court of Kerala Recruitment Center</span>
            </span>
            <span class="px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-800/60">
              Official Syllabus & Verified Patterns
            </span>
          </div>

          <div class="max-w-3xl space-y-2">
            <h1 class="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-white">
              Kerala High Court Examination Hub
            </h1>
            <p class="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Dedicated preparation paths for all High Court recruitment notifications: Assistant, Munsiff-Magistrate Judicial Service, Clerk-Typist, and Stenographer.
            </p>
          </div>

          <!-- Quick Action Buttons -->
          <div class="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              (click)="startHcaMock()"
              class="px-4 py-2.5 rounded-xl font-semibold text-xs text-white bg-amber-700 hover:bg-amber-600 shadow-lg shadow-amber-950/50 flex items-center space-x-2 transition-all active:scale-95"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Launch 100 Qs Mock Exam</span>
            </button>

            <a
              routerLink="/study-library"
              class="px-4 py-2.5 rounded-xl font-semibold text-xs bg-white/10 hover:bg-white/15 text-white border border-white/20 transition-all flex items-center space-x-1.5"
            >
              <svg class="w-4 h-4 text-amber-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span>Legal Study Library</span>
            </a>

            <a
              routerLink="/descriptive-lab"
              class="px-4 py-2.5 rounded-xl font-semibold text-xs bg-white/10 hover:bg-white/15 text-white border border-white/20 transition-all flex items-center space-x-1.5"
            >
              <svg class="w-4 h-4 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span>Précis & Descriptive Lab</span>
            </a>

            <a
              routerLink="/revision"
              class="px-4 py-2.5 rounded-xl font-semibold text-xs bg-white/10 hover:bg-white/15 text-white border border-white/20 transition-all flex items-center space-x-1.5"
            >
              <svg class="w-4 h-4 text-rose-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Error Vault & Revision</span>
            </a>

            <a
              href="https://hckrecruitment.keralacourts.in"
              target="_blank"
              rel="noopener noreferrer"
              class="px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white transition-colors flex items-center space-x-1 ml-auto"
            >
              <span>Official Registry Portal</span>
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <!-- POST SELECTION PATHWAYS -->
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold uppercase tracking-wider text-slate-500">Select High Court Recruitment Post</span>
          <span class="text-xs text-slate-400">4 Recruitment Schemes Available</span>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          @for (post of posts(); track post.postId) {
            <button
              type="button"
              (click)="selectedPostId.set(post.postId)"
              [ngClass]="selectedPostId() === post.postId 
                ? 'bg-amber-700 text-white shadow-md border-amber-800' 
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'"
              class="p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between space-y-2 cursor-pointer"
            >
              <div class="flex items-center justify-between">
                <span class="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                  [ngClass]="selectedPostId() === post.postId ? 'bg-amber-800/80 text-amber-200' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'">
                  {{ post.cadre.split(' - ')[0] }}
                </span>
                <span class="w-2 h-2 rounded-full" [ngClass]="selectedPostId() === post.postId ? 'bg-amber-300' : 'bg-transparent'"></span>
              </div>
              <div>
                <span class="text-xs font-bold block line-clamp-1">{{ post.postTitle }}</span>
                <span class="text-[11px] opacity-80 block truncate mt-0.5">{{ post.payScale }}</span>
              </div>
            </button>
          }
        </div>
      </div>

      <!-- SELECTED POST OVERVIEW & SPECIFICATIONS -->
      @if (currentPost(); as post) {
        <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div class="flex items-center gap-2">
                <h2 class="text-xl font-serif font-bold text-slate-900 dark:text-white">{{ post.postTitle }}</h2>
                <span class="px-2.5 py-0.5 rounded-md text-xs font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                  {{ post.cadre }}
                </span>
              </div>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">{{ post.department }} &bull; Scale of Pay: {{ post.payScale }}</p>
            </div>

            <div class="flex flex-wrap items-center gap-2">
              <span class="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                Age: {{ post.ageLimit }}
              </span>
            </div>
          </div>

          <!-- Eligibility Note -->
          <div class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2.5">
            <svg class="w-4 h-4 text-amber-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <strong class="text-slate-900 dark:text-white">Official Eligibility:</strong> {{ post.eligibility }}
            </div>
          </div>

          <!-- Multi-Stage Selection Cards for Current Post -->
          <div class="space-y-3">
            <h3 class="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Official Examination Stages & Marking Pattern
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              @for (st of post.selectionStages; track st.stageNumber) {
                <div class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 space-y-3">
                  <div class="flex items-center justify-between">
                    <span class="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                      STAGE {{ st.stageNumber }}
                    </span>
                    <span class="text-xs font-bold text-slate-600 dark:text-slate-400">{{ st.duration }} &bull; {{ st.totalMarks }} Marks</span>
                  </div>

                  <div>
                    <h4 class="text-sm font-bold text-slate-900 dark:text-white">{{ st.stageName }}</h4>
                    <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{{ st.details }}</p>
                  </div>

                  <div class="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-rose-600 dark:text-rose-400 font-medium">
                    Penalty: {{ st.negativeMarking }}
                  </div>
                </div>
              }
            </div>
          </div>

          <!-- Subject Weightage & 60-Day Study Plan -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <!-- Subject Weightage Breakdown -->
            <div class="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-3">
              <h4 class="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                Official Marks & Syllabus Weightage
              </h4>
              <div class="space-y-2">
                @for (sw of post.subjectWeightage; track sw.subject) {
                  <div class="space-y-1">
                    <div class="flex justify-between text-xs font-semibold">
                      <span class="text-slate-700 dark:text-slate-300">{{ sw.subject }}</span>
                      <span class="text-amber-700 dark:text-amber-400">{{ sw.marks }} Marks ({{ sw.percentage }}%)</span>
                    </div>
                    <div class="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                      <div class="h-full bg-amber-600 rounded-full" [style.width.%]="sw.percentage"></div>
                    </div>
                  </div>
                }
              </div>
            </div>

            <!-- Recommended Study Plan -->
            <div class="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-3">
              <h4 class="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                60-Day High-Yield Preparation Roadmap
              </h4>
              <div class="space-y-3 text-xs">
                @for (phase of post.studyPlan60Days; track phase.phase) {
                  <div class="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 space-y-1">
                    <div class="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                      <span>{{ phase.phase }} ({{ phase.days }})</span>
                    </div>
                    <p class="text-slate-600 dark:text-slate-300">{{ phase.focus }}</p>
                    <span class="text-[11px] text-amber-700 dark:text-amber-400 font-medium block">
                      Target: {{ phase.recommendedActions }}
                    </span>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class KeralaHcaComponent implements OnInit {
  private dataStorage = inject(DataStorageService);
  private simulator = inject(MockExamSimulatorService);
  private patternEngine = inject(QuestionPatternEngineService);
  private router = inject(Router);
  public trackService = inject(ExamTrackService);
  private studyMaterialsService = inject(StudyMaterialsService);

  public selectedPostId = signal<string>('hck-assistant');
  public posts = computed(() => this.studyMaterialsService.getHighCourtPosts());

  public currentPost = computed(() => {
    return this.posts().find(p => p.postId === this.selectedPostId()) || this.posts()[0];
  });

  async ngOnInit(): Promise<void> {
    this.dataStorage.ensureInitializedLocalData();
  }

  startHcaMock(): void {
    const bps = this.patternEngine.getDefaultBlueprints();
    const hcaBp = bps.find(b => b.id === 'kerala-hca-objective-mock-1') || bps[0];
    this.simulator.startExam(hcaBp, false);
    this.router.navigate(['/mock-exams']);
  }
}
