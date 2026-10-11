export type LearningStatus = 'not_started' | 'learning' | 'learned' | 'revision_completed';
export type Priority = 'low' | 'medium' | 'high';
export type ExamStage = 'prelims' | 'mains' | 'both';
export type EventType =
  | 'exam_date'
  | 'application_open'
  | 'application_deadline'
  | 'admit_card'
  | 'result'
  | 'syllabus_deadline'
  | 'other';
export type DateStatus = 'tentative' | 'confirmed';

export interface Profile {
  id: string;
  display_name: string | null;
  timezone: string;
  daily_target_hours: number;
  daily_target_topics: number;
  target_exam_id?: string | null;
  target_exam_date?: string | null;
  target_exam_name?: string | null;
  onboarding_completed?: boolean;
  created_at: string;
  updated_at: string;
}

export interface QuizQuestion {
  id: string;
  subject_id: string;
  topic_id?: string | null;
  topic_name?: string;
  question_text: string;
  options: string[];
  correct_option_index: number;
  explanation: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  created_at?: string;
  correct_count?: number;
  incorrect_count?: number;
  last_attempted_at?: string;
}

export interface QuizAttempt {
  id: string;
  user_id: string;
  quiz_type: 'subject' | 'topic' | 'mixed' | 'previous_paper';
  subject_id?: string | null;
  topic_id?: string | null;
  topic_name?: string | null;
  total_questions: number;
  correct_answers: number;
  score_percentage: number;
  total_time_seconds: number;
  weak_topics?: string[];
  answers: {
    question_id: string;
    selected_option_index: number | null;
    is_correct: boolean;
    time_spent_seconds: number;
  }[];
  created_at: string;
}

export interface PreviousPaper {
  id: string;
  exam_name: string;
  year: number;
  stage: 'prelims' | 'mains';
  total_marks: number;
  duration_minutes: number;
  sections: {
    subject_name: string;
    questions_count: number;
  }[];
  official_source_license: string;
  questions: QuizQuestion[];
}

export interface Exam {
  id: string;
  user_id: string;
  name: string;
  description?: string | null;
  conducting_body?: string | null;
  vacancies?: number | null;
  notification_date?: string | null;
  application_start_date?: string | null;
  application_end_date?: string | null;
  prelims_date?: string | null;
  mains_date?: string | null;
  official_url?: string | null;
  notification_status?: 'announced' | 'expected' | 'application_open' | 'completed';
  is_active: boolean;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface Subject {
  id: string;
  user_id: string;
  name: string;
  color: string;
  display_order: number;
  archived_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ExamSubject {
  id: string;
  user_id: string;
  exam_id: string;
  subject_id: string;
  stage: 'prelims' | 'mains' | 'both';
  display_order: number;
  created_at?: string;
  subject?: Subject;
}

export interface Topic {
  id: string;
  user_id: string;
  subject_id: string;
  parent_topic_id?: string | null;
  name: string;
  description?: string | null;
  learning_status: LearningStatus;
  priority: Priority;
  target_date?: string | null;
  display_order: number;
  archived_at?: string | null;
  created_at?: string;
  updated_at?: string;
  subject?: Subject;
}

export interface DailyGoal {
  id: string;
  user_id: string;
  goal_date: string; // YYYY-MM-DD
  target_topic_count: number;
  target_study_minutes: number;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
  topics?: DailyGoalTopic[];
}

export interface DailyGoalTopic {
  id: string;
  user_id: string;
  daily_goal_id: string;
  topic_id: string;
  is_completed: boolean;
  completed_at?: string | null;
  created_at?: string;
  updated_at?: string;
  topic?: Topic;
}

export interface StudySession {
  id: string;
  user_id: string;
  subject_id: string;
  topic_id?: string | null;
  started_at: string;
  ended_at: string;
  duration_seconds: number;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
  subject?: Subject;
  topic?: Topic;
}

export interface MockExamSubjectScore {
  id: string;
  user_id: string;
  mock_exam_id: string;
  subject_id: string;
  marks_obtained: number;
  maximum_marks: number;
  attempted_questions?: number | null;
  correct_answers?: number | null;
  created_at?: string;
  updated_at?: string;
  subject?: Subject;
}

export interface MockExam {
  id: string;
  user_id: string;
  exam_id?: string | null;
  name: string;
  exam_stage: 'prelims' | 'mains';
  attended_at: string; // YYYY-MM-DD
  marks_obtained: number;
  maximum_marks: number;
  duration_seconds?: number | null;
  total_questions?: number | null;
  attempted_questions?: number | null;
  correct_answers?: number | null;
  weak_areas?: string | null;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
  exam?: Exam;
  subject_scores?: MockExamSubjectScore[];
}

export interface ExamEvent {
  id: string;
  user_id: string;
  exam_id?: string | null;
  title: string;
  event_type: EventType;
  event_date: string; // YYYY-MM-DD
  date_status: DateStatus;
  description?: string | null;
  reminder_enabled: boolean;
  created_at?: string;
  updated_at?: string;
  exam?: Exam;
}

export interface DashboardSummary {
  syllabusCompletionPercentage: number;
  totalTopics: number;
  completedTopics: number;
  remainingTopics: number;
  todayPlannedTopics: number;
  todayCompletedTopics: number;
  todayStudySeconds: number;
  dailyTargetStudySeconds: number;
  totalMockExams: number;
  averageMockPercentage: number;
  bestMockPercentage: number;
  nextExam?: {
    id: string;
    title: string;
    date: string;
    daysRemaining: number;
    status: DateStatus;
  } | null;
}

export interface SubjectProgress {
  subjectId: string;
  subjectName: string;
  subjectColor: string;
  totalTopics: number;
  completedTopics: number;
  percentage: number;
}

export interface DashboardWidgetConfig {
  showNextExamBanner: boolean;
  showSyllabusCard: boolean;
  showTodayPlanCard: boolean;
  showStudyTimeCard: boolean;
  showMockExamCard: boolean;
  showSubjectProgress: boolean;
  showTodayChecklist: boolean;
  showWeeklyTrend: boolean;
  showUpcomingDeadlines: boolean;
}
