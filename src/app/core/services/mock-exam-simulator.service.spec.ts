import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { MockExamSimulatorService } from './mock-exam-simulator.service';
import { QuestionPatternEngineService } from './question-pattern-engine.service';
import { DataStorageService } from './data-storage.service';
import { AuthService } from '../auth/auth.service';
import { MockExamBlueprint } from '../models/database.types';

describe('MockExamSimulatorService', () => {
  let service: MockExamSimulatorService;
  let patternEngine: QuestionPatternEngineService;

  const mockDataStorage = {
    saveMockExam: () => Promise.resolve({})
  };

  const mockAuthService = {
    currentUser: () => ({ id: 'test-user-123', email: 'aspirant@bank.in' })
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MockExamSimulatorService,
        QuestionPatternEngineService,
        { provide: DataStorageService, useValue: mockDataStorage },
        { provide: AuthService, useValue: mockAuthService }
      ]
    });

    service = TestBed.inject(MockExamSimulatorService);
    patternEngine = TestBed.inject(QuestionPatternEngineService);
  });

  afterEach(() => {
    service.ngOnDestroy();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize and start mock exam properly', () => {
    const sprintBlueprint = patternEngine.getDefaultBlueprints().find(b => b.exam_category === 'MIXED_SPRINT')!;
    service.startExam(sprintBlueprint, false);

    expect(service.isExamActive()).toBe(true);
    expect(service.questions().length).toBe(30);
    expect(service.currentQuestionIndex()).toBe(0);

    const counts = service.paletteCounts();
    expect(counts.total).toBe(30);
    expect(counts.notAnswered).toBe(1);
    expect(counts.notVisited).toBe(29);
  });

  it('should update palette status when answering, marking, and clearing response', () => {
    const sprintBlueprint = patternEngine.getDefaultBlueprints().find(b => b.exam_category === 'MIXED_SPRINT')!;
    service.startExam(sprintBlueprint, false);

    // Select option 2
    service.selectOption(2);
    expect(service.currentResponse()?.selectedOptionIndex).toBe(2);
    expect(service.currentResponse()?.status).toBe('answered');

    // Mark for review
    service.markForReviewAndNext();
    const q0Id = service.questions()[0].id;
    expect(service.responses()[q0Id].status).toBe('answered_marked');

    // Jump back to Q0 and clear response
    service.jumpToQuestion(0);
    service.clearResponse();
    expect(service.currentResponse()?.selectedOptionIndex).toBeNull();
    expect(service.currentResponse()?.status).toBe('not_answered');
  });

  it('should accurately calculate score with +1.00 and -0.25 negative marks', () => {
    const sprintBlueprint: MockExamBlueprint = {
      id: 'test-blueprint',
      title: 'Unit Test Mock',
      exam_category: 'MIXED_SPRINT',
      exam_stage: 'prelims',
      total_duration_minutes: 20,
      has_sectional_timing: false,
      total_marks: 3,
      negative_marking: 0.25,
      target_cutoff: 2.0,
      is_active: true,
      sections_config: [
        {
          code: 'quant',
          name: 'Quant',
          subjectCode: 'quant',
          questionsCount: 3,
          durationMinutes: 20,
          marksPerQuestion: 1,
          negativeMarks: 0.25
        }
      ]
    };

    service.startExam(sprintBlueprint, false);
    const qs = service.questions();

    // Q0: Correct answer (+1.00)
    service.jumpToQuestion(0);
    service.selectOption(qs[0].correctOptionIndex);

    // Q1: Incorrect answer (-0.25)
    const wrongOpt = (qs[1].correctOptionIndex + 1) % 5;
    service.jumpToQuestion(1);
    service.selectOption(wrongOpt);

    // Q2: Unattempted (0.00)
    service.jumpToQuestion(2);

    // Submit
    const result = service.submitExam();

    expect(result.attempted_questions).toBe(2);
    expect(result.correct_answers).toBe(1);
    expect(result.incorrect_answers).toBe(1);
    expect(result.total_score).toBe(0.75);
    expect(result.cutoff_status).toBe('missed');
    expect(service.isExamActive()).toBe(false);
    expect(service.isExamSubmitted()).toBe(true);
  });
});
