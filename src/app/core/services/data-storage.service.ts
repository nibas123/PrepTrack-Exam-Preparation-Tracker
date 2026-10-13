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
  QuestionPattern,
  MockExamBlueprint,
  MockExamAttempt,
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

  private async ensureUserId(): Promise<string> {
    if (this.userId) return this.userId;
    if (this.supabaseService.isRealSupabaseConfigured) {
      try {
        await this.authService.waitForAuthInit();
        if (this.userId) return this.userId;
        const { data: { session } } = await this.supabaseService.clientInstance.auth.getSession();
        if (session?.user?.id) return session.user.id;
      } catch {}
    }
    return this.userId;
  }

  private isValidUuid(val?: string | null): boolean {
    if (!val) return false;
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val);
  }

  private generateUuid(): string {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
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
    const existingSubs = this.getLocal<Subject[]>('subjects', []);
    if (existingSubs && existingSubs.length > 0 && this.isValidUuid(existingSubs[0].id)) return;

    const subReasId = '11111111-1111-4111-8111-111111111101';
    const subQuantId = '11111111-1111-4111-8111-111111111102';
    const subEngId = '11111111-1111-4111-8111-111111111103';
    const subGaId = '11111111-1111-4111-8111-111111111104';
    const subCompId = '11111111-1111-4111-8111-111111111105';

    const defaultSubjects: Subject[] = [
      { id: subReasId, user_id: this.userId, name: 'Reasoning Ability', color: '#2563eb', display_order: 1 },
      { id: subQuantId, user_id: this.userId, name: 'Quantitative Aptitude', color: '#0891b2', display_order: 2 },
      { id: subEngId, user_id: this.userId, name: 'English Language', color: '#7c3aed', display_order: 3 },
      { id: subGaId, user_id: this.userId, name: 'General & Banking Awareness', color: '#d97706', display_order: 4 },
      { id: subCompId, user_id: this.userId, name: 'Computer Aptitude', color: '#059669', display_order: 5 }
    ];

    const defaultTopics: Topic[] = [
      // Reasoning
      { id: '22222222-2222-4222-8222-222222222201', user_id: this.userId, subject_id: subReasId, name: 'Puzzles & Seating Arrangement', priority: 'high', learning_status: 'not_started', display_order: 1 },
      { id: '22222222-2222-4222-8222-222222222202', user_id: this.userId, subject_id: subReasId, name: 'Syllogisms', priority: 'high', learning_status: 'not_started', display_order: 2 },
      { id: '22222222-2222-4222-8222-222222222203', user_id: this.userId, subject_id: subReasId, name: 'Inequalities', priority: 'medium', learning_status: 'not_started', display_order: 3 },
      { id: '22222222-2222-4222-8222-222222222204', user_id: this.userId, subject_id: subReasId, name: 'Blood Relations', priority: 'medium', learning_status: 'not_started', display_order: 4 },
      { id: '22222222-2222-4222-8222-222222222205', user_id: this.userId, subject_id: subReasId, name: 'Direction & Distance', priority: 'medium', learning_status: 'not_started', display_order: 5 },
      { id: '22222222-2222-4222-8222-222222222206', user_id: this.userId, subject_id: subReasId, name: 'Coding & Decoding', priority: 'medium', learning_status: 'not_started', display_order: 6 },
      { id: '22222222-2222-4222-8222-222222222207', user_id: this.userId, subject_id: subReasId, name: 'Alphanumeric Series', priority: 'low', learning_status: 'not_started', display_order: 7 },
      { id: '22222222-2222-4222-8222-222222222208', user_id: this.userId, subject_id: subReasId, name: 'Machine Input-Output', priority: 'high', learning_status: 'not_started', display_order: 8 },
      // Quant
      { id: '22222222-2222-4222-8222-222222222209', user_id: this.userId, subject_id: subQuantId, name: 'Simplification & Approximation', priority: 'high', learning_status: 'not_started', display_order: 1 },
      { id: '22222222-2222-4222-8222-222222222210', user_id: this.userId, subject_id: subQuantId, name: 'Number Series (Missing & Wrong)', priority: 'high', learning_status: 'not_started', display_order: 2 },
      { id: '22222222-2222-4222-8222-222222222211', user_id: this.userId, subject_id: subQuantId, name: 'Quadratic Equations', priority: 'high', learning_status: 'not_started', display_order: 3 },
      { id: '22222222-2222-4222-8222-222222222212', user_id: this.userId, subject_id: subQuantId, name: 'Data Interpretation (Table, Bar, Pie)', priority: 'high', learning_status: 'not_started', display_order: 4 },
      { id: '22222222-2222-4222-8222-222222222213', user_id: this.userId, subject_id: subQuantId, name: 'Profit & Loss, Discount', priority: 'high', learning_status: 'not_started', display_order: 5 },
      { id: '22222222-2222-4222-8222-222222222214', user_id: this.userId, subject_id: subQuantId, name: 'Simple & Compound Interest', priority: 'medium', learning_status: 'not_started', display_order: 6 },
      { id: '22222222-2222-4222-8222-222222222215', user_id: this.userId, subject_id: subQuantId, name: 'Time, Speed & Distance / Trains', priority: 'high', learning_status: 'not_started', display_order: 7 },
      { id: '22222222-2222-4222-8222-222222222216', user_id: this.userId, subject_id: subQuantId, name: 'Time & Work / Pipes & Cisterns', priority: 'high', learning_status: 'not_started', display_order: 8 },
      { id: '22222222-2222-4222-8222-222222222217', user_id: this.userId, subject_id: subQuantId, name: 'Mixtures & Alligation', priority: 'medium', learning_status: 'not_started', display_order: 9 },
      { id: '22222222-2222-4222-8222-222222222218', user_id: this.userId, subject_id: subQuantId, name: 'Ratio, Proportion & Ages', priority: 'medium', learning_status: 'not_started', display_order: 10 },
      // English
      { id: '22222222-2222-4222-8222-222222222219', user_id: this.userId, subject_id: subEngId, name: 'Reading Comprehension', priority: 'high', learning_status: 'not_started', display_order: 1 },
      { id: '22222222-2222-4222-8222-222222222220', user_id: this.userId, subject_id: subEngId, name: 'Error Spotting & Grammar', priority: 'high', learning_status: 'not_started', display_order: 2 },
      { id: '22222222-2222-4222-8222-222222222221', user_id: this.userId, subject_id: subEngId, name: 'Cloze Test', priority: 'high', learning_status: 'not_started', display_order: 3 },
      { id: '22222222-2222-4222-8222-222222222222', user_id: this.userId, subject_id: subEngId, name: 'Para Jumbles', priority: 'high', learning_status: 'not_started', display_order: 4 },
      { id: '22222222-2222-4222-8222-222222222223', user_id: this.userId, subject_id: subEngId, name: 'Double Fillers', priority: 'medium', learning_status: 'not_started', display_order: 5 },
      { id: '22222222-2222-4222-8222-222222222224', user_id: this.userId, subject_id: subEngId, name: 'Sentence Improvement', priority: 'medium', learning_status: 'not_started', display_order: 6 },
      // GA
      { id: '22222222-2222-4222-8222-222222222225', user_id: this.userId, subject_id: subGaId, name: 'Banking & Financial Awareness', priority: 'high', learning_status: 'not_started', display_order: 1 },
      { id: '22222222-2222-4222-8222-222222222226', user_id: this.userId, subject_id: subGaId, name: 'RBI Monetary Policy & Inflation', priority: 'high', learning_status: 'not_started', display_order: 2 },
      { id: '22222222-2222-4222-8222-222222222227', user_id: this.userId, subject_id: subGaId, name: 'Current Affairs (National & International)', priority: 'high', learning_status: 'not_started', display_order: 3 },
      { id: '22222222-2222-4222-8222-222222222228', user_id: this.userId, subject_id: subGaId, name: 'Static Banking & Economy', priority: 'medium', learning_status: 'not_started', display_order: 4 },
      // Computer
      { id: '22222222-2222-4222-8222-222222222229', user_id: this.userId, subject_id: subCompId, name: 'Computer Hardware & Memory', priority: 'medium', learning_status: 'not_started', display_order: 1 },
      { id: '22222222-2222-4222-8222-222222222230', user_id: this.userId, subject_id: subCompId, name: 'Networking & Cyber Security', priority: 'medium', learning_status: 'not_started', display_order: 2 },
      { id: '22222222-2222-4222-8222-222222222231', user_id: this.userId, subject_id: subCompId, name: 'Keyboard Shortcuts & MS Office', priority: 'high', learning_status: 'not_started', display_order: 3 }
    ];

    const defaultExams: Exam[] = [
      { id: '33333333-3333-4333-8333-333333333301', user_id: this.userId, name: 'IBPS PO 2026', description: 'Probationary Officer exam by IBPS', is_active: true, display_order: 1 },
      { id: '33333333-3333-4333-8333-333333333302', user_id: this.userId, name: 'SBI PO 2026', description: 'Probationary Officer exam by State Bank of India', is_active: true, display_order: 2 },
      { id: '33333333-3333-4333-8333-333333333303', user_id: this.userId, name: 'IBPS Clerk 2026', description: 'Clerical Cadre recruitment exam', is_active: true, display_order: 3 }
    ];

    this.setLocal('exams', defaultExams);
    this.setLocal('subjects', defaultSubjects);
    this.setLocal('topics', defaultTopics);
    if (!this.getLocal('initialized', false)) {
      this.setLocal('daily_goals', []);
      this.setLocal('daily_goal_topics', []);
      this.setLocal('study_sessions', []);
      this.setLocal('mock_exams', []);
      this.setLocal('exam_events', []);
      this.setLocal('initialized', true);
    }
  }

  public async seedUserSyllabusInDatabase(userId: string): Promise<void> {
    if (!this.supabaseService.isRealSupabaseConfigured || !userId) return;

    try {
      // Ensure user profile row exists so foreign key constraints on user_id never fail
      await this.supabaseService.clientInstance
        .from('profiles')
        .upsert({ id: userId, timezone: 'Asia/Kolkata' }, { onConflict: 'id', ignoreDuplicates: true });

      // Check if user already has subjects
      const { data: existingSubs } = await this.supabaseService.clientInstance
        .from('subjects')
        .select('*')
        .eq('user_id', userId);

      if (!existingSubs || existingSubs.length === 0) {
        // Try RPC first
        await this.supabaseService.clientInstance.rpc('seed_user_bank_exam_data', { p_user_id: userId });
      }

      // Re-check subjects after RPC
      let { data: subs } = await this.supabaseService.clientInstance
        .from('subjects')
        .select('*')
        .eq('user_id', userId);

      if (!subs || subs.length === 0) {
        // Fallback client-side insert with valid UUIDs
        const newSubjects = [
          { id: this.generateUuid(), user_id: userId, name: 'Reasoning Ability', color: '#2563eb', display_order: 1 },
          { id: this.generateUuid(), user_id: userId, name: 'Quantitative Aptitude', color: '#0891b2', display_order: 2 },
          { id: this.generateUuid(), user_id: userId, name: 'English Language', color: '#7c3aed', display_order: 3 },
          { id: this.generateUuid(), user_id: userId, name: 'General & Banking Awareness', color: '#d97706', display_order: 4 },
          { id: this.generateUuid(), user_id: userId, name: 'Computer Aptitude', color: '#059669', display_order: 5 },
        ];
        const { data: insertedSubs } = await this.supabaseService.clientInstance
          .from('subjects')
          .insert(newSubjects)
          .select('*');
        subs = insertedSubs || newSubjects;
      }

      // Check if topics exist for this user in Supabase
      const { count: topicCount } = await this.supabaseService.clientInstance
        .from('topics')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      if ((!topicCount || topicCount === 0) && subs && subs.length > 0) {
        const findSubId = (keyword: string) =>
          subs!.find(s => s.name.toLowerCase().includes(keyword))?.id || subs![0].id;

        const rId = findSubId('reason');
        const qId = findSubId('quant');
        const eId = findSubId('english');
        const gId = findSubId('general') || findSubId('bank');
        const cId = findSubId('comp');

        const seedTopics = [
          { user_id: userId, subject_id: rId, name: 'Puzzles & Seating Arrangement', priority: 'high', learning_status: 'not_started', display_order: 1 },
          { user_id: userId, subject_id: rId, name: 'Syllogisms', priority: 'high', learning_status: 'not_started', display_order: 2 },
          { user_id: userId, subject_id: rId, name: 'Inequalities', priority: 'medium', learning_status: 'not_started', display_order: 3 },
          { user_id: userId, subject_id: rId, name: 'Blood Relations', priority: 'medium', learning_status: 'not_started', display_order: 4 },
          { user_id: userId, subject_id: rId, name: 'Direction & Distance', priority: 'medium', learning_status: 'not_started', display_order: 5 },
          { user_id: userId, subject_id: rId, name: 'Coding & Decoding', priority: 'medium', learning_status: 'not_started', display_order: 6 },
          { user_id: userId, subject_id: qId, name: 'Simplification & Approximation', priority: 'high', learning_status: 'not_started', display_order: 1 },
          { user_id: userId, subject_id: qId, name: 'Number Series (Missing & Wrong)', priority: 'high', learning_status: 'not_started', display_order: 2 },
          { user_id: userId, subject_id: qId, name: 'Quadratic Equations', priority: 'high', learning_status: 'not_started', display_order: 3 },
          { user_id: userId, subject_id: qId, name: 'Data Interpretation (Table, Bar, Pie)', priority: 'high', learning_status: 'not_started', display_order: 4 },
          { user_id: userId, subject_id: qId, name: 'Profit & Loss, Discount', priority: 'high', learning_status: 'not_started', display_order: 5 },
          { user_id: userId, subject_id: qId, name: 'Time & Work / Pipes & Cisterns', priority: 'high', learning_status: 'not_started', display_order: 6 },
          { user_id: userId, subject_id: eId, name: 'Reading Comprehension', priority: 'high', learning_status: 'not_started', display_order: 1 },
          { user_id: userId, subject_id: eId, name: 'Error Spotting & Grammar', priority: 'high', learning_status: 'not_started', display_order: 2 },
          { user_id: userId, subject_id: eId, name: 'Cloze Test', priority: 'high', learning_status: 'not_started', display_order: 3 },
          { user_id: userId, subject_id: eId, name: 'Para Jumbles', priority: 'high', learning_status: 'not_started', display_order: 4 },
          { user_id: userId, subject_id: gId, name: 'Banking & Financial Awareness', priority: 'high', learning_status: 'not_started', display_order: 1 },
          { user_id: userId, subject_id: gId, name: 'Current Affairs (National & International)', priority: 'high', learning_status: 'not_started', display_order: 2 },
          { user_id: userId, subject_id: cId, name: 'Computer Hardware & Networking', priority: 'medium', learning_status: 'not_started', display_order: 1 },
        ];
        await this.supabaseService.clientInstance.from('topics').insert(seedTopics);
      }
    } catch (e) {
      console.error('Failed to seed user database:', e);
    }
  }


  // --- EXAMS ---
  async getExams(): Promise<Exam[]> {
    const uid = await this.ensureUserId();
    if (this.supabaseService.isRealSupabaseConfigured && uid) {
      const { data, error } = await this.supabaseService.clientInstance
        .from('exams')
        .select('*')
        .eq('user_id', uid)
        .order('display_order', { ascending: true });
      if (!error && data) return data as Exam[];
    }
    this.ensureInitializedLocalData();
    return this.getLocal<Exam[]>('exams', []);
  }

  async saveExam(exam: Partial<Exam>): Promise<Exam> {
    const uid = await this.ensureUserId();
    const newExam: Exam = {
      id: this.isValidUuid(exam.id) ? exam.id! : this.generateUuid(),
      user_id: uid,
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

    if (this.supabaseService.isRealSupabaseConfigured && uid) {
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
    const uid = await this.ensureUserId();
    if (this.supabaseService.isRealSupabaseConfigured && uid) {
      try {
        let { data, error } = await this.supabaseService.clientInstance
          .from('subjects')
          .select('*')
          .eq('user_id', uid)
          .is('archived_at', null)
          .order('display_order', { ascending: true });

        if (!error && (!data || data.length === 0)) {
          await this.seedUserSyllabusInDatabase(uid);
          const retry = await this.supabaseService.clientInstance
            .from('subjects')
            .select('*')
            .eq('user_id', uid)
            .is('archived_at', null)
            .order('display_order', { ascending: true });
          data = retry.data;
          error = retry.error;
        }

        if (!error && data && data.length > 0) {
          this.setLocal('subjects', data);
          return data as Subject[];
        }
      } catch (err) {
        console.warn('Network issue fetching subjects, using local cache:', err);
      }
    }
    this.ensureInitializedLocalData();
    return this.getLocal<Subject[]>('subjects', []).filter(s => !s.archived_at);
  }

  async saveSubject(subject: Partial<Subject>): Promise<Subject> {
    const uid = await this.ensureUserId();
    const newSub: Subject = {
      id: this.isValidUuid(subject.id) ? subject.id! : this.generateUuid(),
      user_id: uid,
      name: subject.name || 'New Subject',
      color: subject.color || '#2563eb',
      display_order: subject.display_order ?? 0,
      archived_at: subject.archived_at || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const current = this.getLocal<Subject[]>('subjects', []);
    const idx = current.findIndex(s => s.id === newSub.id);
    if (idx >= 0) current[idx] = newSub;
    else current.push(newSub);
    this.setLocal('subjects', current);

    if (this.supabaseService.isRealSupabaseConfigured && uid) {
      try {
        const { data } = await this.supabaseService.clientInstance
          .from('subjects')
          .upsert(newSub)
          .select()
          .single();
        if (data) {
          this.setLocal('subjects', current);
          return data as Subject;
        }
      } catch (err) {
        console.warn('Offline: saved subject locally:', err);
      }
    }

    return newSub;
  }

  async getExamSubjects(): Promise<ExamSubject[]> {
    const uid = await this.ensureUserId();
    if (this.supabaseService.isRealSupabaseConfigured && uid) {
      try {
        const { data, error } = await this.supabaseService.clientInstance
          .from('exam_subjects')
          .select('*, subject:subjects(*)')
          .eq('user_id', uid);
        if (!error && data && data.length > 0) {
          this.setLocal('exam_subjects', data);
          return data as ExamSubject[];
        }
      } catch (err) {
        console.warn('Network issue fetching exam subjects, using local cache:', err);
      }
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
    const uid = await this.ensureUserId();
    if (this.supabaseService.isRealSupabaseConfigured && uid) {
      try {
        let { data, error } = await this.supabaseService.clientInstance
          .from('topics')
          .select('*, subject:subjects(*)')
          .eq('user_id', uid)
          .is('archived_at', null)
          .order('display_order', { ascending: true });

        if (!error && (!data || data.length === 0)) {
          await this.seedUserSyllabusInDatabase(uid);
          const retry = await this.supabaseService.clientInstance
            .from('topics')
            .select('*, subject:subjects(*)')
            .eq('user_id', uid)
            .is('archived_at', null)
            .order('display_order', { ascending: true });
          data = retry.data;
          error = retry.error;
        }

        if (!error && data && data.length > 0) {
          this.setLocal('topics', data);
          return data as Topic[];
        }
      } catch (err) {
        console.warn('Network issue fetching topics, using local cache:', err);
      }
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
    const uid = await this.ensureUserId();
    const newTopic: Topic = {
      id: this.isValidUuid(topic.id) ? topic.id! : this.generateUuid(),
      user_id: uid,
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

    const current = this.getLocal<Topic[]>('topics', []);
    const idx = current.findIndex(t => t.id === newTopic.id);
    if (idx >= 0) current[idx] = newTopic;
    else current.push(newTopic);
    this.setLocal('topics', current);

    if (this.supabaseService.isRealSupabaseConfigured && uid) {
      try {
        const { data } = await this.supabaseService.clientInstance
          .from('topics')
          .upsert(newTopic)
          .select('*, subject:subjects(*)')
          .single();
        if (data) return data as Topic;
      } catch (err) {
        console.warn('Offline: saved topic locally:', err);
      }
    }

    const subs = this.getLocal<Subject[]>('subjects', []);
    return { ...newTopic, subject: subs.find(s => s.id === newTopic.subject_id) };
  }

  async updateTopicStatus(topicId: string, status: Topic['learning_status']): Promise<void> {
    const uid = await this.ensureUserId();
    const current = this.getLocal<Topic[]>('topics', []);
    const idx = current.findIndex(t => t.id === topicId);
    if (idx >= 0) {
      current[idx].learning_status = status;
      current[idx].updated_at = new Date().toISOString();
      this.setLocal('topics', current);
    }

    if (this.supabaseService.isRealSupabaseConfigured && uid) {
      try {
        await this.supabaseService.clientInstance
          .from('topics')
          .update({ learning_status: status, updated_at: new Date().toISOString() })
          .eq('id', topicId)
          .eq('user_id', uid);
      } catch (err) {
        console.warn('Offline: status updated in local storage, sync queued:', err);
      }
    }
  }

  async deleteTopic(topicId: string): Promise<void> {
    const uid = await this.ensureUserId();
    let current = this.getLocal<Topic[]>('topics', []);
    current = current.filter(t => t.id !== topicId);
    this.setLocal('topics', current);

    if (this.supabaseService.isRealSupabaseConfigured && uid) {
      try {
        await this.supabaseService.clientInstance
          .from('topics')
          .delete()
          .eq('id', topicId)
          .eq('user_id', uid);
      } catch (err) {
        console.warn('Offline: deleted topic locally:', err);
      }
    }
  }

  // --- DAILY GOALS ---
  async getDailyGoal(dateStr: string): Promise<{ goal: DailyGoal | null; topics: DailyGoalTopic[] }> {
    const uid = await this.ensureUserId();
    if (this.supabaseService.isRealSupabaseConfigured && uid) {
      const { data: goal } = await this.supabaseService.clientInstance
        .from('daily_goals')
        .select('*')
        .eq('user_id', uid)
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
    const uid = await this.ensureUserId();
    const existing = await this.getDailyGoal(goalDate);
    const goalId = this.isValidUuid(existing.goal?.id) ? existing.goal!.id : this.generateUuid();
    const newGoal: DailyGoal = {
      id: goalId,
      user_id: uid,
      goal_date: goalDate,
      target_topic_count: targetTopics,
      target_study_minutes: targetMinutes,
      notes: notes || null,
      created_at: existing.goal?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (this.supabaseService.isRealSupabaseConfigured && uid) {
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
    const uid = await this.ensureUserId();
    const newEntry: DailyGoalTopic = {
      id: this.generateUuid(),
      user_id: uid,
      daily_goal_id: dailyGoalId,
      topic_id: topicId,
      is_completed: false,
      created_at: new Date().toISOString()
    };

    if (this.supabaseService.isRealSupabaseConfigured && uid) {
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
    const uid = await this.ensureUserId();
    if (this.supabaseService.isRealSupabaseConfigured && uid) {
      await this.supabaseService.clientInstance
        .from('daily_goal_topics')
        .update({
          is_completed: isCompleted,
          completed_at: isCompleted ? new Date().toISOString() : null
        })
        .eq('id', dailyGoalTopicId)
        .eq('user_id', uid);
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
    const uid = await this.ensureUserId();
    if (this.supabaseService.isRealSupabaseConfigured && uid) {
      await this.supabaseService.clientInstance
        .from('daily_goal_topics')
        .delete()
        .eq('id', dailyGoalTopicId)
        .eq('user_id', uid);
      return;
    }

    let current = this.getLocal<DailyGoalTopic[]>('daily_goal_topics', []);
    current = current.filter(gt => gt.id !== dailyGoalTopicId);
    this.setLocal('daily_goal_topics', current);
  }

  // --- STUDY SESSIONS ---
  async getStudySessions(): Promise<StudySession[]> {
    const uid = await this.ensureUserId();
    if (this.supabaseService.isRealSupabaseConfigured && uid) {
      try {
        const { data, error } = await this.supabaseService.clientInstance
          .from('study_sessions')
          .select('*, subject:subjects(*), topic:topics(*)')
          .eq('user_id', uid)
          .order('started_at', { ascending: false });

        if (!error && data) {
          const remoteSessions = data as StudySession[];
          const localSessions = this.getLocal<StudySession[]>('study_sessions', []);

          // Sync any local sessions that were not yet persisted to Supabase (e.g. non-UUID or offline sessions)
          const unsynced = localSessions.filter(
            ls => !remoteSessions.some(rs => rs.id === ls.id || rs.started_at === ls.started_at)
          );

          if (unsynced.length > 0) {
            for (const pending of unsynced) {
              try {
                const synced = await this.syncSingleSessionToSupabase(uid, pending);
                if (synced) {
                  remoteSessions.unshift(synced);
                } else {
                  remoteSessions.unshift(pending);
                }
              } catch {
                remoteSessions.unshift(pending);
              }
            }
            remoteSessions.sort((a, b) => new Date(b.started_at).getTime() - new Date(a.started_at).getTime());
          }

          this.setLocal('study_sessions', remoteSessions);
          return remoteSessions;
        }
      } catch (err) {
        console.warn('Network issue fetching study sessions, using local cache:', err);
      }
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

  private async resolveSubjectAndTopicForDb(
    uid: string,
    subjectId: string,
    topicId: string | null
  ): Promise<{ subjectId: string; topicId: string | null }> {
    const subs = await this.getSubjects();
    let resolvedSubject = subs.find(s => s.id === subjectId && this.isValidUuid(s.id));

    if (!resolvedSubject && subs.length > 0) {
      const lower = (subjectId || '').toLowerCase();
      if (lower.includes('reason') || lower.endsWith('01')) {
        resolvedSubject = subs.find(s => s.name.toLowerCase().includes('reason'));
      } else if (lower.includes('quant') || lower.endsWith('02')) {
        resolvedSubject = subs.find(s => s.name.toLowerCase().includes('quant'));
      } else if (lower.includes('eng') || lower.endsWith('03')) {
        resolvedSubject = subs.find(s => s.name.toLowerCase().includes('eng'));
      } else if (lower.includes('ga') || lower.includes('general') || lower.endsWith('04')) {
        resolvedSubject = subs.find(s => s.name.toLowerCase().includes('general') || s.name.toLowerCase().includes('bank'));
      } else if (lower.includes('comp') || lower.endsWith('05')) {
        resolvedSubject = subs.find(s => s.name.toLowerCase().includes('comp'));
      }
      if (!resolvedSubject) {
        resolvedSubject = subs[0];
      }
    }

    const finalSubId = resolvedSubject?.id || subjectId;
    let finalTopId: string | null = null;

    if (topicId) {
      const topics = await this.getTopics();
      const matchedTopic = topics.find(t => t.id === topicId && this.isValidUuid(t.id));
      if (matchedTopic) {
        finalTopId = matchedTopic.id;
      }
    }

    return { subjectId: finalSubId, topicId: finalTopId };
  }

  private async syncSingleSessionToSupabase(uid: string, session: StudySession): Promise<StudySession | null> {
    const { subjectId, topicId } = await this.resolveSubjectAndTopicForDb(uid, session.subject_id, session.topic_id || null);
    if (!this.isValidUuid(subjectId)) return null;

    const cleanId = this.isValidUuid(session.id) ? session.id : this.generateUuid();
    const dbRow = {
      id: cleanId,
      user_id: uid,
      subject_id: subjectId,
      topic_id: topicId,
      started_at: session.started_at,
      ended_at: session.ended_at,
      duration_seconds: Math.max(1, Math.round(Number(session.duration_seconds) || 0)),
      notes: session.notes || null,
      created_at: session.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await this.supabaseService.clientInstance
      .from('study_sessions')
      .upsert(dbRow)
      .select('*, subject:subjects(*), topic:topics(*)')
      .single();

    if (!error && data) return data as StudySession;
    return null;
  }

  async saveStudySession(session: Partial<StudySession>): Promise<StudySession> {
    const uid = await this.ensureUserId();
    const sessionId = this.isValidUuid(session.id) ? session.id! : this.generateUuid();
    const durationSeconds = Math.max(1, Math.round(Number(session.duration_seconds) || 0));

    let resolvedSubId = session.subject_id!;
    let resolvedTopId = session.topic_id || null;

    if (this.supabaseService.isRealSupabaseConfigured && uid) {
      const resolved = await this.resolveSubjectAndTopicForDb(uid, resolvedSubId, resolvedTopId);
      resolvedSubId = resolved.subjectId;
      resolvedTopId = resolved.topicId;
    }

    const newSession: StudySession = {
      id: sessionId,
      user_id: uid,
      subject_id: resolvedSubId,
      topic_id: resolvedTopId,
      started_at: session.started_at || new Date().toISOString(),
      ended_at: session.ended_at || new Date().toISOString(),
      duration_seconds: durationSeconds,
      notes: session.notes || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const subs = await this.getSubjects();
    const topics = await this.getTopics();
    const enrichedLocal: StudySession = {
      ...newSession,
      subject: subs.find(sub => sub.id === newSession.subject_id),
      topic: topics.find(t => t.id === newSession.topic_id)
    };

    // Always persist to localStorage immediately
    const current = this.getLocal<StudySession[]>('study_sessions', []);
    const existingIdx = current.findIndex(s => s.id === newSession.id);
    if (existingIdx >= 0) current[existingIdx] = enrichedLocal;
    else current.unshift(enrichedLocal);
    this.setLocal('study_sessions', current);

    if (this.supabaseService.isRealSupabaseConfigured && uid) {
      try {
        const dbRow = {
          id: newSession.id,
          user_id: uid,
          subject_id: newSession.subject_id,
          topic_id: newSession.topic_id,
          started_at: newSession.started_at,
          ended_at: newSession.ended_at,
          duration_seconds: newSession.duration_seconds,
          notes: newSession.notes,
          created_at: newSession.created_at,
          updated_at: newSession.updated_at
        };

        let { data, error } = await this.supabaseService.clientInstance
          .from('study_sessions')
          .insert(dbRow)
          .select('*, subject:subjects(*), topic:topics(*)')
          .single();

        // Retry with topic_id = null if topic foreign key caused error
        if (error && dbRow.topic_id) {
          dbRow.topic_id = null;
          const retryTopic = await this.supabaseService.clientInstance
            .from('study_sessions')
            .insert(dbRow)
            .select('*, subject:subjects(*), topic:topics(*)')
            .single();
          data = retryTopic.data;
          error = retryTopic.error;
        }

        // Retry after seeding if profile/subject foreign key caused error
        if (error) {
          console.warn('Retrying study session insert after ensuring DB seed:', error);
          await this.seedUserSyllabusInDatabase(uid);
          const refreshedResolve = await this.resolveSubjectAndTopicForDb(uid, session.subject_id!, null);
          dbRow.subject_id = refreshedResolve.subjectId;
          dbRow.topic_id = null;
          const retrySeed = await this.supabaseService.clientInstance
            .from('study_sessions')
            .insert(dbRow)
            .select('*, subject:subjects(*), topic:topics(*)')
            .single();
          data = retrySeed.data;
          error = retrySeed.error;
        }

        if (data && !error) {
          const savedSession = data as StudySession;
          const updatedLocal = this.getLocal<StudySession[]>('study_sessions', []);
          const idx = updatedLocal.findIndex(s => s.id === savedSession.id);
          if (idx >= 0) updatedLocal[idx] = savedSession;
          else updatedLocal.unshift(savedSession);
          this.setLocal('study_sessions', updatedLocal);
          return savedSession;
        }
      } catch (err) {
        console.warn('Offline or error saving study session to Supabase, kept in local cache:', err);
      }
    }

    return enrichedLocal;
  }

  async deleteStudySession(sessionId: string): Promise<void> {
    const uid = await this.ensureUserId();
    let current = this.getLocal<StudySession[]>('study_sessions', []);
    current = current.filter(s => s.id !== sessionId);
    this.setLocal('study_sessions', current);

    if (this.supabaseService.isRealSupabaseConfigured && uid) {
      await this.supabaseService.clientInstance
        .from('study_sessions')
        .delete()
        .eq('id', sessionId)
        .eq('user_id', uid);
    }
  }

  // --- MOCK EXAMS ---
  async getMockExams(): Promise<MockExam[]> {
    const uid = await this.ensureUserId();
    if (this.supabaseService.isRealSupabaseConfigured && uid) {
      const { data, error } = await this.supabaseService.clientInstance
        .from('mock_exams')
        .select('*, exam:exams(*), subject_scores:mock_exam_subject_scores(*, subject:subjects(*))')
        .eq('user_id', uid)
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
    const uid = await this.ensureUserId();
    const newMock: MockExam = {
      id: this.isValidUuid(mock.id) ? mock.id! : this.generateUuid(),
      user_id: uid,
      exam_id: this.isValidUuid(mock.exam_id) ? mock.exam_id! : null,
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

    const current = this.getLocal<MockExam[]>('mock_exams', []);
    const idx = current.findIndex(m => m.id === newMock.id);
    if (idx >= 0) current[idx] = newMock;
    else current.unshift(newMock);
    this.setLocal('mock_exams', current);

    if (this.supabaseService.isRealSupabaseConfigured && uid) {
      const { data } = await this.supabaseService.clientInstance
        .from('mock_exams')
        .upsert(newMock)
        .select('*, exam:exams(*)')
        .single();
      if (data) return data as MockExam;
    }

    const exams = await this.getExams();
    return { ...newMock, exam: exams.find(e => e.id === newMock.exam_id) };
  }

  async deleteMockExam(mockId: string): Promise<void> {
    const uid = await this.ensureUserId();
    let current = this.getLocal<MockExam[]>('mock_exams', []);
    current = current.filter(m => m.id !== mockId);
    this.setLocal('mock_exams', current);

    if (this.supabaseService.isRealSupabaseConfigured && uid) {
      await this.supabaseService.clientInstance
        .from('mock_exams')
        .delete()
        .eq('id', mockId)
        .eq('user_id', uid);
    }
  }

  // --- EXAM CALENDAR EVENTS ---
  async getExamEvents(): Promise<ExamEvent[]> {
    const uid = await this.ensureUserId();
    if (this.supabaseService.isRealSupabaseConfigured && uid) {
      const { data, error } = await this.supabaseService.clientInstance
        .from('exam_events')
        .select('*, exam:exams(*)')
        .eq('user_id', uid)
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
    const uid = await this.ensureUserId();
    const newEvent: ExamEvent = {
      id: this.isValidUuid(event.id) ? event.id! : this.generateUuid(),
      user_id: uid,
      exam_id: this.isValidUuid(event.exam_id) ? event.exam_id! : null,
      title: event.title || 'Exam Event',
      event_type: event.event_type || 'exam_date',
      event_date: event.event_date || new Date().toISOString().split('T')[0],
      date_status: event.date_status || 'tentative',
      description: event.description || null,
      reminder_enabled: event.reminder_enabled ?? false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const current = this.getLocal<ExamEvent[]>('exam_events', []);
    const idx = current.findIndex(e => e.id === newEvent.id);
    if (idx >= 0) current[idx] = newEvent;
    else current.push(newEvent);
    this.setLocal('exam_events', current);

    if (this.supabaseService.isRealSupabaseConfigured && uid) {
      const { data } = await this.supabaseService.clientInstance
        .from('exam_events')
        .upsert(newEvent)
        .select('*, exam:exams(*)')
        .single();
      if (data) return data as ExamEvent;
    }

    const exams = await this.getExams();
    return { ...newEvent, exam: exams.find(e => e.id === newEvent.exam_id) };
  }

  async deleteExamEvent(eventId: string): Promise<void> {
    const uid = await this.ensureUserId();
    let current = this.getLocal<ExamEvent[]>('exam_events', []);
    current = current.filter(e => e.id !== eventId);
    this.setLocal('exam_events', current);

    if (this.supabaseService.isRealSupabaseConfigured && uid) {
      await this.supabaseService.clientInstance
        .from('exam_events')
        .delete()
        .eq('id', eventId)
        .eq('user_id', uid);
    }
  }

  // --- QUESTION PATTERNS & BLUEPRINTS ---
  async getQuestionPatterns(): Promise<QuestionPattern[]> {
    if (this.supabaseService.isRealSupabaseConfigured) {
      const { data, error } = await this.supabaseService.clientInstance
        .from('question_patterns')
        .select('*')
        .order('subject_code', { ascending: true });
      if (!error && data && data.length > 0) return data as QuestionPattern[];
    }
    return this.getLocal<QuestionPattern[]>('preptrack_question_patterns', []);
  }

  async saveQuestionPattern(pattern: Partial<QuestionPattern>): Promise<QuestionPattern> {
    const uid = await this.ensureUserId();
    const item: QuestionPattern = {
      id: this.isValidUuid(pattern.id) ? pattern.id! : this.generateUuid(),
      user_id: uid,
      subject_code: pattern.subject_code || 'quant',
      topic_name: pattern.topic_name || 'General',
      pattern_code: pattern.pattern_code || `PAT_${Date.now()}`,
      pattern_type: pattern.pattern_type || 'parametric_numeric',
      difficulty: pattern.difficulty || 'medium',
      exam_stage: pattern.exam_stage || 'prelims',
      template_config: pattern.template_config || {},
      explanation_template: pattern.explanation_template || '',
      is_active: pattern.is_active ?? true,
      created_at: new Date().toISOString()
    };

    const current = this.getLocal<QuestionPattern[]>('preptrack_question_patterns', []);
    const idx = current.findIndex(p => p.id === item.id);
    if (idx >= 0) current[idx] = item;
    else current.push(item);
    this.setLocal('preptrack_question_patterns', current);

    if (this.supabaseService.isRealSupabaseConfigured && uid) {
      const { data } = await this.supabaseService.clientInstance
        .from('question_patterns')
        .upsert(item)
        .select()
        .single();
      if (data) return data as QuestionPattern;
    }

    return item;
  }

  async getMockExamSimulatorAttempts(): Promise<MockExamAttempt[]> {
    const uid = await this.ensureUserId();
    if (this.supabaseService.isRealSupabaseConfigured && uid) {
      const { data, error } = await this.supabaseService.clientInstance
        .from('mock_exam_attempts')
        .select('*')
        .eq('user_id', uid)
        .order('completed_at', { ascending: false });
      if (!error && data) return data as MockExamAttempt[];
    }
    return this.getLocal<MockExamAttempt[]>('preptrack_mock_exam_simulator_attempts', []);
  }
}
