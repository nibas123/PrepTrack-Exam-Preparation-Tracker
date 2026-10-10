import { Injectable, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { AuthService } from '../auth/auth.service';
import {
  Exam,
  Subject,
  ExamSubject,
  Topic,
  DailyGoal,
  DailyGoalTopic,
  StudySession,
  MockExam,
  ExamEvent,
} from '../models/database.types';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {
  private supabaseService = inject(SupabaseService);
  private authService = inject(AuthService);

  private get userId(): string {
    return this.authService.currentUser()?.id || '';
  }

  // --- LOCAL DEMO STORAGE UTILITIES ---
  private getLocal<T>(key: string, defaultValue: T): T {
    try {
      const data = localStorage.getItem(`preptrack_${this.userId}_${key}`);
      return data ? JSON.parse(data) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  private setLocal<T>(key: string, value: T): void {
    try {
      localStorage.setItem(`preptrack_${this.userId}_${key}`, JSON.stringify(value));
    } catch (e) {
      console.error('LocalStorage write failed:', e);
    }
  }

  // --- INITIAL SEEDING FOR NEW / LOCAL USERS ---
  public ensureInitializedLocalData(): void {
    const initialized = this.getLocal<boolean>('initialized', false);
    if (initialized) return;

    this.setLocal('exams', []);
    this.setLocal('subjects', []);
    this.setLocal('exam_subjects', []);
    this.setLocal('topics', []);
    this.setLocal('daily_goals', []);
    this.setLocal('daily_goal_topics', []);
    this.setLocal('study_sessions', []);
    this.setLocal('mock_exams', []);
    this.setLocal('exam_events', []);
    this.setLocal('initialized', true);
  }

  public async seedUserSyllabusInDatabase(userId: string): Promise<void> {
    if (!this.supabaseService.isRealSupabaseConfigured) return;

    try {
      // Check if user already has subjects
      const { count, error: countErr } = await this.supabaseService.clientInstance
        .from('subjects')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      if (!countErr && count && count > 0) {
        return; // Already seeded
      }

      // Try RPC first
      const { error: rpcError } = await this.supabaseService.clientInstance.rpc('seed_user_bank_exam_data', { p_user_id: userId });
      
      if (rpcError) {
        console.warn('RPC seed failed, falling back to client-side insert', rpcError);
        // Fallback manual insert if RPC is missing or fails
        const uid = userId;
        const exams: Exam[] = [
          { id: 'exam-1' + Date.now(), user_id: uid, name: 'IBPS PO 2026', description: 'Probationary Officer exam by IBPS', is_active: true, display_order: 1 },
          { id: 'exam-2' + Date.now(), user_id: uid, name: 'SBI PO 2026', description: 'Probationary Officer exam by State Bank of India', is_active: true, display_order: 2 },
          { id: 'exam-3' + Date.now(), user_id: uid, name: 'IBPS Clerk 2026', description: 'Clerical Cadre recruitment exam', is_active: true, display_order: 3 },
        ];

        const subjects: Subject[] = [
          { id: 'sub-1' + Date.now(), user_id: uid, name: 'Reasoning', color: '#2563eb', display_order: 1 },
          { id: 'sub-2' + Date.now(), user_id: uid, name: 'Quantitative Aptitude', color: '#0891b2', display_order: 2 },
          { id: 'sub-3' + Date.now(), user_id: uid, name: 'English', color: '#7c3aed', display_order: 3 },
          { id: 'sub-4' + Date.now(), user_id: uid, name: 'General Awareness', color: '#d97706', display_order: 4 },
          { id: 'sub-5' + Date.now(), user_id: uid, name: 'Banking Awareness', color: '#059669', display_order: 5 },
        ];

        await this.supabaseService.clientInstance.from('exams').insert(exams);
        await this.supabaseService.clientInstance.from('subjects').insert(subjects);

        // We could manually seed exam_subjects and topics too if needed, but RPC is preferred.
      }
    } catch (e) {
      console.error('Failed to seed user database:', e);
    }
  }


  // --- EXAMS ---
  async getExams(): Promise<Exam[]> {
    if (this.supabaseService.isRealSupabaseConfigured) {
      const { data, error } = await this.supabaseService.clientInstance
        .from('exams')
        .select('*')
        .eq('user_id', this.userId)
        .order('display_order', { ascending: true });
      if (!error && data) return data as Exam[];
    }
    this.ensureInitializedLocalData();
    return this.getLocal<Exam[]>('exams', []);
  }

  async saveExam(exam: Partial<Exam>): Promise<Exam> {
    const newExam: Exam = {
      id: exam.id || `exam-${Date.now()}`,
      user_id: this.userId,
      name: exam.name || 'New Exam',
      description: exam.description || null,
      conducting_body: exam.conducting_body || 'IBPS',
      vacancies: exam.vacancies || null,
      notification_date: exam.notification_date || null,
      application_start_date: exam.application_start_date || null,
      application_end_date: exam.application_end_date || null,
      prelims_date: exam.prelims_date || null,
      mains_date: exam.mains_date || null,
      official_url: exam.official_url || null,
      notification_status: exam.notification_status || 'announced',
      is_active: exam.is_active ?? true,
      display_order: exam.display_order ?? 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (this.supabaseService.isRealSupabaseConfigured) {
      const { data } = await this.supabaseService.clientInstance
        .from('exams')
        .upsert(newExam)
        .select()
        .single();
      if (data) return data as Exam;
    }

    const current = this.getLocal<Exam[]>('exams', []);
    const idx = current.findIndex(e => e.id === newExam.id);
    if (idx >= 0) current[idx] = newExam;
    else current.push(newExam);
    this.setLocal('exams', current);
    return newExam;
  }

  async announceAndTrackNewExam(examData: Partial<Exam>): Promise<Exam> {
    const saved = await this.saveExam({
      ...examData,
      is_active: true,
      notification_status: examData.notification_status || 'announced'
    });

    // Automatically create milestone calendar events for the announced exam
    if (saved.prelims_date) {
      await this.saveExamEvent({
        exam_id: saved.id,
        title: `${saved.name} Prelims Exam`,
        event_type: 'exam_date',
        event_date: saved.prelims_date,
        date_status: 'tentative',
        description: `Official preliminary examination date for ${saved.name}`,
        reminder_enabled: true
      });
    }

    if (saved.mains_date) {
      await this.saveExamEvent({
        exam_id: saved.id,
        title: `${saved.name} Mains Exam`,
        event_type: 'exam_date',
        event_date: saved.mains_date,
        date_status: 'tentative',
        description: `Official mains examination date for ${saved.name}`,
        reminder_enabled: true
      });
    }

    if (saved.application_end_date) {
      await this.saveExamEvent({
        exam_id: saved.id,
        title: `${saved.name} Application Deadline`,
        event_type: 'application_deadline',
        event_date: saved.application_end_date,
        date_status: 'confirmed',
        description: `Last date to submit online application & application fee for ${saved.name}`,
        reminder_enabled: true
      });
    }

    if (saved.application_start_date) {
      await this.saveExamEvent({
        exam_id: saved.id,
        title: `${saved.name} Application Opening`,
        event_type: 'application_open',
        event_date: saved.application_start_date,
        date_status: 'confirmed',
        description: `Online registration begins for ${saved.name}`,
        reminder_enabled: false
      });
    }

    // Link subjects to this exam
    const subjects = await this.getSubjects();
    const reasoning = subjects.find(s => s.name.toLowerCase().includes('reasoning'));
    const quant = subjects.find(s => s.name.toLowerCase().includes('quant'));
    const english = subjects.find(s => s.name.toLowerCase().includes('english'));
    const ga = subjects.find(s => s.name.toLowerCase().includes('general') || s.name.toLowerCase().includes('current'));
    const banking = subjects.find(s => s.name.toLowerCase().includes('bank'));

    const mappings: { subId: string; stage: 'prelims' | 'mains'; order: number }[] = [];
    if (reasoning) {
      mappings.push({ subId: reasoning.id, stage: 'prelims', order: 1 });
      mappings.push({ subId: reasoning.id, stage: 'mains', order: 1 });
    }
    if (quant) {
      mappings.push({ subId: quant.id, stage: 'prelims', order: 2 });
      mappings.push({ subId: quant.id, stage: 'mains', order: 2 });
    }
    if (english) {
      mappings.push({ subId: english.id, stage: 'prelims', order: 3 });
      mappings.push({ subId: english.id, stage: 'mains', order: 3 });
    }
    if (ga) {
      mappings.push({ subId: ga.id, stage: 'mains', order: 4 });
    }
    if (banking) {
      mappings.push({ subId: banking.id, stage: 'mains', order: 5 });
    }

    const currentEs = this.getLocal<ExamSubject[]>('exam_subjects', []);
    for (const m of mappings) {
      const entry: ExamSubject = {
        id: `es-${saved.id}-${m.subId}-${m.stage}`,
        user_id: this.userId,
        exam_id: saved.id,
        subject_id: m.subId,
        stage: m.stage,
        display_order: m.order,
        created_at: new Date().toISOString()
      };
      if (this.supabaseService.isRealSupabaseConfigured) {
        await this.supabaseService.clientInstance.from('exam_subjects').upsert(entry);
      } else {
        currentEs.push(entry);
      }
    }
    if (!this.supabaseService.isRealSupabaseConfigured) {
      this.setLocal('exam_subjects', currentEs);
    }

    return saved;
  }

  async toggleExamTracking(examId: string, isActive: boolean): Promise<void> {
    if (this.supabaseService.isRealSupabaseConfigured) {
      await this.supabaseService.clientInstance
        .from('exams')
        .update({ is_active: isActive, updated_at: new Date().toISOString() })
        .eq('id', examId)
        .eq('user_id', this.userId);
      return;
    }

    const current = this.getLocal<Exam[]>('exams', []);
    const target = current.find(e => e.id === examId);
    if (target) {
      target.is_active = isActive;
      target.updated_at = new Date().toISOString();
      this.setLocal('exams', current);
    }
  }

  async deleteExam(examId: string): Promise<void> {
    if (this.supabaseService.isRealSupabaseConfigured) {
      await this.supabaseService.clientInstance
        .from('exams')
        .delete()
        .eq('id', examId)
        .eq('user_id', this.userId);
      return;
    }

    let current = this.getLocal<Exam[]>('exams', []);
    current = current.filter(e => e.id !== examId);
    this.setLocal('exams', current);
  }

  // --- SUBJECTS & STAGE MAPPING ---
  async getSubjects(): Promise<Subject[]> {
    if (this.supabaseService.isRealSupabaseConfigured) {
      const { data, error } = await this.supabaseService.clientInstance
        .from('subjects')
        .select('*')
        .eq('user_id', this.userId)
        .is('archived_at', null)
        .order('display_order', { ascending: true });
      if (!error && data) return data as Subject[];
    }
    this.ensureInitializedLocalData();
    return this.getLocal<Subject[]>('subjects', []).filter(s => !s.archived_at);
  }

  async saveSubject(subject: Partial<Subject>): Promise<Subject> {
    const newSub: Subject = {
      id: subject.id || `sub-${Date.now()}`,
      user_id: this.userId,
      name: subject.name || 'New Subject',
      color: subject.color || '#2563eb',
      display_order: subject.display_order ?? 0,
      archived_at: subject.archived_at || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (this.supabaseService.isRealSupabaseConfigured) {
      const { data } = await this.supabaseService.clientInstance
        .from('subjects')
        .upsert(newSub)
        .select()
        .single();
      if (data) return data as Subject;
    }

    const current = this.getLocal<Subject[]>('subjects', []);
    const idx = current.findIndex(s => s.id === newSub.id);
    if (idx >= 0) current[idx] = newSub;
    else current.push(newSub);
    this.setLocal('subjects', current);
    return newSub;
  }

  async getExamSubjects(): Promise<ExamSubject[]> {
    if (this.supabaseService.isRealSupabaseConfigured) {
      const { data, error } = await this.supabaseService.clientInstance
        .from('exam_subjects')
        .select('*, subject:subjects(*)')
        .eq('user_id', this.userId);
      if (!error && data) return data as ExamSubject[];
    }
    this.ensureInitializedLocalData();
    const es = this.getLocal<ExamSubject[]>('exam_subjects', []);
    const subs = this.getLocal<Subject[]>('subjects', []);
    return es.map(item => ({
      ...item,
      subject: subs.find(s => s.id === item.subject_id)
    }));
  }

  // --- TOPICS ---
  async getTopics(): Promise<Topic[]> {
    if (this.supabaseService.isRealSupabaseConfigured) {
      const { data, error } = await this.supabaseService.clientInstance
        .from('topics')
        .select('*, subject:subjects(*)')
        .eq('user_id', this.userId)
        .is('archived_at', null)
        .order('display_order', { ascending: true });
      if (!error && data) return data as Topic[];
    }
    this.ensureInitializedLocalData();
    const topics = this.getLocal<Topic[]>('topics', []).filter(t => !t.archived_at);
    const subs = this.getLocal<Subject[]>('subjects', []);
    return topics.map(t => ({
      ...t,
      subject: subs.find(s => s.id === t.subject_id)
    }));
  }

  async saveTopic(topic: Partial<Topic>): Promise<Topic> {
    const newTopic: Topic = {
      id: topic.id || `top-${Date.now()}`,
      user_id: this.userId,
      subject_id: topic.subject_id!,
      parent_topic_id: topic.parent_topic_id || null,
      name: topic.name || 'Untitled Topic',
      description: topic.description || null,
      learning_status: topic.learning_status || 'not_started',
      priority: topic.priority || 'medium',
      target_date: topic.target_date || null,
      display_order: topic.display_order ?? 0,
      archived_at: topic.archived_at || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (this.supabaseService.isRealSupabaseConfigured) {
      const { data } = await this.supabaseService.clientInstance
        .from('topics')
        .upsert(newTopic)
        .select('*, subject:subjects(*)')
        .single();
      if (data) return data as Topic;
    }

    const current = this.getLocal<Topic[]>('topics', []);
    const idx = current.findIndex(t => t.id === newTopic.id);
    if (idx >= 0) current[idx] = newTopic;
    else current.push(newTopic);
    this.setLocal('topics', current);

    const subs = this.getLocal<Subject[]>('subjects', []);
    return { ...newTopic, subject: subs.find(s => s.id === newTopic.subject_id) };
  }

  async updateTopicStatus(topicId: string, status: Topic['learning_status']): Promise<void> {
    if (this.supabaseService.isRealSupabaseConfigured) {
      await this.supabaseService.clientInstance
        .from('topics')
        .update({ learning_status: status, updated_at: new Date().toISOString() })
        .eq('id', topicId)
        .eq('user_id', this.userId);
      return;
    }

    const current = this.getLocal<Topic[]>('topics', []);
    const idx = current.findIndex(t => t.id === topicId);
    if (idx >= 0) {
      current[idx].learning_status = status;
      current[idx].updated_at = new Date().toISOString();
      this.setLocal('topics', current);
    }
  }

  async deleteTopic(topicId: string): Promise<void> {
    if (this.supabaseService.isRealSupabaseConfigured) {
      await this.supabaseService.clientInstance
        .from('topics')
        .delete()
        .eq('id', topicId)
        .eq('user_id', this.userId);
      return;
    }

    let current = this.getLocal<Topic[]>('topics', []);
    current = current.filter(t => t.id !== topicId);
    this.setLocal('topics', current);
  }

  // --- DAILY GOALS ---
  async getDailyGoal(dateStr: string): Promise<{ goal: DailyGoal | null; topics: DailyGoalTopic[] }> {
    if (this.supabaseService.isRealSupabaseConfigured) {
      const { data: goal } = await this.supabaseService.clientInstance
        .from('daily_goals')
        .select('*')
        .eq('user_id', this.userId)
        .eq('goal_date', dateStr)
        .maybeSingle();

      if (!goal) return { goal: null, topics: [] };

      const { data: goalTopics } = await this.supabaseService.clientInstance
        .from('daily_goal_topics')
        .select('*, topic:topics(*, subject:subjects(*))')
        .eq('daily_goal_id', goal.id);

      return { goal: goal as DailyGoal, topics: (goalTopics || []) as DailyGoalTopic[] };
    }

    this.ensureInitializedLocalData();
    const goals = this.getLocal<DailyGoal[]>('daily_goals', []);
    const goal = goals.find(g => g.goal_date === dateStr) || null;
    if (!goal) return { goal: null, topics: [] };

    const allGoalTopics = this.getLocal<DailyGoalTopic[]>('daily_goal_topics', []);
    const allTopics = await this.getTopics();
    const matched = allGoalTopics
      .filter(gt => gt.daily_goal_id === goal.id)
      .map(gt => ({
        ...gt,
        topic: allTopics.find(t => t.id === gt.topic_id)
      }));

    return { goal, topics: matched };
  }

  async saveDailyGoal(goalDate: string, targetTopics: number, targetMinutes: number, notes?: string): Promise<DailyGoal> {
    const existing = await this.getDailyGoal(goalDate);
    const goalId = existing.goal?.id || `dg-${goalDate}-${Date.now()}`;
    const newGoal: DailyGoal = {
      id: goalId,
      user_id: this.userId,
      goal_date: goalDate,
      target_topic_count: targetTopics,
      target_study_minutes: targetMinutes,
      notes: notes || null,
      created_at: existing.goal?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (this.supabaseService.isRealSupabaseConfigured) {
      const { data } = await this.supabaseService.clientInstance
        .from('daily_goals')
        .upsert(newGoal)
        .select()
        .single();
      if (data) return data as DailyGoal;
    }

    const current = this.getLocal<DailyGoal[]>('daily_goals', []);
    const idx = current.findIndex(g => g.goal_date === goalDate);
    if (idx >= 0) current[idx] = newGoal;
    else current.push(newGoal);
    this.setLocal('daily_goals', current);
    return newGoal;
  }

  async addTopicToDailyGoal(dailyGoalId: string, topicId: string): Promise<void> {
    const newEntry: DailyGoalTopic = {
      id: `dgt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      user_id: this.userId,
      daily_goal_id: dailyGoalId,
      topic_id: topicId,
      is_completed: false,
      created_at: new Date().toISOString()
    };

    if (this.supabaseService.isRealSupabaseConfigured) {
      await this.supabaseService.clientInstance
        .from('daily_goal_topics')
        .insert(newEntry);
      return;
    }

    const current = this.getLocal<DailyGoalTopic[]>('daily_goal_topics', []);
    if (!current.some(gt => gt.daily_goal_id === dailyGoalId && gt.topic_id === topicId)) {
      current.push(newEntry);
      this.setLocal('daily_goal_topics', current);
    }
  }

  async toggleGoalTopicCompletion(dailyGoalTopicId: string, isCompleted: boolean): Promise<void> {
    if (this.supabaseService.isRealSupabaseConfigured) {
      await this.supabaseService.clientInstance
        .from('daily_goal_topics')
        .update({
          is_completed: isCompleted,
          completed_at: isCompleted ? new Date().toISOString() : null
        })
        .eq('id', dailyGoalTopicId)
        .eq('user_id', this.userId);
      return;
    }

    const current = this.getLocal<DailyGoalTopic[]>('daily_goal_topics', []);
    const item = current.find(gt => gt.id === dailyGoalTopicId);
    if (item) {
      item.is_completed = isCompleted;
      item.completed_at = isCompleted ? new Date().toISOString() : null;
      this.setLocal('daily_goal_topics', current);
    }
  }

  async removeTopicFromDailyGoal(dailyGoalTopicId: string): Promise<void> {
    if (this.supabaseService.isRealSupabaseConfigured) {
      await this.supabaseService.clientInstance
        .from('daily_goal_topics')
        .delete()
        .eq('id', dailyGoalTopicId)
        .eq('user_id', this.userId);
      return;
    }

    let current = this.getLocal<DailyGoalTopic[]>('daily_goal_topics', []);
    current = current.filter(gt => gt.id !== dailyGoalTopicId);
    this.setLocal('daily_goal_topics', current);
  }

  // --- STUDY SESSIONS ---
  async getStudySessions(): Promise<StudySession[]> {
    if (this.supabaseService.isRealSupabaseConfigured) {
      const { data, error } = await this.supabaseService.clientInstance
        .from('study_sessions')
        .select('*, subject:subjects(*), topic:topics(*)')
        .eq('user_id', this.userId)
        .order('started_at', { ascending: false });
      if (!error && data) return data as StudySession[];
    }
    this.ensureInitializedLocalData();
    const sessions = this.getLocal<StudySession[]>('study_sessions', []);
    const subs = await this.getSubjects();
    const topics = await this.getTopics();
    return sessions.map(s => ({
      ...s,
      subject: subs.find(sub => sub.id === s.subject_id),
      topic: topics.find(t => t.id === s.topic_id)
    }));
  }

  async saveStudySession(session: Partial<StudySession>): Promise<StudySession> {
    const newSession: StudySession = {
      id: session.id || `sess-${Date.now()}`,
      user_id: this.userId,
      subject_id: session.subject_id!,
      topic_id: session.topic_id || null,
      started_at: session.started_at || new Date().toISOString(),
      ended_at: session.ended_at || new Date().toISOString(),
      duration_seconds: session.duration_seconds || 0,
      notes: session.notes || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (this.supabaseService.isRealSupabaseConfigured) {
      const { data } = await this.supabaseService.clientInstance
        .from('study_sessions')
        .insert(newSession)
        .select('*, subject:subjects(*), topic:topics(*)')
        .single();
      if (data) return data as StudySession;
    }

    const current = this.getLocal<StudySession[]>('study_sessions', []);
    current.unshift(newSession);
    this.setLocal('study_sessions', current);
    const subs = await this.getSubjects();
    const topics = await this.getTopics();
    return {
      ...newSession,
      subject: subs.find(sub => sub.id === newSession.subject_id),
      topic: topics.find(t => t.id === newSession.topic_id)
    };
  }

  async deleteStudySession(sessionId: string): Promise<void> {
    if (this.supabaseService.isRealSupabaseConfigured) {
      await this.supabaseService.clientInstance
        .from('study_sessions')
        .delete()
        .eq('id', sessionId)
        .eq('user_id', this.userId);
      return;
    }

    let current = this.getLocal<StudySession[]>('study_sessions', []);
    current = current.filter(s => s.id !== sessionId);
    this.setLocal('study_sessions', current);
  }

  // --- MOCK EXAMS ---
  async getMockExams(): Promise<MockExam[]> {
    if (this.supabaseService.isRealSupabaseConfigured) {
      const { data, error } = await this.supabaseService.clientInstance
        .from('mock_exams')
        .select('*, exam:exams(*), subject_scores:mock_exam_subject_scores(*, subject:subjects(*))')
        .eq('user_id', this.userId)
        .order('attended_at', { ascending: false });
      if (!error && data) return data as MockExam[];
    }
    this.ensureInitializedLocalData();
    const exams = await this.getExams();
    const mocks = this.getLocal<MockExam[]>('mock_exams', []);
    return mocks.map(m => ({
      ...m,
      exam: exams.find(e => e.id === m.exam_id)
    }));
  }

  async saveMockExam(mock: Partial<MockExam>): Promise<MockExam> {
    const newMock: MockExam = {
      id: mock.id || `mock-${Date.now()}`,
      user_id: this.userId,
      exam_id: mock.exam_id || null,
      name: mock.name || 'Mock Test',
      exam_stage: mock.exam_stage || 'prelims',
      attended_at: mock.attended_at || new Date().toISOString().split('T')[0],
      marks_obtained: Number(mock.marks_obtained),
      maximum_marks: Number(mock.maximum_marks),
      duration_seconds: mock.duration_seconds || null,
      total_questions: mock.total_questions || null,
      attempted_questions: mock.attempted_questions || null,
      correct_answers: mock.correct_answers || null,
      weak_areas: mock.weak_areas || null,
      notes: mock.notes || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (this.supabaseService.isRealSupabaseConfigured) {
      const { data } = await this.supabaseService.clientInstance
        .from('mock_exams')
        .upsert(newMock)
        .select('*, exam:exams(*)')
        .single();
      if (data) return data as MockExam;
    }

    const current = this.getLocal<MockExam[]>('mock_exams', []);
    const idx = current.findIndex(m => m.id === newMock.id);
    if (idx >= 0) current[idx] = newMock;
    else current.unshift(newMock);
    this.setLocal('mock_exams', current);
    const exams = await this.getExams();
    return { ...newMock, exam: exams.find(e => e.id === newMock.exam_id) };
  }

  async deleteMockExam(mockId: string): Promise<void> {
    if (this.supabaseService.isRealSupabaseConfigured) {
      await this.supabaseService.clientInstance
        .from('mock_exams')
        .delete()
        .eq('id', mockId)
        .eq('user_id', this.userId);
      return;
    }

    let current = this.getLocal<MockExam[]>('mock_exams', []);
    current = current.filter(m => m.id !== mockId);
    this.setLocal('mock_exams', current);
  }

  // --- EXAM CALENDAR EVENTS ---
  async getExamEvents(): Promise<ExamEvent[]> {
    if (this.supabaseService.isRealSupabaseConfigured) {
      const { data, error } = await this.supabaseService.clientInstance
        .from('exam_events')
        .select('*, exam:exams(*)')
        .eq('user_id', this.userId)
        .order('event_date', { ascending: true });
      if (!error && data) return data as ExamEvent[];
    }
    this.ensureInitializedLocalData();
    const events = this.getLocal<ExamEvent[]>('exam_events', []);
    const exams = await this.getExams();
    return events.map(ev => ({
      ...ev,
      exam: exams.find(e => e.id === ev.exam_id)
    })).sort((a, b) => a.event_date.localeCompare(b.event_date));
  }

  async saveExamEvent(event: Partial<ExamEvent>): Promise<ExamEvent> {
    const newEvent: ExamEvent = {
      id: event.id || `ev-${Date.now()}`,
      user_id: this.userId,
      exam_id: event.exam_id || null,
      title: event.title || 'Exam Event',
      event_type: event.event_type || 'exam_date',
      event_date: event.event_date || new Date().toISOString().split('T')[0],
      date_status: event.date_status || 'tentative',
      description: event.description || null,
      reminder_enabled: event.reminder_enabled ?? false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (this.supabaseService.isRealSupabaseConfigured) {
      const { data } = await this.supabaseService.clientInstance
        .from('exam_events')
        .upsert(newEvent)
        .select('*, exam:exams(*)')
        .single();
      if (data) return data as ExamEvent;
    }

    const current = this.getLocal<ExamEvent[]>('exam_events', []);
    const idx = current.findIndex(e => e.id === newEvent.id);
    if (idx >= 0) current[idx] = newEvent;
    else current.push(newEvent);
    this.setLocal('exam_events', current);
    const exams = await this.getExams();
    return { ...newEvent, exam: exams.find(e => e.id === newEvent.exam_id) };
  }

  async deleteExamEvent(eventId: string): Promise<void> {
    if (this.supabaseService.isRealSupabaseConfigured) {
      await this.supabaseService.clientInstance
        .from('exam_events')
        .delete()
        .eq('id', eventId)
        .eq('user_id', this.userId);
      return;
    }

    let current = this.getLocal<ExamEvent[]>('exam_events', []);
    current = current.filter(e => e.id !== eventId);
    this.setLocal('exam_events', current);
  }
}
