import { Injectable, inject } from '@angular/core';
import { DataStorageService } from './data-storage.service';
import { AuthService } from '../auth/auth.service';
import {
  DashboardSummary,
  SubjectProgress,
  ExamStage,
  Topic,
  MockExam,
  ExamEvent,
} from '../models/database.types';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private dataStorage = inject(DataStorageService);
  private authService = inject(AuthService);

  /**
   * Statuses considered "Completed" in PrepTrack: 'learned' and 'revision_completed'
   */
  isTopicCompleted(topic: Topic): boolean {
    return topic.learning_status === 'learned' || topic.learning_status === 'revision_completed';
  }

  async getDashboardSummary(stage: ExamStage = 'prelims'): Promise<DashboardSummary> {
    const profile = this.authService.currentProfile();
    const todayStr = new Date().toISOString().split('T')[0];

    const [allTopics, examSubjects, dailyGoalData, sessions, mockExams, events] = await Promise.all([
      this.dataStorage.getTopics(),
      this.dataStorage.getExamSubjects(),
      this.dataStorage.getDailyGoal(todayStr),
      this.dataStorage.getStudySessions(),
      this.dataStorage.getMockExams(),
      this.dataStorage.getExamEvents(),
    ]);

    // Filter topics based on stage mapping
    let stageSubjectIds: Set<string>;
    if (stage === 'both') {
      stageSubjectIds = new Set(allTopics.map(t => t.subject_id));
    } else {
      const filteredExamSubs = examSubjects.filter(es => es.stage === stage || es.stage === 'both');
      stageSubjectIds = new Set(filteredExamSubs.map(es => es.subject_id));
      // Fallback if none matched
      if (stageSubjectIds.size === 0) {
        stageSubjectIds = new Set(allTopics.map(t => t.subject_id));
      }
    }

    const filteredTopics = allTopics.filter(t => stageSubjectIds.has(t.subject_id));
    const totalTopics = filteredTopics.length;
    const completedTopics = filteredTopics.filter(t => this.isTopicCompleted(t)).length;
    const syllabusCompletionPercentage = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

    // Daily Goal
    const todayPlannedTopics = dailyGoalData.topics.length;
    const todayCompletedTopics = dailyGoalData.topics.filter(t => t.is_completed).length;

    // Study sessions today
    const todayStart = new Date(todayStr).getTime();
    const todayEnd = todayStart + 86400000;
    const todaySessions = sessions.filter(s => {
      const t = new Date(s.started_at).getTime();
      return t >= todayStart && t < todayEnd;
    });
    const todayStudySeconds = todaySessions.reduce((acc, s) => acc + s.duration_seconds, 0);
    const dailyTargetStudySeconds = Math.round((profile?.daily_target_hours || 4.0) * 3600);

    // Mock exams
    const totalMockExams = mockExams.length;
    let averageMockPercentage = 0;
    let bestMockPercentage = 0;

    if (totalMockExams > 0) {
      const percentages = mockExams.map(m => (m.marks_obtained / m.maximum_marks) * 100);
      const sum = percentages.reduce((a, b) => a + b, 0);
      averageMockPercentage = Math.round((sum / totalMockExams) * 10) / 10;
      bestMockPercentage = Math.round(Math.max(...percentages) * 10) / 10;
    }

    // Next exam event
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);

    const upcomingEvents = events
      .filter(e => {
        const evDate = new Date(e.event_date);
        evDate.setHours(0, 0, 0, 0);
        return evDate.getTime() >= todayDate.getTime();
      })
      .sort((a, b) => a.event_date.localeCompare(b.event_date));

    let nextExam = null;
    if (upcomingEvents.length > 0) {
      const first = upcomingEvents[0];
      const evDate = new Date(first.event_date);
      evDate.setHours(0, 0, 0, 0);
      const diffMs = evDate.getTime() - todayDate.getTime();
      const daysRemaining = Math.round(diffMs / (1000 * 60 * 60 * 24));

      nextExam = {
        id: first.id,
        title: first.title,
        date: first.event_date,
        daysRemaining,
        status: first.date_status
      };
    }

    return {
      syllabusCompletionPercentage,
      totalTopics,
      completedTopics,
      remainingTopics: Math.max(0, totalTopics - completedTopics),
      todayPlannedTopics,
      todayCompletedTopics,
      todayStudySeconds,
      dailyTargetStudySeconds,
      totalMockExams,
      averageMockPercentage,
      bestMockPercentage,
      nextExam
    };
  }

  async getSubjectProgress(stage: ExamStage = 'prelims'): Promise<SubjectProgress[]> {
    const [allTopics, allSubjects, examSubjects] = await Promise.all([
      this.dataStorage.getTopics(),
      this.dataStorage.getSubjects(),
      this.dataStorage.getExamSubjects(),
    ]);

    let stageSubjectIds: Set<string>;
    if (stage === 'both') {
      stageSubjectIds = new Set(allSubjects.map(s => s.id));
    } else {
      const filteredExamSubs = examSubjects.filter(es => es.stage === stage || es.stage === 'both');
      stageSubjectIds = new Set(filteredExamSubs.map(es => es.subject_id));
      if (stageSubjectIds.size === 0) {
        stageSubjectIds = new Set(allSubjects.map(s => s.id));
      }
    }

    const filteredSubjects = allSubjects.filter(s => stageSubjectIds.has(s.id));

    return filteredSubjects.map(subject => {
      const subTopics = allTopics.filter(t => t.subject_id === subject.id);
      const totalTopics = subTopics.length;
      const completedTopics = subTopics.filter(t => this.isTopicCompleted(t)).length;
      const percentage = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

      return {
        subjectId: subject.id,
        subjectName: subject.name,
        subjectColor: subject.color,
        totalTopics,
        completedTopics,
        percentage
      };
    });
  }

  async getWeeklyStudyStats(): Promise<{ day: string; date: string; seconds: number; hours: number }[]> {
    const sessions = await this.dataStorage.getStudySessions();
    const result: { day: string; date: string; seconds: number; hours: number }[] = [];

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayName = dayNames[d.getDay()];

      const dayStart = new Date(dateStr).getTime();
      const dayEnd = dayStart + 86400000;

      const daySeconds = sessions
        .filter(s => {
          const t = new Date(s.started_at).getTime();
          return t >= dayStart && t < dayEnd;
        })
        .reduce((sum, s) => sum + s.duration_seconds, 0);

      result.push({
        day: dayName,
        date: dateStr,
        seconds: daySeconds,
        hours: Math.round((daySeconds / 3600) * 10) / 10
      });
    }

    return result;
  }

  async calculateStudyStreak(): Promise<number> {
    const sessions = await this.dataStorage.getStudySessions();
    if (sessions.length === 0) return 0;

    const sessionDates = new Set(
      sessions.map(s => new Date(s.started_at).toISOString().split('T')[0])
    );

    let streak = 0;
    const checkDate = new Date();
    // Allow today to not be recorded yet if yesterday was recorded
    const todayStr = checkDate.toISOString().split('T')[0];
    if (!sessionDates.has(todayStr)) {
      checkDate.setDate(checkDate.getDate() - 1);
    }

    while (true) {
      const dateStr = checkDate.toISOString().split('T')[0];
      if (sessionDates.has(dateStr)) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  }

  async getRecommendedTasks(): Promise<{ id: string; title: string; subtitle: string; route: string; badge: string }[]> {
    const [topics, sessions] = await Promise.all([
      this.dataStorage.getTopics(),
      this.dataStorage.getStudySessions()
    ]);

    const tasks: { id: string; title: string; subtitle: string; route: string; badge: string }[] = [];

    // Task 1: High-priority unstarted or learning topic
    const highPriorityTopic = topics.find(t => t.priority === 'high' && t.learning_status !== 'learned' && t.learning_status !== 'revision_completed');
    if (highPriorityTopic) {
      tasks.push({
        id: 'rec-topic-1',
        title: `Master ${highPriorityTopic.name}`,
        subtitle: `${highPriorityTopic.subject?.name || 'High Priority'} • Target this for maximum exam weightage`,
        route: '/syllabus',
        badge: 'Priority Topic'
      });
    }

    // Task 2: Practice Quiz recommended
    tasks.push({
      id: 'rec-quiz-2',
      title: 'Take 5-Min Quantitative Aptitude Speed Drill',
      subtitle: '5 timed questions (45s per question) with automatic scoring',
      route: '/quizzes',
      badge: 'Speed Drill'
    });

    // Task 3: Previous Paper or Revision
    const learningTopic = topics.find(t => t.learning_status === 'learning');
    if (learningTopic) {
      tasks.push({
        id: 'rec-rev-3',
        title: `Review Notes for ${learningTopic.name}`,
        subtitle: `Currently in progress • Log a focus session or complete topic`,
        route: '/study-sessions',
        badge: 'In Progress'
      });
    } else {
      tasks.push({
        id: 'rec-paper-3',
        title: 'Benchmark with IBPS PO 2025 Paper',
        subtitle: 'Review memory-based pattern & timed sectional performance',
        route: '/quizzes',
        badge: 'Previous Paper'
      });
    }

    return tasks.slice(0, 3);
  }
}
