import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { AdminComponent } from './admin.component';
import { AiConfigService } from '../../core/services/ai-config.service';
import { QuizService } from '../../core/services/quiz.service';
import { QuestionPatternEngineService } from '../../core/services/question-pattern-engine.service';
import { DataStorageService } from '../../core/services/data-storage.service';
import { SupabaseService } from '../../core/services/supabase.service';
import { AuthService } from '../../core/auth/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { OfflineSyncService } from '../../core/services/offline-sync.service';

describe('AdminComponent', () => {
  let component: AdminComponent;
  let fixture: ComponentFixture<AdminComponent>;
  let aiConfig: AiConfigService;

  const mockToast = {
    info: vi.fn(),
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn()
  };

  const mockAuthService = {
    currentUser: vi.fn().mockReturnValue({ id: 'user-1', email: 'aspirant@bank.gov.in' }),
    currentProfile: vi.fn().mockReturnValue({ display_name: 'Rahul' })
  };

  const mockSupabase = {
    client: {}
  };

  const mockOfflineSync = {
    getCached: vi.fn().mockResolvedValue([]),
    setCached: vi.fn().mockResolvedValue(undefined),
    addToQueue: vi.fn().mockResolvedValue(undefined)
  };

  const mockDataStorage = {
    getExams: vi.fn().mockResolvedValue([
      { id: 'exam-1', exam_name: 'IBPS PO 2026', conducting_body: 'IBPS' },
      { id: 'exam-2', exam_name: 'SBI PO 2026', conducting_body: 'SBI' }
    ]),
    getTopics: vi.fn().mockResolvedValue([
      { id: 'top-1', name: 'Percentage' },
      { id: 'top-2', name: 'Syllogisms' }
    ]),
    getMockExamSimulatorAttempts: vi.fn().mockResolvedValue([])
  };

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [AdminComponent],
      providers: [
        { provide: ToastService, useValue: mockToast },
        { provide: AuthService, useValue: mockAuthService },
        { provide: SupabaseService, useValue: mockSupabase },
        { provide: DataStorageService, useValue: mockDataStorage },
        { provide: OfflineSyncService, useValue: mockOfflineSync },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({})
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminComponent);
    component = fixture.componentInstance;
    aiConfig = TestBed.inject(AiConfigService);
    fixture.detectChanges();
  });

  it('should create and load registered blueprints and patterns', () => {
    expect(component).toBeTruthy();
    expect(component.blueprints.length).toBeGreaterThanOrEqual(14);
    expect(component.patterns.length).toBeGreaterThanOrEqual(14);
  });

  it('should switch between tabs properly', () => {
    expect(component.activeTab()).toBe('dashboard');

    component.activeTab.set('gemini');
    expect(component.activeTab()).toBe('gemini');

    component.activeTab.set('bank');
    expect(component.activeTab()).toBe('bank');

    component.activeTab.set('patterns');
    expect(component.activeTab()).toBe('patterns');

    component.activeTab.set('diagnostics');
    expect(component.activeTab()).toBe('diagnostics');
  });

  it('should toggle Gemini AI master switch', () => {
    const initial = aiConfig.isAiGloballyEnabled();
    component.toggleAiMaster();
    expect(aiConfig.isAiGloballyEnabled()).toBe(!initial);
    expect(mockToast.info).toHaveBeenCalled();
  });

  it('should seed sample banking questions into local question bank', () => {
    component.seedSampleQuestions();
    expect(component.cachedBank().length).toBeGreaterThan(0);
    expect(mockToast.success).toHaveBeenCalledWith(expect.stringContaining('Seeded'));
  });

  it('should execute dry-run pattern engine simulation and calculate latency', () => {
    component.selectedSimulationBlueprintId = 'ibps-po-prelims-live-1';
    component.runEngineDryRun();

    expect(component.dryRunResult).not.toBeNull();
    expect(component.dryRunResult?.questions.length).toBe(100);
    expect(component.dryRunResult?.sectionCounts.length).toBe(3);
    expect(component.dryRunResult?.latencyMs).toBeGreaterThanOrEqual(0);
  });

  it('should delete a question from bank', () => {
    component.seedSampleQuestions();
    const initialCount = component.cachedBank().length;
    const firstId = component.cachedBank()[0].id;

    component.deleteQuestion(firstId);
    expect(component.cachedBank().length).toBe(initialCount - 1);
  });

  it('should open and close the AI question generator modal', () => {
    expect(component.showAiGenModal()).toBe(false);

    component.openAiGenModal();
    expect(component.showAiGenModal()).toBe(true);

    component.closeAiGenModal();
    expect(component.showAiGenModal()).toBe(false);
  });

  it('should update topic suggestion when subject changes', () => {
    component.onSubjectChange('Reasoning Ability');
    expect(component.aiGenSubject()).toBe('Reasoning Ability');
    expect(component.aiGenTopic()).toBe('Syllogisms (Only a Few)');
    expect(component.currentTopicSuggestions.length).toBeGreaterThan(0);
  });

  it('should generate and add AI questions to the platform bank', async () => {
    const quizService = TestBed.inject(QuizService);
    aiConfig.setAiEnabled(true);
    aiConfig.updateConfig({ primaryKey: 'test-mock-gemini-key' });

    vi.spyOn(quizService, 'generateGeminiQuestions').mockResolvedValue([
      {
        id: 'gemini-mock-1',
        subject_id: 'Quantitative Aptitude',
        topic_name: 'Percentage & Profit/Loss',
        question_text: 'What is 15% of 200?',
        options: ['30', '40', '50', '60'],
        correct_option_index: 0,
        explanation: '15% of 200 is 30',
        difficulty: 'easy',
        is_ai_generated: true,
        generator_type: 'gemini_ai',
        correct_count: 0,
        incorrect_count: 0
      }
    ]);

    component.openAiGenModal();
    await component.generateAiQuestionsForBank();

    expect(component.aiGenResult?.success).toBe(true);
    expect(component.aiGenResult?.count).toBe(1);
    expect(component.cachedBank().some(q => q.id === 'gemini-mock-1')).toBe(true);
    expect(component.aiQuestionsCount()).toBeGreaterThanOrEqual(1);
    expect(mockToast.success).toHaveBeenCalledWith(expect.stringContaining('Successfully added 1 fresh AI question'));
  });

  it('should warn when attempting generation if AI is globally disabled', async () => {
    aiConfig.setAiEnabled(false);

    await component.generateAiQuestionsForBank();
    expect(mockToast.error).toHaveBeenCalledWith(expect.stringContaining('Gemini AI is globally disabled'));
  });
});
