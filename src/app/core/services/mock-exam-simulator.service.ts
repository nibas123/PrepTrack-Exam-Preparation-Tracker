import { Injectable, signal, computed, inject, OnDestroy } from '@angular/core';
import {
  MockExamBlueprint,
  MockExamSectionConfig,
  ExamQuestionItem,
  ExamUserResponse,
  MockExamAttempt,
  MockExamAttemptSectionBreakdown,
  ExamPaletteStatus
} from '../models/database.types';
import { QuestionPatternEngineService } from './question-pattern-engine.service';
import { DataStorageService } from './data-storage.service';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class MockExamSimulatorService implements OnDestroy {
  private patternEngine = inject(QuestionPatternEngineService);
  private dataStorage = inject(DataStorageService);
  private authService = inject(AuthService);

  // --- STATE SIGNALS ---
  readonly activeBlueprint = signal<MockExamBlueprint | null>(null);
  readonly questions = signal<ExamQuestionItem[]>([]);
  readonly currentQuestionIndex = signal<number>(0);
  readonly currentSectionIndex = signal<number>(0);
  readonly responses = signal<Record<string, ExamUserResponse>>({});
  
  readonly isExamActive = signal<boolean>(false);
  readonly isExamSubmitted = signal<boolean>(false);
  readonly lastAttempt = signal<MockExamAttempt | null>(null);
  readonly isStrictSectionalMode = signal<boolean>(true);
  readonly isSummaryModalOpen = signal<boolean>(false);

  // Timers (seconds)
  readonly remainingSectionSeconds = signal<number>(0);
  readonly totalTimeSpentSeconds = signal<number>(0);

  private timerInterval: any = null;
  private examStartedAt: string = '';

  // --- COMPUTED SELECTORS ---

  readonly currentQuestion = computed<ExamQuestionItem | null>(() => {
    const list = this.questions();
    const idx = this.currentQuestionIndex();
    return list[idx] || null;
  });

  readonly currentSection = computed<MockExamSectionConfig | null>(() => {
    const bp = this.activeBlueprint();
    const sIdx = this.currentSectionIndex();
    if (!bp || !bp.sections_config[sIdx]) return null;
    return bp.sections_config[sIdx];
  });

  readonly currentResponse = computed<ExamUserResponse | null>(() => {
    const q = this.currentQuestion();
    if (!q) return null;
    return this.responses()[q.id] || null;
  });

  readonly currentSectionQuestions = computed<ExamQuestionItem[]>(() => {
    const sec = this.currentSection();
    if (!sec) return [];
    return this.questions().filter(q => q.sectionCode === sec.code);
  });

  readonly paletteCounts = computed(() => {
    const allResponses = Object.values(this.responses());
    let answered = 0;
    let notAnswered = 0;
    let markedReview = 0;
    let answeredMarked = 0;
    let notVisited = 0;

    for (const r of allResponses) {
      switch (r.status) {
        case 'answered':
          answered++;
          break;
        case 'not_answered':
          notAnswered++;
          break;
        case 'marked_review':
          markedReview++;
          break;
        case 'answered_marked':
          answeredMarked++;
          break;
        case 'not_visited':
        default:
          notVisited++;
          break;
      }
    }

    return {
      answered,
      notAnswered,
      markedReview,
      answeredMarked,
      notVisited,
      total: allResponses.length
    };
  });

  // --- ACTIONS ---

  startExam(blueprint: MockExamBlueprint, strictSectionalMode: boolean = true): void {
    this.stopTimer();

    this.activeBlueprint.set(blueprint);
    this.isStrictSectionalMode.set(strictSectionalMode);
    this.examStartedAt = new Date().toISOString();

    // Generate questions
    const generated = this.patternEngine.generateExamQuestions(blueprint);
    this.questions.set(generated);

    // Initialize responses
    const initialResponses: Record<string, ExamUserResponse> = {};
    generated.forEach((q, idx) => {
      initialResponses[q.id] = {
        questionId: q.id,
        selectedOptionIndex: null,
        status: idx === 0 ? 'not_answered' : 'not_visited',
        isVisited: idx === 0,
        timeSpentSeconds: 0
      };
    });
    this.responses.set(initialResponses);

    this.currentQuestionIndex.set(0);
    this.currentSectionIndex.set(0);
    this.isExamActive.set(true);
    this.isExamSubmitted.set(false);
    this.lastAttempt.set(null);
    this.isSummaryModalOpen.set(false);
    this.totalTimeSpentSeconds.set(0);

    // Start timer for Section 1
    const firstSection = blueprint.sections_config[0];
    const initialDuration = strictSectionalMode && firstSection
      ? firstSection.durationMinutes * 60
      : blueprint.total_duration_minutes * 60;
    this.remainingSectionSeconds.set(initialDuration);

    this.startTimer();
  }

  selectOption(optionIndex: number): void {
    const q = this.currentQuestion();
    if (!q || !this.isExamActive()) return;

    this.responses.update(map => {
      const existing = map[q.id];
      if (!existing) return map;

      const isMarked = existing.status === 'marked_review' || existing.status === 'answered_marked';
      const newStatus: ExamPaletteStatus = isMarked ? 'answered_marked' : 'answered';

      return {
        ...map,
        [q.id]: {
          ...existing,
          selectedOptionIndex: optionIndex,
          status: newStatus,
          isVisited: true,
          markedAt: new Date().toISOString()
        }
      };
    });
  }

  clearResponse(): void {
    const q = this.currentQuestion();
    if (!q || !this.isExamActive()) return;

    this.responses.update(map => {
      const existing = map[q.id];
      if (!existing) return map;

      return {
        ...map,
        [q.id]: {
          ...existing,
          selectedOptionIndex: null,
          status: 'not_answered',
          isVisited: true
        }
      };
    });
  }

  markForReviewAndNext(): void {
    const q = this.currentQuestion();
    if (!q || !this.isExamActive()) return;

    this.responses.update(map => {
      const existing = map[q.id];
      if (!existing) return map;

      const hasSelected = existing.selectedOptionIndex !== null;
      const newStatus: ExamPaletteStatus = hasSelected ? 'answered_marked' : 'marked_review';

      return {
        ...map,
        [q.id]: {
          ...existing,
          status: newStatus,
          isVisited: true
        }
      };
    });

    this.navigateNext();
  }

  saveAndNext(): void {
    const q = this.currentQuestion();
    if (!q || !this.isExamActive()) return;

    this.responses.update(map => {
      const existing = map[q.id];
      if (!existing) return map;

      const hasSelected = existing.selectedOptionIndex !== null;
      const newStatus: ExamPaletteStatus = hasSelected ? 'answered' : 'not_answered';

      return {
        ...map,
        [q.id]: {
          ...existing,
          status: newStatus,
          isVisited: true
        }
      };
    });

    this.navigateNext();
  }

  jumpToQuestion(globalIndex: number): void {
    const questionsList = this.questions();
    const targetQ = questionsList[globalIndex];
    if (!targetQ || !this.isExamActive()) return;

    // Check sectional restriction in strict mode
    if (this.isStrictSectionalMode()) {
      const currentSec = this.currentSection();
      if (currentSec && targetQ.sectionCode !== currentSec.code) {
        // Section switching restricted until timer elapses
        return;
      }
    }

    this.activateQuestion(globalIndex);
  }

  switchSection(sectionIndex: number): void {
    const bp = this.activeBlueprint();
    if (!bp || !bp.sections_config[sectionIndex] || !this.isExamActive()) return;

    if (this.isStrictSectionalMode()) {
      // In strict mode, sections progress sequentially
      return;
    }

    this.currentSectionIndex.set(sectionIndex);
    const targetSection = bp.sections_config[sectionIndex];
    const firstQIndex = this.questions().findIndex(q => q.sectionCode === targetSection.code);
    if (firstQIndex >= 0) {
      this.activateQuestion(firstQIndex);
    }
  }

  openSummaryModal(): void {
    this.isSummaryModalOpen.set(true);
  }

  closeSummaryModal(): void {
    this.isSummaryModalOpen.set(false);
  }

  submitExam(): MockExamAttempt {
    this.stopTimer();
    this.isSummaryModalOpen.set(false);
    this.isExamActive.set(false);
    this.isExamSubmitted.set(true);

    const bp = this.activeBlueprint()!;
    const qList = this.questions();
    const respMap = this.responses();
    const completedAt = new Date().toISOString();

    let totalScore = 0;
    let attemptedCount = 0;
    let correctCount = 0;
    let incorrectCount = 0;

    // Section breakdown accumulator
    const sectionStatsMap: Record<string, {
      sectionCode: string;
      sectionName: string;
      totalQuestions: number;
      attempted: number;
      correct: number;
      incorrect: number;
      marksObtained: number;
      maximumMarks: number;
      timeSpentSeconds: number;
      sectionalCutoff?: number;
    }> = {};

    bp.sections_config.forEach(sec => {
      sectionStatsMap[sec.code] = {
        sectionCode: sec.code,
        sectionName: sec.name,
        totalQuestions: 0,
        attempted: 0,
        correct: 0,
        incorrect: 0,
        marksObtained: 0,
        maximumMarks: sec.questionsCount * sec.marksPerQuestion,
        timeSpentSeconds: 0,
        sectionalCutoff: sec.cutoffEstimate
      };
    });

    for (const q of qList) {
      const resp = respMap[q.id];
      const stats = sectionStatsMap[q.sectionCode];
      if (stats) stats.totalQuestions++;

      if (resp && resp.selectedOptionIndex !== null) {
        attemptedCount++;
        if (stats) stats.attempted++;

        if (resp.selectedOptionIndex === q.correctOptionIndex) {
          correctCount++;
          totalScore += q.marks;
          if (stats) {
            stats.correct++;
            stats.marksObtained += q.marks;
          }
        } else {
          incorrectCount++;
          totalScore -= q.negativeMarks;
          if (stats) {
            stats.incorrect++;
            stats.marksObtained -= q.negativeMarks;
          }
        }
      }
    }

    // Round total score to 2 decimal places
    totalScore = Math.max(0, Math.round(totalScore * 100) / 100);

    const accuracy = attemptedCount > 0
      ? Math.round((correctCount / attemptedCount) * 1000) / 10
      : 0;

    const breakdowns: MockExamAttemptSectionBreakdown[] = Object.values(sectionStatsMap).map(s => ({
      sectionCode: s.sectionCode,
      sectionName: s.sectionName,
      totalQuestions: s.totalQuestions,
      attempted: s.attempted,
      correct: s.correct,
      incorrect: s.incorrect,
      marksObtained: Math.max(0, Math.round(s.marksObtained * 100) / 100),
      maximumMarks: s.maximumMarks,
      accuracy: s.attempted > 0 ? Math.round((s.correct / s.attempted) * 1000) / 10 : 0,
      timeSpentSeconds: 0,
      sectionalCutoff: s.sectionalCutoff,
      cutoffCleared: s.sectionalCutoff ? s.marksObtained >= s.sectionalCutoff : true
    }));

    // Cutoff comparison
    const targetCutoff = bp.target_cutoff || 50;
    const cutoffStatus = totalScore >= targetCutoff ? 'cleared' : 'missed';

    // Percentile estimate (simulated bell curve distribution relative to cutoff)
    // 50% percentile near cutoff - 10, 85% at cutoff, 98% at cutoff + 15
    const diffFromCutoff = totalScore - targetCutoff;
    let percentile = 82 + diffFromCutoff * 1.5;
    percentile = Math.max(10, Math.min(99.8, Math.round(percentile * 10) / 10));

    const attempt: MockExamAttempt = {
      id: `attempt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      user_id: this.authService.currentUser()?.id,
      blueprint_id: bp.id,
      mock_name: bp.title,
      exam_stage: bp.exam_stage,
      started_at: this.examStartedAt,
      completed_at: completedAt,
      total_score: totalScore,
      maximum_marks: bp.total_marks,
      total_questions: qList.length,
      attempted_questions: attemptedCount,
      correct_answers: correctCount,
      incorrect_answers: incorrectCount,
      accuracy_percentage: accuracy,
      percentile_estimate: percentile,
      time_spent_seconds: this.totalTimeSpentSeconds(),
      cutoff_status: cutoffStatus,
      target_cutoff: targetCutoff,
      section_breakdown: breakdowns,
      questions_payload: qList,
      user_responses: respMap,
      created_at: completedAt
    };

    this.lastAttempt.set(attempt);

    // Save to persistent storage and log in user's mock history
    this.persistAttempt(attempt);

    return attempt;
  }

  // --- INTERNAL ENGINE HELPERS ---

  private activateQuestion(globalIndex: number): void {
    const list = this.questions();
    const targetQ = list[globalIndex];
    if (!targetQ) return;

    // Update status to 'not_answered' if was 'not_visited'
    this.responses.update(map => {
      const current = map[targetQ.id];
      if (current && current.status === 'not_visited') {
        return {
          ...map,
          [targetQ.id]: {
            ...current,
            status: 'not_answered',
            isVisited: true
          }
        };
      }
      return map;
    });

    this.currentQuestionIndex.set(globalIndex);

    // Sync section index
    const bp = this.activeBlueprint();
    if (bp) {
      const secIdx = bp.sections_config.findIndex(s => s.code === targetQ.sectionCode);
      if (secIdx >= 0) {
        this.currentSectionIndex.set(secIdx);
      }
    }
  }

  private navigateNext(): void {
    const currentIndex = this.currentQuestionIndex();
    const list = this.questions();
    const bp = this.activeBlueprint();
    const currentSec = this.currentSection();

    if (currentIndex < list.length - 1) {
      const nextQ = list[currentIndex + 1];

      if (this.isStrictSectionalMode() && currentSec && nextQ.sectionCode !== currentSec.code) {
        // At the end of current section in strict mode: loop to first question of this section
        const firstSecQIdx = list.findIndex(q => q.sectionCode === currentSec.code);
        this.activateQuestion(firstSecQIdx);
      } else {
        this.activateQuestion(currentIndex + 1);
      }
    } else {
      // Reached the end of exam
      if (this.isStrictSectionalMode() && currentSec) {
        const firstSecQIdx = list.findIndex(q => q.sectionCode === currentSec.code);
        this.activateQuestion(firstSecQIdx);
      }
    }
  }

  private startTimer(): void {
    this.timerInterval = setInterval(() => {
      this.totalTimeSpentSeconds.update(t => t + 1);

      // Decrement section timer
      this.remainingSectionSeconds.update(sec => {
        if (sec <= 1) {
          this.handleSectionTimeout();
          return 0;
        }
        return sec - 1;
      });
    }, 1000);
  }

  private stopTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  private handleSectionTimeout(): void {
    const bp = this.activeBlueprint();
    if (!bp) return;

    if (this.isStrictSectionalMode()) {
      const nextSecIdx = this.currentSectionIndex() + 1;
      if (nextSecIdx < bp.sections_config.length) {
        // Advance to next section automatically
        this.currentSectionIndex.set(nextSecIdx);
        const nextSec = bp.sections_config[nextSecIdx];
        this.remainingSectionSeconds.set(nextSec.durationMinutes * 60);

        const firstQIdx = this.questions().findIndex(q => q.sectionCode === nextSec.code);
        if (firstQIdx >= 0) {
          this.activateQuestion(firstQIdx);
        }
      } else {
        // All sections completed -> auto submit
        this.submitExam();
      }
    } else {
      // Practice mode timeout -> auto submit
      this.submitExam();
    }
  }

  private async persistAttempt(attempt: MockExamAttempt): Promise<void> {
    try {
      // 1. Save locally to attempts list in localStorage
      const storageKey = 'preptrack_mock_exam_simulator_attempts';
      const existing: MockExamAttempt[] = JSON.parse(localStorage.getItem(storageKey) || '[]');
      existing.unshift(attempt);
      localStorage.setItem(storageKey, JSON.stringify(existing.slice(0, 50)));

      // 2. Also register in the existing mock_exams table via dataStorage
      // so dashboard analytics & mock tracker progression charts update immediately!
      await this.dataStorage.saveMockExam({
        name: attempt.mock_name,
        exam_stage: attempt.exam_stage,
        attended_at: new Date().toISOString().split('T')[0],
        marks_obtained: attempt.total_score,
        maximum_marks: attempt.maximum_marks,
        duration_seconds: attempt.time_spent_seconds,
        total_questions: attempt.total_questions,
        attempted_questions: attempt.attempted_questions,
        correct_answers: attempt.correct_answers,
        notes: `Simulated via Mock Exam Pattern Engine. Accuracy: ${attempt.accuracy_percentage}%. Percentile: ~${attempt.percentile_estimate}%. Cutoff: ${attempt.cutoff_status?.toUpperCase()}.`
      });
    } catch (err) {
      console.warn('Failed to persist mock exam attempt:', err);
    }
  }

  getSavedAttempts(): MockExamAttempt[] {
    try {
      const storageKey = 'preptrack_mock_exam_simulator_attempts';
      return JSON.parse(localStorage.getItem(storageKey) || '[]');
    } catch {
      return [];
    }
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }
}
