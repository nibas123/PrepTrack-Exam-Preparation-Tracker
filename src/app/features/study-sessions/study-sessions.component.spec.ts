import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { StudySessionsComponent } from './study-sessions.component';
import { DataStorageService } from '../../core/services/data-storage.service';
import { TimerService } from '../../core/services/timer.service';
import { ToastService } from '../../core/services/toast.service';
import { Subject, Topic, StudySession } from '../../core/models/database.types';

describe('StudySessionsComponent', () => {
  let component: StudySessionsComponent;
  let fixture: ComponentFixture<StudySessionsComponent>;

  const mockSubjects: Subject[] = [
    { id: 'sub-quant', user_id: 'user-1', name: 'Quantitative Aptitude', color: '#0891b2', display_order: 1 },
    { id: 'sub-reasoning', user_id: 'user-1', name: 'Reasoning Ability', color: '#2563eb', display_order: 2 }
  ];

  const mockTopics: Topic[] = [
    { id: 'top-1', user_id: 'user-1', subject_id: 'sub-quant', name: 'Simplification', priority: 'high', learning_status: 'learning', display_order: 1 },
    { id: 'top-2', user_id: 'user-1', subject_id: 'sub-quant', name: 'Number Series', priority: 'high', learning_status: 'not_started', display_order: 2 },
    { id: 'top-3', user_id: 'user-1', subject_id: 'sub-reasoning', name: 'Syllogisms', priority: 'high', learning_status: 'not_started', display_order: 1 }
  ];

  const mockSessions: StudySession[] = [
    {
      id: 'sess-1',
      user_id: 'user-1',
      subject_id: 'sub-quant',
      topic_id: 'top-1',
      started_at: '2026-10-12T08:00:00.000Z',
      ended_at: '2026-10-12T09:00:00.000Z',
      duration_seconds: 3600,
      notes: 'Solved 25 questions',
      created_at: '2026-10-12T09:00:00.000Z',
      updated_at: '2026-10-12T09:00:00.000Z'
    },
    {
      id: 'sess-2',
      user_id: 'user-1',
      subject_id: 'sub-reasoning',
      topic_id: 'top-3',
      started_at: '2026-10-12T10:00:00.000Z',
      ended_at: '2026-10-12T10:45:00.000Z',
      duration_seconds: 2700,
      notes: null,
      created_at: '2026-10-12T10:45:00.000Z',
      updated_at: '2026-10-12T10:45:00.000Z'
    }
  ];

  const mockDataStorage = {
    getSubjects: vi.fn().mockResolvedValue(mockSubjects),
    getTopics: vi.fn().mockResolvedValue(mockTopics),
    getStudySessions: vi.fn().mockResolvedValue(mockSessions),
    saveStudySession: vi.fn().mockResolvedValue(mockSessions[0]),
    deleteStudySession: vi.fn().mockResolvedValue(true)
  };

  const mockToast = {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudySessionsComponent],
      providers: [
        { provide: DataStorageService, useValue: mockDataStorage },
        { provide: ToastService, useValue: mockToast },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { queryParams: {} }, queryParams: of({}) }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(StudySessionsComponent);
    component = fixture.componentInstance;
  });

  it('should initialize and load subjects and topics', async () => {
    await component.loadData();
    expect(component.subjects().length).toBe(2);
    expect(component.allTopics().length).toBe(3);
    expect(component.selectedSubjectId()).toBe('sub-quant');
  });

  it('should reactively filter topics based on selectedSubjectId signal', async () => {
    await component.loadData();

    // Default subject selected is sub-quant
    expect(component.selectedSubjectId()).toBe('sub-quant');
    expect(component.filteredTopics().length).toBe(2);
    expect(component.filteredTopics().map(t => t.id)).toEqual(['top-1', 'top-2']);

    // Change subject via onSubjectSelect
    component.onSubjectSelect('sub-reasoning');
    expect(component.selectedSubjectId()).toBe('sub-reasoning');
    expect(component.selectedTopicId()).toBeNull();

    // filteredTopics should automatically recompute
    expect(component.filteredTopics().length).toBe(1);
    expect(component.filteredTopics()[0].id).toBe('top-3');
  });

  it('should reactively filter manualTopics in manual session modal', async () => {
    await component.loadData();

    component.openManualModal();
    expect(component.showManualModal()).toBe(true);
    expect(component.manualSubjectId()).toBe('sub-quant');
    expect(component.manualTopics().length).toBe(2);

    component.onManualSubjectChange('sub-reasoning');
    expect(component.manualSubjectId()).toBe('sub-reasoning');
    expect(component.manualTopicId()).toBeNull();
    expect(component.manualTopics().length).toBe(1);
    expect(component.manualTopics()[0].id).toBe('top-3');
  });

  it('should filter session history reactively when historySubjectFilter changes', async () => {
    await component.loadData();

    expect(component.historySubjectFilter()).toBe('all');
    expect(component.filteredSessions().length).toBe(2);

    component.historySubjectFilter.set('sub-reasoning');
    expect(component.filteredSessions().length).toBe(1);
    expect(component.filteredSessions()[0].subject_id).toBe('sub-reasoning');

    component.historySubjectFilter.set('all');
    expect(component.filteredSessions().length).toBe(2);
  });

  it('should reactively compute formattedTimerDisplay and activeSubjectName when timer runs', async () => {
    await component.loadData();
    expect(component.formattedTimerDisplay()).toBe('00:00:00');

    // Start timer for sub-quant
    component.onSubjectSelect('sub-quant');
    component.startTimer();

    expect(component.timerService.isRunning()).toBe(true);
    expect(component.activeSubjectName()).toBe('Quantitative Aptitude');

    // Clean up timer
    component.timerService.discardTimer();
    expect(component.timerService.isRunning()).toBe(false);
  });

  it('should save study session to DataStorageService when finishSession is called', async () => {
    await component.loadData();
    mockDataStorage.saveStudySession.mockClear();

    component.onSubjectSelect('sub-quant');
    component.selectedTopicId.set('top-1');
    component.startTimer();

    await component.finishSession();

    expect(mockDataStorage.saveStudySession).toHaveBeenCalledTimes(1);
    expect(mockDataStorage.saveStudySession).toHaveBeenCalledWith(
      expect.objectContaining({
        subject_id: 'sub-quant',
        topic_id: 'top-1'
      })
    );
    expect(component.timerService.isRunning()).toBe(false);
  });
});
