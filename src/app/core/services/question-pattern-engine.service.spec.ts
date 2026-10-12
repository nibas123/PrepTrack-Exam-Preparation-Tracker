import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { QuestionPatternEngineService } from './question-pattern-engine.service';

describe('QuestionPatternEngineService', () => {
  let service: QuestionPatternEngineService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuestionPatternEngineService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return default blueprints including IBPS PO Prelims', () => {
    const blueprints = service.getDefaultBlueprints();
    expect(blueprints.length).toBeGreaterThan(0);
    const ibps = blueprints.find(b => b.exam_category === 'IBPS_PO');
    expect(ibps).toBeDefined();
    expect(ibps?.sections_config.length).toBe(3);
  });

  it('should generate an authentic 100-question exam for IBPS PO with exactly 5 options per question', () => {
    const blueprint = service.getDefaultBlueprints()[0];
    const questions = service.generateExamQuestions(blueprint);

    expect(questions.length).toBe(100);

    for (const q of questions) {
      expect(q.options.length).toBe(5);
      expect(q.correctOptionIndex).toBeGreaterThanOrEqual(0);
      expect(q.correctOptionIndex).toBeLessThan(5);
      expect(q.explanation).toBeTruthy();
      expect(q.questionText).toBeTruthy();
      expect(q.marks).toBe(1);
      expect(q.negativeMarks).toBe(0.25);
    }
  });

  it('should generate a 30-question sprint exam correctly', () => {
    const sprintBlueprint = service.getDefaultBlueprints().find(b => b.exam_category === 'MIXED_SPRINT');
    expect(sprintBlueprint).toBeDefined();
    const questions = service.generateExamQuestions(sprintBlueprint!);
    expect(questions.length).toBe(30);
  });

  it('should return question patterns library with quant, reasoning, and english', () => {
    const library = service.getPatternsLibrary();
    expect(library.length).toBeGreaterThan(5);
    expect(library.some(p => p.subject_code === 'quant')).toBe(true);
    expect(library.some(p => p.subject_code === 'reasoning')).toBe(true);
    expect(library.some(p => p.subject_code === 'english')).toBe(true);
  });
});
