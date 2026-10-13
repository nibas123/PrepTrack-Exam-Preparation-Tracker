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

  it('should generate a 200-question RRB PO Mains exam with GA and Computer sections', () => {
    const rrbMains = service.getDefaultBlueprints().find(b => b.id === 'rrb-po-mains-mock-1');
    expect(rrbMains).toBeDefined();
    const questions = service.generateExamQuestions(rrbMains!);
    expect(questions.length).toBe(200);
    expect(questions.some(q => q.subjectCode === 'computer')).toBe(true);
    expect(questions.some(q => q.subjectCode === 'ga')).toBe(true);
  });

  it('should generate an authentic 200-question RBI Grade B Phase-I exam paper with 80 GA questions', () => {
    const rbi = service.getDefaultBlueprints().find(b => b.id === 'rbi-gradeb-phase1-mock-1');
    expect(rbi).toBeDefined();
    expect(rbi?.exam_category).toBe('RBI_EXAM');
    const questions = service.generateExamQuestions(rbi!);
    expect(questions.length).toBe(200);
    const gaQuestions = questions.filter(q => q.subjectCode === 'ga');
    expect(gaQuestions.length).toBe(80);
    expect(questions.filter(q => q.subjectCode === 'reasoning').length).toBe(60);
    expect(questions.filter(q => q.subjectCode === 'english').length).toBe(30);
    expect(questions.filter(q => q.subjectCode === 'quant').length).toBe(30);
  });

  it('should generate an authentic 200-question NABARD Grade A Phase-I exam paper', () => {
    const nabard = service.getDefaultBlueprints().find(b => b.id === 'nabard-gradea-phase1-mock-1');
    expect(nabard).toBeDefined();
    expect(nabard?.exam_category).toBe('NABARD');
    const questions = service.generateExamQuestions(nabard!);
    expect(questions.length).toBe(200);
    expect(questions.some(q => q.subjectCode === 'computer')).toBe(true);
  });

  it('should generate an authentic 100-question LIC AAO Prelims exam paper', () => {
    const lic = service.getDefaultBlueprints().find(b => b.id === 'lic-aao-prelims-mock-1');
    expect(lic).toBeDefined();
    expect(lic?.exam_category).toBe('INSURANCE');
    const questions = service.generateExamQuestions(lic!);
    expect(questions.length).toBe(100);
  });

  it('should generate an authentic 150-question IBPS SO Specialist Officer Prelims exam paper', () => {
    const so = service.getDefaultBlueprints().find(b => b.id === 'ibps-so-prelims-mock-1');
    expect(so).toBeDefined();
    expect(so?.exam_category).toBe('SPECIALIST');
    const questions = service.generateExamQuestions(so!);
    expect(questions.length).toBe(150);
  });

  it('should return question patterns library with quant, reasoning, english, ga, and computer', () => {
    const library = service.getPatternsLibrary();
    expect(library.length).toBeGreaterThanOrEqual(14);
    expect(library.some(p => p.subject_code === 'quant')).toBe(true);
    expect(library.some(p => p.subject_code === 'reasoning')).toBe(true);
    expect(library.some(p => p.subject_code === 'english')).toBe(true);
    expect(library.some(p => p.subject_code === 'ga')).toBe(true);
    expect(library.some(p => p.subject_code === 'computer')).toBe(true);
  });
});
