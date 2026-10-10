import { describe, it, expect } from 'vitest';
import { Topic, MockExam, ExamStage } from '../models/database.types';

describe('PrepTrack Core Business Logic & Calculations', () => {

  describe('Topic Completion Rules', () => {
    const isTopicCompleted = (topic: Partial<Topic>): boolean => {
      return topic.learning_status === 'learned' || topic.learning_status === 'revision_completed';
    };

    it('should count "learned" and "revision_completed" as completed', () => {
      expect(isTopicCompleted({ learning_status: 'learned' })).toBe(true);
      expect(isTopicCompleted({ learning_status: 'revision_completed' })).toBe(true);
    });

    it('should NOT count "not_started" or "learning" as completed', () => {
      expect(isTopicCompleted({ learning_status: 'not_started' })).toBe(false);
      expect(isTopicCompleted({ learning_status: 'learning' })).toBe(false);
    });

    it('should accurately calculate syllabus completion percentage without double counting', () => {
      const sampleTopics: Partial<Topic>[] = [
        { id: '1', learning_status: 'not_started' },
        { id: '2', learning_status: 'learning' },
        { id: '3', learning_status: 'learned' },
        { id: '4', learning_status: 'revision_completed' }
      ];

      const completed = sampleTopics.filter(t => isTopicCompleted(t)).length;
      const percentage = Math.round((completed / sampleTopics.length) * 100);

      expect(completed).toBe(2);
      expect(percentage).toBe(50);
    });
  });

  describe('Mock Exam Score & Percentage Calculations', () => {
    it('should calculate percentage per attempt before averaging', () => {
      // Test 1: 50 / 100 = 50.0%
      // Test 2: 150 / 200 = 75.0%
      // Correct Average: (50 + 75) / 2 = 62.5%
      // If someone naively summed raw marks (200 / 300), that would give 66.6% which is WRONG.
      const mock1: Partial<MockExam> = { marks_obtained: 50, maximum_marks: 100 };
      const mock2: Partial<MockExam> = { marks_obtained: 150, maximum_marks: 200 };

      const getPct = (m: Partial<MockExam>) => (m.marks_obtained! / m.maximum_marks!) * 100;

      const p1 = getPct(mock1);
      const p2 = getPct(mock2);

      expect(p1).toBe(50);
      expect(p2).toBe(75);

      const avg = (p1 + p2) / 2;
      expect(avg).toBe(62.5);

      const best = Math.max(p1, p2);
      expect(best).toBe(75);
    });

    it('should validate marks cannot be negative or exceed maximum marks', () => {
      const isValidScore = (obtained: number, max: number): boolean => {
        return obtained >= 0 && obtained <= max && max > 0;
      };

      expect(isValidScore(65, 100)).toBe(true);
      expect(isValidScore(100, 100)).toBe(true);
      expect(isValidScore(0, 100)).toBe(true);
      expect(isValidScore(-5, 100)).toBe(false);
      expect(isValidScore(105, 100)).toBe(false);
      expect(isValidScore(50, 0)).toBe(false);
    });
  });

  describe('Study Timer Timestamp Calculations', () => {
    it('should calculate elapsed duration mathematically from timestamps', () => {
      const startedAt = 1000000;
      const now = 1003600; // 3600 ms later = 3.6s
      const accumulated = 10; // 10s from previous pause

      const additionalSeconds = Math.floor((now - startedAt) / 1000); // 3s
      const totalElapsed = accumulated + additionalSeconds;

      expect(totalElapsed).toBe(13);
    });

    it('should format seconds into hours and minutes display correctly', () => {
      const formatDuration = (seconds: number): string => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        if (hrs > 0) return `${hrs}h ${mins}m`;
        return `${mins}m`;
      };

      expect(formatDuration(3600)).toBe('1h 0m');
      expect(formatDuration(5400)).toBe('1h 30m');
      expect(formatDuration(1800)).toBe('30m');
      expect(formatDuration(45)).toBe('0m');
    });
  });

  describe('Exam Countdown Date Calculations', () => {
    it('should calculate days remaining correctly for future, today, and past dates', () => {
      const calculateDiffDays = (targetDateStr: string, currentDateStr: string): number => {
        const target = new Date(targetDateStr);
        target.setHours(0, 0, 0, 0);
        const current = new Date(currentDateStr);
        current.setHours(0, 0, 0, 0);
        return Math.round((target.getTime() - current.getTime()) / (1000 * 60 * 60 * 24));
      };

      expect(calculateDiffDays('2026-11-20', '2026-10-10')).toBe(41);
      expect(calculateDiffDays('2026-10-10', '2026-10-10')).toBe(0);
      expect(calculateDiffDays('2026-10-05', '2026-10-10')).toBe(-5);
    });
  });
});
