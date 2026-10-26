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
    const subReasId = '11111111-1111-4111-8111-111111111101';
    const subQuantId = '11111111-1111-4111-8111-111111111102';
    const subEngId = '11111111-1111-4111-8111-111111111103';
    const subGaId = '11111111-1111-4111-8111-111111111104';
    const subCompId = '11111111-1111-4111-8111-111111111105';

    // Kerala High Court Assistant Subjects
    const subHcaEngId = '11111111-1111-4111-8111-111111111106';
    const subHcaGkConstId = '11111111-1111-4111-8111-111111111107';
    const subHcaKeralaId = '11111111-1111-4111-8111-111111111108';
    const subHcaMathReasId = '11111111-1111-4111-8111-111111111109';
    const subHcaDescriptiveId = '11111111-1111-4111-8111-111111111110';

    const defaultSubjects: Subject[] = [
      // Banking
      { id: subReasId, user_id: this.userId, name: 'Reasoning Ability', color: '#2563eb', display_order: 1 },
      { id: subQuantId, user_id: this.userId, name: 'Quantitative Aptitude', color: '#0891b2', display_order: 2 },
      { id: subEngId, user_id: this.userId, name: 'English Language', color: '#7c3aed', display_order: 3 },
      { id: subGaId, user_id: this.userId, name: 'General & Banking Awareness', color: '#d97706', display_order: 4 },
      { id: subCompId, user_id: this.userId, name: 'Computer Aptitude', color: '#059669', display_order: 5 },
      // Kerala High Court Assistant
      { id: subHcaEngId, user_id: this.userId, name: 'General English (Kerala HCA)', color: '#4f46e5', display_order: 6 },
      { id: subHcaGkConstId, user_id: this.userId, name: 'Indian Constitution & Legal GK (Kerala HCA)', color: '#b45309', display_order: 7 },
      { id: subHcaKeralaId, user_id: this.userId, name: 'Facts about Kerala & Renaissance (Kerala HCA)', color: '#047857', display_order: 8 },
      { id: subHcaMathReasId, user_id: this.userId, name: 'Basic Mathematics & Reasoning (Kerala HCA)', color: '#0284c7', display_order: 9 },
      { id: subHcaDescriptiveId, user_id: this.userId, name: 'Descriptive English (Kerala HCA Stage II)', color: '#c026d3', display_order: 10 }
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
      { id: '22222222-2222-4222-8222-222222222231', user_id: this.userId, subject_id: subCompId, name: 'Keyboard Shortcuts & MS Office', priority: 'high', learning_status: 'not_started', display_order: 3 },

      // --- KERALA HIGH COURT ASSISTANT TOPICS ---
      // 1. General English (HCA - 50 Marks Weightage)
      { id: '22222222-2222-4222-8222-222222222240', user_id: this.userId, subject_id: subHcaEngId, name: 'Tenses & Subject-Verb Agreement', priority: 'high', learning_status: 'not_started', display_order: 1 },
      { id: '22222222-2222-4222-8222-222222222241', user_id: this.userId, subject_id: subHcaEngId, name: 'Active & Passive Voice', priority: 'high', learning_status: 'not_started', display_order: 2 },
      { id: '22222222-2222-4222-8222-222222222242', user_id: this.userId, subject_id: subHcaEngId, name: 'Direct & Indirect Speech', priority: 'high', learning_status: 'not_started', display_order: 3 },
      { id: '22222222-2222-4222-8222-222222222243', user_id: this.userId, subject_id: subHcaEngId, name: 'Synonyms & Antonyms (Legal & Formal Vocabulary)', priority: 'high', learning_status: 'not_started', display_order: 4 },
      { id: '22222222-2222-4222-8222-222222222244', user_id: this.userId, subject_id: subHcaEngId, name: 'Idioms, Phrases & Phrasal Verbs', priority: 'high', learning_status: 'not_started', display_order: 5 },
      { id: '22222222-2222-4222-8222-222222222245', user_id: this.userId, subject_id: subHcaEngId, name: 'One-Word Substitutions & Legal Terms', priority: 'high', learning_status: 'not_started', display_order: 6 },
      { id: '22222222-2222-4222-8222-222222222246', user_id: this.userId, subject_id: subHcaEngId, name: 'Error Spotting & Sentence Correction', priority: 'high', learning_status: 'not_started', display_order: 7 },
      { id: '22222222-2222-4222-8222-222222222247', user_id: this.userId, subject_id: subHcaEngId, name: 'Reading Comprehension & Cloze Test', priority: 'high', learning_status: 'not_started', display_order: 8 },

      // 2. Indian Constitution & Legal GK (HCA)
      { id: '22222222-2222-4222-8222-222222222250', user_id: this.userId, subject_id: subHcaGkConstId, name: 'Preamble & Salient Features of Constitution', priority: 'high', learning_status: 'not_started', display_order: 1 },
      { id: '22222222-2222-4222-8222-222222222251', user_id: this.userId, subject_id: subHcaGkConstId, name: 'Fundamental Rights & Duties (Articles 12-51A)', priority: 'high', learning_status: 'not_started', display_order: 2 },
      { id: '22222222-2222-4222-8222-222222222252', user_id: this.userId, subject_id: subHcaGkConstId, name: 'Directive Principles of State Policy (DPSP)', priority: 'medium', learning_status: 'not_started', display_order: 3 },
      { id: '22222222-2222-4222-8222-222222222253', user_id: this.userId, subject_id: subHcaGkConstId, name: 'High Courts & Supreme Court: Powers & Jurisdiction', priority: 'high', learning_status: 'not_started', display_order: 4 },
      { id: '22222222-2222-4222-8222-222222222254', user_id: this.userId, subject_id: subHcaGkConstId, name: 'Article 226: Writs (Habeas Corpus, Mandamus, Quo Warranto)', priority: 'high', learning_status: 'not_started', display_order: 5 },
      { id: '22222222-2222-4222-8222-222222222255', user_id: this.userId, subject_id: subHcaGkConstId, name: 'Landmark Judicial Precedents & Constitutional Amendments', priority: 'high', learning_status: 'not_started', display_order: 6 },
      { id: '22222222-2222-4222-8222-222222222256', user_id: this.userId, subject_id: subHcaGkConstId, name: 'General Science & Information Technology Basics', priority: 'medium', learning_status: 'not_started', display_order: 7 },
      { id: '22222222-2222-4222-8222-222222222257', user_id: this.userId, subject_id: subHcaGkConstId, name: 'National & International Current Affairs', priority: 'high', learning_status: 'not_started', display_order: 8 },

      // 3. Facts about Kerala & Renaissance (HCA)
      { id: '22222222-2222-4222-8222-222222222260', user_id: this.userId, subject_id: subHcaKeralaId, name: 'Kerala Renaissance Leaders (Guru, Chattampi, Ayyankali)', priority: 'high', learning_status: 'not_started', display_order: 1 },
      { id: '22222222-2222-4222-8222-222222222261', user_id: this.userId, subject_id: subHcaKeralaId, name: 'Reform Movements (Vaikom, Guruvayur, Temple Entry)', priority: 'high', learning_status: 'not_started', display_order: 2 },
      { id: '22222222-2222-4222-8222-222222222262', user_id: this.userId, subject_id: subHcaKeralaId, name: 'Kerala Geography, Rivers, Forests & Wildlife', priority: 'medium', learning_status: 'not_started', display_order: 3 },
      { id: '22222222-2222-4222-8222-222222222263', user_id: this.userId, subject_id: subHcaKeralaId, name: 'History of Travancore, Cochin, and Malabar', priority: 'medium', learning_status: 'not_started', display_order: 4 },
      { id: '22222222-2222-4222-8222-222222222264', user_id: this.userId, subject_id: subHcaKeralaId, name: 'Art, Culture, Literature & Festivals of Kerala', priority: 'medium', learning_status: 'not_started', display_order: 5 },

      // 4. Basic Mathematics & Reasoning (HCA - 10 Marks Weightage)
      { id: '22222222-2222-4222-8222-222222222270', user_id: this.userId, subject_id: subHcaMathReasId, name: 'Number Systems, Fractions & Decimals', priority: 'medium', learning_status: 'not_started', display_order: 1 },
      { id: '22222222-2222-4222-8222-222222222271', user_id: this.userId, subject_id: subHcaMathReasId, name: 'Percentages, Profit & Loss, Interest', priority: 'high', learning_status: 'not_started', display_order: 2 },
      { id: '22222222-2222-4222-8222-222222222272', user_id: this.userId, subject_id: subHcaMathReasId, name: 'Ratio, Proportion, Average & Ages', priority: 'medium', learning_status: 'not_started', display_order: 3 },
      { id: '22222222-2222-4222-8222-222222222273', user_id: this.userId, subject_id: subHcaMathReasId, name: 'Time & Work, Time & Distance', priority: 'medium', learning_status: 'not_started', display_order: 4 },
      { id: '22222222-2222-4222-8222-222222222274', user_id: this.userId, subject_id: subHcaMathReasId, name: 'Coding-Decoding, Letter & Number Series', priority: 'high', learning_status: 'not_started', display_order: 5 },
      { id: '22222222-2222-4222-8222-222222222275', user_id: this.userId, subject_id: subHcaMathReasId, name: 'Blood Relations & Direction Sense', priority: 'medium', learning_status: 'not_started', display_order: 6 },

      // 5. Descriptive English (Stage II - 60 Marks)
      { id: '22222222-2222-4222-8222-222222222280', user_id: this.userId, subject_id: subHcaDescriptiveId, name: 'Precis Writing: Rules, Structure & Exercises', priority: 'high', learning_status: 'not_started', display_order: 1 },
      { id: '22222222-2222-4222-8222-222222222281', user_id: this.userId, subject_id: subHcaDescriptiveId, name: 'Reading Comprehension (Descriptive Analysis)', priority: 'high', learning_status: 'not_started', display_order: 2 },
      { id: '22222222-2222-4222-8222-222222222282', user_id: this.userId, subject_id: subHcaDescriptiveId, name: 'Short Essay Writing: Legal & Contemporary Themes', priority: 'high', learning_status: 'not_started', display_order: 3 }
    ];

    const defaultExams: Exam[] = this.getDefaultBankExams(this.userId);

    const existingSubs = this.getLocal<Subject[]>('subjects', []);
    if (!existingSubs || existingSubs.length === 0) {
      this.setLocal('subjects', defaultSubjects);
      this.setLocal('topics', defaultTopics);
    } else {
      // Intelligently check if Kerala HCA subjects are missing in existing storage
      const hasHca = existingSubs.some(s => s.name.toLowerCase().includes('kerala') || s.name.toLowerCase().includes('hca'));
      if (!hasHca) {
        const hcaSubs = defaultSubjects.filter(s => s.name.toLowerCase().includes('kerala') || s.name.toLowerCase().includes('hca'));
        const updatedSubs = [...existingSubs, ...hcaSubs];
        this.setLocal('subjects', updatedSubs);

        const existingTopics = this.getLocal<Topic[]>('topics', []);
        const hcaSubIds = new Set(hcaSubs.map(s => s.id));
        const hcaTopics = defaultTopics.filter(t => hcaSubIds.has(t.subject_id));
        const updatedTopics = [...existingTopics, ...hcaTopics];
        this.setLocal('topics', updatedTopics);
      }
    }

    const currentExams = this.getLocal<Exam[]>('exams', []);
    if (!currentExams || currentExams.length === 0) {
      this.setLocal('exams', defaultExams);
    } else {
      // Check if Kerala HCA is present
      const hasHcaExam = currentExams.some(e => e.name.toLowerCase().includes('kerala') || e.name.toLowerCase().includes('high court'));
      if (!hasHcaExam) {
        const hcaExam = defaultExams.find(e => e.name.toLowerCase().includes('high court'));
        if (hcaExam) {
          currentExams.unshift(hcaExam);
          this.setLocal('exams', currentExams);
        }
      }
    }

    // Default Events (ensure Kerala High Court events exist)
    const currentEvents = this.getLocal<ExamEvent[]>('exam_events', []);
    const hasHcaEvent = currentEvents.some(e => e.title.toLowerCase().includes('high court') || e.title.toLowerCase().includes('hca'));
    if (!hasHcaEvent) {
      const hcaEvents: ExamEvent[] = [
        {
          id: 'event-hca-2026-objective',
          user_id: this.userId,
          exam_id: '33333333-3333-4333-8333-333333333315',
          title: 'Kerala High Court Assistant - Stage 1 Objective Written Exam',
          event_type: 'exam_date',
          event_date: '2026-09-15',
          date_status: 'confirmed',
          description: '100 Questions (50 English, 40 GK/Constitution, 10 Math), 75 Minutes, -0.25 penalty.',
          reminder_enabled: true
        },
        {
          id: 'event-hca-2026-descriptive',
          user_id: this.userId,
          exam_id: '33333333-3333-4333-8333-333333333315',
          title: 'Kerala High Court Assistant - Stage 2 Descriptive Test',
          event_type: 'exam_date',
          event_date: '2026-11-20',
          date_status: 'tentative',
          description: '60 Marks (Precis Writing, Comprehension, Short Essay), 60 Minutes.',
          reminder_enabled: true
        }
      ];
      this.setLocal('exam_events', [...currentEvents, ...hcaEvents]);
    }

    if (!this.getLocal('initialized', false)) {
      this.setLocal('daily_goals', []);
      this.setLocal('daily_goal_topics', []);
      this.setLocal('study_sessions', []);
      this.setLocal('mock_exams', []);
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

      // Check if user already has exams in Supabase
      const { count: examCount } = await this.supabaseService.clientInstance
        .from('exams')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      if (!examCount || examCount === 0) {
        const seedExams = this.getDefaultBankExams(userId).map((ex, idx) => ({
          user_id: userId,
          name: ex.name,
          description: ex.description,
          conducting_body: ex.conducting_body,
          vacancies: ex.vacancies,
          notification_status: ex.notification_status,
          prelims_date: ex.prelims_date,
          mains_date: ex.mains_date,
          official_url: ex.official_url,
          is_active: ex.is_active,
          display_order: idx + 1
        }));
        await this.supabaseService.clientInstance.from('exams').insert(seedExams);
      }
    } catch (e) {
      console.error('Failed to seed user database:', e);
    }
  }

  public getDefaultBankExams(userId: string = this.userId): Exam[] {
    return [
      {
        id: '33333333-3333-4333-8333-333333333315',
        user_id: userId,
        name: 'Kerala High Court Assistant (HCA) 2026',
        description: 'High Court of Kerala Assistant Recruitment - Objective Test (100 M), Descriptive Test (60 M) & Viva-Voce',
        conducting_body: 'High Court of Kerala',
        vacancies: 45,
        notification_status: 'announced',
        prelims_date: '2026-09-15',
        mains_date: '2026-11-20',
        official_url: 'https://hckrecruitment.keralacourts.in',
        is_active: true,
        display_order: 1
      },
      {
        id: '33333333-3333-4333-8333-333333333301',
        user_id: userId,
        name: 'IBPS PO 2026',
        description: 'Probationary Officer exam by Institute of Banking Personnel Selection',
        conducting_body: 'IBPS',
        vacancies: 4455,
        notification_status: 'expected',
        prelims_date: '2026-10-18',
        mains_date: '2026-11-28',
        official_url: 'https://www.ibps.in',
        is_active: true,
        display_order: 2
      },
      {
        id: '33333333-3333-4333-8333-333333333302',
        user_id: userId,
        name: 'SBI PO 2026',
        description: 'Probationary Officer recruitment by State Bank of India',
        conducting_body: 'SBI',
        vacancies: 2000,
        notification_status: 'expected',
        prelims_date: '2026-11-01',
        mains_date: '2026-12-15',
        official_url: 'https://sbi.co.in/careers',
        is_active: true,
        display_order: 2
      },
      {
        id: '33333333-3333-4333-8333-333333333303',
        user_id: userId,
        name: 'IBPS Clerk 2026',
        description: 'Clerical Cadre recruitment across Public Sector Banks',
        conducting_body: 'IBPS',
        vacancies: 6128,
        notification_status: 'expected',
        prelims_date: '2026-08-29',
        mains_date: '2026-10-04',
        official_url: 'https://www.ibps.in',
        is_active: true,
        display_order: 3
      },
      {
        id: '33333333-3333-4333-8333-333333333304',
        user_id: userId,
        name: 'SBI Clerk (Junior Associates) 2026',
        description: 'Junior Associates (Customer Support & Sales) in State Bank of India',
        conducting_body: 'SBI',
        vacancies: 8283,
        notification_status: 'announced',
        prelims_date: '2026-06-15',
        mains_date: '2026-08-10',
        official_url: 'https://sbi.co.in/careers',
        is_active: true,
        display_order: 4
      },
      {
        id: '33333333-3333-4333-8333-333333333305',
        user_id: userId,
        name: 'IBPS RRB Officer Scale-I (RRB PO) 2026',
        description: 'Group A Officers in Regional Rural Banks',
        conducting_body: 'IBPS',
        vacancies: 3583,
        notification_status: 'expected',
        prelims_date: '2026-08-01',
        mains_date: '2026-09-20',
        official_url: 'https://www.ibps.in',
        is_active: true,
        display_order: 5
      },
      {
        id: '33333333-3333-4333-8333-333333333306',
        user_id: userId,
        name: 'IBPS RRB Office Assistant (RRB Clerk) 2026',
        description: 'Group B Multipurpose Office Assistant in Regional Rural Banks',
        conducting_body: 'IBPS',
        vacancies: 5585,
        notification_status: 'expected',
        prelims_date: '2026-08-08',
        mains_date: '2026-10-05',
        official_url: 'https://www.ibps.in',
        is_active: true,
        display_order: 6
      },
      {
        id: '33333333-3333-4333-8333-333333333307',
        user_id: userId,
        name: 'RBI Grade B (Officers) 2026',
        description: 'Direct Recruitment for Officers in Grade B (General / DEPR / DSIM)',
        conducting_body: 'RBI',
        vacancies: 291,
        notification_status: 'expected',
        prelims_date: '2026-09-12',
        mains_date: '2026-10-19',
        official_url: 'https://opportunities.rbi.org.in',
        is_active: true,
        display_order: 7
      },
      {
        id: '33333333-3333-4333-8333-333333333308',
        user_id: userId,
        name: 'RBI Assistant 2026',
        description: 'Assistant recruitment across RBI regional offices nationwide',
        conducting_body: 'RBI',
        vacancies: 450,
        notification_status: 'expected',
        prelims_date: '2026-04-20',
        mains_date: '2026-06-10',
        official_url: 'https://opportunities.rbi.org.in',
        is_active: true,
        display_order: 8
      },
      {
        id: '33333333-3333-4333-8333-333333333309',
        user_id: userId,
        name: 'NABARD Grade A (Assistant Manager - RDBS) 2026',
        description: 'National Bank for Agriculture and Rural Development Officer recruitment',
        conducting_body: 'NABARD',
        vacancies: 150,
        notification_status: 'expected',
        prelims_date: '2026-09-25',
        mains_date: '2026-11-05',
        official_url: 'https://www.nabard.org',
        is_active: true,
        display_order: 9
      },
      {
        id: '33333333-3333-4333-8333-333333333310',
        user_id: userId,
        name: 'SEBI Grade A (Assistant Manager) 2026',
        description: 'Securities and Exchange Board of India General & IT Stream Officers',
        conducting_body: 'SEBI',
        vacancies: 97,
        notification_status: 'expected',
        prelims_date: '2026-07-27',
        mains_date: '2026-08-31',
        official_url: 'https://www.sebi.gov.in',
        is_active: true,
        display_order: 10
      },
      {
        id: '33333333-3333-4333-8333-333333333311',
        user_id: userId,
        name: 'SIDBI Grade A (Assistant Manager) 2026',
        description: 'Small Industries Development Bank of India General Stream Officer recruitment',
        conducting_body: 'SIDBI',
        vacancies: 100,
        notification_status: 'expected',
        prelims_date: '2026-12-10',
        mains_date: null,
        official_url: 'https://www.sidbi.in',
        is_active: true,
        display_order: 11
      },
      {
        id: '33333333-3333-4333-8333-333333333312',
        user_id: userId,
        name: 'IBPS SO (Specialist Officers) 2026',
        description: 'Specialist Officer recruitment (IT Officer, AFO, HR, Law & Marketing)',
        conducting_body: 'IBPS',
        vacancies: 1402,
        notification_status: 'expected',
        prelims_date: '2026-12-28',
        mains_date: '2027-01-25',
        official_url: 'https://www.ibps.in',
        is_active: true,
        display_order: 12
      },
      {
        id: '33333333-3333-4333-8333-333333333313',
        user_id: userId,
        name: 'LIC AAO (Assistant Administrative Officer) 2026',
        description: 'Life Insurance Corporation of India Generalist Officer Cadre',
        conducting_body: 'LIC',
        vacancies: 300,
        notification_status: 'expected',
        prelims_date: '2026-05-18',
        mains_date: '2026-07-02',
        official_url: 'https://licindia.in',
        is_active: true,
        display_order: 13
      },
      {
        id: '33333333-3333-4333-8333-333333333314',
        user_id: userId,
        name: 'IDBI Bank Executive / Assistant Manager 2026',
        description: 'Recruitment of Executives and Assistant Managers in IDBI Bank',
        conducting_body: 'IDBI',
        vacancies: 1300,
        notification_status: 'expected',
        prelims_date: '2026-06-28',
        mains_date: null,
        official_url: 'https://www.idbibank.in',
        is_active: true,
        display_order: 14
      }
    ];
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
      if (!error && data && data.length > 0) return data as Exam[];
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

  // --- SMART REVISION & QUESTION BOOKMARKS ---
  getBookmarkedQuestionIds(): string[] {
    return this.getLocal<string[]>('preptrack_bookmarked_questions', []);
  }

  isQuestionBookmarked(questionId: string): boolean {
    if (!questionId) return false;
    const current = this.getBookmarkedQuestionIds();
    return current.includes(questionId);
  }

  toggleBookmarkQuestion(questionId: string): boolean {
    if (!questionId) return false;
    const current = this.getBookmarkedQuestionIds();
    const index = current.indexOf(questionId);
    let bookmarked = false;
    if (index >= 0) {
      current.splice(index, 1);
      bookmarked = false;
    } else {
      current.push(questionId);
      bookmarked = true;
    }
    this.setLocal('preptrack_bookmarked_questions', current);
    return bookmarked;
  }

  getIncorrectQuestions(): {
    questionId: string;
    questionText: string;
    selectedOption: string;
    correctOption: string;
    explanation: string;
    subjectName: string;
    topicName: string;
    failedDate: string;
    attemptCount: number;
  }[] {
    return this.getLocal<any[]>('preptrack_incorrect_questions', []);
  }

  recordIncorrectQuestion(item: {
    questionId: string;
    questionText: string;
    selectedOption: string;
    correctOption: string;
    explanation: string;
    subjectName?: string;
    topicName?: string;
  }): void {
    if (!item.questionId || !item.questionText) return;
    const current = this.getIncorrectQuestions();
    const existing = current.find(q => q.questionId === item.questionId);
    if (existing) {
      existing.attemptCount = (existing.attemptCount || 1) + 1;
      existing.failedDate = new Date().toISOString();
      existing.selectedOption = item.selectedOption;
    } else {
      current.unshift({
        questionId: item.questionId,
        questionText: item.questionText,
        selectedOption: item.selectedOption,
        correctOption: item.correctOption,
        explanation: item.explanation,
        subjectName: item.subjectName || 'General',
        topicName: item.topicName || 'Mixed Practice',
        failedDate: new Date().toISOString(),
        attemptCount: 1
      });
    }
    this.setLocal('preptrack_incorrect_questions', current.slice(0, 200));
  }

  removeIncorrectQuestion(questionId: string): void {
    const current = this.getIncorrectQuestions().filter(q => q.questionId !== questionId);
    this.setLocal('preptrack_incorrect_questions', current);
  }
}
