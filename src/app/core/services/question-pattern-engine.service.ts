import { Injectable } from '@angular/core';
import {
  MockExamBlueprint,
  ExamQuestionItem,
  QuestionPattern,
  ExamSubjectCode,
  QuizQuestion
} from '../models/database.types';

@Injectable({
  providedIn: 'root'
})
export class QuestionPatternEngineService {

  // =========================================================================
  // STANDARD BANK EXAM BLUEPRINTS
  // =========================================================================

  getDefaultBlueprints(): MockExamBlueprint[] {
    return [
      {
        id: 'ibps-po-prelims-live-1',
        title: 'IBPS PO Prelims All-India Live Mock #1',
        description: 'Authentic 100-Question Preliminary Exam with 20-min sectional timer and -0.25 negative marking.',
        exam_category: 'IBPS_PO',
        exam_stage: 'prelims',
        total_duration_minutes: 60,
        has_sectional_timing: true,
        total_marks: 100,
        negative_marking: 0.25,
        target_cutoff: 54.5,
        is_active: true,
        sections_config: [
          {
            code: 'english',
            name: 'English Language',
            subjectCode: 'english',
            questionsCount: 30,
            durationMinutes: 20,
            marksPerQuestion: 1,
            negativeMarks: 0.25,
            cutoffEstimate: 9.5
          },
          {
            code: 'quant',
            name: 'Quantitative Aptitude',
            subjectCode: 'quant',
            questionsCount: 35,
            durationMinutes: 20,
            marksPerQuestion: 1,
            negativeMarks: 0.25,
            cutoffEstimate: 10.0
          },
          {
            code: 'reasoning',
            name: 'Reasoning Ability',
            subjectCode: 'reasoning',
            questionsCount: 35,
            durationMinutes: 20,
            marksPerQuestion: 1,
            negativeMarks: 0.25,
            cutoffEstimate: 11.5
          }
        ]
      },
      {
        id: 'ibps-po-prelims-live-2',
        title: 'IBPS PO Prelims High-Scoring Mock #2',
        description: 'Second full-length IBPS PO Prelims test featuring Floor Puzzles, Missing Number Series, and Table DI.',
        exam_category: 'IBPS_PO',
        exam_stage: 'prelims',
        total_duration_minutes: 60,
        has_sectional_timing: true,
        total_marks: 100,
        negative_marking: 0.25,
        target_cutoff: 57.0,
        is_active: true,
        sections_config: [
          {
            code: 'english',
            name: 'English Language',
            subjectCode: 'english',
            questionsCount: 30,
            durationMinutes: 20,
            marksPerQuestion: 1,
            negativeMarks: 0.25,
            cutoffEstimate: 10.0
          },
          {
            code: 'quant',
            name: 'Quantitative Aptitude',
            subjectCode: 'quant',
            questionsCount: 35,
            durationMinutes: 20,
            marksPerQuestion: 1,
            negativeMarks: 0.25,
            cutoffEstimate: 10.5
          },
          {
            code: 'reasoning',
            name: 'Reasoning Ability',
            subjectCode: 'reasoning',
            questionsCount: 35,
            durationMinutes: 20,
            marksPerQuestion: 1,
            negativeMarks: 0.25,
            cutoffEstimate: 12.0
          }
        ]
      },
      {
        id: 'sbi-po-prelims-live-1',
        title: 'SBI PO Prelims Full-Length Mock Exam #1',
        description: 'High-difficulty mock calibrated to SBI PO standard with advanced arithmetic and reasoning puzzles.',
        exam_category: 'SBI_PO',
        exam_stage: 'prelims',
        total_duration_minutes: 60,
        has_sectional_timing: true,
        total_marks: 100,
        negative_marking: 0.25,
        target_cutoff: 58.75,
        is_active: true,
        sections_config: [
          {
            code: 'english',
            name: 'English Language',
            subjectCode: 'english',
            questionsCount: 30,
            durationMinutes: 20,
            marksPerQuestion: 1,
            negativeMarks: 0.25,
            cutoffEstimate: 11.0
          },
          {
            code: 'quant',
            name: 'Quantitative Aptitude',
            subjectCode: 'quant',
            questionsCount: 35,
            durationMinutes: 20,
            marksPerQuestion: 1,
            negativeMarks: 0.25,
            cutoffEstimate: 12.5
          },
          {
            code: 'reasoning',
            name: 'Reasoning Ability',
            subjectCode: 'reasoning',
            questionsCount: 35,
            durationMinutes: 20,
            marksPerQuestion: 1,
            negativeMarks: 0.25,
            cutoffEstimate: 13.0
          }
        ]
      },
      {
        id: 'sbi-po-prelims-live-2',
        title: 'SBI PO Prelims Advanced Challenge #2',
        description: 'Rigorous SBI PO Prelims simulation testing speed under pressure across multi-variable puzzles and DI.',
        exam_category: 'SBI_PO',
        exam_stage: 'prelims',
        total_duration_minutes: 60,
        has_sectional_timing: true,
        total_marks: 100,
        negative_marking: 0.25,
        target_cutoff: 61.5,
        is_active: true,
        sections_config: [
          {
            code: 'english',
            name: 'English Language',
            subjectCode: 'english',
            questionsCount: 30,
            durationMinutes: 20,
            marksPerQuestion: 1,
            negativeMarks: 0.25,
            cutoffEstimate: 11.5
          },
          {
            code: 'quant',
            name: 'Quantitative Aptitude',
            subjectCode: 'quant',
            questionsCount: 35,
            durationMinutes: 20,
            marksPerQuestion: 1,
            negativeMarks: 0.25,
            cutoffEstimate: 13.0
          },
          {
            code: 'reasoning',
            name: 'Reasoning Ability',
            subjectCode: 'reasoning',
            questionsCount: 35,
            durationMinutes: 20,
            marksPerQuestion: 1,
            negativeMarks: 0.25,
            cutoffEstimate: 13.5
          }
        ]
      },
      {
        id: 'ibps-clerk-prelims-mock-1',
        title: 'IBPS Clerk Prelims Speed Test Mock #1',
        description: 'High-speed preliminary format focusing on calculation speed, simplification, and rapid deduction.',
        exam_category: 'IBPS_CLERK',
        exam_stage: 'prelims',
        total_duration_minutes: 60,
        has_sectional_timing: true,
        total_marks: 100,
        negative_marking: 0.25,
        target_cutoff: 74.0,
        is_active: true,
        sections_config: [
          {
            code: 'english',
            name: 'English Language',
            subjectCode: 'english',
            questionsCount: 30,
            durationMinutes: 20,
            marksPerQuestion: 1,
            negativeMarks: 0.25,
            cutoffEstimate: 18.0
          },
          {
            code: 'quant',
            name: 'Numerical Ability',
            subjectCode: 'quant',
            questionsCount: 35,
            durationMinutes: 20,
            marksPerQuestion: 1,
            negativeMarks: 0.25,
            cutoffEstimate: 26.0
          },
          {
            code: 'reasoning',
            name: 'Reasoning Ability',
            subjectCode: 'reasoning',
            questionsCount: 35,
            durationMinutes: 20,
            marksPerQuestion: 1,
            negativeMarks: 0.25,
            cutoffEstimate: 28.0
          }
        ]
      },
      {
        id: 'sbi-clerk-prelims-mock-1',
        title: 'SBI Clerk (Junior Associates) Prelims Mock #1',
        description: 'Full 100-question SBI Junior Associates Prelims mock calibrated for high-accuracy clerical cutoffs.',
        exam_category: 'SBI_CLERK',
        exam_stage: 'prelims',
        total_duration_minutes: 60,
        has_sectional_timing: true,
        total_marks: 100,
        negative_marking: 0.25,
        target_cutoff: 76.5,
        is_active: true,
        sections_config: [
          {
            code: 'english',
            name: 'English Language',
            subjectCode: 'english',
            questionsCount: 30,
            durationMinutes: 20,
            marksPerQuestion: 1,
            negativeMarks: 0.25,
            cutoffEstimate: 19.0
          },
          {
            code: 'quant',
            name: 'Numerical Ability',
            subjectCode: 'quant',
            questionsCount: 35,
            durationMinutes: 20,
            marksPerQuestion: 1,
            negativeMarks: 0.25,
            cutoffEstimate: 27.0
          },
          {
            code: 'reasoning',
            name: 'Reasoning Ability',
            subjectCode: 'reasoning',
            questionsCount: 35,
            durationMinutes: 20,
            marksPerQuestion: 1,
            negativeMarks: 0.25,
            cutoffEstimate: 28.5
          }
        ]
      },
      {
        id: 'rrb-po-prelims-mock-1',
        title: 'IBPS RRB PO (Officer Scale-I) Prelims Mock #1',
        description: 'Official 80-question, 45-minute dual-section format (Reasoning 40 Qs + Quantitative Aptitude 40 Qs).',
        exam_category: 'RRB_PO',
        exam_stage: 'prelims',
        total_duration_minutes: 45,
        has_sectional_timing: true,
        total_marks: 80,
        negative_marking: 0.25,
        target_cutoff: 56.0,
        is_active: true,
        sections_config: [
          {
            code: 'reasoning',
            name: 'Reasoning Ability',
            subjectCode: 'reasoning',
            questionsCount: 40,
            durationMinutes: 25,
            marksPerQuestion: 1,
            negativeMarks: 0.25,
            cutoffEstimate: 29.0
          },
          {
            code: 'quant',
            name: 'Quantitative Aptitude',
            subjectCode: 'quant',
            questionsCount: 40,
            durationMinutes: 20,
            marksPerQuestion: 1,
            negativeMarks: 0.25,
            cutoffEstimate: 27.0
          }
        ]
      },
      {
        id: 'rrb-clerk-prelims-mock-1',
        title: 'IBPS RRB Clerk (Office Assistant) Prelims Mock #1',
        description: 'Fast-paced 80-question, 45-minute Regional Rural Bank Office Assistant preliminary test.',
        exam_category: 'RRB_CLERK',
        exam_stage: 'prelims',
        total_duration_minutes: 45,
        has_sectional_timing: true,
        total_marks: 80,
        negative_marking: 0.25,
        target_cutoff: 68.5,
        is_active: true,
        sections_config: [
          {
            code: 'reasoning',
            name: 'Reasoning Ability',
            subjectCode: 'reasoning',
            questionsCount: 40,
            durationMinutes: 25,
            marksPerQuestion: 1,
            negativeMarks: 0.25,
            cutoffEstimate: 35.0
          },
          {
            code: 'quant',
            name: 'Numerical Ability',
            subjectCode: 'quant',
            questionsCount: 40,
            durationMinutes: 20,
            marksPerQuestion: 1,
            negativeMarks: 0.25,
            cutoffEstimate: 33.5
          }
        ]
      },
      {
        id: 'rbi-assistant-prelims-mock-1',
        title: 'RBI Assistant Prelims All-India Mock #1',
        description: 'Precision-focused 100-question Reserve Bank of India Assistant preliminary examination paper.',
        exam_category: 'RBI_EXAM',
        exam_stage: 'prelims',
        total_duration_minutes: 60,
        has_sectional_timing: true,
        total_marks: 100,
        negative_marking: 0.25,
        target_cutoff: 82.0,
        is_active: true,
        sections_config: [
          {
            code: 'english',
            name: 'English Language',
            subjectCode: 'english',
            questionsCount: 30,
            durationMinutes: 20,
            marksPerQuestion: 1,
            negativeMarks: 0.25,
            cutoffEstimate: 23.0
          },
          {
            code: 'quant',
            name: 'Numerical Ability',
            subjectCode: 'quant',
            questionsCount: 35,
            durationMinutes: 20,
            marksPerQuestion: 1,
            negativeMarks: 0.25,
            cutoffEstimate: 29.0
          },
          {
            code: 'reasoning',
            name: 'Reasoning Ability',
            subjectCode: 'reasoning',
            questionsCount: 35,
            durationMinutes: 20,
            marksPerQuestion: 1,
            negativeMarks: 0.25,
            cutoffEstimate: 30.0
          }
        ]
      },
      {
        id: 'ibps-po-mains-mock-1',
        title: 'IBPS PO Mains Full-Length Objective Mock #1',
        description: 'Comprehensive 4-section Mains simulation covering Reasoning, Banking Awareness, English, and Data Analysis.',
        exam_category: 'IBPS_PO',
        exam_stage: 'mains',
        total_duration_minutes: 180,
        has_sectional_timing: true,
        total_marks: 155,
        negative_marking: 0.25,
        target_cutoff: 74.5,
        is_active: true,
        sections_config: [
          {
            code: 'reasoning',
            name: 'Reasoning & Computer Aptitude',
            subjectCode: 'reasoning',
            questionsCount: 45,
            durationMinutes: 60,
            marksPerQuestion: 1,
            negativeMarks: 0.25,
            cutoffEstimate: 18.0
          },
          {
            code: 'ga',
            name: 'General, Economy & Banking Awareness',
            subjectCode: 'ga',
            questionsCount: 40,
            durationMinutes: 35,
            marksPerQuestion: 1,
            negativeMarks: 0.25,
            cutoffEstimate: 16.5
          },
          {
            code: 'english',
            name: 'English Language',
            subjectCode: 'english',
            questionsCount: 35,
            durationMinutes: 40,
            marksPerQuestion: 1,
            negativeMarks: 0.25,
            cutoffEstimate: 17.0
          },
          {
            code: 'quant',
            name: 'Data Analysis & Interpretation',
            subjectCode: 'quant',
            questionsCount: 35,
            durationMinutes: 45,
            marksPerQuestion: 1,
            negativeMarks: 0.25,
            cutoffEstimate: 15.0
          }
        ]
      },
      {
        id: 'sbi-po-mains-mock-1',
        title: 'SBI PO Mains Championship Objective Mock #1',
        description: 'Full 155-question SBI PO Phase-II Mains paper featuring Banking Awareness, DI, Reasoning, and English.',
        exam_category: 'SBI_PO',
        exam_stage: 'mains',
        total_duration_minutes: 180,
        has_sectional_timing: true,
        total_marks: 155,
        negative_marking: 0.25,
        target_cutoff: 78.0,
        is_active: true,
        sections_config: [
          {
            code: 'reasoning',
            name: 'Reasoning & Computer Aptitude',
            subjectCode: 'reasoning',
            questionsCount: 40,
            durationMinutes: 50,
            marksPerQuestion: 1,
            negativeMarks: 0.25,
            cutoffEstimate: 18.0
          },
          {
            code: 'quant',
            name: 'Data Analysis & Interpretation',
            subjectCode: 'quant',
            questionsCount: 30,
            durationMinutes: 45,
            marksPerQuestion: 1,
            negativeMarks: 0.25,
            cutoffEstimate: 14.5
          },
          {
            code: 'ga',
            name: 'General, Economy & Banking Awareness',
            subjectCode: 'ga',
            questionsCount: 50,
            durationMinutes: 45,
            marksPerQuestion: 1,
            negativeMarks: 0.25,
            cutoffEstimate: 24.0
          },
          {
            code: 'english',
            name: 'English Language',
            subjectCode: 'english',
            questionsCount: 35,
            durationMinutes: 40,
            marksPerQuestion: 1,
            negativeMarks: 0.25,
            cutoffEstimate: 17.5
          }
        ]
      },
      {
        id: 'rrb-po-mains-mock-1',
        title: 'IBPS RRB PO (Officer Scale-I) Mains Mock #1',
        description: '5-section RRB Officer Scale-I Mains exam including Computer Knowledge and Financial Awareness.',
        exam_category: 'RRB_PO',
        exam_stage: 'mains',
        total_duration_minutes: 120,
        has_sectional_timing: true,
        total_marks: 200,
        negative_marking: 0.25,
        target_cutoff: 94.5,
        is_active: true,
        sections_config: [
          {
            code: 'reasoning',
            name: 'Reasoning Ability',
            subjectCode: 'reasoning',
            questionsCount: 40,
            durationMinutes: 30,
            marksPerQuestion: 1,
            negativeMarks: 0.25,
            cutoffEstimate: 22.0
          },
          {
            code: 'computer',
            name: 'Computer Knowledge',
            subjectCode: 'computer',
            questionsCount: 40,
            durationMinutes: 15,
            marksPerQuestion: 1,
            negativeMarks: 0.25,
            cutoffEstimate: 20.0
          },
          {
            code: 'ga',
            name: 'General / Financial Awareness',
            subjectCode: 'ga',
            questionsCount: 40,
            durationMinutes: 20,
            marksPerQuestion: 1,
            negativeMarks: 0.25,
            cutoffEstimate: 18.0
          },
          {
            code: 'english',
            name: 'English Language',
            subjectCode: 'english',
            questionsCount: 40,
            durationMinutes: 25,
            marksPerQuestion: 1,
            negativeMarks: 0.25,
            cutoffEstimate: 18.5
          },
          {
            code: 'quant',
            name: 'Quantitative Aptitude',
            subjectCode: 'quant',
            questionsCount: 40,
            durationMinutes: 30,
            marksPerQuestion: 1,
            negativeMarks: 0.25,
            cutoffEstimate: 16.0
          }
        ]
      },
      {
        id: 'mixed-sprint-mini-mock',
        title: 'Daily Mixed Sprint Exam (30 Qs / 20 Mins)',
        description: 'Bite-sized high-intensity mixed sprint across English (10 Qs), Quant (10 Qs), and Reasoning (10 Qs).',
        exam_category: 'MIXED_SPRINT',
        exam_stage: 'prelims',
        total_duration_minutes: 20,
        has_sectional_timing: false,
        total_marks: 30,
        negative_marking: 0.25,
        target_cutoff: 21.0,
        is_active: true,
        sections_config: [
          {
            code: 'english',
            name: 'English Sprint',
            subjectCode: 'english',
            questionsCount: 10,
            durationMinutes: 6,
            marksPerQuestion: 1,
            negativeMarks: 0.25,
            cutoffEstimate: 6.5
          },
          {
            code: 'quant',
            name: 'Quant Sprint',
            subjectCode: 'quant',
            questionsCount: 10,
            durationMinutes: 7,
            marksPerQuestion: 1,
            negativeMarks: 0.25,
            cutoffEstimate: 7.0
          },
          {
            code: 'reasoning',
            name: 'Reasoning Sprint',
            subjectCode: 'reasoning',
            questionsCount: 10,
            durationMinutes: 7,
            marksPerQuestion: 1,
            negativeMarks: 0.25,
            cutoffEstimate: 7.5
          }
        ]
      },
      {
        id: 'sectional-quant-di-booster',
        title: 'Quant & DI Sectional Speed Booster (35 Qs / 20 Mins)',
        description: 'Dedicated 20-minute Quantitative Aptitude sectional test with Simplification, Quadratics, Series, DI, and Arithmetic.',
        exam_category: 'SECTIONAL',
        exam_stage: 'prelims',
        total_duration_minutes: 20,
        has_sectional_timing: true,
        total_marks: 35,
        negative_marking: 0.25,
        target_cutoff: 24.0,
        is_active: true,
        sections_config: [
          {
            code: 'quant',
            name: 'Quantitative Aptitude',
            subjectCode: 'quant',
            questionsCount: 35,
            durationMinutes: 20,
            marksPerQuestion: 1,
            negativeMarks: 0.25,
            cutoffEstimate: 24.0
          }
        ]
      },
      {
        id: 'sectional-reasoning-puzzle-booster',
        title: 'Reasoning & Puzzles Sectional Booster (35 Qs / 20 Mins)',
        description: 'Dedicated 20-minute Reasoning Ability sectional test featuring Seating Arrangements, Floor Puzzles, and Syllogisms.',
        exam_category: 'SECTIONAL',
        exam_stage: 'prelims',
        total_duration_minutes: 20,
        has_sectional_timing: true,
        total_marks: 35,
        negative_marking: 0.25,
        target_cutoff: 25.5,
        is_active: true,
        sections_config: [
          {
            code: 'reasoning',
            name: 'Reasoning Ability',
            subjectCode: 'reasoning',
            questionsCount: 35,
            durationMinutes: 20,
            marksPerQuestion: 1,
            negativeMarks: 0.25,
            cutoffEstimate: 25.5
          }
        ]
      },
      {
        id: 'sectional-ga-computer-mains',
        title: 'Banking Awareness & Computer Mains Booster (40 Qs / 25 Mins)',
        description: 'Rapid Mains-stage sectional paper combining 25 RBI/Banking Awareness questions and 15 Computer Knowledge questions.',
        exam_category: 'SECTIONAL',
        exam_stage: 'mains',
        total_duration_minutes: 25,
        has_sectional_timing: false,
        total_marks: 40,
        negative_marking: 0.25,
        target_cutoff: 28.0,
        is_active: true,
        sections_config: [
          {
            code: 'ga',
            name: 'Banking & Financial Awareness',
            subjectCode: 'ga',
            questionsCount: 25,
            durationMinutes: 15,
            marksPerQuestion: 1,
            negativeMarks: 0.25,
            cutoffEstimate: 17.5
          },
          {
            code: 'computer',
            name: 'Computer Knowledge',
            subjectCode: 'computer',
            questionsCount: 15,
            durationMinutes: 10,
            marksPerQuestion: 1,
            negativeMarks: 0.25,
            cutoffEstimate: 10.5
          }
        ]
      },
      {
        id: 'rbi-gradeb-phase1-mock-1',
        title: 'RBI Grade B (Officers) Phase-I Comprehensive Mock #1',
        description: 'Authentic 200-question Phase-I simulation for Officers in Grade B with GA (80 Qs), Reasoning (60 Qs), English (30 Qs), and Quant (30 Qs).',
        exam_category: 'RBI_EXAM',
        exam_stage: 'prelims',
        total_duration_minutes: 120,
        has_sectional_timing: true,
        total_marks: 200,
        negative_marking: 0.25,
        target_cutoff: 66.75,
        is_active: true,
        sections_config: [
          {
            code: 'ga',
            name: 'General Awareness',
            subjectCode: 'ga',
            questionsCount: 80,
            durationMinutes: 25,
            marksPerQuestion: 1,
            negativeMarks: 0.25,
            cutoffEstimate: 20.0
          },
          {
            code: 'reasoning',
            name: 'Reasoning Ability',
            subjectCode: 'reasoning',
            questionsCount: 60,
            durationMinutes: 45,
            marksPerQuestion: 1,
            negativeMarks: 0.25,
            cutoffEstimate: 18.0
          },
          {
            code: 'english',
            name: 'English Language',
            subjectCode: 'english',
            questionsCount: 30,
            durationMinutes: 25,
            marksPerQuestion: 1,
            negativeMarks: 0.25,
            cutoffEstimate: 9.0
          },
          {
            code: 'quant',
            name: 'Quantitative Aptitude',
            subjectCode: 'quant',
            questionsCount: 30,
            durationMinutes: 25,
            marksPerQuestion: 1,
            negativeMarks: 0.25,
            cutoffEstimate: 8.5
          }
        ]
      },
      {
        id: 'nabard-gradea-phase1-mock-1',
        title: 'NABARD Grade A (RDBS) Phase-I Comprehensive Mock #1',
        description: 'Official 200-question Phase-I paper combining qualifying test sections (Reasoning, English, Computer, Quant) and merit sections (GA & Economic Development).',
        exam_category: 'NABARD',
        exam_stage: 'prelims',
        total_duration_minutes: 120,
        has_sectional_timing: false,
        total_marks: 200,
        negative_marking: 0.25,
        target_cutoff: 46.5,
        is_active: true,
        sections_config: [
          {
            code: 'reasoning',
            name: 'Reasoning Ability',
            subjectCode: 'reasoning',
            questionsCount: 20,
            durationMinutes: 15,
            marksPerQuestion: 1,
            negativeMarks: 0.25,
            cutoffEstimate: 6.0
          },
          {
            code: 'english',
            name: 'English Language',
            subjectCode: 'english',
            questionsCount: 30,
            durationMinutes: 20,
            marksPerQuestion: 1,
            negativeMarks: 0.25,
            cutoffEstimate: 9.0
          },
          {
            code: 'computer',
            name: 'Computer Knowledge',
            subjectCode: 'computer',
            questionsCount: 20,
            durationMinutes: 15,
            marksPerQuestion: 1,
            negativeMarks: 0.25,
            cutoffEstimate: 6.0
          },
          {
            code: 'quant',
            name: 'Quantitative Aptitude',
            subjectCode: 'quant',
            questionsCount: 20,
            durationMinutes: 15,
            marksPerQuestion: 1,
            negativeMarks: 0.25,
            cutoffEstimate: 6.0
          },
          {
            code: 'ga',
            name: 'General Awareness & Economic Development',
            subjectCode: 'ga',
            questionsCount: 60,
            durationMinutes: 30,
            marksPerQuestion: 1,
            negativeMarks: 0.25,
            cutoffEstimate: 16.0
          },
          {
            code: 'ga_ard',
            name: 'Agriculture & Rural Development (ARD)',
            subjectCode: 'ga',
            questionsCount: 50,
            durationMinutes: 25,
            marksPerQuestion: 1,
            negativeMarks: 0.25,
            cutoffEstimate: 14.0
          }
        ]
      },
      {
        id: 'sebi-gradea-phase1-mock-1',
        title: 'SEBI Grade A (Assistant Manager) Phase-I Paper-1 Mock #1',
        description: 'Securities and Exchange Board of India Phase-I Paper-1 general paper with GA, English, Quant, and Reasoning.',
        exam_category: 'RBI_EXAM',
        exam_stage: 'prelims',
        total_duration_minutes: 60,
        has_sectional_timing: false,
        total_marks: 100,
        negative_marking: 0.25,
        target_cutoff: 30.0,
        is_active: true,
        sections_config: [
          {
            code: 'ga',
            name: 'General Awareness (Financial Sector)',
            subjectCode: 'ga',
            questionsCount: 25,
            durationMinutes: 15,
            marksPerQuestion: 1,
            negativeMarks: 0.25,
            cutoffEstimate: 8.0
          },
          {
            code: 'english',
            name: 'English Language',
            subjectCode: 'english',
            questionsCount: 25,
            durationMinutes: 15,
            marksPerQuestion: 1,
            negativeMarks: 0.25,
            cutoffEstimate: 8.0
          },
          {
            code: 'quant',
            name: 'Quantitative Aptitude',
            subjectCode: 'quant',
            questionsCount: 25,
            durationMinutes: 15,
            marksPerQuestion: 1,
            negativeMarks: 0.25,
            cutoffEstimate: 8.0
          },
          {
            code: 'reasoning',
            name: 'Reasoning Ability',
            subjectCode: 'reasoning',
            questionsCount: 25,
            durationMinutes: 15,
            marksPerQuestion: 1,
            negativeMarks: 0.25,
            cutoffEstimate: 8.0
          }
        ]
      },
      {
        id: 'lic-aao-prelims-mock-1',
        title: 'LIC AAO Prelims All-India Championship Mock #1',
        description: 'Complete 100-question Life Insurance Corporation Assistant Administrative Officer preliminary test (Reasoning, Quant, and English).',
        exam_category: 'INSURANCE',
        exam_stage: 'prelims',
        total_duration_minutes: 60,
        has_sectional_timing: true,
        total_marks: 70,
        negative_marking: 0.25,
        target_cutoff: 58.0,
        is_active: true,
        sections_config: [
          {
            code: 'reasoning',
            name: 'Reasoning Ability',
            subjectCode: 'reasoning',
            questionsCount: 35,
            durationMinutes: 20,
            marksPerQuestion: 1,
            negativeMarks: 0.25,
            cutoffEstimate: 23.0
          },
          {
            code: 'quant',
            name: 'Quantitative Aptitude',
            subjectCode: 'quant',
            questionsCount: 35,
            durationMinutes: 20,
            marksPerQuestion: 1,
            negativeMarks: 0.25,
            cutoffEstimate: 22.0
          },
          {
            code: 'english',
            name: 'English Language (Qualifying)',
            subjectCode: 'english',
            questionsCount: 30,
            durationMinutes: 20,
            marksPerQuestion: 1,
            negativeMarks: 0.25,
            cutoffEstimate: 10.0
          }
        ]
      },
      {
        id: 'ibps-so-prelims-mock-1',
        title: 'IBPS SO (Specialist Officers) Prelims Mock #1',
        description: '150-question preliminary test for Specialist Officers (IT / Marketing / HR / Agriculture) with Reasoning, English, and Quant.',
        exam_category: 'SPECIALIST',
        exam_stage: 'prelims',
        total_duration_minutes: 120,
        has_sectional_timing: true,
        total_marks: 125,
        negative_marking: 0.25,
        target_cutoff: 62.5,
        is_active: true,
        sections_config: [
          {
            code: 'english',
            name: 'English Language',
            subjectCode: 'english',
            questionsCount: 50,
            durationMinutes: 40,
            marksPerQuestion: 0.5,
            negativeMarks: 0.125,
            cutoffEstimate: 11.5
          },
          {
            code: 'reasoning',
            name: 'Reasoning Ability',
            subjectCode: 'reasoning',
            questionsCount: 50,
            durationMinutes: 40,
            marksPerQuestion: 1,
            negativeMarks: 0.25,
            cutoffEstimate: 15.0
          },
          {
            code: 'quant',
            name: 'Quantitative Aptitude',
            subjectCode: 'quant',
            questionsCount: 50,
            durationMinutes: 40,
            marksPerQuestion: 1,
            negativeMarks: 0.25,
            cutoffEstimate: 14.0
          }
        ]
      },
      {
        id: 'idbi-am-full-mock-1',
        title: 'IDBI Bank Executive / Assistant Manager Full-Length Mock #1',
        description: '200-question, 120-minute comprehensive single-tier examination with Reasoning, English, Quant, and General/Banking Awareness.',
        exam_category: 'SPECIALIST',
        exam_stage: 'prelims',
        total_duration_minutes: 120,
        has_sectional_timing: false,
        total_marks: 200,
        negative_marking: 0.25,
        target_cutoff: 112.0,
        is_active: true,
        sections_config: [
          {
            code: 'reasoning',
            name: 'Logical Reasoning & Data Analysis',
            subjectCode: 'reasoning',
            questionsCount: 60,
            durationMinutes: 35,
            marksPerQuestion: 1,
            negativeMarks: 0.25,
            cutoffEstimate: 17.5
          },
          {
            code: 'english',
            name: 'English Language',
            subjectCode: 'english',
            questionsCount: 40,
            durationMinutes: 25,
            marksPerQuestion: 1,
            negativeMarks: 0.25,
            cutoffEstimate: 12.0
          },
          {
            code: 'quant',
            name: 'Quantitative Aptitude',
            subjectCode: 'quant',
            questionsCount: 40,
            durationMinutes: 30,
            marksPerQuestion: 1,
            negativeMarks: 0.25,
            cutoffEstimate: 13.0
          },
          {
            code: 'ga',
            name: 'General Economy & Banking Awareness',
            subjectCode: 'ga',
            questionsCount: 60,
            durationMinutes: 30,
            marksPerQuestion: 1,
            negativeMarks: 0.25,
            cutoffEstimate: 16.0
          }
        ]
      },
      {
        id: 'sbi-clerk-mains-mock-1',
        title: 'SBI Clerk (Junior Associates) Mains Full-Length Mock #1',
        description: '190-question, 160-minute Phase-II Mains examination for SBI Junior Associates across GA, English, Quant, and Reasoning/Computer.',
        exam_category: 'SBI_CLERK',
        exam_stage: 'mains',
        total_duration_minutes: 160,
        has_sectional_timing: true,
        total_marks: 200,
        negative_marking: 0.25,
        target_cutoff: 92.0,
        is_active: true,
        sections_config: [
          {
            code: 'ga',
            name: 'General / Financial Awareness',
            subjectCode: 'ga',
            questionsCount: 50,
            durationMinutes: 35,
            marksPerQuestion: 1,
            negativeMarks: 0.25,
            cutoffEstimate: 19.0
          },
          {
            code: 'english',
            name: 'General English',
            subjectCode: 'english',
            questionsCount: 40,
            durationMinutes: 35,
            marksPerQuestion: 1,
            negativeMarks: 0.25,
            cutoffEstimate: 17.0
          },
          {
            code: 'quant',
            name: 'Quantitative Aptitude',
            subjectCode: 'quant',
            questionsCount: 50,
            durationMinutes: 45,
            marksPerQuestion: 1,
            negativeMarks: 0.25,
            cutoffEstimate: 18.0
          },
          {
            code: 'reasoning',
            name: 'Reasoning Ability & Computer Aptitude',
            subjectCode: 'reasoning',
            questionsCount: 50,
            durationMinutes: 45,
            marksPerQuestion: 1.2,
            negativeMarks: 0.3,
            cutoffEstimate: 20.0
          }
        ]
      },
      {
        id: 'rrb-clerk-mains-mock-1',
        title: 'IBPS RRB Clerk (Office Assistant) Mains Mock #1',
        description: '200-question, 120-minute Phase-II Mains paper for RRB Office Assistants with Reasoning, Computer, GA, English, and Numerical Ability.',
        exam_category: 'RRB_CLERK',
        exam_stage: 'mains',
        total_duration_minutes: 120,
        has_sectional_timing: true,
        total_marks: 200,
        negative_marking: 0.25,
        target_cutoff: 128.5,
        is_active: true,
        sections_config: [
          {
            code: 'reasoning',
            name: 'Reasoning',
            subjectCode: 'reasoning',
            questionsCount: 40,
            durationMinutes: 30,
            marksPerQuestion: 1.25,
            negativeMarks: 0.3125,
            cutoffEstimate: 26.0
          },
          {
            code: 'computer',
            name: 'Computer Knowledge',
            subjectCode: 'computer',
            questionsCount: 40,
            durationMinutes: 15,
            marksPerQuestion: 0.5,
            negativeMarks: 0.125,
            cutoffEstimate: 22.0
          },
          {
            code: 'ga',
            name: 'General Awareness',
            subjectCode: 'ga',
            questionsCount: 40,
            durationMinutes: 20,
            marksPerQuestion: 1,
            negativeMarks: 0.25,
            cutoffEstimate: 20.0
          },
          {
            code: 'english',
            name: 'English Language',
            subjectCode: 'english',
            questionsCount: 40,
            durationMinutes: 25,
            marksPerQuestion: 1,
            negativeMarks: 0.25,
            cutoffEstimate: 20.0
          },
          {
            code: 'quant',
            name: 'Numerical Ability',
            subjectCode: 'quant',
            questionsCount: 40,
            durationMinutes: 30,
            marksPerQuestion: 1.25,
            negativeMarks: 0.3125,
            cutoffEstimate: 24.0
          }
        ]
      }
    ];
  }

  // =========================================================================
  // EXAM GENERATION ENGINE
  // =========================================================================

  generateExamQuestions(blueprint: MockExamBlueprint): ExamQuestionItem[] {
    const allQuestions: ExamQuestionItem[] = [];
    let overallQuestionIndex = 1;

    for (const section of blueprint.sections_config) {
      let sectionQuestions: ExamQuestionItem[] = [];

      switch (section.subjectCode) {
        case 'quant':
          sectionQuestions = this.generateQuantSection(section.questionsCount, section.code, section.name);
          break;
        case 'reasoning':
          sectionQuestions = this.generateReasoningSection(section.questionsCount, section.code, section.name);
          break;
        case 'english':
          sectionQuestions = this.generateEnglishSection(section.questionsCount, section.code, section.name);
          break;
        case 'ga':
          sectionQuestions = this.generateGaSection(section.questionsCount, section.code, section.name);
          break;
        case 'computer':
          sectionQuestions = this.generateComputerSection(section.questionsCount, section.code, section.name);
          break;
        default:
          sectionQuestions = this.generateQuantSection(section.questionsCount, section.code, section.name);
          break;
      }

      // Assign global numbering and blueprint marks
      sectionQuestions.forEach(q => {
        q.questionNumber = overallQuestionIndex++;
        q.marks = section.marksPerQuestion;
        q.negativeMarks = section.negativeMarks;
      });

      allQuestions.push(...sectionQuestions);
    }

    return allQuestions;
  }

  // =========================================================================
  // QUANTITATIVE APTITUDE GENERATOR
  // =========================================================================

  private generateQuantSection(count: number, sectionCode: string, sectionName: string): ExamQuestionItem[] {
    const items: ExamQuestionItem[] = [];
    const runId = Math.random().toString(36).substring(2, 7);

    // Distribution:
    // If full 35 Qs:
    // 5 Simplification, 5 Quadratic, 5 Series, 5 Data Interpretation (Table DI), 15 Arithmetic Word Problems
    const simpCount = Math.min(5, Math.ceil(count * 0.15));
    const quadCount = Math.min(5, Math.ceil(count * 0.15));
    const seriesCount = Math.min(5, Math.ceil(count * 0.15));
    const diCount = count >= 20 ? 5 : 0;
    const arithmeticCount = Math.max(1, count - (simpCount + quadCount + seriesCount + diCount));

    // 1. Simplification
    for (let i = 0; i < simpCount; i++) {
      items.push(this.buildSimplificationQuestion(`${runId}-simp-${i}`, sectionCode, sectionName));
    }

    // 2. Quadratic Equations
    for (let i = 0; i < quadCount; i++) {
      items.push(this.buildQuadraticQuestion(`${runId}-quad-${i}`, sectionCode, sectionName));
    }

    // 3. Number Series (Missing & Wrong)
    for (let i = 0; i < seriesCount; i++) {
      items.push(this.buildNumberSeriesQuestion(`${runId}-ser-${i}`, sectionCode, sectionName, i % 2 === 0));
    }

    // 4. Data Interpretation (Table DI)
    if (diCount > 0) {
      items.push(...this.buildTableDiSet(`${runId}-di`, sectionCode, sectionName));
    }

    // 5. Arithmetic Word Problems
    const arithmeticTopics = [
      'Profit & Loss',
      'Simple & Compound Interest',
      'Time, Speed & Distance',
      'Boats & Streams',
      'Time & Work',
      'Pipes & Cisterns',
      'Mixtures & Alligation',
      'Partnership',
      'Ages',
      'Averages',
      'Mensuration',
      'Probability'
    ];

    for (let i = 0; i < arithmeticCount; i++) {
      const topic = arithmeticTopics[i % arithmeticTopics.length];
      items.push(this.buildArithmeticQuestion(`${runId}-arith-${i}`, sectionCode, sectionName, topic));
    }

    // If count was smaller or larger, slice to exact requirement
    return items.slice(0, count);
  }

  // --- Quant Sub-Generators ---

  private buildSimplificationQuestion(id: string, sectionCode: string, sectionName: string): ExamQuestionItem {
    const subType = Math.floor(Math.random() * 4);

    if (subType === 0) {
      // BODMAS with squares and percentages: ? = (A% of B) + C^2 - D
      const percent = (Math.floor(Math.random() * 8) + 2) * 5; // 10, 15, ..., 50
      const baseNum = (Math.floor(Math.random() * 6) + 2) * 40; // 80, 120, ..., 280
      const c = Math.floor(Math.random() * 8) + 12; // 12..19 (squares: 144..361)
      const d = Math.floor(Math.random() * 40) + 10;
      const part1 = (percent * baseNum) / 100;
      const part2 = c * c;
      const correctVal = part1 + part2 - d;

      const distractors = this.generateNumericDistractors(correctVal, [
        correctVal + 10,
        correctVal - 10,
        part1 + c - d,
        correctVal + (c % 5)
      ]);

      const { options, correctIndex } = this.format5Options(correctVal.toString(), distractors.map(d => d.toString()));

      return {
        id,
        sectionCode,
        sectionName,
        questionNumber: 0,
        subjectCode: 'quant',
        topicName: 'Simplification & Approximation',
        patternCode: 'QUAN_SIMP_01',
        difficulty: 'easy',
        questionText: `What value should come in place of the question mark (?) in the following equation?\n\n(${percent}% of ${baseNum}) + ${c}² - ${d} = ?`,
        options,
        correctOptionIndex: correctIndex,
        explanation: `Step 1: Calculate ${percent}% of ${baseNum} = (${percent} / 100) × ${baseNum} = ${part1}.\nStep 2: Calculate ${c}² = ${part2}.\nStep 3: Combine terms: ${part1} + ${part2} - ${d} = ${correctVal}.\nHence, the correct answer is ${correctVal}.`,
        marks: 1,
        negativeMarks: 0.25
      };
    } else if (subType === 1) {
      // Square roots and division: ? = √A + (B × C) ÷ D
      const rootBase = (Math.floor(Math.random() * 15) + 15); // 15..29
      const a = rootBase * rootBase;
      const d = Math.floor(Math.random() * 4) + 3; // 3, 4, 5, 6
      const c = d * (Math.floor(Math.random() * 4) + 2); // multiple of d
      const b = (Math.floor(Math.random() * 12) + 6);
      const divisionPart = (b * c) / d;
      const correctVal = rootBase + divisionPart;

      const distractors = this.generateNumericDistractors(correctVal, [
        correctVal + d,
        correctVal - rootBase,
        correctVal + 12,
        rootBase * 2 + divisionPart
      ]);
      const { options, correctIndex } = this.format5Options(correctVal.toString(), distractors.map(d => d.toString()));

      return {
        id,
        sectionCode,
        sectionName,
        questionNumber: 0,
        subjectCode: 'quant',
        topicName: 'Simplification & Approximation',
        patternCode: 'QUAN_SIMP_02',
        difficulty: 'easy',
        questionText: `Find the value of (?):\n\n√${a} + (${b} × ${c}) ÷ ${d} = ?`,
        options,
        correctOptionIndex: correctIndex,
        explanation: `Step 1: √${a} = ${rootBase}.\nStep 2: (${b} × ${c}) ÷ ${d} = ${b * c} ÷ ${d} = ${divisionPart}.\nStep 3: ${rootBase} + ${divisionPart} = ${correctVal}.`,
        marks: 1,
        negativeMarks: 0.25
      };
    } else if (subType === 2) {
      // Fraction addition and percentage
      const num1 = 3;
      const den1 = 4;
      const num2 = 2;
      const den2 = 5;
      const baseOf = 200;
      // (3/4 + 2/5) of 200 = (23/20) * 200 = 230
      const multiplier = Math.floor(Math.random() * 4) + 1;
      const totalBase = baseOf * multiplier;
      const correctVal = Math.round(((num1 / den1) + (num2 / den2)) * totalBase);

      const distractors = this.generateNumericDistractors(correctVal, [
        correctVal - 20,
        correctVal + 20,
        correctVal - 10,
        correctVal + 40
      ]);
      const { options, correctIndex } = this.format5Options(correctVal.toString(), distractors.map(d => d.toString()));

      return {
        id,
        sectionCode,
        sectionName,
        questionNumber: 0,
        subjectCode: 'quant',
        topicName: 'Simplification & Approximation',
        patternCode: 'QUAN_SIMP_03',
        difficulty: 'easy',
        questionText: `Evaluate the expression:\n\n(${num1}/${den1} + ${num2}/${den2}) of ${totalBase} = ?`,
        options,
        correctOptionIndex: correctIndex,
        explanation: `Step 1: Take LCM of denominators 4 and 5, which is 20.\nStep 2: (${num1}/4) + (${num2}/5) = (15 + 8) / 20 = 23/20.\nStep 3: (23 / 20) × ${totalBase} = 23 × ${totalBase / 20} = ${correctVal}.`,
        marks: 1,
        negativeMarks: 0.25
      };
    } else {
      // Approximation: ? ≈ 49.98% of 640.12 - 14.02 × 11.97
      const p = 50;
      const b = (Math.floor(Math.random() * 5) + 6) * 100; // 600..1000
      const m1 = 14;
      const m2 = 12;
      const correctVal = Math.round((p / 100) * b - (m1 * m2));

      const distractors = this.generateNumericDistractors(correctVal, [
        correctVal + 15,
        correctVal - 15,
        correctVal + 25,
        correctVal - 30
      ]);
      const { options, correctIndex } = this.format5Options(correctVal.toString(), distractors.map(d => d.toString()));

      return {
        id,
        sectionCode,
        sectionName,
        questionNumber: 0,
        subjectCode: 'quant',
        topicName: 'Simplification & Approximation',
        patternCode: 'QUAN_SIMP_04',
        difficulty: 'easy',
        questionText: `What approximate value should come in place of the question mark (?) in the following question?\n(Note: You are not expected to calculate the exact value)\n\n49.98% of ${b + 0.12} - 13.98 × 12.04 = ?`,
        options,
        correctOptionIndex: correctIndex,
        explanation: `Approximate values:\n49.98% ≈ 50% = 1/2\n${b + 0.12} ≈ ${b}\n13.98 ≈ 14\n12.04 ≈ 12\n\nCalculation:\n(50% of ${b}) - (14 × 12) = ${b / 2} - 168 = ${correctVal}.`,
        marks: 1,
        negativeMarks: 0.25
      };
    }
  }

  private buildQuadraticQuestion(id: string, sectionCode: string, sectionName: string): ExamQuestionItem {
    // Generate two factorable quadratics:
    // x^2 - (r1 + r2)x + (r1 * r2) = 0 => roots x = r1, r2
    // y^2 - (s1 + s2)y + (s1 * s2) = 0 => roots y = s1, s2
    const scenario = Math.floor(Math.random() * 5);
    let r1 = 3, r2 = 4, s1 = 1, s2 = 2; // Default x > y

    if (scenario === 0) {
      // x > y
      r1 = Math.floor(Math.random() * 3) + 7; // 7, 8, 9
      r2 = Math.floor(Math.random() * 2) + 5; // 5, 6
      s1 = Math.floor(Math.random() * 2) + 2; // 2, 3
      s2 = Math.floor(Math.random() * 2) + 3; // 3, 4
    } else if (scenario === 1) {
      // x < y
      r1 = Math.floor(Math.random() * 2) + 2;
      r2 = Math.floor(Math.random() * 2) + 3;
      s1 = Math.floor(Math.random() * 3) + 6;
      s2 = Math.floor(Math.random() * 2) + 8;
    } else if (scenario === 2) {
      // x >= y
      r1 = 5; r2 = 7;
      s1 = 3; s2 = 5; // r1 == s2, so x >= y
    } else if (scenario === 3) {
      // x <= y
      r1 = 3; r2 = 4;
      s1 = 4; s2 = 6; // r2 == s1, so x <= y
    } else {
      // Relationship cannot be determined / overlapping
      r1 = 3; r2 = 8;
      s1 = 5; s2 = 6; // 3 < 5, but 8 > 6 => Cannot determine
    }

    const bx = -(r1 + r2);
    const cx = r1 * r2;
    const by = -(s1 + s2);
    const cy = s1 * s2;

    const eqX = `x² ${bx >= 0 ? '+' : '-'} ${Math.abs(bx)}x + ${cx} = 0`;
    const eqY = `y² ${by >= 0 ? '+' : '-'} ${Math.abs(by)}y + ${cy} = 0`;

    // Standard 5 options for Indian bank exam quadratic equations
    const options = [
      'x > y',
      'x < y',
      'x ≥ y',
      'x ≤ y',
      'x = y or relationship between x and y cannot be established'
    ];

    let correctIndex = 4;
    let relationText = 'x = y or relationship cannot be established';

    const minX = Math.min(r1, r2);
    const maxX = Math.max(r1, r2);
    const minY = Math.min(s1, s2);
    const maxY = Math.max(s1, s2);

    if (minX > maxY) {
      correctIndex = 0;
      relationText = 'x > y';
    } else if (maxX < minY) {
      correctIndex = 1;
      relationText = 'x < y';
    } else if (minX >= maxY) {
      correctIndex = 2;
      relationText = 'x ≥ y';
    } else if (maxX <= minY) {
      correctIndex = 3;
      relationText = 'x ≤ y';
    } else {
      correctIndex = 4;
      relationText = 'x = y or relationship between x and y cannot be established';
    }

    return {
      id,
      sectionCode,
      sectionName,
      questionNumber: 0,
      subjectCode: 'quant',
      topicName: 'Quadratic Equations',
      patternCode: 'QUAN_QUAD_01',
      difficulty: 'medium',
      questionText: `In the following question, two equations (I) and (II) are given. You have to solve both equations and establish the relation between x and y:\n\nI. ${eqX}\nII. ${eqY}`,
      options,
      correctOptionIndex: correctIndex,
      explanation: `Equation I: ${eqX}\nFactorizing: (x - ${r1})(x - ${r2}) = 0\nRoots of x = ${r1}, ${r2}\n\nEquation II: ${eqY}\nFactorizing: (y - ${s1})(y - ${s2}) = 0\nRoots of y = ${s1}, ${s2}\n\nComparison:\nRoots of x: ${r1}, ${r2}\nRoots of y: ${s1}, ${s2}\nComparing all root pairs gives relation: ${relationText}.`,
      marks: 1,
      negativeMarks: 0.25
    };
  }

  private buildNumberSeriesQuestion(id: string, sectionCode: string, sectionName: string, isMissing: boolean): ExamQuestionItem {
    const patternType = Math.floor(Math.random() * 4);
    let series: number[] = [];
    let answer = 0;
    let explanationText = '';
    let questionText = '';

    if (patternType === 0) {
      // Geometric difference / powers of 2: +3, +6, +12, +24, +48
      const start = Math.floor(Math.random() * 20) + 10;
      const baseDiff = Math.floor(Math.random() * 3) + 3; // 3, 4, 5
      series = [start];
      let current = start;
      let diff = baseDiff;
      for (let k = 0; k < 5; k++) {
        current += diff;
        series.push(current);
        diff *= 2;
      }
      if (isMissing) {
        answer = series[4];
        series[4] = NaN; // Missing item represented as ?
        questionText = `What will come in place of the question mark (?) in the following number series?\n\n${series.map(v => isNaN(v) ? '?' : v).join(', ')}`;
        explanationText = `Pattern of differences:\nEach subsequent difference is multiplied by 2 (×2):\n+${baseDiff}, +${baseDiff * 2}, +${baseDiff * 4}, +${baseDiff * 8}, +${baseDiff * 16}.\nHence the missing number is ${answer}.`;
      } else {
        // Wrong number series: introduce error at index 3
        const wrongIdx = 3;
        const correctVal = series[wrongIdx];
        answer = correctVal + 5; // The wrong term shown in series
        series[wrongIdx] = answer;
        questionText = `Find the wrong term in the given number series:\n\n${series.join(', ')}`;
        explanationText = `The pattern is differences doubling each step (+${baseDiff}, +${baseDiff * 2}, +${baseDiff * 4}, ...).\nAt term #${wrongIdx + 1}, the value is ${answer}, which should have been ${correctVal}.\nTherefore, the wrong term is ${answer}.`;
      }
    } else if (patternType === 1) {
      // n^2 + 1 series: 2, 5, 10, 17, 26, 37, 50
      const offset = Math.floor(Math.random() * 5) + 1;
      const terms: number[] = [];
      for (let n = 2; n <= 7; n++) {
        terms.push(n * n + offset);
      }
      answer = terms[4];
      terms[4] = NaN;
      questionText = `What will come in place of the question mark (?) in the following number series?\n\n${terms.map(v => isNaN(v) ? '?' : v).join(', ')}`;
      explanationText = `Pattern: n² + ${offset} for n = 2, 3, 4, 5, 6, 7.\nFor the 5th term (n = 6): 6² + ${offset} = 36 + ${offset} = ${answer}.`;
    } else if (patternType === 2) {
      // Alternating operations: ×2 + 1, ×2 + 2, ×2 + 3...
      const start = Math.floor(Math.random() * 5) + 3;
      series = [start];
      let cur = start;
      for (let k = 1; k <= 5; k++) {
        cur = cur * 2 + k;
        series.push(cur);
      }
      answer = series[4];
      series[4] = NaN;
      questionText = `Identify the number that replaces (?) in the series:\n\n${series.map(v => isNaN(v) ? '?' : v).join(', ')}`;
      explanationText = `Pattern:\nTerm 2 = (Term 1 × 2) + 1\nTerm 3 = (Term 2 × 2) + 2\nTerm 4 = (Term 3 × 2) + 3\nTerm 5 = (Term 4 × 2) + 4 = ${answer}.`;
    } else {
      // Cube differences: +8 (+2^3), +27 (+3^3), +64 (+4^3), +125 (+5^3)
      const start = Math.floor(Math.random() * 30) + 15;
      series = [start];
      let cur = start;
      const cubes = [8, 27, 64, 125, 216];
      for (let k = 0; k < 5; k++) {
        cur += cubes[k];
        series.push(cur);
      }
      answer = series[4];
      series[4] = NaN;
      questionText = `Find the value of (?) in the following series:\n\n${series.map(v => isNaN(v) ? '?' : v).join(', ')}`;
      explanationText = `Difference between consecutive numbers are cubes of consecutive natural numbers:\n+2³ (8), +3³ (27), +4³ (64), +5³ (125), +6³ (216).\nMissing term = ${series[3]} + 125 = ${answer}.`;
    }

    const distractors = this.generateNumericDistractors(answer, [
      answer + 6,
      answer - 6,
      answer + 14,
      answer - 12
    ]);
    const { options, correctIndex } = this.format5Options(answer.toString(), distractors.map(d => d.toString()));

    return {
      id,
      sectionCode,
      sectionName,
      questionNumber: 0,
      subjectCode: 'quant',
      topicName: isMissing ? 'Missing Number Series' : 'Wrong Number Series',
      patternCode: 'QUAN_SER_01',
      difficulty: 'medium',
      questionText,
      options,
      correctOptionIndex: correctIndex,
      explanation: explanationText,
      marks: 1,
      negativeMarks: 0.25
    };
  }

  private buildTableDiSet(idPrefix: string, sectionCode: string, sectionName: string): ExamQuestionItem[] {
    // Generate a full 5-question Data Interpretation set based on a common tabular dataset
    const cities = ['Mumbai', 'Delhi', 'Bengaluru', 'Kolkata'];
    const totalAppeared = [1200, 1500, 1800, 900];
    const passPercentage = [65, 60, 75, 50]; // % passed
    const passedCounts = totalAppeared.map((t, idx) => Math.round((t * passPercentage[idx]) / 100));

    const tableMarkdown =
      `Directions (Q. 1 to 5): Study the following table carefully and answer the questions based on it.\n` +
      `The table shows the number of candidates who appeared and the percentage of candidates who passed the examination from 4 different centers:\n\n` +
      `| Center | Total Candidates Appeared | Percentage of Candidates Passed |\n` +
      `| :--- | :--- | :--- |\n` +
      `| Mumbai | 1,200 | 65% |\n` +
      `| Delhi | 1,500 | 60% |\n` +
      `| Bengaluru | 1,800 | 75% |\n` +
      `| Kolkata | 900 | 50% |\n`;

    const diQuestions: ExamQuestionItem[] = [];

    // Q1: Total passed from Mumbai and Delhi combined
    const q1Ans = passedCounts[0] + passedCounts[1]; // 780 + 900 = 1680
    const q1Dis = this.generateNumericDistractors(q1Ans, [1620, 1720, 1580, 1740]);
    const q1Fmt = this.format5Options(q1Ans.toString(), q1Dis.map(d => d.toString()));
    diQuestions.push({
      id: `${idPrefix}-1`,
      sectionCode,
      sectionName,
      questionNumber: 0,
      subjectCode: 'quant',
      topicName: 'Data Interpretation (Table DI)',
      patternCode: 'QUAN_DI_01',
      difficulty: 'medium',
      passageText: tableMarkdown,
      questionText: `What is the total number of candidates who passed the examination from Mumbai and Delhi centers together?`,
      options: q1Fmt.options,
      correctOptionIndex: q1Fmt.correctIndex,
      explanation: `Candidates passed from Mumbai = 65% of 1,200 = 0.65 × 1,200 = ${passedCounts[0]}.\nCandidates passed from Delhi = 60% of 1,500 = 0.60 × 1,500 = ${passedCounts[1]}.\nTotal passed together = ${passedCounts[0]} + ${passedCounts[1]} = ${q1Ans}.`,
      marks: 1,
      negativeMarks: 0.25
    });

    // Q2: Ratio of passed in Bengaluru to failed in Kolkata
    const kolkataFailed = totalAppeared[3] - passedCounts[3]; // 900 - 450 = 450
    // Bengaluru passed = 1350. Ratio 1350 : 450 = 3 : 1
    const q2Fmt = this.format5Options('3 : 1', ['2 : 1', '4 : 3', '5 : 2', '3 : 2']);
    diQuestions.push({
      id: `${idPrefix}-2`,
      sectionCode,
      sectionName,
      questionNumber: 0,
      subjectCode: 'quant',
      topicName: 'Data Interpretation (Table DI)',
      patternCode: 'QUAN_DI_02',
      difficulty: 'medium',
      passageText: tableMarkdown,
      questionText: `What is the ratio of the number of candidates who passed from Bengaluru to the number of candidates who failed from Kolkata?`,
      options: q2Fmt.options,
      correctOptionIndex: q2Fmt.correctIndex,
      explanation: `Bengaluru passed = 75% of 1,800 = ${passedCounts[2]}.\nKolkata failed = 100% - 50% = 50% of 900 = ${kolkataFailed}.\nRatio = ${passedCounts[2]} : ${kolkataFailed} = 1350 : 450 = 3 : 1.`,
      marks: 1,
      negativeMarks: 0.25
    });

    // Q3: Percentage more/less
    // Total appeared in Delhi is what percent less than total appeared in Bengaluru?
    // (1800 - 1500) / 1800 * 100 = 300 / 1800 * 100 = 16.67%
    const q3Fmt = this.format5Options('16.67%', ['20%', '15%', '12.5%', '18.25%']);
    diQuestions.push({
      id: `${idPrefix}-3`,
      sectionCode,
      sectionName,
      questionNumber: 0,
      subjectCode: 'quant',
      topicName: 'Data Interpretation (Table DI)',
      patternCode: 'QUAN_DI_03',
      difficulty: 'medium',
      passageText: tableMarkdown,
      questionText: `The total number of candidates who appeared from Delhi is approximately what percentage less than the total number of candidates who appeared from Bengaluru?`,
      options: q3Fmt.options,
      correctOptionIndex: q3Fmt.correctIndex,
      explanation: `Appeared from Delhi = 1,500\nAppeared from Bengaluru = 1,800\nDifference = 1,800 - 1,500 = 300\nPercentage less = (300 / 1,800) × 100 = 100 / 6 ≈ 16.67%.`,
      marks: 1,
      negativeMarks: 0.25
    });

    // Q4: Average passed candidates
    const avgPassed = Math.round((passedCounts[0] + passedCounts[1] + passedCounts[2] + passedCounts[3]) / 4); // (780 + 900 + 1350 + 450) / 4 = 3480 / 4 = 870
    const q4Dis = this.generateNumericDistractors(avgPassed, [840, 890, 860, 910]);
    const q4Fmt = this.format5Options(avgPassed.toString(), q4Dis.map(d => d.toString()));
    diQuestions.push({
      id: `${idPrefix}-4`,
      sectionCode,
      sectionName,
      questionNumber: 0,
      subjectCode: 'quant',
      topicName: 'Data Interpretation (Table DI)',
      patternCode: 'QUAN_DI_04',
      difficulty: 'medium',
      passageText: tableMarkdown,
      questionText: `What is the average number of passed candidates across all four centers combined?`,
      options: q4Fmt.options,
      correctOptionIndex: q4Fmt.correctIndex,
      explanation: `Passed candidates:\nMumbai: ${passedCounts[0]}\nDelhi: ${passedCounts[1]}\nBengaluru: ${passedCounts[2]}\nKolkata: ${passedCounts[3]}\n\nTotal passed = 780 + 900 + 1350 + 450 = 3,480.\nAverage = 3,480 / 4 = ${avgPassed}.`,
      marks: 1,
      negativeMarks: 0.25
    });

    // Q5: Center with maximum failed candidates
    // Mumbai failed: 1200 - 780 = 420
    // Delhi failed: 1500 - 900 = 600 (Max)
    // Bengaluru failed: 1800 - 1350 = 450
    // Kolkata failed: 900 - 450 = 450
    const q5Fmt = this.format5Options('Delhi', ['Mumbai', 'Bengaluru', 'Kolkata', 'Both Kolkata & Mumbai']);
    diQuestions.push({
      id: `${idPrefix}-5`,
      sectionCode,
      sectionName,
      questionNumber: 0,
      subjectCode: 'quant',
      topicName: 'Data Interpretation (Table DI)',
      patternCode: 'QUAN_DI_05',
      difficulty: 'medium',
      passageText: tableMarkdown,
      questionText: `Which examination center recorded the highest number of failed candidates?`,
      options: q5Fmt.options,
      correctOptionIndex: q5Fmt.correctIndex,
      explanation: `Number of failed candidates by center:\n• Mumbai: 1,200 - 780 = 420\n• Delhi: 1,500 - 900 = 600 (Maximum)\n• Bengaluru: 1,800 - 1350 = 450\n• Kolkata: 900 - 450 = 450\n\nTherefore, Delhi recorded the highest number of failed candidates (600).`,
      marks: 1,
      negativeMarks: 0.25
    });

    return diQuestions;
  }

  private buildArithmeticQuestion(id: string, sectionCode: string, sectionName: string, topic: string, index: number = 0): ExamQuestionItem {
    switch (topic) {
      case 'Percentage':
      case 'Percentage & Fractions':
      case 'Percentage & Profit/Loss': {
        const variant = index % 3;
        if (variant === 0) {
          // Price increase and consumption reduction
          const increases = [20, 25, 50, 10, 30];
          const inc = increases[index % increases.length];
          const redPercent = inc === 20 ? 16.67 : (inc === 25 ? 20 : (inc === 50 ? 33.33 : (inc === 10 ? 9.09 : 23.08)));
          const distractors = this.generateNumericDistractors(redPercent, [redPercent + 5, redPercent - 4, inc, redPercent + 10]);
          const fmt = this.format5Options(`${redPercent}%`, distractors.map(d => `${d}%`));

          return {
            id,
            sectionCode,
            sectionName,
            questionNumber: 0,
            subjectCode: 'quant',
            topicName: 'Percentage',
            patternCode: 'QUAN_ARITH_PERCENT_CONS',
            difficulty: 'easy',
            questionText: `If the price of sugar increases by ${inc}%, by what percentage must a household reduce its consumption so that the total expenditure remains unchanged?`,
            options: fmt.options,
            correctOptionIndex: fmt.correctIndex,
            explanation: `Standard formula for consumption reduction without changing expenditure:\nReduction% = [R / (100 + R)] × 100%\nHere R = ${inc}%.\nReduction% = [${inc} / (100 + ${inc})] × 100% = [${inc} / ${100 + inc}] × 100% = ${redPercent}%.`,
            marks: 1,
            negativeMarks: 0.25
          };
        } else if (variant === 1) {
          // Pass mark percentage
          const passPercent = 40;
          const scored = Math.floor(Math.random() * 4 + 3) * 50; // 150, 200, 250, 300
          const failedBy = Math.floor(Math.random() * 4 + 2) * 5; // 10, 15, 20, 25
          const passMarks = scored + failedBy;
          const maxMarks = (passMarks / passPercent) * 100;
          const distractors = this.generateNumericDistractors(maxMarks, [maxMarks + 50, maxMarks - 50, maxMarks + 100, maxMarks - 75]);
          const fmt = this.format5Options(`${maxMarks}`, distractors.map(d => `${d}`));

          return {
            id,
            sectionCode,
            sectionName,
            questionNumber: 0,
            subjectCode: 'quant',
            topicName: 'Percentage',
            patternCode: 'QUAN_ARITH_PERCENT_PASS',
            difficulty: 'medium',
            questionText: `In a competitive examination, a student needs ${passPercent}% marks to pass. A candidate scores ${scored} marks and fails by ${failedBy} marks. What are the maximum aggregate marks for the examination?`,
            options: fmt.options,
            correctOptionIndex: fmt.correctIndex,
            explanation: `Passing Marks = Marks Scored + Shortfall = ${scored} + ${failedBy} = ${passMarks}.\nSince passing marks represent ${passPercent}% of maximum marks (M):\n${passPercent}% of M = ${passMarks} ⇒ M = (${passMarks} × 100) / ${passPercent} = ${maxMarks} marks.`,
            marks: 1,
            negativeMarks: 0.25
          };
        } else {
          // Successive percentage change
          const inc = 20;
          const dec = 10;
          const net = inc - dec - (inc * dec) / 100; // 20 - 10 - 2 = 8% increase
          const distractors = this.generateNumericDistractors(net, [10, 12, 6, 5]);
          const fmt = this.format5Options(`${net}% increase`, distractors.map(d => `${d}% increase`));

          return {
            id,
            sectionCode,
            sectionName,
            questionNumber: 0,
            subjectCode: 'quant',
            topicName: 'Percentage',
            patternCode: 'QUAN_ARITH_PERCENT_SUCC',
            difficulty: 'easy',
            questionText: `The length of a rectangular field is increased by ${inc}% and its breadth is decreased by ${dec}%. What is the net percentage change in its area?`,
            options: fmt.options,
            correctOptionIndex: fmt.correctIndex,
            explanation: `Using the successive percentage formula:\nNet Change% = x + y + (xy / 100)\nHere x = +${inc}% and y = -${dec}%.\nNet Change% = ${inc} - ${dec} + [(${inc} × (-${dec})) / 100] = 10 - 2 = +${net}% (Net Increase).`,
            marks: 1,
            negativeMarks: 0.25
          };
        }
      }

      case 'Profit & Loss': {
        const cp = (Math.floor(Math.random() * 6) + 4) * 100; // 400..900
        const markupPairs = [
          { markup: 40, discount: 20 }, // +12%
          { markup: 50, discount: 20 }, // +20%
          { markup: 25, discount: 12 }, // +10%
          { markup: 60, discount: 25 }  // +20%
        ];
        const pair = markupPairs[Math.floor(Math.random() * markupPairs.length)];
        const mp = cp * (1 + pair.markup / 100);
        const sp = mp * (1 - pair.discount / 100);
        const profitPercent = Math.round(((sp - cp) / cp) * 100);

        const distractors = this.generateNumericDistractors(profitPercent, [
          profitPercent + 4,
          profitPercent - 2,
          pair.markup - pair.discount,
          profitPercent + 8
        ]);
        const fmt = this.format5Options(`${profitPercent}%`, distractors.map(d => `${d}%`));

        return {
          id,
          sectionCode,
          sectionName,
          questionNumber: 0,
          subjectCode: 'quant',
          topicName: 'Profit, Loss & Discount',
          patternCode: 'QUAN_ARITH_PL',
          difficulty: 'medium',
          questionText: `A shopkeeper marks an article ${pair.markup}% above its cost price of ₹${cp} and allows a discount of ${pair.discount}% on the marked price. Find his net profit percentage.`,
          options: fmt.options,
          correctOptionIndex: fmt.correctIndex,
          explanation: `Let Cost Price (CP) = 100 units.\nMarked Price (MP) = 100 + ${pair.markup}% of 100 = ${100 + pair.markup} units.\nSelling Price (SP) = ${100 + pair.markup} × (100 - ${pair.discount}) / 100 = ${100 + profitPercent} units.\nNet Profit Percentage = ${profitPercent}%.`,
          marks: 1,
          negativeMarks: 0.25
        };
      }

      case 'Simple & Compound Interest': {
        const p = (Math.floor(Math.random() * 6) + 3) * 2000; // 6000..16000
        const rates = [10, 15, 20];
        const r = rates[Math.floor(Math.random() * rates.length)];
        const diff = Math.round(p * Math.pow(r / 100, 2));

        const distractors = this.generateNumericDistractors(diff, [diff + 30, diff - 25, diff + 60, diff - 15]);
        const fmt = this.format5Options(`₹${diff}`, distractors.map(d => `₹${d}`));

        return {
          id,
          sectionCode,
          sectionName,
          questionNumber: 0,
          subjectCode: 'quant',
          topicName: 'Simple & Compound Interest',
          patternCode: 'QUAN_ARITH_SI_CI',
          difficulty: 'medium',
          questionText: `What is the difference between the Compound Interest (compounded annually) and Simple Interest on a sum of ₹${p.toLocaleString()} for 2 years at an interest rate of ${r}% per annum?`,
          options: fmt.options,
          correctOptionIndex: fmt.correctIndex,
          explanation: `Standard 2-year difference formula between CI and SI:\nDifference = P × (R / 100)²\nHere, P = ₹${p}, R = ${r}%\nDifference = ${p} × (${r} / 100)² = ₹${diff}.`,
          marks: 1,
          negativeMarks: 0.25
        };
      }

      case 'Time, Speed & Distance': {
        const speedMult = Math.floor(Math.random() * 3) + 3; // 3, 4, 5
        const speedKmph = speedMult * 18; // 54, 72, 90 km/h
        const speedMs = speedMult * 5; // 15, 20, 25 m/s
        const timeSec = Math.floor(Math.random() * 10) + 22; // 22..31 s
        const trainLen = (Math.floor(Math.random() * 4) + 3) * 50; // 150..300 m
        const totalDist = speedMs * timeSec;
        const platLen = totalDist - trainLen;

        const distractors = this.generateNumericDistractors(platLen, [platLen - 40, platLen + 40, platLen - 20, platLen + 60]);
        const fmt = this.format5Options(`${platLen} m`, distractors.map(d => `${d} m`));

        return {
          id,
          sectionCode,
          sectionName,
          questionNumber: 0,
          subjectCode: 'quant',
          topicName: 'Time, Speed & Distance',
          patternCode: 'QUAN_ARITH_TRAIN',
          difficulty: 'medium',
          questionText: `A train ${trainLen} m long running at a uniform speed of ${speedKmph} km/h crosses a platform completely in ${timeSec} seconds. What is the length of the platform?`,
          options: fmt.options,
          correctOptionIndex: fmt.correctIndex,
          explanation: `Speed in m/s = ${speedKmph} × (5 / 18) = ${speedMs} m/s.\nTotal distance covered in ${timeSec} s = Speed × Time = ${speedMs} × ${timeSec} = ${totalDist} m.\nLength of platform = Total distance - Train length = ${totalDist} - ${trainLen} = ${platLen} m.`,
          marks: 1,
          negativeMarks: 0.25
        };
      }

      case 'Boats & Streams': {
        // Still water speed u = 12 km/h, stream v = 4 km/h => Downstream = 16, Upstream = 8
        const mult = Math.floor(Math.random() * 3) + 1; // 1, 2, 3
        const u = 12;
        const v = 4;
        const dist = 32 * mult; // 32, 64, 96 km
        const downTime = dist / (u + v); // 2*mult
        const upTime = dist / (u - v); // 4*mult
        const totalHours = downTime + upTime; // 6*mult

        const distractors = this.generateNumericDistractors(totalHours, [totalHours + 2, totalHours - 2, totalHours + 4, totalHours + 1]);
        const fmt = this.format5Options(`${totalHours} hours`, distractors.map(d => `${d} hours`));

        return {
          id,
          sectionCode,
          sectionName,
          questionNumber: 0,
          subjectCode: 'quant',
          topicName: 'Boats & Streams',
          patternCode: 'QUAN_ARITH_BOATS',
          difficulty: 'medium',
          questionText: `The speed of a boat in still water is ${u} km/h and the speed of the current is ${v} km/h. How much total time will the boat take to row ${dist} km downstream and return ${dist} km upstream to the starting point?`,
          options: fmt.options,
          correctOptionIndex: fmt.correctIndex,
          explanation: `Downstream speed = ${u} + ${v} = ${u + v} km/h.\nUpstream speed = ${u} - ${v} = ${u - v} km/h.\nTime downstream = ${dist} / ${u + v} = ${downTime} hours.\nTime upstream = ${dist} / ${u - v} = ${upTime} hours.\nTotal time = ${downTime} + ${upTime} = ${totalHours} hours.`,
          marks: 1,
          negativeMarks: 0.25
        };
      }

      case 'Time & Work': {
        const pairs = [
          { a: 10, b: 15, ans: 6, lcm: 30 },
          { a: 12, b: 24, ans: 8, lcm: 24 },
          { a: 15, b: 30, ans: 10, lcm: 30 },
          { a: 20, b: 30, ans: 12, lcm: 60 }
        ];
        const p = pairs[Math.floor(Math.random() * pairs.length)];
        const distractors = this.generateNumericDistractors(p.ans, [p.ans + 2, p.ans - 1, p.ans + 3, p.ans + 4]);
        const fmt = this.format5Options(`${p.ans} days`, distractors.map(d => `${d} days`));

        return {
          id,
          sectionCode,
          sectionName,
          questionNumber: 0,
          subjectCode: 'quant',
          topicName: 'Time & Work',
          patternCode: 'QUAN_ARITH_WORK',
          difficulty: 'easy',
          questionText: `A can complete a piece of work in ${p.a} days, while B can complete the same work in ${p.b} days. In how many days will both of them complete the work working together?`,
          options: fmt.options,
          correctOptionIndex: fmt.correctIndex,
          explanation: `Total Work = LCM(${p.a}, ${p.b}) = ${p.lcm} units.\nEfficiency of A = ${p.lcm / p.a} units/day.\nEfficiency of B = ${p.lcm / p.b} units/day.\nCombined efficiency = ${(p.lcm / p.a) + (p.lcm / p.b)} units/day.\nTime required = ${p.lcm} / ${(p.lcm / p.a) + (p.lcm / p.b)} = ${p.ans} days.`,
          marks: 1,
          negativeMarks: 0.25
        };
      }

      case 'Pipes & Cisterns': {
        // Pipe A fills in 12 hrs, Pipe B empties in 18 hrs => LCM 36, net = 3 - 2 = 1 => 36 hrs
        const pairs = [
          { fill: 12, empty: 18, netHours: 36 },
          { fill: 10, empty: 15, netHours: 30 },
          { fill: 8, empty: 12, netHours: 24 }
        ];
        const p = pairs[Math.floor(Math.random() * pairs.length)];
        const distractors = this.generateNumericDistractors(p.netHours, [p.netHours - 6, p.netHours + 6, p.netHours - 4, p.netHours + 12]);
        const fmt = this.format5Options(`${p.netHours} hours`, distractors.map(d => `${d} hours`));

        return {
          id,
          sectionCode,
          sectionName,
          questionNumber: 0,
          subjectCode: 'quant',
          topicName: 'Pipes & Cisterns',
          patternCode: 'QUAN_ARITH_PIPES',
          difficulty: 'medium',
          questionText: `An inlet pipe A can fill an empty cistern in ${p.fill} hours, while an outlet pipe B can empty the completely filled cistern in ${p.empty} hours. If both pipes are opened simultaneously when the cistern is empty, in how many hours will the cistern be completely filled?`,
          options: fmt.options,
          correctOptionIndex: fmt.correctIndex,
          explanation: `Let total capacity = ${p.netHours} units.\nInlet Pipe A fills = ${p.netHours} / ${p.fill} = 3 units/hr.\nOutlet Pipe B empties = ${p.netHours} / ${p.empty} = 2 units/hr.\nNet filling rate = 3 - 2 = 1 unit/hr.\nTime to fill = ${p.netHours} / 1 = ${p.netHours} hours.`,
          marks: 1,
          negativeMarks: 0.25
        };
      }

      case 'Mixtures & Alligation': {
        const mult = Math.floor(Math.random() * 4) + 1; // 1..4
        const total = 40 * mult;
        const milk = 30 * mult;
        const water = 10 * mult;
        const addedWater = 5 * mult;

        const distractors = this.generateNumericDistractors(addedWater, [addedWater + 2, addedWater - 1, addedWater + 4, addedWater + 5]);
        const fmt = this.format5Options(`${addedWater} liters`, distractors.map(d => `${d} liters`));

        return {
          id,
          sectionCode,
          sectionName,
          questionNumber: 0,
          subjectCode: 'quant',
          topicName: 'Mixtures & Alligation',
          patternCode: 'QUAN_ARITH_MIXTURE',
          difficulty: 'medium',
          questionText: `A vessel contains ${total} liters of a mixture of milk and water in the ratio 3 : 1. How much water must be added to this mixture so that the ratio of milk to water becomes 2 : 1?`,
          options: fmt.options,
          correctOptionIndex: fmt.correctIndex,
          explanation: `Initial mixture = ${total} liters (Milk = ${milk} L, Water = ${water} L).\nLet x liters of water be added:\n${milk} / (${water} + x) = 2 / 1\n⇒ 2(${water} + x) = ${milk} ⇒ x = ${addedWater} liters.`,
          marks: 1,
          negativeMarks: 0.25
        };
      }

      case 'Partnership': {
        // A and B invest in ratio 3:5 for 12 months. Total profit = 8000 * k
        const k = (Math.floor(Math.random() * 5) + 2) * 1000; // 2000..6000
        const aInv = 3 * 10000;
        const bInv = 5 * 10000;
        const totalProfit = 8 * k;
        const bShare = 5 * k;

        const distractors = this.generateNumericDistractors(bShare, [3 * k, 4 * k, bShare + 1000, bShare - 1000]);
        const fmt = this.format5Options(`₹${bShare.toLocaleString()}`, distractors.map(d => `₹${d.toLocaleString()}`));

        return {
          id,
          sectionCode,
          sectionName,
          questionNumber: 0,
          subjectCode: 'quant',
          topicName: 'Partnership',
          patternCode: 'QUAN_ARITH_PARTNER',
          difficulty: 'easy',
          questionText: `Rohan and Vikram started a business by investing ₹${aInv.toLocaleString()} and ₹${bInv.toLocaleString()} respectively. At the end of the year, they earned a total profit of ₹${totalProfit.toLocaleString()}. What is Vikram's share in the profit?`,
          options: fmt.options,
          correctOptionIndex: fmt.correctIndex,
          explanation: `Ratio of investments = ${aInv} : ${bInv} = 3 : 5.\nSince both invested for 12 months, profit ratio = 3 : 5 (Total = 8 parts).\nVikram's share = (5 / 8) × ₹${totalProfit.toLocaleString()} = ₹${bShare.toLocaleString()}.`,
          marks: 1,
          negativeMarks: 0.25
        };
      }

      case 'Averages': {
        const students = (Math.floor(Math.random() * 3) + 2) * 10; // 20, 30, 40
        const avgAge = Math.floor(Math.random() * 4) + 14; // 14..17
        const teacherAge = avgAge + (students + 1); // increases average by 1 year

        const distractors = this.generateNumericDistractors(teacherAge, [teacherAge - 2, teacherAge + 3, teacherAge - 5, teacherAge + 5]);
        const fmt = this.format5Options(`${teacherAge} years`, distractors.map(d => `${d} years`));

        return {
          id,
          sectionCode,
          sectionName,
          questionNumber: 0,
          subjectCode: 'quant',
          topicName: 'Averages',
          patternCode: 'QUAN_ARITH_AVG',
          difficulty: 'easy',
          questionText: `The average age of a class of ${students} students is ${avgAge} years. When the age of the class teacher is also included, the average age of the whole group increases by 1 year. What is the age of the teacher?`,
          options: fmt.options,
          correctOptionIndex: fmt.correctIndex,
          explanation: `New average for (${students} + 1) = ${students + 1} persons is ${avgAge + 1} years.\nAge of teacher = Base average + (Total members × Increase in average)\n= ${avgAge} + (${students + 1} × 1) = ${teacherAge} years.`,
          marks: 1,
          negativeMarks: 0.25
        };
      }

      case 'Mensuration': {
        const rMult = Math.floor(Math.random() * 3) + 1; // 1, 2, 3
        const radius = 7 * rMult; // 7, 14, 21 cm
        const area = 154 * rMult * rMult; // 154, 616, 1386 sq cm

        const distractors = this.generateNumericDistractors(area, [area + 22, area - 14, area + 44, area - 28]);
        const fmt = this.format5Options(`${area} cm²`, distractors.map(d => `${d} cm²`));

        return {
          id,
          sectionCode,
          sectionName,
          questionNumber: 0,
          subjectCode: 'quant',
          topicName: 'Mensuration (2D & 3D)',
          patternCode: 'QUAN_ARITH_MENS',
          difficulty: 'easy',
          questionText: `The circumference of a circular garden is ${44 * rMult} cm. What is the area of the circular garden? (Take π = 22/7)`,
          options: fmt.options,
          correctOptionIndex: fmt.correctIndex,
          explanation: `Circumference = 2πr = 2 × (22/7) × r = ${44 * rMult} ⇒ r = ${radius} cm.\nArea of circle = πr² = (22/7) × ${radius} × ${radius} = ${area} cm².`,
          marks: 1,
          negativeMarks: 0.25
        };
      }

      case 'Probability': {
        const fmt = this.format5Options('5/14', ['3/14', '9/14', '1/7', '2/7']);

        return {
          id,
          sectionCode,
          sectionName,
          questionNumber: 0,
          subjectCode: 'quant',
          topicName: 'Probability',
          patternCode: 'QUAN_ARITH_PROB',
          difficulty: 'medium',
          questionText: `A bag contains 5 Red balls and 3 Blue balls. If 2 balls are drawn at random simultaneously from the bag, what is the probability that both balls drawn are Red?`,
          options: fmt.options,
          correctOptionIndex: fmt.correctIndex,
          explanation: `Total balls = 5 + 3 = 8.\nTotal ways to draw 2 balls = ⁸C₂ = (8 × 7) / 2 = 28.\nFavorable ways to draw 2 Red balls = ⁵C₂ = (5 × 4) / 2 = 10.\nProbability = 10 / 28 = 5/14.`,
          marks: 1,
          negativeMarks: 0.25
        };
      }

      default: {
        // Ages
        const x = Math.floor(Math.random() * 4) + 4; // 4, 5, 6, 7
        const presentA = 4 * x;
        const presentB = 5 * x;
        const distractors = this.generateNumericDistractors(presentA, [presentB, presentA - 4, presentA + 4, presentA + 2]);
        const fmt = this.format5Options(`${presentA} years`, distractors.map(d => `${d} years`));

        return {
          id,
          sectionCode,
          sectionName,
          questionNumber: 0,
          subjectCode: 'quant',
          topicName: 'Ages & Ratios',
          patternCode: 'QUAN_ARITH_AGES',
          difficulty: 'easy',
          questionText: `The ratio of the present ages of Amit and Bharat is 4 : 5. After ${x} years, the ratio of their ages will become 5 : 6. What is Amit's present age?`,
          options: fmt.options,
          correctOptionIndex: fmt.correctIndex,
          explanation: `Let the present ages of Amit and Bharat be 4k and 5k years.\nAfter ${x} years: (4k + ${x}) / (5k + ${x}) = 5 / 6\n⇒ 24k + ${6 * x} = 25k + ${5 * x} ⇒ k = ${x}.\nTherefore, Amit's present age = 4 × ${x} = ${presentA} years.`,
          marks: 1,
          negativeMarks: 0.25
        };
      }
    }
  }

  // =========================================================================
  // REASONING ABILITY GENERATOR
  // =========================================================================

  private generateReasoningSection(count: number, sectionCode: string, sectionName: string): ExamQuestionItem[] {
    const items: ExamQuestionItem[] = [];
    const runId = Math.random().toString(36).substring(2, 7);

    // Distribution for 35-45 Qs:
    const syllCount = Math.min(5, Math.ceil(count * 0.14));
    const ineqCount = Math.min(5, Math.ceil(count * 0.14));
    const dirCount = Math.min(3, Math.ceil(count * 0.09));
    const brCount = Math.min(3, Math.ceil(count * 0.09));
    const codeCount = Math.min(5, Math.ceil(count * 0.14));
    const puzzleSetsCount = count >= 35 ? 3 : (count >= 20 ? 2 : 0);
    const puzzleCount = puzzleSetsCount * 5;
    const miscCount = Math.max(1, count - (syllCount + ineqCount + dirCount + brCount + codeCount + puzzleCount));

    for (let i = 0; i < syllCount; i++) {
      items.push(this.buildSyllogismQuestion(`${runId}-syll-${i}`, sectionCode, sectionName));
    }

    for (let i = 0; i < ineqCount; i++) {
      items.push(this.buildInequalityQuestion(`${runId}-ineq-${i}`, sectionCode, sectionName));
    }

    for (let i = 0; i < dirCount; i++) {
      items.push(this.buildDirectionQuestion(`${runId}-dir-${i}`, sectionCode, sectionName));
    }

    for (let i = 0; i < brCount; i++) {
      items.push(this.buildBloodRelationQuestion(`${runId}-br-${i}`, sectionCode, sectionName));
    }

    for (let i = 0; i < codeCount; i++) {
      items.push(this.buildCodingDecodingQuestion(`${runId}-cd-${i}`, sectionCode, sectionName));
    }

    if (puzzleSetsCount >= 2) {
      items.push(...this.buildCircularPuzzleSet(`${runId}-puz1`, sectionCode, sectionName));
      items.push(...this.buildLinearPuzzleSet(`${runId}-puz2`, sectionCode, sectionName));
    }
    if (puzzleSetsCount >= 3) {
      items.push(...this.buildFloorPuzzleSet(`${runId}-puz3`, sectionCode, sectionName));
    }

    for (let i = 0; i < miscCount; i++) {
      items.push(this.buildAlphanumericQuestion(`${runId}-misc-${i}`, sectionCode, sectionName));
    }

    return items.slice(0, count);
  }

  // --- Reasoning Sub-Generators ---

  private buildSyllogismQuestion(id: string, sectionCode: string, sectionName: string, index: number = 0): ExamQuestionItem {
    const templates = [
      {
        statements: 'Statements:\n• Only a few laptops are tablets.\n• All tablets are mobiles.\n• No mobile is a watch.',
        conclusions: 'Conclusions:\nI. Some laptops are not watches.\nII. All mobiles being laptops is a possibility.',
        answer: 'Both conclusions I and II follow',
        explanation: '1. Since only a few laptops are tablets, some laptops are tablets and some laptops are not tablets.\n2. All tablets are mobiles, and no mobile is a watch, so tablets cannot be watches.\n3. The part of laptops that are tablets (and thus mobiles) cannot be watches. Hence, "Some laptops are not watches" is definitely true.\n4. "All mobiles being laptops is a possibility" is valid because "only a few laptops are tablets" does not restrict all mobiles from being inside laptops.\nTherefore, both conclusions follow.'
      },
      {
        statements: 'Statements:\n• Some trees are plants.\n• Only a few plants are flowers.\n• All flowers are shrubs.',
        conclusions: 'Conclusions:\nI. Some plants are shrubs.\nII. All shrubs can never be plants.',
        answer: 'Only conclusion I follows',
        explanation: '1. All flowers are shrubs, and only a few plants are flowers (meaning some plants are flowers). Thus, the overlapping part of plants with flowers is also shrubs. Conclusion I follows.\n2. All shrubs being plants is possible since there is no negative constraint against shrubs entering plants. Thus II does not follow.\nTherefore, only conclusion I follows.'
      },
      {
        statements: 'Statements:\n• All circles are squares.\n• Some squares are triangles.\n• No triangle is a hexagon.',
        conclusions: 'Conclusions:\nI. No circle is a triangle.\nII. Some squares are definitely not hexagons.',
        answer: 'Only conclusion II follows',
        explanation: '1. Circles and triangles have no negative relation; circle may or may not overlap triangle. Conclusion I is not definite.\n2. The squares that are triangles cannot be hexagons because no triangle is a hexagon. Hence, those squares are definitely not hexagons. Conclusion II follows.'
      },
      {
        statements: 'Statements:\n• Only a few rivers are oceans.\n• All oceans are glaciers.\n• Some glaciers are mountains.',
        conclusions: 'Conclusions:\nI. All rivers being oceans is a possibility.\nII. Some rivers are glaciers.',
        answer: 'Only conclusion II follows',
        explanation: '1. "Only a few rivers are oceans" means some rivers are oceans AND some rivers are definitely NOT oceans. Therefore, all rivers can never be oceans (I does not follow).\n2. Since some rivers are oceans and all oceans are glaciers, some rivers are definitely glaciers (II follows).'
      },
      {
        statements: 'Statements:\n• Only a few banks are lenders.\n• All lenders are NBFCs.\n• No NBFC is a pawnshop.',
        conclusions: 'Conclusions:\nI. Some banks are NBFCs.\nII. All banks can never be pawnshops.',
        answer: 'Both conclusions I and II follow',
        explanation: '1. Since some banks are lenders and all lenders are NBFCs, some banks are definitely NBFCs (I follows).\n2. The part of banks that are NBFCs cannot be pawnshops. Hence, all banks can never be pawnshops (II follows).'
      },
      {
        statements: 'Statements:\n• All cards are accounts.\n• Only a few accounts are deposits.\n• No deposit is credit.',
        conclusions: 'Conclusions:\nI. No card is credit.\nII. Some accounts being credit is a possibility.',
        answer: 'Only conclusion II follows',
        explanation: '1. There is no direct negative relation between cards and credit (only deposits cannot be credit). Card can overlap credit, so I does not definitely follow.\n2. Accounts that are not deposits can freely overlap credit, so II is a valid possibility.'
      }
    ];

    const pick = templates[index % templates.length];
    const options = [
      'Only conclusion I follows',
      'Only conclusion II follows',
      'Either conclusion I or II follows',
      'Neither conclusion I nor II follows',
      'Both conclusions I and II follow'
    ];
    const correctIndex = options.indexOf(pick.answer);

    return {
      id,
      sectionCode,
      sectionName,
      questionNumber: 0,
      subjectCode: 'reasoning',
      topicName: 'Syllogisms',
      patternCode: 'REAS_SYLL_01',
      difficulty: 'medium',
      questionText: `In the following question, some statements are followed by two conclusions. Read all the conclusions and decide which follows logically:\n\n${pick.statements}\n\n${pick.conclusions}`,
      options,
      correctOptionIndex: correctIndex,
      explanation: pick.explanation,
      marks: 1,
      negativeMarks: 0.25
    };
  }

  private buildInequalityQuestion(id: string, sectionCode: string, sectionName: string, index: number = 0): ExamQuestionItem {
    const templates = [
      {
        statement: 'Statements: P ≥ Q > R = S ≤ T < U',
        conclusions: 'Conclusions:\nI. P > S\nII. U > S',
        answer: 'Both conclusions I and II follow',
        explanation: 'For I: P ≥ Q > R = S ⇒ P > S (Strictly true since > is present in chain).\nFor II: S ≤ T < U ⇒ S < U or U > S (Strictly true since < is present in chain).\nHence, both conclusions I and II follow.'
      },
      {
        statement: 'Statements: A > B ≥ C; C = D < E; E ≤ F',
        conclusions: 'Conclusions:\nI. A > D\nII. B < E',
        answer: 'Only conclusion I follows',
        explanation: 'For I: A > B ≥ C = D ⇒ A > D. (Valid)\nFor II: B ≥ C and C < E creates opposite signs between B and E (≥ and <), so relation cannot be determined. (Invalid)\nHence, only conclusion I follows.'
      },
      {
        statement: 'Statements: M ≤ N < O; O ≥ P; P > Q',
        conclusions: 'Conclusions:\nI. M < P\nII. N > Q',
        answer: 'Neither conclusion I nor II follows',
        explanation: 'For I: M ≤ N < O ≥ P contains opposite signs (< and ≥), relation undetermined.\nFor II: N < O ≥ P > Q contains opposite signs (< and ≥), relation undetermined.\nHence, neither conclusion follows.'
      },
      {
        statement: 'Statements: K ≥ L = M ≥ N; N = O',
        conclusions: 'Conclusions:\nI. K > O\nII. K = O',
        answer: 'Either conclusion I or II follows',
        explanation: 'Combining the chain: K ≥ L = M ≥ N = O ⇒ K ≥ O.\nSince K ≥ O means either K > O or K = O, Conclusions I and II form a complementary "Either/Or" pair.'
      },
      {
        statement: 'Statements: W < X ≤ Y = Z; Z > V ≥ U',
        conclusions: 'Conclusions:\nI. Y > U\nII. W < Z',
        answer: 'Both conclusions I and II follow',
        explanation: 'From Y = Z > V ≥ U, we have Y > U (Conclusion I follows).\nFrom W < X ≤ Y = Z, we have W < Z (Conclusion II follows).\nBoth conclusions follow.'
      },
      {
        statement: 'Statements: G ≥ H > I; I = J ≤ K < L',
        conclusions: 'Conclusions:\nI. G > J\nII. H < L',
        answer: 'Only conclusion I follows',
        explanation: 'From G ≥ H > I = J, we have G > J (I follows).\nFrom H > I = J ≤ K < L, comparing H and L encounters opposite inequality directions (> and <), so relation cannot be determined (II does not follow).'
      }
    ];

    const pick = templates[index % templates.length];
    const options = [
      'Only conclusion I follows',
      'Only conclusion II follows',
      'Either conclusion I or II follows',
      'Neither conclusion I nor II follows',
      'Both conclusions I and II follow'
    ];
    const correctIndex = options.indexOf(pick.answer);

    return {
      id,
      sectionCode,
      sectionName,
      questionNumber: 0,
      subjectCode: 'reasoning',
      topicName: 'Inequalities',
      patternCode: 'REAS_INEQ_01',
      difficulty: 'easy',
      questionText: `In the following question, relationship between different elements is shown in the statements followed by two conclusions:\n\n${pick.statement}\n\n${pick.conclusions}`,
      options,
      correctOptionIndex: correctIndex,
      explanation: pick.explanation,
      marks: 1,
      negativeMarks: 0.25
    };
  }

  private buildDirectionQuestion(id: string, sectionCode: string, sectionName: string, index: number = 0): ExamQuestionItem {
    const triplets = [
      { name: 'Rohan', n1: 12, e: 8, s: 6, netN: 6, ans: 10 },
      { name: 'Ananya', n1: 15, e: 12, s: 6, netN: 9, ans: 15 },
      { name: 'Vikram', n1: 10, e: 12, s: 5, netN: 5, ans: 13 },
      { name: 'Kavita', n1: 20, e: 15, s: 8, netN: 12, ans: 19 },
      { name: 'Deepak', n1: 16, e: 24, s: 9, netN: 7, ans: 25 }
    ];
    const t = triplets[index % triplets.length];
    const distractors = this.generateNumericDistractors(t.ans, [t.ans + 2, t.ans + 4, t.ans - 2, t.ans + 5]);
    const fmt = this.format5Options(`${t.ans} meters`, distractors.map(d => `${d} meters`));

    return {
      id,
      sectionCode,
      sectionName,
      questionNumber: 0,
      subjectCode: 'reasoning',
      topicName: 'Direction & Distance',
      patternCode: 'REAS_DIR_01',
      difficulty: 'easy',
      questionText: `${t.name} starts walking from point A towards North. After walking ${t.n1} meters, turns right and walks ${t.e} meters. Then turns right again and walks ${t.s} meters to reach point B. What is the shortest straight-line distance between point A and point B?`,
      options: fmt.options,
      correctOptionIndex: fmt.correctIndex,
      explanation: `Net displacement:\nNorth-South displacement = ${t.n1} m (North) - ${t.s} m (South) = ${t.netN} m North.\nEast-West displacement = ${t.e} m East.\nShortest distance = √(${t.netN}² + ${t.e}²) = ${t.ans} meters.`,
      marks: 1,
      negativeMarks: 0.25
    };
  }

  private buildBloodRelationQuestion(id: string, sectionCode: string, sectionName: string, index: number = 0): ExamQuestionItem {
    const templates = [
      {
        q: `Pointing to a photograph, Priya said, "He is the only son of the mother of my sister's brother." How is the person in the photograph related to Priya?`,
        ans: 'Brother',
        dis: ['Uncle', 'Father', 'Cousin', 'Nephew'],
        exp: `"My sister's brother" is Priya's brother. His mother is Priya's mother. The only son of Priya's mother is Priya's brother.`
      },
      {
        q: `A is the father of B. B is the sister of C. D is the mother of C. E is the father of D. How is A related to E?`,
        ans: 'Son-in-law',
        dis: ['Brother-in-law', 'Son', 'Nephew', 'Brother'],
        exp: `A is the father of B & C, and D is the mother of B & C, so A is the husband of D. Since E is the father of D, A is the son-in-law of E.`
      },
      {
        q: `Introducing a man to her husband, a woman said, "His wife is the only daughter of my father." How is the man related to the woman?`,
        ans: 'Husband',
        dis: ['Brother', 'Father-in-law', 'Maternal Uncle', 'Cousin'],
        exp: `The only daughter of the woman's father is the woman herself. Thus, the man's wife is the woman herself, meaning the man is her husband.`
      },
      {
        q: `P is the brother of Q. R is the daughter of Q. S is the sister of P. T is the brother of R. Who is the uncle of T?`,
        ans: 'P',
        dis: ['Q', 'S', 'R', 'Cannot be determined'],
        exp: `R and T are children of Q. P is the brother of Q. Therefore, P is the uncle of T.`
      },
      {
        q: `Looking at a portrait, Mahesh said, "I have no brothers or sisters, but this man's father is my father's son." Whose portrait was Mahesh looking at?`,
        ans: 'His son',
        dis: ['His father', 'Himself', 'His nephew', 'His cousin'],
        exp: `Since Mahesh has no brothers or sisters, "my father's son" is Mahesh himself. Therefore, "this man's father is Mahesh" means the portrait is of Mahesh's son.`
      }
    ];
    const pick = templates[index % templates.length];
    const fmt = this.format5Options(pick.ans, pick.dis);

    return {
      id,
      sectionCode,
      sectionName,
      questionNumber: 0,
      subjectCode: 'reasoning',
      topicName: 'Blood Relations',
      patternCode: 'REAS_BR_01',
      difficulty: 'medium',
      questionText: pick.q,
      options: fmt.options,
      correctOptionIndex: fmt.correctIndex,
      explanation: pick.exp,
      marks: 1,
      negativeMarks: 0.25
    };
  }

  private buildCodingDecodingQuestion(id: string, sectionCode: string, sectionName: string, index: number = 0): ExamQuestionItem {
    const templates = [
      {
        q: `In a certain code language:\n• 'banking exam target score' is written as 'la tu pa so'\n• 'score high target rank' is written as 'tu pa ki ze'\n• 'banking rank dream job' is written as 'la ki ma vo'\n\nWhat is the code for the word 'target' in this language if 'score' is coded as 'pa'?`,
        ans: 'tu',
        dis: ['la', 'pa', 'so', 'ki'],
        exp: `Common words between Sentence 1 and Sentence 2 are 'target' and 'score'. Common codes are 'tu' and 'pa'. Given that 'score' is coded as 'pa', the remaining word 'target' must be coded as 'tu'.`
      },
      {
        q: `In a certain code language:\n• 'rbi monetary policy review' is written as 'xo na bi ku'\n• 'review financial market growth' is written as 'na ze lo ti'\n• 'monetary growth index steady' is written as 'bi lo wa pe'\n\nWhat is the code for the word 'review' in that language?`,
        ans: 'na',
        dis: ['xo', 'bi', 'ku', 'ze'],
        exp: `The word 'review' appears in Sentence 1 and Sentence 2. The only common code between Sentence 1 and Sentence 2 is 'na'.`
      },
      {
        q: `In a certain code language:\n• 'digital payment secure fast' is written as 'da ri sa te'\n• 'secure banking network robust' is written as 'ri mo fa ka'\n• 'fast network transfer instant' is written as 'sa mo ju lo'\n\nWhat is the code for the word 'secure'?`,
        ans: 'ri',
        dis: ['da', 'sa', 'mo', 'ka'],
        exp: `'secure' is common between Sentence 1 and Sentence 2. The common code between 'da ri sa te' and 'ri mo fa ka' is 'ri'.`
      },
      {
        q: `If in a code language, 'CREDIT' is coded as 'FUGGLW', then how will 'DEBIT' be coded in the same language?`,
        ans: 'GHGLW',
        dis: ['GHFLW', 'GHHKW', 'FGGKW', 'EFCJU'],
        exp: `Each letter is shifted forward by +3:\nC(+3)=F, R(+3)=U, E(+3)=H, D(+3)=G, I(+3)=L, T(+3)=W.\nApplying +3 to DEBIT gives GHGLW.`
      }
    ];

    const pick = templates[index % templates.length];
    const fmt = this.format5Options(pick.ans, pick.dis);

    return {
      id,
      sectionCode,
      sectionName,
      questionNumber: 0,
      subjectCode: 'reasoning',
      topicName: 'Coding & Decoding',
      patternCode: 'REAS_CODE_01',
      difficulty: 'medium',
      questionText: pick.q,
      options: fmt.options,
      correctOptionIndex: fmt.correctIndex,
      explanation: pick.exp,
      marks: 1,
      negativeMarks: 0.25
    };
  }

  private buildCircularPuzzleSet(idPrefix: string, sectionCode: string, sectionName: string): ExamQuestionItem[] {
    const passage =
      `Directions (Q. 1 to 5): Study the following information carefully and answer the questions:\n\n` +
      `Eight friends — P, Q, R, S, T, U, V, and W — are sitting around a circular table facing the center.\n` +
      `• P sits third to the right of T.\n` +
      `• Only two people sit between P and W.\n` +
      `• R sits second to the left of W.\n` +
      `• Q is an immediate neighbour of neither P nor W.\n` +
      `• S sits second to the right of U.\n` +
      `• V is not an immediate neighbour of P.\n`;

    const items: ExamQuestionItem[] = [];

    const q1 = this.format5Options('U', ['T', 'Q', 'V', 'R']);
    items.push({
      id: `${idPrefix}-1`,
      sectionCode,
      sectionName,
      questionNumber: 0,
      subjectCode: 'reasoning',
      topicName: 'Circular Seating Arrangement',
      patternCode: 'REAS_PUZ_CIRC_01',
      difficulty: 'hard',
      passageText: passage,
      questionText: `Who sits to the immediate right of P?`,
      options: q1.options,
      correctOptionIndex: q1.correctIndex,
      explanation: `By placing T at bottom (Position 1), P sits third to right at Position 4. Working through constraints: positions clockwise are T, Q, S, P, U, R, W, V. Immediate right of P is U.`,
      marks: 1,
      negativeMarks: 0.25
    });

    const q2 = this.format5Options('One', ['Two', 'Three', 'None', 'Four']);
    items.push({
      id: `${idPrefix}-2`,
      sectionCode,
      sectionName,
      questionNumber: 0,
      subjectCode: 'reasoning',
      topicName: 'Circular Seating Arrangement',
      patternCode: 'REAS_PUZ_CIRC_02',
      difficulty: 'hard',
      passageText: passage,
      questionText: `How many persons sit between T and W when counted from the left of T?`,
      options: q2.options,
      correctOptionIndex: q2.correctIndex,
      explanation: `Counting from left of T: next is V, then W. Hence, exactly one person (V) sits between T and W.`,
      marks: 1,
      negativeMarks: 0.25
    });

    const q3 = this.format5Options('W', ['P', 'R', 'S', 'U']);
    items.push({
      id: `${idPrefix}-3`,
      sectionCode,
      sectionName,
      questionNumber: 0,
      subjectCode: 'reasoning',
      topicName: 'Circular Seating Arrangement',
      patternCode: 'REAS_PUZ_CIRC_03',
      difficulty: 'hard',
      passageText: passage,
      questionText: `Who among the following sits diametrically opposite to Q?`,
      options: q3.options,
      correctOptionIndex: q3.correctIndex,
      explanation: `In the 8-person circular arrangement, the person 4 steps away from Q is W. Thus, W sits opposite to Q.`,
      marks: 1,
      negativeMarks: 0.25
    });

    const q4 = this.format5Options('Q and P', ['T and U', 'W and R', 'P and V', 'R and T']);
    items.push({
      id: `${idPrefix}-4`,
      sectionCode,
      sectionName,
      questionNumber: 0,
      subjectCode: 'reasoning',
      topicName: 'Circular Seating Arrangement',
      patternCode: 'REAS_PUZ_CIRC_04',
      difficulty: 'hard',
      passageText: passage,
      questionText: `Who are the immediate neighbours of S?`,
      options: q4.options,
      correctOptionIndex: q4.correctIndex,
      explanation: `The order is T -> Q -> S -> P. Thus the two neighbours flanking S are Q and P.`,
      marks: 1,
      negativeMarks: 0.25
    });

    const q5 = this.format5Options('Third to the left', ['Second to the right', 'Immediate right', 'Fourth to the left', 'Opposite']);
    items.push({
      id: `${idPrefix}-5`,
      sectionCode,
      sectionName,
      questionNumber: 0,
      subjectCode: 'reasoning',
      topicName: 'Circular Seating Arrangement',
      patternCode: 'REAS_PUZ_CIRC_05',
      difficulty: 'hard',
      passageText: passage,
      questionText: `What is the position of V with respect to R?`,
      options: q5.options,
      correctOptionIndex: q5.correctIndex,
      explanation: `Looking at R facing center, left is towards W and V. Here V is third to the left of R.`,
      marks: 1,
      negativeMarks: 0.25
    });

    return items;
  }

  private buildLinearPuzzleSet(idPrefix: string, sectionCode: string, sectionName: string): ExamQuestionItem[] {
    const passage =
      `Directions (Q. 1 to 5): Study the following information carefully:\n\n` +
      `Seven people — A, B, C, D, E, F, and G — are sitting in a single straight row facing North.\n` +
      `• D sits at one of the extreme ends of the row.\n` +
      `• Only three people sit between D and B.\n` +
      `• C sits second to the left of B.\n` +
      `• A sits to the immediate right of C.\n` +
      `• E sits third to the right of F.\n` +
      `• G does not sit at an extreme end.\n`;

    const items: ExamQuestionItem[] = [];

    const q1 = this.format5Options('A', ['C', 'G', 'B', 'F']);
    items.push({
      id: `${idPrefix}-1`,
      sectionCode,
      sectionName,
      questionNumber: 0,
      subjectCode: 'reasoning',
      topicName: 'Linear Seating Arrangement',
      patternCode: 'REAS_PUZ_LIN_01',
      difficulty: 'hard',
      passageText: passage,
      questionText: `Who sits exactly in the middle of the row (4th position from either end)?`,
      options: q1.options,
      correctOptionIndex: q1.correctIndex,
      explanation: `Arranging from left to right: [Pos 1: D], [Pos 2: F], [Pos 3: C], [Pos 4: A], [Pos 5: B], [Pos 6: G], [Pos 7: E]. The middle person at position 4 is A.`,
      marks: 1,
      negativeMarks: 0.25
    });

    const q2 = this.format5Options('E', ['D', 'B', 'G', 'F']);
    items.push({
      id: `${idPrefix}-2`,
      sectionCode,
      sectionName,
      questionNumber: 0,
      subjectCode: 'reasoning',
      topicName: 'Linear Seating Arrangement',
      patternCode: 'REAS_PUZ_LIN_02',
      difficulty: 'hard',
      passageText: passage,
      questionText: `Who sits at the rightmost extreme end of the row?`,
      options: q2.options,
      correctOptionIndex: q2.correctIndex,
      explanation: `D is at the left extreme end (Pos 1), and E is at the right extreme end (Pos 7).`,
      marks: 1,
      negativeMarks: 0.25
    });

    const q3 = this.format5Options('Two', ['One', 'Three', 'Four', 'None']);
    items.push({
      id: `${idPrefix}-3`,
      sectionCode,
      sectionName,
      questionNumber: 0,
      subjectCode: 'reasoning',
      topicName: 'Linear Seating Arrangement',
      patternCode: 'REAS_PUZ_LIN_03',
      difficulty: 'hard',
      passageText: passage,
      questionText: `How many people sit between F and B?`,
      options: q3.options,
      correctOptionIndex: q3.correctIndex,
      explanation: `F is at position 2 and B is at position 5. People between them are C and A (2 people).`,
      marks: 1,
      negativeMarks: 0.25
    });

    const q4 = this.format5Options('Immediate right', ['Second to the right', 'Immediate left', 'Second to the left', 'Third to the right']);
    items.push({
      id: `${idPrefix}-4`,
      sectionCode,
      sectionName,
      questionNumber: 0,
      subjectCode: 'reasoning',
      topicName: 'Linear Seating Arrangement',
      patternCode: 'REAS_PUZ_LIN_04',
      difficulty: 'hard',
      passageText: passage,
      questionText: `What is the position of G with respect to B?`,
      options: q4.options,
      correctOptionIndex: q4.correctIndex,
      explanation: `B is at position 5 and G is at position 6. Hence, G is to the immediate right of B.`,
      marks: 1,
      negativeMarks: 0.25
    });

    const q5 = this.format5Options('D', ['E', 'B', 'A', 'None of these']);
    items.push({
      id: `${idPrefix}-5`,
      sectionCode,
      sectionName,
      questionNumber: 0,
      subjectCode: 'reasoning',
      topicName: 'Linear Seating Arrangement',
      patternCode: 'REAS_PUZ_LIN_05',
      difficulty: 'hard',
      passageText: passage,
      questionText: `Who sits second to the left of C?`,
      options: q5.options,
      correctOptionIndex: q5.correctIndex,
      explanation: `C is at position 3. 1st to the left is F (Pos 2), 2nd to the left is D (Pos 1).`,
      marks: 1,
      negativeMarks: 0.25
    });

    return items;
  }

  private buildFloorPuzzleSet(idPrefix: string, sectionCode: string, sectionName: string): ExamQuestionItem[] {
    // 7-Floor Building Puzzle: Floors 7 (top) down to 1 (bottom)
    // Order from Floor 7 down to 1:
    // Floor 7: K, Floor 6: N, Floor 5: J, Floor 4: M, Floor 3: O, Floor 2: L, Floor 1: P
    const passage =
      `Directions (Q. 1 to 5): Study the following information carefully and answer the questions:\n\n` +
      `Seven executives — J, K, L, M, N, O, and P — live on seven different floors of a residential building. The lowermost floor is numbered 1, the floor above it is numbered 2, and so on until the topmost floor is numbered 7.\n` +
      `• M lives on the 4th floor.\n` +
      `• Only two people live between M and K.\n` +
      `• J lives immediately above M.\n` +
      `• Three people live between N and L, and N lives on an even-numbered floor above M.\n` +
      `• O lives immediately above L.\n` +
      `• P lives on the lowermost floor (Floor 1).\n`;

    const items: ExamQuestionItem[] = [];

    const q1 = this.format5Options('K', ['N', 'J', 'O', 'L']);
    items.push({
      id: `${idPrefix}-1`,
      sectionCode,
      sectionName,
      questionNumber: 0,
      subjectCode: 'reasoning',
      topicName: 'Floor Based Puzzle',
      patternCode: 'REAS_PUZ_FLR_01',
      difficulty: 'hard',
      passageText: passage,
      questionText: `Who lives on the topmost floor (7th floor)?`,
      options: q1.options,
      correctOptionIndex: q1.correctIndex,
      explanation: `Since M is on Floor 4 and P is on Floor 1, two people between M and K places K on Floor 7 (topmost floor). Final floor order (7 to 1): K(7), N(6), J(5), M(4), O(3), L(2), P(1).`,
      marks: 1,
      negativeMarks: 0.25
    });

    const q2 = this.format5Options('6th Floor', ['5th Floor', '3rd Floor', '2nd Floor', '7th Floor']);
    items.push({
      id: `${idPrefix}-2`,
      sectionCode,
      sectionName,
      questionNumber: 0,
      subjectCode: 'reasoning',
      topicName: 'Floor Based Puzzle',
      patternCode: 'REAS_PUZ_FLR_02',
      difficulty: 'hard',
      passageText: passage,
      questionText: `On which floor does N live?`,
      options: q2.options,
      correctOptionIndex: q2.correctIndex,
      explanation: `N lives on an even-numbered floor above M (Floor 4), which must be Floor 6.`,
      marks: 1,
      negativeMarks: 0.25
    });

    const q3 = this.format5Options('Two', ['One', 'Three', 'Four', 'None']);
    items.push({
      id: `${idPrefix}-3`,
      sectionCode,
      sectionName,
      questionNumber: 0,
      subjectCode: 'reasoning',
      topicName: 'Floor Based Puzzle',
      patternCode: 'REAS_PUZ_FLR_03',
      difficulty: 'hard',
      passageText: passage,
      questionText: `How many people live between J and L?`,
      options: q3.options,
      correctOptionIndex: q3.correctIndex,
      explanation: `J lives on Floor 5 and L lives on Floor 2. The people living between them are M (Floor 4) and O (Floor 3) — i.e., Two people.`,
      marks: 1,
      negativeMarks: 0.25
    });

    const q4 = this.format5Options('O', ['L', 'J', 'N', 'P']);
    items.push({
      id: `${idPrefix}-4`,
      sectionCode,
      sectionName,
      questionNumber: 0,
      subjectCode: 'reasoning',
      topicName: 'Floor Based Puzzle',
      patternCode: 'REAS_PUZ_FLR_04',
      difficulty: 'hard',
      passageText: passage,
      questionText: `Who lives immediately below M?`,
      options: q4.options,
      correctOptionIndex: q4.correctIndex,
      explanation: `M lives on Floor 4, and O lives on Floor 3 immediately below M.`,
      marks: 1,
      negativeMarks: 0.25
    });

    const q5 = this.format5Options('L - 2nd Floor', ['O - 5th Floor', 'J - 6th Floor', 'N - 3rd Floor', 'K - 5th Floor']);
    items.push({
      id: `${idPrefix}-5`,
      sectionCode,
      sectionName,
      questionNumber: 0,
      subjectCode: 'reasoning',
      topicName: 'Floor Based Puzzle',
      patternCode: 'REAS_PUZ_FLR_05',
      difficulty: 'hard',
      passageText: passage,
      questionText: `Which of the following combinations of Person and Floor is definitely CORRECT?`,
      options: q5.options,
      correctOptionIndex: q5.correctIndex,
      explanation: `From the arrangement K(7), N(6), J(5), M(4), O(3), L(2), P(1), the combination "L - 2nd Floor" is correct.`,
      marks: 1,
      negativeMarks: 0.25
    });

    return items;
  }

  private buildAlphanumericQuestion(id: string, sectionCode: string, sectionName: string): ExamQuestionItem {
    const fmt = this.format5Options('Two', ['Three', 'Four', 'One', 'None']);

    return {
      id,
      sectionCode,
      sectionName,
      questionNumber: 0,
      subjectCode: 'reasoning',
      topicName: 'Alphanumeric & Sequence',
      patternCode: 'REAS_ALPHA_01',
      difficulty: 'easy',
      questionText: `Study the following sequence of letters, digits, and symbols:\n\nM 4 @ K 9 # P $ 2 T & 7 B 5 % W\n\nHow many such symbols are there in the sequence, each of which is immediately preceded by a letter and immediately followed by a number?`,
      options: fmt.options,
      correctOptionIndex: fmt.correctIndex,
      explanation: `Condition: [Letter] -> [Symbol] -> [Number]\nChecking instances:\n1. P $ 2 (P is letter, $ is symbol, 2 is number -> VALID #1)\n2. T & 7 (T is letter, & is symbol, 7 is number -> VALID #2)\nTotal valid instances = Two.`,
      marks: 1,
      negativeMarks: 0.25
    };
  }

  // =========================================================================
  // ENGLISH LANGUAGE GENERATOR
  // =========================================================================

  private generateEnglishSection(count: number, sectionCode: string, sectionName: string): ExamQuestionItem[] {
    const items: ExamQuestionItem[] = [];
    const runId = Math.random().toString(36).substring(2, 7);

    // Distribution for 30-40 Qs:
    const errCount = Math.min(6, Math.ceil(count * 0.18));
    const repCount = Math.min(5, Math.ceil(count * 0.15));
    const filCount = Math.min(5, Math.ceil(count * 0.15));
    const clozeCount = count >= 20 ? 5 : 0;
    const pjCount = count >= 25 ? 5 : 0;
    const rcCount = count >= 30 ? 5 : 0;
    const remCount = Math.max(0, count - (errCount + repCount + filCount + clozeCount + pjCount + rcCount));

    for (let i = 0; i < errCount; i++) {
      items.push(this.buildErrorSpottingQuestion(`${runId}-err-${i}`, sectionCode, sectionName, i));
    }

    for (let i = 0; i < repCount; i++) {
      items.push(this.buildPhraseReplacementQuestion(`${runId}-rep-${i}`, sectionCode, sectionName, i));
    }

    for (let i = 0; i < filCount; i++) {
      items.push(this.buildDoubleFillerQuestion(`${runId}-fil-${i}`, sectionCode, sectionName, i));
    }

    if (clozeCount > 0) {
      items.push(...this.buildClozeTestSet(`${runId}-cloze`, sectionCode, sectionName));
    }

    if (pjCount > 0) {
      items.push(...this.buildParaJumbleSet(`${runId}-pj`, sectionCode, sectionName));
    }

    if (rcCount > 0) {
      items.push(...this.buildReadingComprehensionSet(`${runId}-rc`, sectionCode, sectionName));
    }

    for (let i = 0; i < remCount; i++) {
      items.push(this.buildVocabContextQuestion(`${runId}-voc-${i}`, sectionCode, sectionName, i));
    }

    return items.slice(0, count);
  }

  // --- English Sub-Generators ---

  private buildErrorSpottingQuestion(id: string, sectionCode: string, sectionName: string, index: number): ExamQuestionItem {
    const errorSets = [
      {
        text: 'The Monetary Policy Committee / has decided to keep the repo rate / unchanged in order to curb inflation, / despite of strong pressure from industries.',
        partA: 'The Monetary Policy Committee',
        partB: 'has decided to keep the repo rate',
        partC: 'unchanged in order to curb inflation,',
        partD: 'despite of strong pressure from industries.',
        errorPart: 'D',
        explanation: 'In part (D), "despite of" is grammatically incorrect. "Despite" is a preposition that does not take "of" (we use either "despite" alone or "in spite of"). Therefore, the correct phrase is "despite strong pressure".'
      },
      {
        text: 'Neither the Governor / nor the deputy governors / was present at the annual / financial stability review conclave.',
        partA: 'Neither the Governor',
        partB: 'nor the deputy governors',
        partC: 'was present at the annual',
        partD: 'financial stability review conclave.',
        errorPart: 'C',
        explanation: 'In part (C), "was present" is incorrect. According to the rule of proximity in "Neither... nor", the verb agrees with the subject closest to it ("the deputy governors", which is plural). Hence, "were present" should be used.'
      },
      {
        text: 'No sooner had the commercial bank / announced the reduction in lending rates / when thousands of borrowers / applied for retail home loans.',
        partA: 'No sooner had the commercial bank',
        partB: 'announced the reduction in lending rates',
        partC: 'when thousands of borrowers',
        partD: 'applied for retail home loans.',
        errorPart: 'C',
        explanation: 'In part (C), "when" is incorrect. The correlative conjunction pair for "No sooner... " is "than", not "when" ("Hardly / Scarcely... when"). It should read "than thousands of borrowers".'
      },
      {
        text: 'Each of the selected probationary officers / have been allocated / to different rural branches / for their mandatory training period.',
        partA: 'Each of the selected probationary officers',
        partB: 'have been allocated',
        partC: 'to different rural branches',
        partD: 'for their mandatory training period.',
        errorPart: 'B',
        explanation: 'In part (B), "have been allocated" is incorrect. The distributive pronoun "Each" takes a singular verb. The correct verb is "has been allocated".'
      },
      {
        text: 'The digital payment infrastructure has witnessed / exponential growth over the past decade, / making India one of the global leaders / in cashless transactions.',
        partA: 'The digital payment infrastructure has witnessed',
        partB: 'exponential growth over the past decade,',
        partC: 'making India one of the global leaders',
        partD: 'in cashless transactions.',
        errorPart: 'E', // No error
        explanation: 'The sentence is grammatically sound with correct subject-verb agreement and prepositional usage. Hence, there is No error (E).'
      },
      {
        text: 'The Reserve Bank of India has instructed / all scheduled commercial banks to strictly / comply to the revised KYC guidelines / before the end of the quarter.',
        partA: 'The Reserve Bank of India has instructed',
        partB: 'all scheduled commercial banks to strictly',
        partC: 'comply to the revised KYC guidelines',
        partD: 'before the end of the quarter.',
        errorPart: 'C',
        explanation: 'In part (C), "comply to" is incorrect. The verb "comply" takes the fixed preposition "with" ("comply with the revised KYC guidelines").'
      }
    ];

    const pick = errorSets[index % errorSets.length];
    const options = [
      `A: ${pick.partA}`,
      `B: ${pick.partB}`,
      `C: ${pick.partC}`,
      `D: ${pick.partD}`,
      'E: No error'
    ];
    const mapIndex: Record<string, number> = { A: 0, B: 1, C: 2, D: 3, E: 4 };

    return {
      id,
      sectionCode,
      sectionName,
      questionNumber: 0,
      subjectCode: 'english',
      topicName: 'Error Spotting',
      patternCode: 'ENG_ERR_01',
      difficulty: 'medium',
      questionText: `Read the sentence to find out whether there is any grammatical error in it. The error, if any, will be in one part of the sentence. If there is no error, mark 'No error' as your answer:\n\n${pick.text}`,
      options,
      correctOptionIndex: mapIndex[pick.errorPart],
      explanation: pick.explanation,
      marks: 1,
      negativeMarks: 0.25
    };
  }

  private buildPhraseReplacementQuestion(id: string, sectionCode: string, sectionName: string, index: number): ExamQuestionItem {
    const templates = [
      {
        sentence: 'If the bank *would have complied* with the regulatory liquidity framework, it would not have suffered punitive penalties.',
        options: [
          'had complied',
          'would comply',
          'was complying',
          'has complied',
          'No correction required'
        ],
        correct: 0,
        explanation: 'In third conditional sentences (past unreal condition), the if-clause uses the past perfect tense ("had + past participle"), and the main clause uses "would have + past participle". Thus, "had complied" is the correct replacement.'
      },
      {
        sentence: 'The credit rating agency has downgraded the bonds *owing to of* persistent revenue deficits.',
        options: [
          'owing to',
          'in owing of',
          'due with',
          'owing because',
          'No correction required'
        ],
        correct: 0,
        explanation: '"Owing to" already means "because of" and does not take another preposition "of". Hence, "owing to" is correct.'
      },
      {
        sentence: 'The board of directors is looking forward *to implement* the new core banking solution next month.',
        options: [
          'to implementing',
          'for implementing',
          'to have implemented',
          'at implementing',
          'No correction required'
        ],
        correct: 0,
        explanation: 'The phrasal expression "look forward to" has "to" as a preposition, so it must be followed by a gerund (-ing form: "to implementing").'
      }
    ];

    const pick = templates[index % templates.length];

    return {
      id,
      sectionCode,
      sectionName,
      questionNumber: 0,
      subjectCode: 'english',
      topicName: 'Phrase Replacement',
      patternCode: 'ENG_REP_01',
      difficulty: 'easy',
      questionText: `In the following sentence, a phrase is marked between asterisks (*). Choose the option that best replaces the marked phrase to make the sentence grammatically correct:\n\n${pick.sentence}`,
      options: pick.options,
      correctOptionIndex: pick.correct,
      explanation: pick.explanation,
      marks: 1,
      negativeMarks: 0.25
    };
  }

  private buildDoubleFillerQuestion(id: string, sectionCode: string, sectionName: string, index: number): ExamQuestionItem {
    const templates = [
      {
        sentence: 'The central bank has initiated strict measures to ________ non-performing assets and ________ financial resilience among public sector lenders.',
        options: [
          'curb, enhance',
          'augment, diminish',
          'neglect, deteriorate',
          'accelerate, impede',
          'promote, suppress'
        ],
        correct: 0,
        explanation: 'NPAs are non-performing assets that banks need to "curb" (control/reduce), and resilience is a positive quality that banks need to "enhance" (improve). The pair "curb, enhance" fits both blanks logically and grammatically.'
      },
      {
        sentence: 'Despite facing severe macroeconomic ________, the domestic fintech sector has demonstrated remarkable ________.',
        options: [
          'headwinds, resilience',
          'prosperity, weakness',
          'tranquility, chaos',
          'subsidies, failure',
          'stagnation, vulnerability'
        ],
        correct: 0,
        explanation: 'The contrast word "Despite" indicates adversity in the first blank ("headwinds") followed by strength/endurance in the second blank ("resilience").'
      },
      {
        sentence: 'Stringent capital adequacy norms are designed to ________ systemic risks and ________ depositor confidence in the banking sector.',
        options: [
          'mitigate, bolster',
          'exacerbate, undermine',
          'amplify, erode',
          'ignore, weaken',
          'provoke, shatter'
        ],
        correct: 0,
        explanation: 'Capital adequacy norms reduce ("mitigate") systemic risk and strengthen ("bolster") depositor confidence.'
      }
    ];

    const pick = templates[index % templates.length];

    return {
      id,
      sectionCode,
      sectionName,
      questionNumber: 0,
      subjectCode: 'english',
      topicName: 'Double Fillers',
      patternCode: 'ENG_FIL_01',
      difficulty: 'medium',
      questionText: `The following sentence has two blanks. Choose the pair of words that best completes the sentence contextually and grammatically:\n\n${pick.sentence}`,
      options: pick.options,
      correctOptionIndex: pick.correct,
      explanation: pick.explanation,
      marks: 1,
      negativeMarks: 0.25
    };
  }

  private buildClozeTestSet(idPrefix: string, sectionCode: string, sectionName: string): ExamQuestionItem[] {
    const passage =
      `Directions (Q. 1 to 5): In the following passage, there are blanks numbered (1) to (5). ` +
      `Read the passage carefully and choose the correct word from the options for each blank.\n\n` +
      `Financial inclusion remains a cornerstone of India's inclusive growth strategy. Over the last decade, ` +
      `the widespread adoption of the JAM (Jan Dhan, Aadhaar, Mobile) trinity has significantly (1) ________ ` +
      `the socio-economic landscape. By enabling direct benefit transfers, the government has (2) ________ ` +
      `leakages in welfare delivery. However, merely opening bank accounts is not sufficient; ensuring active (3) ________ ` +
      `and credit access for micro-enterprises is critical. Furthermore, robust digital literacy drives are necessary to (4) ________ ` +
      `first-time rural users against cyber frauds and financial (5) ________.`;

    const questionsData = [
      {
        qNum: 1,
        options: ['transformed', 'hindered', 'demolished', 'retarded', 'stagnated'],
        correct: 0,
        explanation: '"Transformed" fits positively with significant technological and socio-economic adoption.'
      },
      {
        qNum: 2,
        options: ['curtailed', 'inflated', 'promoted', 'fabricated', 'neglected'],
        correct: 0,
        explanation: '"Curtailed" means reduced or restricted, which fits the context of eliminating leakages in welfare subsidies.'
      },
      {
        qNum: 3,
        options: ['usage', 'negligence', 'dormancy', 'abstinence', 'boycott'],
        correct: 0,
        explanation: 'Active "usage" refers to recurring transactions and account operations beyond basic opening.'
      },
      {
        qNum: 4,
        options: ['safeguard', 'expose', 'entangle', 'provoke', 'compromise'],
        correct: 0,
        explanation: 'Digital literacy drives aim to "safeguard" (protect) rural customers from fraudulent schemes.'
      },
      {
        qNum: 5,
        options: ['exploitation', 'empowerment', 'prosperity', 'affluence', 'subsidies'],
        correct: 0,
        explanation: '"Exploitation" matches the negative context of cyber frauds and unauthorized extortion.'
      }
    ];

    return questionsData.map((item, idx) => ({
      id: `${idPrefix}-${idx + 1}`,
      sectionCode,
      sectionName,
      questionNumber: 0,
      subjectCode: 'english',
      topicName: 'Cloze Test',
      patternCode: 'ENG_CLOZE_01',
      difficulty: 'medium',
      passageText: passage,
      questionText: `Which of the following words fits best in blank (${item.qNum})?`,
      options: item.options,
      correctOptionIndex: item.correct,
      explanation: item.explanation,
      marks: 1,
      negativeMarks: 0.25
    }));
  }

  private buildParaJumbleSet(idPrefix: string, sectionCode: string, sectionName: string): ExamQuestionItem[] {
    const passage =
      `Directions (Q. 1 to 5): Rearrange the following five sentences (A), (B), (C), (D), and (E) in the proper sequence to form a meaningful paragraph:\n\n` +
      `A. Consequently, foreign portfolio investors withdrew substantial capital from emerging market equities.\n` +
      `B. Global central banks rapidly increased their benchmark interest rates to combat multi-decade high inflation.\n` +
      `C. This aggressive monetary tightening triggered a surge in sovereign bond yields across advanced economies.\n` +
      `D. In response, domestic banking regulators implemented proactive liquidity management buffers.\n` +
      `E. As bond yields rose, the US dollar strengthened markedly against other world currencies.\n`;

    const pjQuestions: ExamQuestionItem[] = [
      {
        id: `${idPrefix}-1`,
        sectionCode,
        sectionName,
        questionNumber: 0,
        subjectCode: 'english',
        topicName: 'Para Jumbles',
        patternCode: 'ENG_PJ_01',
        difficulty: 'hard',
        passageText: passage,
        questionText: `Which of the following should be the FIRST sentence after rearrangement?`,
        options: ['B', 'A', 'C', 'D', 'E'],
        correctOptionIndex: 0,
        explanation: 'Sentence B introduces the root cause: global central banks raising rates to fight inflation. Logical sequence: B -> C -> E -> A -> D.',
        marks: 1,
        negativeMarks: 0.25
      },
      {
        id: `${idPrefix}-2`,
        sectionCode,
        sectionName,
        questionNumber: 0,
        subjectCode: 'english',
        topicName: 'Para Jumbles',
        patternCode: 'ENG_PJ_02',
        difficulty: 'hard',
        passageText: passage,
        questionText: `Which of the following should be the SECOND sentence after rearrangement?`,
        options: ['C', 'A', 'B', 'D', 'E'],
        correctOptionIndex: 0,
        explanation: 'Sentence C directly refers back to B: "This aggressive monetary tightening triggered a surge in bond yields".',
        marks: 1,
        negativeMarks: 0.25
      },
      {
        id: `${idPrefix}-3`,
        sectionCode,
        sectionName,
        questionNumber: 0,
        subjectCode: 'english',
        topicName: 'Para Jumbles',
        patternCode: 'ENG_PJ_03',
        difficulty: 'hard',
        passageText: passage,
        questionText: `Which of the following should be the THIRD sentence after rearrangement?`,
        options: ['E', 'B', 'C', 'A', 'D'],
        correctOptionIndex: 0,
        explanation: 'Sentence E follows C: "As bond yields rose, the US dollar strengthened markedly".',
        marks: 1,
        negativeMarks: 0.25
      },
      {
        id: `${idPrefix}-4`,
        sectionCode,
        sectionName,
        questionNumber: 0,
        subjectCode: 'english',
        topicName: 'Para Jumbles',
        patternCode: 'ENG_PJ_04',
        difficulty: 'hard',
        passageText: passage,
        questionText: `Which of the following should be the FOURTH sentence after rearrangement?`,
        options: ['A', 'D', 'B', 'C', 'E'],
        correctOptionIndex: 0,
        explanation: 'Sentence A details the outflow resulting from dollar strength: foreign investors withdrawing capital.',
        marks: 1,
        negativeMarks: 0.25
      },
      {
        id: `${idPrefix}-5`,
        sectionCode,
        sectionName,
        questionNumber: 0,
        subjectCode: 'english',
        topicName: 'Para Jumbles',
        patternCode: 'ENG_PJ_05',
        difficulty: 'hard',
        passageText: passage,
        questionText: `Which of the following should be the FIFTH (LAST) sentence after rearrangement?`,
        options: ['D', 'E', 'B', 'A', 'C'],
        correctOptionIndex: 0,
        explanation: 'Sentence D concludes by showing domestic regulators reacting to capital outflows.',
        marks: 1,
        negativeMarks: 0.25
      }
    ];

    return pjQuestions;
  }

  private buildReadingComprehensionSet(idPrefix: string, sectionCode: string, sectionName: string): ExamQuestionItem[] {
    const passage =
      `Directions (Q. 1 to 5): Read the following passage carefully and answer the questions given below it.\n\n` +
      `Central Bank Digital Currencies (CBDCs), such as the Reserve Bank of India's Digital Rupee (e₹), represent a sovereign digital legal tender issued directly by the central bank. Unlike decentralized cryptocurrencies, which exhibit extreme price volatility and lack intrinsic backing, a CBDC carries the same sovereign guarantee as physical banknotes. The RBI has bifurcated its pilot into two distinct segments: Wholesale CBDC (e₹-W), designed to streamline interbank settlements and government securities trading, and Retail CBDC (e₹-R), aimed at everyday peer-to-peer and peer-to-merchant transactions.\n\n` +
      `A key advantage of CBDCs is the reduction in the physical cost of printing, transporting, and storing paper currency, alongside instantaneous settlement finality that reduces counterparty risk. However, policymakers remain mindful of potential disintermediation risks: if citizens convert large volumes of commercial bank deposits into risk-free central bank digital wallets during periods of financial stress, commercial banks could face liquidity constraints. Consequently, non-remunerative (zero-interest) holdings and tiered transaction caps have been incorporated into the design architecture.`;

    return [
      {
        id: `${idPrefix}-1`,
        sectionCode,
        sectionName,
        questionNumber: 0,
        subjectCode: 'english',
        topicName: 'Reading Comprehension',
        patternCode: 'ENG_RC_01',
        difficulty: 'medium',
        passageText: passage,
        questionText: `According to the passage, how does a Central Bank Digital Currency (CBDC) fundamentally differ from decentralized cryptocurrencies?`,
        options: [
          'It is a sovereign legal tender backed directly by the central bank',
          'It exhibits higher price volatility than private tokens',
          'It is issued exclusively by private commercial fintech firms',
          'It carries a high annual interest rate for all retail holders',
          'It cannot be used for peer-to-merchant retail payments'
        ],
        correctOptionIndex: 0,
        explanation: 'The first paragraph explicitly states that unlike volatile decentralized cryptocurrencies, a CBDC is a sovereign digital legal tender issued and backed directly by the central bank.',
        marks: 1,
        negativeMarks: 0.25
      },
      {
        id: `${idPrefix}-2`,
        sectionCode,
        sectionName,
        questionNumber: 0,
        subjectCode: 'english',
        topicName: 'Reading Comprehension',
        patternCode: 'ENG_RC_02',
        difficulty: 'medium',
        passageText: passage,
        questionText: `What is the primary objective of the Wholesale CBDC (e₹-W) segment mentioned in the passage?`,
        options: [
          'Streamlining interbank settlements and government securities trading',
          'Replacing all rural cooperative bank branches',
          'Providing high-interest savings accounts to retail households',
          'Financing international cryptocurrency exchanges',
          'Eliminating the Unified Payments Interface (UPI)'
        ],
        correctOptionIndex: 0,
        explanation: 'The passage notes that Wholesale CBDC (e₹-W) is designed to streamline interbank settlements and government securities trading.',
        marks: 1,
        negativeMarks: 0.25
      },
      {
        id: `${idPrefix}-3`,
        sectionCode,
        sectionName,
        questionNumber: 0,
        subjectCode: 'english',
        topicName: 'Reading Comprehension',
        patternCode: 'ENG_RC_03',
        difficulty: 'hard',
        passageText: passage,
        questionText: `Why have policymakers designed CBDC wallets to be "non-remunerative" (bearing zero interest)?`,
        options: [
          'To prevent commercial bank deposit disintermediation and liquidity drain',
          'To increase the physical cost of printing paper currency',
          'To encourage speculative trading in digital tokens',
          'To restrict interbank government securities settlement',
          'Because central banks are prohibited from using digital ledgers'
        ],
        correctOptionIndex: 0,
        explanation: 'The second paragraph explains that non-remunerative (zero-interest) holdings and caps prevent citizens from pulling large deposits out of commercial banks (disintermediation).',
        marks: 1,
        negativeMarks: 0.25
      },
      {
        id: `${idPrefix}-4`,
        sectionCode,
        sectionName,
        questionNumber: 0,
        subjectCode: 'english',
        topicName: 'Reading Comprehension',
        patternCode: 'ENG_RC_04',
        difficulty: 'easy',
        passageText: passage,
        questionText: `Which of the following is most nearly SIMILAR in meaning to the word 'BIFURCATED' as used in the passage?`,
        options: ['Divided into two branches', 'Consolidated into one', 'Abolished permanently', 'Postponed indefinitely', 'Complicated unnecessarily'],
        correctOptionIndex: 0,
        explanation: '"Bifurcated" means divided or split into two branches or parts (here, Wholesale and Retail segments).',
        marks: 1,
        negativeMarks: 0.25
      },
      {
        id: `${idPrefix}-5`,
        sectionCode,
        sectionName,
        questionNumber: 0,
        subjectCode: 'english',
        topicName: 'Reading Comprehension',
        patternCode: 'ENG_RC_05',
        difficulty: 'easy',
        passageText: passage,
        questionText: `Which operational benefit of CBDCs over paper currency is highlighted by the author?`,
        options: [
          'Reduction in printing, transportation, and storage costs of physical cash',
          'Elimination of all central bank regulatory oversight',
          'Guaranteed doubling of currency value every year',
          'Mandatory closure of retail merchant payment networks',
          'Complete removal of KYC compliance for institutional traders'
        ],
        correctOptionIndex: 0,
        explanation: 'The passage states that a key advantage of CBDCs is reducing the physical cost of printing, transporting, and storing paper currency.',
        marks: 1,
        negativeMarks: 0.25
      }
    ];
  }

  private buildVocabContextQuestion(id: string, sectionCode: string, sectionName: string, index: number): ExamQuestionItem {
    const vocabList = [
      {
        word: 'PRUDENT',
        sentence: '"Banks must adopt prudent lending norms to prevent bad loans."',
        correct: 'Cautious',
        distractors: ['Audacious', 'Negligent', 'Reckless', 'Precipitous'],
        exp: `'Prudent' means acting with care and thought for the future. 'Cautious' is the closest synonym.`
      },
      {
        word: 'TRANSIENT',
        sentence: '"The central bank governor noted that the spike in vegetable inflation was transient."',
        correct: 'Temporary',
        distractors: ['Permanent', 'Perpetual', 'Enduring', 'Irreversible'],
        exp: `'Transient' means lasting only for a short time (temporary/fleeting).`
      },
      {
        word: 'STRINGENT',
        sentence: '"Regulators enforced stringent capital adequacy norms for NBFCs."',
        correct: 'Rigorous',
        distractors: ['Lenient', 'Flexible', 'Optional', 'Trivial'],
        exp: `'Stringent' means strict, precise, and exacting ('Rigorous').`
      }
    ];
    const pick = vocabList[index % vocabList.length];
    const fmt = this.format5Options(pick.correct, pick.distractors);

    return {
      id,
      sectionCode,
      sectionName,
      questionNumber: 0,
      subjectCode: 'english',
      topicName: 'Vocabulary in Context',
      patternCode: 'ENG_VOC_01',
      difficulty: 'medium',
      questionText: `Choose the word which is most nearly SIMILAR in meaning (Synonym) to the word '${pick.word}' as used in banking regulation:\n\n${pick.sentence}`,
      options: fmt.options,
      correctOptionIndex: fmt.correctIndex,
      explanation: pick.exp,
      marks: 1,
      negativeMarks: 0.25
    };
  }

  // =========================================================================
  // GENERAL & BANKING AWARENESS GENERATOR
  // =========================================================================

  private generateGaSection(count: number, sectionCode: string, sectionName: string): ExamQuestionItem[] {
    const gaBank = [
      {
        question: 'Under the Deposit Insurance and Credit Guarantee Corporation (DICGC) Act, each depositor in an insured bank is insured up to a maximum of what amount per bank?',
        options: ['₹5,00,000', '₹1,00,000', '₹2,00,000', '₹10,00,000', '₹3,00,000'],
        correct: 0,
        explanation: 'The DICGC insures principal and interest up to a maximum of ₹5 Lakh per depositor per bank across all branch deposits.'
      },
      {
        question: 'What is the mandatory Priority Sector Lending (PSL) target for Domestic Commercial Banks (excluding RRBs & Small Finance Banks)?',
        options: ['40% of ANBC', '75% of ANBC', '30% of ANBC', '50% of ANBC', '25% of ANBC'],
        correct: 0,
        explanation: 'Domestic commercial banks are mandated by the Reserve Bank of India to allocate 40% of Adjusted Net Bank Credit (ANBC) or credit equivalent of off-balance sheet exposure to priority sectors.'
      },
      {
        question: 'Which entity regulates and supervises Regional Rural Banks (RRBs) in India?',
        options: ['NABARD', 'SEBI', 'SIDBI', 'PFRDA', 'IRDAI'],
        correct: 0,
        explanation: 'The National Bank for Agriculture and Rural Development (NABARD) is the statutory apex supervisory body overseeing RRBs and cooperative banks in India.'
      },
      {
        question: 'What does the acronym "LAF" stand for in RBI monetary policy operations?',
        options: ['Liquidity Adjustment Facility', 'Loan Assets Framework', 'Liquid Assets Fund', 'Leveraged Asset Finance', 'Liquidity Allocation Feature'],
        correct: 0,
        explanation: 'LAF stands for Liquidity Adjustment Facility, through which RBI manages day-to-day money market liquidity via Repo and Reverse Repo/SDF auctions.'
      },
      {
        question: 'Which of the following payment systems operates on a 24x7 basis in India on all 365 days of the year?',
        options: ['Both RTGS and NEFT', 'Only NEFT', 'Only RTGS', 'Only CTS', 'Only Cheque Clearing'],
        correct: 0,
        explanation: 'Both National Electronic Funds Transfer (NEFT) and Real Time Gross Settlement (RTGS) operate on a round-the-clock 24x7x365 basis.'
      },
      {
        question: 'What is the minimum amount required to initiate a Real Time Gross Settlement (RTGS) transaction in India?',
        options: ['₹2,00,000', '₹1,00,000', '₹5,00,000', '₹50,000', 'No minimum limit'],
        correct: 0,
        explanation: 'RTGS is designed for high-value transactions and requires a minimum transfer amount of ₹2 Lakh, with no upper ceiling.'
      },
      {
        question: 'How many members constitute the Monetary Policy Committee (MPC) of the Reserve Bank of India?',
        options: ['6 members (3 from RBI and 3 appointed by Government of India)', '5 members', '8 members', '10 members', '4 members'],
        correct: 0,
        explanation: 'Under Section 45ZB of the RBI Act, 1934, the MPC consists of 6 members: 3 internal RBI officials (chaired by the Governor) and 3 external members nominated by the Central Government.'
      },
      {
        question: 'Under Basel-III norms enforced by the Reserve Bank of India, what is the minimum Capital to Risk-Weighted Assets Ratio (CRAR) required for Scheduled Commercial Banks (excluding CCB)?',
        options: ['9.0%', '8.0%', '11.5%', '10.5%', '7.5%'],
        correct: 0,
        explanation: 'While international Basel-III norms prescribe 8%, the RBI mandates a stricter minimum CRAR of 9.0% (or 11.5% including the 2.5% Capital Conservation Buffer) for Indian scheduled commercial banks.'
      },
      {
        question: 'What is the mandatory Priority Sector Lending (PSL) target for Small Finance Banks (SFBs) and Regional Rural Banks (RRBs) in India?',
        options: ['75% of ANBC', '40% of ANBC', '60% of ANBC', '50% of ANBC', '80% of ANBC'],
        correct: 0,
        explanation: 'Both Small Finance Banks (SFBs) and Regional Rural Banks (RRBs) are required to direct 75% of their Adjusted Net Bank Credit (ANBC) toward Priority Sector Lending.'
      },
      {
        question: 'Which organization launched the "SARTHI" and "SCORES" platforms for investor grievance redressal and market awareness?',
        options: ['SEBI', 'RBI', 'IRDAI', 'NABARD', 'SIDBI'],
        correct: 0,
        explanation: 'The Securities and Exchange Board of India (SEBI) operates SCORES (SEBI Complaints Redress System) and the Saarthi investor education app.'
      },
      {
        question: 'A loan asset in a commercial bank is classified as a "Substandard Asset" when it has remained a Non-Performing Asset (NPA) for a period less than or equal to:',
        options: ['12 months', '90 days', '6 months', '24 months', '36 months'],
        correct: 0,
        explanation: 'Once an account becomes an NPA (overdue > 90 days), it is categorized as a Substandard Asset for a period of up to 12 months, after which it moves to the Doubtful category.'
      },
      {
        question: 'Which uncollateralized monetary policy tool was introduced by the RBI in April 2022 as the floor of the Liquidity Adjustment Facility (LAF) corridor?',
        options: ['Standing Deposit Facility (SDF)', 'Marginal Standing Facility (MSF)', 'Cash Reserve Ratio (CRR)', 'Statutory Liquidity Ratio (SLR)', 'Long Term Repo Operation (LTRO)'],
        correct: 0,
        explanation: 'The Standing Deposit Facility (SDF) allows banks to park excess liquidity with the RBI without requiring government securities collateral, serving as the floor of the LAF corridor.'
      },
      {
        question: 'In the context of digital banking, how many digits are present in a standard Indian Financial System Code (IFSC)?',
        options: ['11 alphanumeric characters', '10 alphanumeric characters', '12 numeric digits', '9 numeric digits', '16 alphanumeric characters'],
        correct: 0,
        explanation: 'IFSC is an 11-character alphanumeric code where the first 4 letters identify the bank, the 5th character is always 0, and the last 6 characters identify the specific bank branch.'
      },
      {
        question: 'Which statutory institution acts as the principal financial institution for the promotion, financing, and development of the Micro, Small and Medium Enterprise (MSME) sector in India?',
        options: ['SIDBI', 'EXIM Bank', 'NABARD', 'NHB', 'NaBFID'],
        correct: 0,
        explanation: 'The Small Industries Development Bank of India (SIDBI), headquartered in Lucknow, was established in 1990 as the apex refinancing and development institution for MSMEs.'
      },
      {
        question: 'Money lent for 2 to 14 days in the interbank money market is referred to as:',
        options: ['Notice Money', 'Call Money', 'Term Money', 'Treasury Bill', 'Commercial Paper'],
        correct: 0,
        explanation: 'In the money market, overnight borrowing (1 day) is Call Money, borrowing for 2 to 14 days is Notice Money, and borrowing beyond 14 days is Term Money.'
      },
      {
        question: 'Which institution maintains and manages the Rural Infrastructure Development Fund (RIDF) created out of Priority Sector Lending shortfalls of commercial banks?',
        options: ['NABARD', 'RBI', 'SIDBI', 'Ministry of Finance', 'NHB'],
        correct: 0,
        explanation: 'The Rural Infrastructure Development Fund (RIDF) was instituted by the Government of India in 1995-96 in NABARD to finance ongoing rural infrastructure projects.'
      },
      {
        question: 'What is the foreign direct investment (FDI) ceiling permissible in the Indian insurance sector under the automatic approval route?',
        options: ['74%', '49%', '100%', '26%', '51%'],
        correct: 0,
        explanation: 'The Parliament enacted the Insurance Laws (Amendment) Act increasing the FDI limit in insurance companies from 49% to 74% under the automatic route.'
      },
      {
        question: 'Which apex statutory body regulates and licenses the insurance and reinsurance industry in India?',
        options: ['IRDAI', 'SEBI', 'PFRDA', 'RBI', 'FMC'],
        correct: 0,
        explanation: 'The Insurance Regulatory and Development Authority of India (IRDAI), headquartered in Hyderabad, is the statutory regulator for insurance and reinsurance.'
      },
      {
        question: 'Under the Kisan Credit Card (KCC) scheme, what prompt repayment incentive (interest subvention) is provided by the Central Government on short-term crop loans up to ₹3 Lakh?',
        options: ['3% per annum', '2% per annum', '1.5% per annum', '4% per annum', '5% per annum'],
        correct: 0,
        explanation: 'With a normal benchmark interest rate of 7% and an additional 3% subvention for prompt repayment, the effective interest rate for farmers is 4% per annum.'
      },
      {
        question: 'What is the life insurance coverage provided under the Pradhan Mantri Jeevan Jyoti Bima Yojana (PMJJBY)?',
        options: ['₹2,00,000', '₹1,00,000', '₹5,00,000', '₹3,00,000', '₹50,000'],
        correct: 0,
        explanation: 'PMJJBY offers life insurance cover of ₹2 Lakh for death due to any reason to all savings bank account holders aged 18 to 50 years.'
      },
      {
        question: 'What is the accidental death and full disability insurance cover under Pradhan Mantri Suraksha Bima Yojana (PMSBY)?',
        options: ['₹2,00,000', '₹1,00,000', '₹50,000', '₹5,00,000', '₹3,00,000'],
        correct: 0,
        explanation: 'PMSBY provides ₹2 Lakh cover for accidental death or permanent total disability (and ₹1 Lakh for permanent partial disability) for persons aged 18 to 70 years.'
      },
      {
        question: 'What is the entry age bracket for eligible Indian citizens to subscribe to the Atal Pension Yojana (APY)?',
        options: ['18 to 40 years', '18 to 60 years', '21 to 55 years', '25 to 50 years', '18 to 50 years'],
        correct: 0,
        explanation: 'Subscribers can join Atal Pension Yojana (APY) between 18 and 40 years of age to receive a guaranteed monthly pension ranging from ₹1,000 to ₹5,000 from age 60.'
      },
      {
        question: 'Under Priority Sector Lending (PSL) norms, what is the mandatory sub-target for lending to Small and Marginal Farmers (SMFs) for domestic commercial banks?',
        options: ['10% of ANBC', '8% of ANBC', '12% of ANBC', '7.5% of ANBC', '15% of ANBC'],
        correct: 0,
        explanation: 'Within the total 18% agricultural target, domestic commercial banks have a phased mandatory sub-target of 10% of Adjusted Net Bank Credit for Small and Marginal Farmers.'
      },
      {
        question: 'What is the fixed annual interest rate offered by the Reserve Bank of India on Sovereign Gold Bonds (SGB)?',
        options: ['2.50% per annum', '3.00% per annum', '2.00% per annum', '1.75% per annum', '4.00% per annum'],
        correct: 0,
        explanation: 'SGB investors receive a guaranteed nominal interest of 2.50% per annum on the amount of initial investment, credited semi-annually to their bank account.'
      },
      {
        question: 'The SARFAESI Act, 2002 allows banks and financial institutions in India to auction commercial or residential properties to recover loans without the intervention of:',
        options: ['Courts of Law', 'Reserve Bank of India', 'Ministry of Finance', 'State Government', 'Registrar of Companies'],
        correct: 0,
        explanation: 'SARFAESI (Securitization and Reconstruction of Financial Assets and Enforcement of Security Interest) Act empowers secured creditors to seize and auction mortgaged collateral without going to court.'
      },
      {
        question: 'Under the Prompt Corrective Action (PCA) framework revised by the RBI, which three parameters trigger supervisory intervention?',
        options: ['Capital (CRAR), Asset Quality (Net NPA), and Leverage Ratio', 'Deposit Growth, Branch Network, and Profitability', 'CRR, SLR, and Cash Reserve Deficit', 'Foreign Exchange Inflow, Net Worth, and Credit Spread', 'Lending Rate, CASA Ratio, and Return on Assets'],
        correct: 0,
        explanation: 'The RBI revised PCA framework monitors three critical indicators: CRAR/Tier 1 Capital, Net NPA Ratio, and Tier 1 Leverage Ratio.'
      },
      {
        question: 'In the context of credit underwriting in India, how many Credit Information Companies (CICs) are authorized and regulated by the Reserve Bank of India under the CICRA Act, 2005?',
        options: ['4 (TransUnion CIBIL, Equifax, Experian, CRIF High Mark)', '2 (CIBIL and Equifax)', '5 (CIBIL, Equifax, Experian, CRISIL, ICRA)', '3 (CIBIL, Experian, ICRA)', '1 (TransUnion CIBIL only)'],
        correct: 0,
        explanation: 'There are 4 operating CICs registered with the RBI in India: TransUnion CIBIL, Equifax Credit Information Services, Experian Credit Information Company, and CRIF High Mark.'
      },
      {
        question: 'What is the maximum loan limit eligible for financing under the Pradhan Mantri MUDRA Yojana (PMMY) under the "Tarun" category?',
        options: ['₹10,00,000', '₹5,00,000', '₹20,00,000', '₹15,00,000', '₹7,50,000'],
        correct: 0,
        explanation: 'PMMY loans are classified into Shishu (up to ₹50,000), Kishor (₹50,000 to ₹5,00,000), and Tarun (above ₹5,00,000 up to ₹10,00,000).'
      },
      {
        question: 'Under the Lead Bank Scheme formulated by the RBI following the Gadgil Study Group and Nariman Committee, each district in India is assigned to a Lead Bank to coordinate:',
        options: ['District Credit Plans (DCP) and credit flow across commercial banks', 'Central bank inspections only', 'Currency chest security and coin distribution', 'Tax collection for State Treasuries', 'Foreign exchange remittances only'],
        correct: 0,
        explanation: 'Under the Lead Bank Scheme, designated Lead Banks coordinate with District Consultative Committees (DCC) to formulate and execute annual District Credit Plans (DCP).'
      }
    ];

    const shuffledBank = this.shuffle(gaBank);
    const items: ExamQuestionItem[] = [];
    const runId = Math.random().toString(36).substring(2, 7);

    for (let i = 0; i < count; i++) {
      const qData = shuffledBank[i % shuffledBank.length];
      const fmt = this.format5Options(qData.options[qData.correct], qData.options.filter((_, idx) => idx !== qData.correct));
      items.push({
        id: `${runId}-ga-${i}`,
        sectionCode,
        sectionName,
        questionNumber: 0,
        subjectCode: 'ga',
        topicName: 'Banking Awareness & Monetary Policy',
        patternCode: 'GA_BANK_01',
        difficulty: 'medium',
        questionText: qData.question,
        options: fmt.options,
        correctOptionIndex: fmt.correctIndex,
        explanation: qData.explanation,
        marks: 1,
        negativeMarks: 0.25
      });
    }

    return items;
  }

  // =========================================================================
  // CURRENT AFFAIRS (NATIONAL, INTERNATIONAL & FINANCIAL NEWS) GENERATOR
  // =========================================================================

  public generateCurrentAffairsSection(count: number, sectionCode: string, sectionName: string): ExamQuestionItem[] {
    const caBank = [
      {
        question: 'Which country recently linked its national fast-payment network "PayNow" with India\'s Unified Payments Interface (UPI) for instantaneous cross-border remittances?',
        options: ['Singapore', 'United Arab Emirates', 'France', 'Mauritius', 'Malaysia'],
        correct: 0,
        explanation: 'Singapore became the first country to link its real-time payment system (PayNow) with India\'s UPI to enable direct, low-cost cross-border fund transfers.'
      },
      {
        question: 'The Reserve Bank of India launched the "UDGAM" portal to assist the public in searching for:',
        options: ['Unclaimed deposits across multiple banks in one centralized platform', 'Counterfeit currency detection reports', 'Direct agricultural subsidy disbursements', 'Non-performing asset auction schedules', 'Foreign currency exchange licenses'],
        correct: 0,
        explanation: 'UDGAM stands for Unclaimed Deposits - Gateway to Access inforMation, developed by RBI to help depositors search their unclaimed accounts across all participating banks in India.'
      },
      {
        question: 'Under the PM Vishwakarma Scheme, what is the maximum collateral-free enterprise development loan provided to traditional artisans across two tranches at a concessional interest rate of 5%?',
        options: ['₹3 Lakh (₹1 Lakh in first tranche, ₹2 Lakh in second tranche)', '₹5 Lakh', '₹2 Lakh', '₹10 Lakh', '₹1 Lakh'],
        correct: 0,
        explanation: 'The PM Vishwakarma Scheme provides holistic support including skill training and collateral-free enterprise loans up to ₹3 Lakh (₹1L tranche-1 and ₹2L tranche-2) at a subsidised interest rate of 5%.'
      },
      {
        question: 'The Reserve Bank of India\'s Central Bank Digital Currency (CBDC) pilot operates in two segments: retail and wholesale. What is the official symbol/denomination name for India\'s digital currency?',
        options: ['Digital Rupee (e₹)', 'Bharat Coin (bCoin)', 'DigiRupee (DR)', 'RBI Token (rToken)', 'CryptoRupee (c₹)'],
        correct: 0,
        explanation: 'The RBI launched India\'s official sovereign Central Bank Digital Currency under the name "Digital Rupee", denoted as "e₹" (e₹-R for retail and e₹-W for wholesale).'
      },
      {
        question: 'In a significant international debt market milestone, which major global benchmark index began including Indian Government Bonds (FAR securities) starting from June 2024?',
        options: ['JPMorgan Government Bond Index - Emerging Markets (GBI-EM)', 'Bloomberg Global Aggregate Index', 'FTSE Emerging Markets Bond Index', 'MSCI World Sovereign Index', 'S&P Dow Jones Global Bond Index'],
        correct: 0,
        explanation: 'JPMorgan included Indian Government Fully Accessible Route (FAR) bonds into its flagship GBI-EM Global Diversified index with a phased 10% maximum weight.'
      },
      {
        question: 'Which organization was admitted as the newest permanent member of the Group of Twenty (G20) during the New Delhi G20 Leaders\' Summit?',
        options: ['African Union (AU)', 'European Free Trade Association (EFTA)', 'Association of Southeast Asian Nations (ASEAN)', 'Commonwealth of Independent States (CIS)', 'OPEC'],
        correct: 0,
        explanation: 'Under India\'s G20 Presidency in New Delhi, the 55-nation African Union (AU) was formally admitted as a permanent member of the G20 group.'
      },
      {
        question: 'The "MuleHunter.AI" collaborative artificial intelligence tool was initiated by which entity in India to detect and dismantle illicit money mule accounts used in cyber-financial fraud?',
        options: ['Reserve Bank Innovation Hub (RBIH)', 'SEBI', 'National Crime Records Bureau (NCRB)', 'CERT-In', 'Indian Banks Association (IBA)'],
        correct: 0,
        explanation: 'Reserve Bank Innovation Hub (RBIH), a wholly owned subsidiary of the RBI, built MuleHunter.AI to assist banks in proactively identifying mule account networks.'
      },
      {
        question: 'Under the Union Budget fiscal consolidation roadmap, the Government of India aims to reduce the fiscal deficit to below what percentage of GDP by FY 2025-26?',
        options: ['Below 4.5% of GDP', 'Below 3.0% of GDP', 'Below 5.1% of GDP', 'Below 4.0% of GDP', 'Below 5.5% of GDP'],
        correct: 0,
        explanation: 'The Government of India has committed to a glide path reaching a fiscal deficit below 4.5% of GDP by financial year 2025-26.'
      },
      {
        question: 'Which international financial institution is headquartered in Shanghai, China, and was established by the BRICS nations to mobilize resources for infrastructure and sustainable development projects?',
        options: ['New Development Bank (NDB)', 'Asian Infrastructure Investment Bank (AIIB)', 'Asian Development Bank (ADB)', 'Bank for International Settlements (BIS)', 'International Monetary Fund (IMF)'],
        correct: 0,
        explanation: 'The New Development Bank (NDB), formerly referred to as the BRICS Development Bank, has its headquarters in Shanghai, China.'
      },
      {
        question: 'The Reserve Bank of India mandated that all Scheduled Commercial Banks must maintain an Incremental Cash Reserve Ratio (I-CRR) temporarily in 2023 primarily to absorb surplus liquidity generated by:',
        options: ['The return and withdrawal of ₹2,000 denomination banknotes', 'Inflow of foreign portfolio investments', 'Heavy government transfer payments during elections', 'Reduction in statutory liquidity ratio (SLR)', 'Open market sales of government securities'],
        correct: 0,
        explanation: 'The RBI imposed a temporary 10% Incremental CRR on net demand and time liabilities (NDTL) to soak up excess banking system liquidity caused by the return of ₹2,000 banknotes.'
      },
      {
        question: 'Under RBI guidelines on Digital Lending, all loan disbursals and repayments must be executed solely between:',
        options: ['Bank accounts of the borrower and the Regulated Entity (RE) directly without any third-party pass-through', 'The borrower and the Lending Service Provider (LSP)', 'The escrow wallet of the mobile application and the borrower', 'The payment gateway and the fintech platform', 'The borrower and credit rating agencies'],
        correct: 0,
        explanation: 'To eliminate predatory fintech malpractices, the RBI mandates that all credit disbursement and collection must occur directly between the borrower\'s bank account and the regulated bank/NBFC.'
      },
      {
        question: 'What is the primary objective of the "RBI Retail Direct" scheme introduced by the Reserve Bank of India?',
        options: ['To facilitate individual retail investors to directly open Gilt accounts with RBI and buy Government Securities without intermediaries', 'To provide instant personal overdrafts to savings account holders', 'To issue credit cards to rural retail shopkeepers', 'To allow retail shopping using gold bullion', 'To insure deposits of retail merchants up to ₹25 Lakh'],
        correct: 0,
        explanation: 'RBI Retail Direct provides a one-stop portal for individual retail investors to invest in Central Government Securities, Treasury Bills, State Development Loans (SDLs), and Sovereign Gold Bonds directly.'
      },
      {
        question: 'What is the maximum investment limit under the Senior Citizens Savings Scheme (SCSS) as enhanced by the Government of India?',
        options: ['₹30 Lakh', '₹15 Lakh', '₹25 Lakh', '₹20 Lakh', '₹50 Lakh'],
        correct: 0,
        explanation: 'The Government of India doubled the maximum deposit limit under the Senior Citizens Savings Scheme (SCSS) from ₹15 Lakh to ₹30 Lakh.'
      },
      {
        question: 'The National Asset Reconstruction Company Limited (NARCL), popular as India\'s "Bad Bank", was established with an aggregate sovereign government guarantee of how much amount to resolve stressed banking assets?',
        options: ['₹30,600 crore', '₹50,000 crore', '₹20,000 crore', '₹15,000 crore', '₹75,000 crore'],
        correct: 0,
        explanation: 'The Union Cabinet approved a sovereign central government guarantee of up to ₹30,600 crore to back Security Receipts (SRs) issued by NARCL for acquiring legacy non-performing loans.'
      },
      {
        question: 'Which state hosted the 37th National Games of India, where Maharashtra topped the overall medal tally to win the prestigious Raja Bhalindra Singh Trophy?',
        options: ['Goa', 'Gujarat', 'Kerala', 'Uttarakhand', 'Assam'],
        correct: 0,
        explanation: 'Goa hosted the 37th National Games in 2023, where Maharashtra emerged as champions with over 200 medals.'
      },
      {
        question: 'Under the RBI Financial Inclusion Index (FI-Index), which three broad parameters are evaluated, with weights of 35%, 45%, and 20% respectively?',
        options: ['Access (35%), Usage (45%), and Quality (20%)', 'Availability, Affordability, and Accountability', 'Inclusion, Outreach, and Recovery', 'Rural Reach, Digital Volume, and Asset Quality', 'Branching, ATM density, and Microfinance'],
        correct: 0,
        explanation: 'The FI-Index incorporates 97 indicators capturing three dimensions: Access (35% weight), Usage (45% weight), and Quality (20% weight).'
      },
      {
        question: 'Which Indian public sector bank introduced "Project WAVE" (World of Advanced Virtual Experience) to spearhead end-to-end digital pre-approved loans and financial journeys?',
        options: ['Indian Bank', 'Punjab National Bank', 'Bank of Baroda', 'State Bank of India', 'Canara Bank'],
        correct: 0,
        explanation: 'Indian Bank launched Project WAVE to digitalise retail banking products, agriculture finance, and micro-loan sanctions without physical branch visits.'
      },
      {
        question: 'In the context of green financing, Sovereign Green Bonds (SGrBs) issued by the Government of India qualify for which regulatory reserve requirement for banks?',
        options: ['Statutory Liquidity Ratio (SLR)', 'Cash Reserve Ratio (CRR)', 'Capital Conservation Buffer only', 'Foreign Exchange Reserve Asset', 'Priority Sector Lending certificate only'],
        correct: 0,
        explanation: 'RBI notified that investments in Sovereign Green Bonds (SGrBs) are reckoned as eligible securities for Statutory Liquidity Ratio (SLR) purposes.'
      },
      {
        question: 'Which country officially took over the presidency of the BRICS grouping from January 1, 2024, overseeing the expansion of its member nations?',
        options: ['Russia', 'Brazil', 'South Africa', 'India', 'China'],
        correct: 0,
        explanation: 'Russia assumed the rotating one-year BRICS chairmanship under the motto "Strengthening Multilateralism for Equitable Global Development and Security".'
      },
      {
        question: 'Under the Pradhan Mantri Jan Dhan Yojana (PMJDY), what is the maximum overdraft (OD) facility available to eligible account holders after 6 months of satisfactory operation?',
        options: ['₹10,000', '₹5,00,000', '₹20,000', '₹15,000', '₹2,000'],
        correct: 0,
        explanation: 'Eligible PMJDY accounts with active debit transactions are entitled to an overdraft facility of up to ₹10,000 (with no conditions up to ₹2,000) for individuals aged 18 to 65 years.'
      }
    ];

    const shuffledBank = this.shuffle(caBank);
    const items: ExamQuestionItem[] = [];
    const runId = Math.random().toString(36).substring(2, 7);

    for (let i = 0; i < count; i++) {
      const qData = shuffledBank[i % shuffledBank.length];
      const fmt = this.format5Options(qData.options[qData.correct], qData.options.filter((_, idx) => idx !== qData.correct));
      items.push({
        id: `${runId}-ca-${i}`,
        sectionCode,
        sectionName,
        questionNumber: 0,
        subjectCode: 'ga',
        topicName: 'Current Affairs (National & International)',
        patternCode: 'GA_CA_01',
        difficulty: 'medium',
        questionText: qData.question,
        options: fmt.options,
        correctOptionIndex: fmt.correctIndex,
        explanation: qData.explanation,
        marks: 1,
        negativeMarks: 0.25
      });
    }

    return items;
  }

  // =========================================================================
  // COMPUTER APTITUDE & KNOWLEDGE GENERATOR (FOR MAINS & RRB EXAMS)
  // =========================================================================

  private generateComputerSection(count: number, sectionCode: string, sectionName: string): ExamQuestionItem[] {
    const compBank = [
      {
        question: 'Which layer of the 7-layer OSI (Open Systems Interconnection) model is responsible for end-to-end error recovery, flow control, and TCP/UDP packet segmentation?',
        options: ['Transport Layer (Layer 4)', 'Network Layer (Layer 3)', 'Data Link Layer (Layer 2)', 'Session Layer (Layer 5)', 'Physical Layer (Layer 1)'],
        correct: 0,
        explanation: 'The Transport Layer (Layer 4) manages end-to-end communication, flow control, and error recovery using protocols like TCP and UDP.'
      },
      {
        question: 'In a Relational Database Management System (RDBMS), which key is used to establish and enforce a link between the data in two tables?',
        options: ['Foreign Key', 'Candidate Key', 'Super Key', 'Alternate Key', 'Composite Key'],
        correct: 0,
        explanation: 'A Foreign Key is a column or group of columns in a relational database table that provides a link between data in two tables by referencing the Primary Key of another table.'
      },
      {
        question: 'Which high-speed volatile semiconductor memory is placed directly between the CPU registers and main RAM to reduce average data access time?',
        options: ['Cache Memory (SRAM)', 'ROM', 'Flash Memory', 'Magnetic Disk', 'Optical CD-ROM'],
        correct: 0,
        explanation: 'Cache memory (built using Static RAM) sits between the CPU and main DRAM to store frequently accessed instructions and data.'
      },
      {
        question: 'In Microsoft Excel, which keyboard shortcut is used to insert a new worksheet into a workbook?',
        options: ['Shift + F11', 'Ctrl + N', 'Alt + F1', 'Ctrl + F11', 'Shift + F9'],
        correct: 0,
        explanation: 'Pressing Shift + F11 inserts a new worksheet in Microsoft Excel, whereas Ctrl + N creates an entirely new workbook.'
      },
      {
        question: 'What is the hexadecimal equivalent of the binary number (11011010)₂?',
        options: ['DA', 'CA', 'DB', 'B6', 'E4'],
        correct: 0,
        explanation: 'Grouping into 4-bit nibbles: 1101 = 13 (D in hex) and 1010 = 10 (A in hex). Therefore, (11011010)₂ = (DA)₁₆.'
      },
      {
        question: 'Which network protocol automatically assigns dynamic IP addresses and subnet masks to client devices joining a TCP/IP network?',
        options: ['DHCP (Dynamic Host Configuration Protocol)', 'DNS (Domain Name System)', 'SNMP (Simple Network Management Protocol)', 'FTP (File Transfer Protocol)', 'SMTP (Simple Mail Transfer Protocol)'],
        correct: 0,
        explanation: 'DHCP dynamically assigns IP addresses and network configuration parameters to devices on a network.'
      },
      {
        question: 'Which universal logic gate produces a LOW (0) output ONLY when all of its inputs are HIGH (1)?',
        options: ['NAND Gate', 'NOR Gate', 'XOR Gate', 'OR Gate', 'AND Gate'],
        correct: 0,
        explanation: 'A NAND (NOT-AND) gate is a universal gate whose output is 0 only when all inputs are 1, and 1 in all other cases.'
      },
      {
        question: 'In operating systems, what is the condition called where two or more processes are permanently blocked because each process holds a resource and waits for another resource held by another process?',
        options: ['Deadlock', 'Paging', 'Thrashing', 'Spooling', 'Context Switching'],
        correct: 0,
        explanation: 'Deadlock occurs when a set of processes are blocked because each process is holding a resource and waiting to acquire a resource held by another process in the same set.'
      },
      {
        question: 'Which SQL command belongs to the Data Definition Language (DDL) category and removes all rows from a table without logging individual row deletions, while keeping the table structure intact?',
        options: ['TRUNCATE', 'DELETE', 'DROP', 'REMOVE', 'UPDATE'],
        correct: 0,
        explanation: 'TRUNCATE TABLE is a DDL command that rapidly deallocates all data pages in a table while preserving the table schema for future inserts.'
      },
      {
        question: 'Which type of malicious software encrypts a victim’s files and demands a financial payment in exchange for the decryption key?',
        options: ['Ransomware', 'Adware', 'Spyware', 'Rootkit', 'Keylogger'],
        correct: 0,
        explanation: 'Ransomware is a category of malware that locks or encrypts critical user/enterprise data and demands ransom for restoration.'
      },
      {
        question: 'What is the address length in bits of an Internet Protocol Version 6 (IPv6) address compared to an IPv4 address?',
        options: ['128 bits (IPv6) vs 32 bits (IPv4)', '64 bits (IPv6) vs 32 bits (IPv4)', '256 bits (IPv6) vs 64 bits (IPv4)', '128 bits (IPv6) vs 64 bits (IPv4)', '32 bits (IPv6) vs 16 bits (IPv4)'],
        correct: 0,
        explanation: 'IPv4 uses 32-bit numeric addresses yielding ~4.3 billion addresses, whereas IPv6 uses 128-bit hexadecimal addresses allowing 2^128 unique addresses.'
      },
      {
        question: 'What standard well-known TCP port number is utilized for Secure Hypertext Transfer Protocol (HTTPS) traffic encrypted via TLS/SSL?',
        options: ['Port 443', 'Port 80', 'Port 21', 'Port 25', 'Port 22'],
        correct: 0,
        explanation: 'Port 443 is universally designated for HTTPS secure encrypted web traffic, whereas port 80 is for unencrypted HTTP.'
      },
      {
        question: 'Which memory type is non-volatile, retains its contents when computer power is switched off, and holds the firmware bootstrap startup routines?',
        options: ['ROM (Read Only Memory)', 'DRAM (Dynamic RAM)', 'SRAM (Static RAM)', 'Virtual Swap File', 'CPU Register Cache'],
        correct: 0,
        explanation: 'ROM is non-volatile memory where vital bootstrap loader instructions and BIOS/UEFI firmware are permanently stored.'
      },
      {
        question: 'In cybersecurity, what term describes a deceptive social engineering attack where fraudulent emails or websites impersonate legitimate banks to steal user credentials?',
        options: ['Phishing', 'Man-in-the-Middle Attack', 'Denial of Service (DoS)', 'SQL Injection', 'Buffer Overflow'],
        correct: 0,
        explanation: 'Phishing is a fraudulent attempt to obtain sensitive information such as usernames, passwords, and banking details by disguising as a trustworthy entity.'
      },
      {
        question: 'Which keyboard shortcut is used in Microsoft Office applications (Word, Excel, PowerPoint) to open the Insert Hyperlink dialog box?',
        options: ['Ctrl + K', 'Ctrl + H', 'Ctrl + L', 'Alt + K', 'Ctrl + Shift + H'],
        correct: 0,
        explanation: 'Ctrl + K is the standard universal shortcut across Microsoft Office and browsers to insert a hyperlink.'
      },
      {
        question: 'In operating system architecture, what is the core computer program that possesses complete control over everything in the system and directly bridges user applications to CPU hardware?',
        options: ['Kernel', 'Shell', 'Device Driver', 'Compiler', 'Spooler'],
        correct: 0,
        explanation: 'The Kernel is the central core component of an OS that manages hardware resources, process scheduling, memory allocation, and system calls.'
      },
      {
        question: 'Which RAID (Redundant Array of Independent Disks) configuration level provides disk mirroring without parity, duplicating data across two drives for high fault tolerance?',
        options: ['RAID 1', 'RAID 0', 'RAID 5', 'RAID 6', 'RAID 10'],
        correct: 0,
        explanation: 'RAID 1 uses disk mirroring, writing identical copies of data to two separate drives so that if one drive fails, no data is lost.'
      },
      {
        question: 'Which network security system continuously monitors and controls incoming and outgoing network traffic based on predetermined security access rules?',
        options: ['Firewall', 'Proxy Server', 'Modem', 'Network Switch', 'Hub'],
        correct: 0,
        explanation: 'A Firewall inspects network packets at network boundaries and permits or blocks traffic based on configured security policies.'
      },
      {
        question: 'Which protocol translates human-friendly Internet domain names (like www.rbi.org.in) into machine-readable numeric IP addresses?',
        options: ['DNS (Domain Name System)', 'SNMP (Simple Network Management Protocol)', 'ICMP (Internet Control Message Protocol)', 'ARP (Address Resolution Protocol)', 'BGP (Border Gateway Protocol)'],
        correct: 0,
        explanation: 'DNS serves as the phonebook of the Internet, resolving domain names into the corresponding IP addresses required by networking hardware.'
      },
      {
        question: 'In operating systems, which resource allocation and deadlock avoidance algorithm tests for safety by simulating the allocation of predetermined maximum possible amounts of all resources?',
        options: ["Banker's Algorithm", "Round Robin Scheduling", "Dijkstra's Shortest Path", "LRU Page Replacement", "First-Come First-Served"],
        correct: 0,
        explanation: "The Banker's Algorithm (developed by Edsger Dijkstra) is a deadlock avoidance algorithm that checks if resource allocation leaves the system in a safe state."
      },
      {
        question: 'What technique temporarily holds print jobs or I/O data in a disk buffer until the slower peripheral device is ready to process them?',
        options: ['Spooling (Simultaneous Peripheral Operations On-Line)', 'Swapping', 'Caching', 'Pipelining', 'Interleaving'],
        correct: 0,
        explanation: 'Spooling overlaps the I/O of one job with the computation of other jobs by holding print/data streams on high-speed disk storage.'
      },
      {
        question: 'In relational database design, a table is in Boyce-Codd Normal Form (BCNF) if and only if for every non-trivial functional dependency X → Y:',
        options: ['X is a Super Key', 'Y is a Super Key', 'X is a Foreign Key', 'Y is a Prime Attribute', 'X is a Candidate Key of another table'],
        correct: 0,
        explanation: 'BCNF is a stricter version of 3NF where every determinant (X in X → Y) must strictly be a Super Key.'
      },
      {
        question: 'Which type of malicious software misleads users of its true intent by disguising itself as legitimate, safe software while secretly executing malicious payloads?',
        options: ['Trojan Horse', 'Worm', 'Rootkit', 'Adware', 'Spyware'],
        correct: 0,
        explanation: 'A Trojan Horse appears as a harmless utility or game to trick the user into installing it, but contains hidden malicious code.'
      },
      {
        question: 'Which media access control method is historically utilized in half-duplex Ethernet networks to detect collisions on shared transmission media?',
        options: ['CSMA/CD (Carrier Sense Multiple Access with Collision Detection)', 'CSMA/CA (Carrier Sense Multiple Access with Collision Avoidance)', 'Token Ring Passing', 'Slotted ALOHA', 'TDMA (Time Division Multiple Access)'],
        correct: 0,
        explanation: 'CSMA/CD listens before transmitting on Ethernet cables; if a collision is detected during transmission, both stations back off for a random interval.'
      },
      {
        question: 'Which cloud computing service delivery model provides end users with complete on-demand applications hosted entirely over the internet without local software installation?',
        options: ['SaaS (Software as a Service)', 'IaaS (Infrastructure as a Service)', 'PaaS (Platform as a Service)', 'DaaS (Desktop as a Service)', 'BaaS (Backend as a Service)'],
        correct: 0,
        explanation: 'SaaS provides software applications (like Google Workspace, Microsoft 365, Salesforce) accessible through web browsers over the cloud.'
      },
      {
        question: 'In Microsoft Excel, which keyboard shortcut combination displays the Macro dialog box to view, run, or edit VBA macros?',
        options: ['Alt + F8', 'Alt + F11', 'Ctrl + F8', 'Shift + F8', 'Ctrl + M'],
        correct: 0,
        explanation: 'Alt + F8 opens the Macro dialog box in Microsoft Excel (Alt + F11 opens the Visual Basic Editor).'
      },
      {
        question: 'Which physical network topology connects all client nodes directly to a central networking device such as a network switch or hub?',
        options: ['Star Topology', 'Bus Topology', 'Ring Topology', 'Mesh Topology', 'Tree Topology'],
        correct: 0,
        explanation: 'In a Star topology, all devices are connected directly to a central hub or switch; a failure in any individual cable only isolates that single workstation.'
      },
      {
        question: 'Which cryptography methodology utilizes a pair of mathematically linked keys — a public key for encryption and a private key for decryption?',
        options: ['Asymmetric (Public Key) Cryptography', 'Symmetric Key Cryptography', 'Stream Cipher Hashing', 'Block Cipher Substitution', 'Caesar Cipher'],
        correct: 0,
        explanation: 'Asymmetric encryption (e.g., RSA, ECC) uses a public key available to anyone for encryption and a mathematically linked private key kept secret for decryption.'
      },
      {
        question: 'Which type of programmable read-only memory can be erased and reprogrammed repeatedly using electrical charges without exposure to ultraviolet light?',
        options: ['EEPROM (Electrically Erasable Programmable ROM)', 'EPROM', 'PROM', 'Mask ROM', 'Static RAM'],
        correct: 0,
        explanation: 'EEPROM allows individual bytes to be erased and rewritten electrically; modern flash memory is a specialized form of EEPROM.'
      },
      {
        question: 'In operating systems, what mechanism uses secondary storage (such as SSD or hard drive paging space) to simulate additional main physical memory?',
        options: ['Virtual Memory', 'Dynamic RAM', 'Segment Register', 'Direct Memory Access (DMA)', 'Cache Coherence'],
        correct: 0,
        explanation: 'Virtual memory maps physical RAM addresses to secondary storage pages, allowing the system to execute processes larger than physical RAM.'
      }
    ];

    const shuffled = this.shuffle(compBank);
    const items: ExamQuestionItem[] = [];
    const runId = Math.random().toString(36).substring(2, 7);

    // Guaranteed uniqueness: pick up to shuffled.length without replacement
    const safeCount = Math.min(count, shuffled.length);
    for (let i = 0; i < safeCount; i++) {
      const qData = shuffled[i];
      const fmt = this.format5Options(qData.options[qData.correct], qData.options.filter((_, idx) => idx !== qData.correct));
      items.push({
        id: `${runId}-comp-${i}`,
        sectionCode,
        sectionName,
        questionNumber: 0,
        subjectCode: 'computer',
        topicName: 'Computer Aptitude & Networking',
        patternCode: 'COMP_APT_01',
        difficulty: 'easy',
        questionText: qData.question,
        options: fmt.options,
        correctOptionIndex: fmt.correctIndex,
        explanation: qData.explanation,
        marks: 1,
        negativeMarks: 0.25
      });
    }

    // If more questions requested than bank size (e.g. 40 Qs in Mains), generate dynamic unique binary/hex and networking variants
    if (count > safeCount) {
      for (let i = safeCount; i < count; i++) {
        const byte = 100 + (i * 7) % 155;
        const bin = byte.toString(2).padStart(8, '0');
        const hex = byte.toString(16).toUpperCase();
        const fmt = this.format5Options(hex, [(byte + 1).toString(16).toUpperCase(), (byte - 1).toString(16).toUpperCase(), (byte + 16).toString(16).toUpperCase(), (byte ^ 15).toString(16).toUpperCase()]);
        items.push({
          id: `${runId}-comp-dyn-${i}`,
          sectionCode,
          sectionName,
          questionNumber: 0,
          subjectCode: 'computer',
          topicName: 'Computer Aptitude & Networking',
          patternCode: 'COMP_APT_DYN',
          difficulty: 'medium',
          questionText: `What is the hexadecimal equivalent of the 8-bit binary number (${bin})₂?`,
          options: fmt.options,
          correctOptionIndex: fmt.correctIndex,
          explanation: `Convert binary to hex by grouping into 4-bit nibbles: high nibble (${bin.substring(0, 4)})₂ and low nibble (${bin.substring(4)})₂. Result is (${hex})₁₆.`,
          marks: 1,
          negativeMarks: 0.25
        });
      }
    }

    return items;
  }

  // =========================================================================
  // CATALOG OF QUESTION PATTERNS (FOR TAB 3: PATTERN BANK INSPECTION)
  // =========================================================================

  getPatternsLibrary(): QuestionPattern[] {
    return [
      {
        id: 'pat-quan-simp-01',
        subject_code: 'quant',
        topic_name: 'Simplification & Approximation',
        pattern_code: 'QUAN_SIMP_BODMAS',
        pattern_type: 'parametric_numeric',
        difficulty: 'easy',
        exam_stage: 'prelims',
        explanation_template: 'Multi-operator BODMAS evaluation with squares, surds, and percentage multipliers.',
        is_active: true
      },
      {
        id: 'pat-quan-quad-01',
        subject_code: 'quant',
        topic_name: 'Quadratic Equations',
        pattern_code: 'QUAN_QUAD_ROOTS',
        pattern_type: 'parametric_numeric',
        difficulty: 'medium',
        exam_stage: 'prelims',
        explanation_template: 'Factorization of ax² + bx + c = 0 and py² + qy + r = 0 with five standard relation outcomes.',
        is_active: true
      },
      {
        id: 'pat-quan-ser-01',
        subject_code: 'quant',
        topic_name: 'Number Series (Missing & Wrong)',
        pattern_code: 'QUAN_SER_MISSING',
        pattern_type: 'parametric_numeric',
        difficulty: 'medium',
        exam_stage: 'prelims',
        explanation_template: 'Geometric differences, cube addition, and alternating operations.',
        is_active: true
      },
      {
        id: 'pat-quan-di-01',
        subject_code: 'quant',
        topic_name: 'Data Interpretation (Table DI)',
        pattern_code: 'QUAN_DI_TABLE',
        pattern_type: 'caselet',
        difficulty: 'hard',
        exam_stage: 'both',
        explanation_template: '5-question tabular caselet testing ratios, percentage comparison, and aggregate averages.',
        is_active: true
      },
      {
        id: 'pat-quan-arith-01',
        subject_code: 'quant',
        topic_name: 'Arithmetic Word Problems (12 Topics)',
        pattern_code: 'QUAN_ARITH_ALL',
        pattern_type: 'parametric_numeric',
        difficulty: 'medium',
        exam_stage: 'both',
        explanation_template: 'Parametric generators for Profit/Loss, SI/CI, Trains, Boats, Work, Pipes, Mixtures, Partnership, Averages, Mensuration, and Probability.',
        is_active: true
      },
      {
        id: 'pat-reas-syll-01',
        subject_code: 'reasoning',
        topic_name: 'Syllogisms',
        pattern_code: 'REAS_SYLL_FEW',
        pattern_type: 'logic_deduction',
        difficulty: 'medium',
        exam_stage: 'prelims',
        explanation_template: '"Only a few", "All", and "Some not" logical deduction syllogism patterns.',
        is_active: true
      },
      {
        id: 'pat-reas-ineq-01',
        subject_code: 'reasoning',
        topic_name: 'Inequalities',
        pattern_code: 'REAS_INEQ_DIRECT',
        pattern_type: 'logic_deduction',
        difficulty: 'easy',
        exam_stage: 'prelims',
        explanation_template: 'Multi-statement priority chaining testing >, ≥, =, Either/Or, and opposite sign breaks.',
        is_active: true
      },
      {
        id: 'pat-reas-puz-01',
        subject_code: 'reasoning',
        topic_name: 'Circular & Linear Seating Puzzles',
        pattern_code: 'REAS_PUZ_CIRC_LIN',
        pattern_type: 'puzzle_grid',
        difficulty: 'hard',
        exam_stage: 'both',
        explanation_template: '8-person circular table and 7-person linear row arrangements with relative positional clues.',
        is_active: true
      },
      {
        id: 'pat-reas-puz-02',
        subject_code: 'reasoning',
        topic_name: '7-Floor Building Arrangement Puzzle',
        pattern_code: 'REAS_PUZ_FLOOR_7',
        pattern_type: 'puzzle_grid',
        difficulty: 'hard',
        exam_stage: 'both',
        explanation_template: '7-floor vertical arrangement puzzle testing parity floors, gap constraints, and immediate adjacency.',
        is_active: true
      },
      {
        id: 'pat-eng-err-01',
        subject_code: 'english',
        topic_name: 'Error Spotting & Phrase Replacement',
        pattern_code: 'ENG_ERR_SYNTAX',
        pattern_type: 'grammar_cloze',
        difficulty: 'medium',
        exam_stage: 'both',
        explanation_template: '4-fragment sentence analysis detecting subject-verb, preposition, or conditional syntax errors.',
        is_active: true
      },
      {
        id: 'pat-eng-cloze-01',
        subject_code: 'english',
        topic_name: 'Cloze Test & Para Jumbles',
        pattern_code: 'ENG_CLOZE_PJ',
        pattern_type: 'grammar_cloze',
        difficulty: 'medium',
        exam_stage: 'both',
        explanation_template: '5-blank economic editorial Cloze passage and 5-sentence macroeconomic Para Jumble rearrangement.',
        is_active: true
      },
      {
        id: 'pat-eng-rc-01',
        subject_code: 'english',
        topic_name: 'Reading Comprehension (RBI & Economy)',
        pattern_code: 'ENG_RC_CBDC',
        pattern_type: 'caselet',
        difficulty: 'hard',
        exam_stage: 'both',
        explanation_template: '5-question Reading Comprehension passage on Central Bank Digital Currencies (e₹) testing inference and vocabulary.',
        is_active: true
      },
      {
        id: 'pat-ga-bank-01',
        subject_code: 'ga',
        topic_name: 'RBI Monetary Policy & Banking Awareness',
        pattern_code: 'GA_RBI_BASEL',
        pattern_type: 'static_mcq',
        difficulty: 'medium',
        exam_stage: 'mains',
        explanation_template: '15-question regulatory bank covering DICGC, PSL, Basel-III CRAR, MPC, SDF/LAF, NPAs, and Money Market.',
        is_active: true
      },
      {
        id: 'pat-comp-apt-01',
        subject_code: 'computer',
        topic_name: 'Computer Aptitude & Networking',
        pattern_code: 'COMP_OSI_DBMS',
        pattern_type: 'static_mcq',
        difficulty: 'easy',
        exam_stage: 'mains',
        explanation_template: '10-question Computer Knowledge bank covering OSI Layers, RDBMS keys, Cache Memory, Binary/Hex, and Cybersecurity.',
        is_active: true
      }
    ];
  }

  // =========================================================================
  // UTILITY HELPERS
  // =========================================================================

  private generateNumericDistractors(correctVal: number, rawList: number[]): number[] {
    const unique = new Set<number>();
    for (const val of rawList) {
      if (val !== correctVal && !unique.has(val) && unique.size < 4) {
        unique.add(val);
      }
    }

    // Pad if needed
    let delta = 1;
    while (unique.size < 4) {
      const candidate = correctVal + (delta * (unique.size % 2 === 0 ? 1 : -1));
      if (candidate !== correctVal && !unique.has(candidate)) {
        unique.add(candidate);
      }
      delta++;
    }

    return Array.from(unique);
  }

  private format5Options(correctAnswer: string, distractors: string[]): { options: string[]; correctIndex: number } {
    const list = [correctAnswer, ...distractors.slice(0, 4)];
    // Deterministic shuffle
    const shuffled = this.shuffle(list);
    const correctIndex = shuffled.indexOf(correctAnswer);

    return {
      options: shuffled,
      correctIndex: correctIndex >= 0 ? correctIndex : 0
    };
  }

  /**
   * Generates authentic, targeted QuizQuestion items for a specific syllabus topic.
   * Directly supports granular topics such as Percentage, Profit & Loss, Simple Interest,
   * Syllogisms, Inequalities, Time & Work, Speed & Distance, Error Spotting, etc.
   */
  public generateQuizQuestionsForTopic(
    topicName: string,
    subjectFilter?: string,
    count: number = 5,
    difficulty: 'easy' | 'medium' | 'hard' | 'mixed' = 'mixed'
  ): QuizQuestion[] {
    const rawItems: ExamQuestionItem[] = [];
    const normalized = (topicName || '').toLowerCase().trim();
    const runId = Math.random().toString(36).substring(2, 7);

    // BATCH GENERATION FOR CATEGORICAL BANKS (guarantees unique questions without replacement)
    if (normalized.includes('comp') || normalized.includes('hardware') || normalized.includes('network') || normalized.includes('shortcut')) {
      const compItems = this.generateComputerSection(count, 'computer', 'Computer Aptitude');
      rawItems.push(...compItems);
    } else if (
      normalized.includes('current') ||
      normalized.includes('affairs') ||
      normalized.includes('news') ||
      normalized.includes('national') ||
      normalized.includes('international')
    ) {
      const caItems = this.generateCurrentAffairsSection(count, 'ga', 'Current Affairs (National & International)');
      rawItems.push(...caItems);
    } else if (
      normalized.includes('bank') ||
      normalized.includes('monetary') ||
      normalized.includes('rbi') ||
      normalized.includes('ga') ||
      normalized.includes('awareness') ||
      normalized.includes('economy') ||
      normalized.includes('financial') ||
      normalized.includes('gk')
    ) {
      const gaItems = this.generateGaSection(count, 'ga', 'General & Banking Awareness');
      rawItems.push(...gaItems);
    } else {
      // PARAMETRIC & ROTATING GENERATORS WITH UNIQUE SEEDS
      for (let i = 0; i < count; i++) {
        const qId = `top-${runId}-${i}`;

        if (normalized.includes('percent')) {
          rawItems.push(this.buildArithmeticQuestion(qId, 'quant', 'Quantitative Aptitude', 'Percentage', i));
        } else if (normalized.includes('profit') || normalized.includes('loss') || normalized.includes('discount')) {
          rawItems.push(this.buildArithmeticQuestion(qId, 'quant', 'Quantitative Aptitude', 'Profit & Loss', i));
        } else if (normalized.includes('interest') || normalized.includes('si') || normalized.includes('ci')) {
          rawItems.push(this.buildArithmeticQuestion(qId, 'quant', 'Quantitative Aptitude', 'Simple & Compound Interest', i));
        } else if (normalized.includes('work') || normalized.includes('pipe') || normalized.includes('cistern')) {
          rawItems.push(this.buildArithmeticQuestion(qId, 'quant', 'Quantitative Aptitude', i % 2 === 0 ? 'Time & Work' : 'Pipes & Cisterns', i));
        } else if (normalized.includes('speed') || normalized.includes('distance') || normalized.includes('train') || normalized.includes('boat')) {
          rawItems.push(this.buildArithmeticQuestion(qId, 'quant', 'Quantitative Aptitude', i % 2 === 0 ? 'Time, Speed & Distance' : 'Boats & Streams', i));
        } else if (normalized.includes('mixture') || normalized.includes('alligation')) {
          rawItems.push(this.buildArithmeticQuestion(qId, 'quant', 'Quantitative Aptitude', 'Mixtures & Alligation', i));
        } else if (normalized.includes('partnership')) {
          rawItems.push(this.buildArithmeticQuestion(qId, 'quant', 'Quantitative Aptitude', 'Partnership', i));
        } else if (normalized.includes('age') || normalized.includes('ratio') || normalized.includes('proportion')) {
          rawItems.push(this.buildArithmeticQuestion(qId, 'quant', 'Quantitative Aptitude', 'Ages', i));
        } else if (normalized.includes('average')) {
          rawItems.push(this.buildArithmeticQuestion(qId, 'quant', 'Quantitative Aptitude', 'Averages', i));
        } else if (normalized.includes('mensuration')) {
          rawItems.push(this.buildArithmeticQuestion(qId, 'quant', 'Quantitative Aptitude', 'Mensuration', i));
        } else if (normalized.includes('probability')) {
          rawItems.push(this.buildArithmeticQuestion(qId, 'quant', 'Quantitative Aptitude', 'Probability', i));
        } else if (normalized.includes('simplif') || normalized.includes('approx') || normalized.includes('bodmas')) {
          rawItems.push(this.buildSimplificationQuestion(qId, 'quant', 'Quantitative Aptitude'));
        } else if (normalized.includes('quad') || normalized.includes('equation')) {
          rawItems.push(this.buildQuadraticQuestion(qId, 'quant', 'Quantitative Aptitude'));
        } else if (normalized.includes('series') || normalized.includes('number') || normalized.includes('missing') || normalized.includes('wrong')) {
          rawItems.push(this.buildNumberSeriesQuestion(qId, 'quant', 'Quantitative Aptitude', i % 2 === 0));
        } else if (normalized.includes('syllog')) {
          rawItems.push(this.buildSyllogismQuestion(qId, 'reasoning', 'Reasoning Ability', i));
        } else if (normalized.includes('inequal')) {
          rawItems.push(this.buildInequalityQuestion(qId, 'reasoning', 'Reasoning Ability', i));
        } else if (normalized.includes('blood') || normalized.includes('relation')) {
          rawItems.push(this.buildBloodRelationQuestion(qId, 'reasoning', 'Reasoning Ability', i));
        } else if (normalized.includes('direction')) {
          rawItems.push(this.buildDirectionQuestion(qId, 'reasoning', 'Reasoning Ability', i));
        } else if (normalized.includes('coding') || normalized.includes('decoding')) {
          rawItems.push(this.buildCodingDecodingQuestion(qId, 'reasoning', 'Reasoning Ability', i));
        } else if (normalized.includes('error') || normalized.includes('grammar')) {
          rawItems.push(this.buildErrorSpottingQuestion(qId, 'english', 'English Language', i));
        } else if (normalized.includes('phrase') || normalized.includes('sentence')) {
          rawItems.push(this.buildPhraseReplacementQuestion(qId, 'english', 'English Language', i));
        } else if (normalized.includes('cloze') || normalized.includes('filler')) {
          rawItems.push(this.buildDoubleFillerQuestion(qId, 'english', 'English Language', i));
        } else {
          // Fallback arithmetic with specific topic attribution
          rawItems.push(this.buildArithmeticQuestion(qId, 'quant', 'Quantitative Aptitude', 'Percentage', i));
        }
      }
    }

    // STRICT DEDUPLICATION: Ensure no identical questions by normalized text
    const seenTexts = new Set<string>();
    const deduplicatedRaw: ExamQuestionItem[] = [];

    for (const item of rawItems) {
      const norm = (item.questionText || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      if (!seenTexts.has(norm)) {
        seenTexts.add(norm);
        deduplicatedRaw.push(item);
      }
    }

    // Convert ExamQuestionItem (5 options) into standard QuizQuestion (4 options)
    return deduplicatedRaw.map((item, idx) => {
      const correctText = item.options[item.correctOptionIndex];
      const distractors = item.options.filter((_, oIdx) => oIdx !== item.correctOptionIndex);
      const chosen3Distractors = this.shuffle(distractors).slice(0, 3);
      const fourOptions = this.shuffle([correctText, ...chosen3Distractors]);
      const newCorrectIdx = fourOptions.indexOf(correctText);

      return {
        id: `topic-${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 4)}`,
        subject_id: item.subjectCode === 'quant' ? 'sub-quant' : (item.subjectCode === 'reasoning' ? 'sub-reasoning' : (item.subjectCode === 'english' ? 'sub-english' : (item.subjectCode === 'ga' ? 'sub-ga' : 'sub-computer'))),
        topic_name: topicName || item.topicName,
        question_text: item.questionText,
        options: fourOptions,
        correct_option_index: newCorrectIdx >= 0 ? newCorrectIdx : 0,
        explanation: item.explanation,
        difficulty: item.difficulty || (difficulty === 'mixed' ? 'medium' : difficulty),
        created_at: new Date().toISOString(),
        correct_count: 0,
        incorrect_count: 0,
        is_ai_generated: false,
        generator_type: 'algorithmic_engine' as const
      };
    });
  }

  private shuffle<T>(array: T[]): T[] {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }
}
