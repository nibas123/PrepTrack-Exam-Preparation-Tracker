import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { QuizzesComponent } from './quizzes.component';
import { QuizService } from '../../core/services/quiz.service';
import { DataStorageService } from '../../core/services/data-storage.service';
import { ToastService } from '../../core/services/toast.service';
import { Subject, Topic } from '../../core/models/database.types';

describe('QuizzesComponent - Multi-Topic Search & Selection Functionality', () => {
  let component: QuizzesComponent;
  let fixture: ComponentFixture<QuizzesComponent>;

  const mockSubjects: Subject[] = [
    { id: 'sub-quant', user_id: 'user-1', name: 'Quantitative Aptitude', color: '#3b82f6', display_order: 1 },
    { id: 'sub-reas', user_id: 'user-1', name: 'Reasoning Ability', color: '#8b5cf6', display_order: 2 },
    { id: 'sub-eng', user_id: 'user-1', name: 'English Language', color: '#10b981', display_order: 3 }
  ];

  const mockTopics: Topic[] = [
    { id: 'top-1', user_id: 'user-1', subject_id: 'sub-quant', name: 'Percentage', priority: 'high', learning_status: 'learning', display_order: 1 },
    { id: 'top-2', user_id: 'user-1', subject_id: 'sub-quant', name: 'Profit & Loss', priority: 'high', learning_status: 'learning', display_order: 2 },
    { id: 'top-3', user_id: 'user-1', subject_id: 'sub-quant', name: 'Simple & Compound Interest', priority: 'medium', learning_status: 'not_started', display_order: 3 },
    { id: 'top-4', user_id: 'user-1', subject_id: 'sub-reas', name: 'Syllogisms', priority: 'high', learning_status: 'learned', display_order: 1 },
    { id: 'top-5', user_id: 'user-1', subject_id: 'sub-reas', name: 'Coding-Decoding', priority: 'medium', learning_status: 'learned', display_order: 2 },
    { id: 'top-6', user_id: 'user-1', subject_id: 'sub-eng', name: 'Reading Comprehension', priority: 'high', learning_status: 'learning', display_order: 1 }
  ];

  const mockQuizService = {
    getPreviousPapers: vi.fn().mockResolvedValue([]),
    getQuizAttempts: vi.fn().mockResolvedValue([]),
    getQuestions: vi.fn().mockResolvedValue([
      { id: 'q-1', question_text: 'Test Q1', options: ['A', 'B', 'C', 'D'], correct_option_index: 0, topic_name: 'Percentage' }
    ]),
    deduplicateQuestions: vi.fn().mockImplementation((qs) => qs),
    saveQuizAttempt: vi.fn().mockResolvedValue({ id: 'att-1' }),
    aiConfig: {
      getAiDefaultToggleState: vi.fn().mockReturnValue(false)
    }
  };

  const mockDataStorage = {
    getSubjects: vi.fn().mockResolvedValue(mockSubjects),
    getTopics: vi.fn().mockResolvedValue(mockTopics)
  };

  const mockToast = {
    info: vi.fn(),
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn()
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    await TestBed.configureTestingModule({
      imports: [QuizzesComponent],
      providers: [
        { provide: DataStorageService, useValue: mockDataStorage },
        { provide: QuizService, useValue: mockQuizService },
        { provide: ToastService, useValue: mockToast },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({})
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(QuizzesComponent);
    component = fixture.componentInstance;
    component.selectedSubjectId.set('all');
    component.selectedTopicNames.set([]);
    component.topicSearchQuery.set('');
    await component.ngOnInit();
    fixture.detectChanges();
  });

  it('should initialize with empty selected topics list', () => {
    expect(component).toBeTruthy();
    expect(component.subjects().length).toBe(3);
    expect(component.topics().length).toBe(6);
    expect(component.selectedTopicNames()).toEqual([]);
    expect(component.selectedTopicName()).toBe('');
    expect(component.topicSearchQuery()).toBe('');
  });

  it('should filter available topics based on search query', () => {
    component.onSearchInputChange('percent');

    expect(component.topicSearchQuery()).toBe('percent');
    expect(component.isTopicDropdownOpen()).toBe(true);

    const filtered = component.filteredTopics();
    expect(filtered.length).toBe(1);
    expect(filtered[0].name).toBe('Percentage');
  });

  it('should filter topics across subject name when typed in search', () => {
    component.onSearchInputChange('Reasoning');

    const filtered = component.filteredTopics();
    expect(filtered.length).toBe(2);
    expect(filtered.map(t => t.name)).toEqual(['Syllogisms', 'Coding-Decoding']);
  });

  it('should support selecting multiple topics and report isTopicSelected correctly', () => {
    component.toggleTopic('Percentage');
    component.toggleTopic('Profit & Loss');

    expect(component.selectedTopicNames()).toEqual(['Percentage', 'Profit & Loss']);
    expect(component.selectedTopicName()).toBe('Percentage, Profit & Loss');
    expect(component.isTopicSelected('Percentage')).toBe(true);
    expect(component.isTopicSelected('Profit & Loss')).toBe(true);
    expect(component.isTopicSelected('Syllogisms')).toBe(false);
  });

  it('should remove specific topic chip when removeTopic is called', () => {
    component.toggleTopic('Percentage');
    component.toggleTopic('Profit & Loss');
    component.toggleTopic('Syllogisms');

    expect(component.selectedTopicNames().length).toBe(3);

    component.removeTopic('Profit & Loss');
    expect(component.selectedTopicNames()).toEqual(['Percentage', 'Syllogisms']);
    expect(component.isTopicSelected('Profit & Loss')).toBe(false);
  });

  it('should toggle quick select pills and allow multi-selection', () => {
    component.selectTopicPill('Syllogisms');
    expect(component.selectedTopicNames()).toEqual(['Syllogisms']);

    // Select second pill
    component.selectTopicPill('Coding-Decoding');
    expect(component.selectedTopicNames()).toEqual(['Syllogisms', 'Coding-Decoding']);

    // Tapping first pill again deselects it
    component.selectTopicPill('Syllogisms');
    expect(component.selectedTopicNames()).toEqual(['Coding-Decoding']);
  });

  it('should clear all selected topics with clearTopicFilter()', () => {
    component.toggleTopic('Percentage');
    component.toggleTopic('Syllogisms');
    expect(component.selectedTopicNames().length).toBe(2);

    component.clearTopicFilter();
    expect(component.selectedTopicNames()).toEqual([]);
    expect(component.selectedTopicName()).toBe('');
    expect(component.topicSearchQuery()).toBe('');
    expect(component.isTopicDropdownOpen()).toBe(false);
  });

  it('should support adding custom topic through search enter key', () => {
    component.onSearchInputChange('Quadratic Inequalities');
    expect(component.isCustomTopicAvailable()).toBe(true);

    const mockEvent = { preventDefault: vi.fn() } as unknown as Event;
    component.onSearchEnterKey(mockEvent);

    expect(component.selectedTopicNames()).toContain('Quadratic Inequalities');
    expect(component.topicSearchQuery()).toBe(''); // Cleared for next entry
  });

  it('should add first matching topic when pressing Enter on partial query', () => {
    component.onSearchInputChange('inter');

    const mockEvent = { preventDefault: vi.fn() } as unknown as Event;
    component.onSearchEnterKey(mockEvent);

    expect(component.selectedTopicNames()).toContain('Simple & Compound Interest');
    expect(component.topicSearchQuery()).toBe('');
  });

  it('should pass array of selected topics to quizService.getQuestions on startQuiz', async () => {
    component.toggleTopic('Percentage');
    component.toggleTopic('Profit & Loss');

    await component.startQuiz();

    expect(mockQuizService.getQuestions).toHaveBeenCalledWith(
      'Quantitative Aptitude',
      ['Percentage', 'Profit & Loss'],
      5,
      'mixed',
      false
    );
  });

  it('should correctly extract reading passage and question statement using getQuestionDisplay', () => {
    const qWithPassage = {
      id: 'q-rc-1',
      subject_id: 'sub-eng',
      topic_name: 'Reading Comprehension',
      passage_text: 'Directions: Read this paragraph about CBDCs.',
      question_text: 'Directions: Read this paragraph about CBDCs.\n\nAccording to the passage, what is a CBDC?',
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correct_option_index: 0,
      explanation: 'Detailed explanation'
    };

    const display = component.getQuestionDisplay(qWithPassage);
    expect(display.passage).toBe('Directions: Read this paragraph about CBDCs.');
    expect(display.question).toBe('According to the passage, what is a CBDC?');

    const regularQ = {
      id: 'q-arith-1',
      subject_id: 'sub-quant',
      topic_name: 'Percentage',
      question_text: 'What is 20% of 150?',
      options: ['30', '40', '50', '60'],
      correct_option_index: 0,
      explanation: '20% of 150 = 30'
    };

    const regularDisplay = component.getQuestionDisplay(regularQ);
    expect(regularDisplay.passage).toBeNull();
    expect(regularDisplay.question).toBe('What is 20% of 150?');
  });
});
