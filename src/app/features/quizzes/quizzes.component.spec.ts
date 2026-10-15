import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { QuizzesComponent } from './quizzes.component';
import { QuizService } from '../../core/services/quiz.service';
import { DataStorageService } from '../../core/services/data-storage.service';
import { ToastService } from '../../core/services/toast.service';
import { Subject, Topic } from '../../core/models/database.types';

describe('QuizzesComponent - Topic Search Functionality', () => {
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

  const mockDataStorage = {
    getSubjects: vi.fn().mockResolvedValue(mockSubjects),
    getTopics: vi.fn().mockResolvedValue(mockTopics)
  };

  const mockQuizService = {
    getPreviousPapers: vi.fn().mockResolvedValue([]),
    getQuizAttempts: vi.fn().mockResolvedValue([]),
    getQuestions: vi.fn().mockResolvedValue([]),
    saveQuizAttempt: vi.fn().mockResolvedValue({ id: 'att-1' }),
    aiConfig: {
      getAiDefaultToggleState: vi.fn().mockReturnValue(false)
    }
  };

  const mockToast = {
    info: vi.fn(),
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn()
  };

  beforeEach(async () => {
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
    component.selectedTopicName.set('');
    component.topicSearchQuery.set('');
    await component.ngOnInit();
    fixture.detectChanges();
  });

  it('should initialize and load subjects and topics', () => {
    expect(component).toBeTruthy();
    expect(component.subjects().length).toBe(3);
    expect(component.topics().length).toBe(6);
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

  it('should select topic when clicked and auto-sync subject if on all subjects', () => {
    component.selectTopic('Coding-Decoding');

    expect(component.selectedTopicName()).toBe('Coding-Decoding');
    expect(component.topicSearchQuery()).toBe('Coding-Decoding');
    expect(component.isTopicDropdownOpen()).toBe(false);
    expect(component.selectedSubjectId()).toBe('sub-reas');
  });

  it('should toggle quick select pills and support clearing', () => {
    component.selectTopicPill('Syllogisms');
    expect(component.selectedTopicName()).toBe('Syllogisms');

    // Clicking again deselects/clears
    component.selectTopicPill('Syllogisms');
    expect(component.selectedTopicName()).toBe('');
    expect(component.topicSearchQuery()).toBe('');
  });

  it('should clear topic filter completely', () => {
    component.selectTopic('Percentage');
    expect(component.selectedTopicName()).toBe('Percentage');

    component.clearTopicFilter();
    expect(component.selectedTopicName()).toBe('');
    expect(component.topicSearchQuery()).toBe('');
    expect(component.isTopicDropdownOpen()).toBe(false);
  });

  it('should support custom topic if query does not match any syllabus topics', () => {
    component.onSearchInputChange('Quadratic Inequalities');

    expect(component.isCustomTopicAvailable()).toBe(true);

    // Press Enter to select custom topic
    const mockEvent = { preventDefault: vi.fn() } as unknown as Event;
    component.onSearchEnterKey(mockEvent);

    expect(component.selectedTopicName()).toBe('Quadratic Inequalities');
    expect(component.topicSearchQuery()).toBe('Quadratic Inequalities');
    expect(component.isTopicDropdownOpen()).toBe(false);
  });

  it('should select first matching topic when pressing Enter on partial query', () => {
    component.onSearchInputChange('inter');

    const mockEvent = { preventDefault: vi.fn() } as unknown as Event;
    component.onSearchEnterKey(mockEvent);

    expect(component.selectedTopicName()).toBe('Simple & Compound Interest');
  });

  it('should filter popular suggestions when searching', () => {
    component.selectedSubjectId.set('all');
    component.onSearchInputChange('Coding');
    const filteredSuggestions = component.filteredPopularSuggestions();

    expect(filteredSuggestions).toContain('Coding-Decoding');
    expect(filteredSuggestions.length).toBe(1);
  });
});
