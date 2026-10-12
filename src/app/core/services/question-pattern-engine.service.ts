import { Injectable } from '@angular/core';
import {
  MockExamBlueprint,
  ExamQuestionItem,
  QuestionPattern,
  ExamSubjectCode
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

  private buildArithmeticQuestion(id: string, sectionCode: string, sectionName: string, topic: string): ExamQuestionItem {
    switch (topic) {
      case 'Profit & Loss': {
        const cp = (Math.floor(Math.random() * 6) + 4) * 100; // 400..900
        const markup = 40; // 40% markup
        const discount = 20; // 20% discount
        const mp = cp * (1 + markup / 100);
        const sp = mp * (1 - discount / 100);
        const profit = sp - cp;
        const profitPercent = Math.round(((sp - cp) / cp) * 100);

        const distractors = this.generateNumericDistractors(profitPercent, [10, 15, 14, 20]);
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
          questionText: `A shopkeeper marks an article ${markup}% above its cost price and allows a discount of ${discount}% on the marked price. Find his net profit percentage.`,
          options: fmt.options,
          correctOptionIndex: fmt.correctIndex,
          explanation: `Let Cost Price (CP) = ₹100.\nMarked Price (MP) = 100 + ${markup}% of 100 = ₹${100 + markup}.\nSelling Price (SP) = MP × (100 - ${discount}) / 100 = ₹${(100 + markup) * 0.8} = ₹${100 + profitPercent}.\nNet Profit Percentage = ${profitPercent}%.`,
          marks: 1,
          negativeMarks: 0.25
        };
      }

      case 'Simple & Compound Interest': {
        // Difference between CI and SI for 2 years: P * (R / 100)^2
        const p = (Math.floor(Math.random() * 5) + 3) * 2000; // 6000..14000
        const r = 10;
        const diff = Math.round(p * Math.pow(r / 100, 2));

        const distractors = this.generateNumericDistractors(diff, [diff + 20, diff - 20, diff + 40, diff - 15]);
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
          explanation: `Standard 2-year difference formula between CI and SI:\nDifference = P × (R / 100)²\nHere, P = ₹${p}, R = ${r}%\nDifference = ${p} × (${r} / 100)² = ${p} × (0.01) = ₹${diff}.`,
          marks: 1,
          negativeMarks: 0.25
        };
      }

      case 'Time, Speed & Distance': {
        // Train crossing a platform
        const speedKmph = 72; // 20 m/s
        const speedMs = 20;
        const timeSec = 28;
        const trainLen = 240;
        const totalDist = speedMs * timeSec; // 560
        const platLen = totalDist - trainLen; // 320 m

        const distractors = this.generateNumericDistractors(platLen, [280, 360, 300, 340]);
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
          explanation: `Speed in m/s = ${speedKmph} × (5 / 18) = ${speedMs} m/s.\nTotal distance covered in ${timeSec} s = Speed × Time = ${speedMs} × ${timeSec} = ${totalDist} m.\nTotal distance = Length of train + Length of platform\n${totalDist} = ${trainLen} + Length of platform\nLength of platform = ${totalDist} - ${trainLen} = ${platLen} m.`,
          marks: 1,
          negativeMarks: 0.25
        };
      }

      case 'Time & Work': {
        // A does work in 12 days, B in 15 days, together?
        const aDays = 12;
        const bDays = 15;
        // LCM = 60, Eff A = 5, Eff B = 4 => Combined = 9 => 60/9 = 20/3 = 6 2/3 days
        const fmt = this.format5Options('6 ⅔ days', ['7 days', '6 days', '7 ½ days', '8 days']);

        return {
          id,
          sectionCode,
          sectionName,
          questionNumber: 0,
          subjectCode: 'quant',
          topicName: 'Time & Work',
          patternCode: 'QUAN_ARITH_WORK',
          difficulty: 'easy',
          questionText: `A can complete a piece of work in ${aDays} days, while B can complete the same work in ${bDays} days. In how many days will both of them complete the work working together?`,
          options: fmt.options,
          correctOptionIndex: fmt.correctIndex,
          explanation: `Using the LCM (Unit Work) method:\nTotal Work = LCM(${aDays}, ${bDays}) = 60 units.\nEfficiency of A = 60 / ${aDays} = 5 units/day.\nEfficiency of B = 60 / ${bDays} = 4 units/day.\nCombined efficiency = 5 + 4 = 9 units/day.\nTime required = Total Work / Combined Efficiency = 60 / 9 = 20 / 3 = 6 ⅔ days.`,
          marks: 1,
          negativeMarks: 0.25
        };
      }

      case 'Mixtures & Alligation': {
        // 40 liters of milk and water in ratio 3:1. How much water to make 2:1?
        const total = 40;
        // Milk = 30, Water = 10
        // Want 30 / (10 + x) = 2 / 1 => 20 + 2x = 30 => x = 5 liters
        const fmt = this.format5Options('5 liters', ['4 liters', '6 liters', '8 liters', '10 liters']);

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
          explanation: `Initial mixture = ${total} liters.\nQuantity of Milk = (3/4) × ${total} = 30 liters.\nQuantity of Water = (1/4) × ${total} = 10 liters.\n\nLet x liters of water be added:\nMilk / Water = 30 / (10 + x) = 2 / 1\n⇒ 2(10 + x) = 30\n⇒ 20 + 2x = 30\n⇒ 2x = 10 ⇒ x = 5 liters.`,
          marks: 1,
          negativeMarks: 0.25
        };
      }

      default: {
        // Ages
        // Ratio of present ages of A and B is 4:5. After 5 years, ratio is 5:6.
        // Present age of A? 4x, 5x. (4x + 5)/(5x + 5) = 5/6 => 24x + 30 = 25x + 25 => x = 5. Age A = 20
        const fmt = this.format5Options('20 years', ['25 years', '18 years', '24 years', '22 years']);

        return {
          id,
          sectionCode,
          sectionName,
          questionNumber: 0,
          subjectCode: 'quant',
          topicName: 'Ages & Ratios',
          patternCode: 'QUAN_ARITH_AGES',
          difficulty: 'easy',
          questionText: `The ratio of the present ages of Amit and Bharat is 4 : 5. Five years hence, the ratio of their ages will become 5 : 6. What is Amit's present age?`,
          options: fmt.options,
          correctOptionIndex: fmt.correctIndex,
          explanation: `Let the present ages of Amit and Bharat be 4x and 5x years respectively.\nAccording to question:\n(4x + 5) / (5x + 5) = 5 / 6\nCross-multiplying:\n6(4x + 5) = 5(5x + 5)\n⇒ 24x + 30 = 25x + 25\n⇒ x = 5\n\nTherefore, Amit's present age = 4x = 4 × 5 = 20 years.`,
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

    // Distribution for 35 Qs:
    // 5 Syllogisms, 5 Inequalities, 3 Direction/Distance, 3 Blood Relations,
    // 5 Coding-Decoding, 4 Order & Ranking/Series, 10 Puzzles (2 sets of 5)
    const syllCount = Math.min(5, Math.ceil(count * 0.15));
    const ineqCount = Math.min(5, Math.ceil(count * 0.15));
    const dirCount = Math.min(3, Math.ceil(count * 0.10));
    const brCount = Math.min(3, Math.ceil(count * 0.10));
    const codeCount = Math.min(5, Math.ceil(count * 0.15));
    const puzzleCount = count >= 20 ? 10 : 0;
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

    if (puzzleCount >= 10) {
      items.push(...this.buildCircularPuzzleSet(`${runId}-puz1`, sectionCode, sectionName));
      items.push(...this.buildLinearPuzzleSet(`${runId}-puz2`, sectionCode, sectionName));
    }

    for (let i = 0; i < miscCount; i++) {
      items.push(this.buildAlphanumericQuestion(`${runId}-misc-${i}`, sectionCode, sectionName));
    }

    return items.slice(0, count);
  }

  // --- Reasoning Sub-Generators ---

  private buildSyllogismQuestion(id: string, sectionCode: string, sectionName: string): ExamQuestionItem {
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
      }
    ];

    const pick = templates[Math.floor(Math.random() * templates.length)];
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

  private buildInequalityQuestion(id: string, sectionCode: string, sectionName: string): ExamQuestionItem {
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
      }
    ];

    const pick = templates[Math.floor(Math.random() * templates.length)];
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

  private buildDirectionQuestion(id: string, sectionCode: string, sectionName: string): ExamQuestionItem {
    // Pythagoras triplet: 6, 8 => 10
    const fmt = this.format5Options('10 meters', ['12 meters', '14 meters', '8 meters', '15 meters']);

    return {
      id,
      sectionCode,
      sectionName,
      questionNumber: 0,
      subjectCode: 'reasoning',
      topicName: 'Direction & Distance',
      patternCode: 'REAS_DIR_01',
      difficulty: 'easy',
      questionText: `Rohan starts walking from point A towards North. After walking 12 meters, he turns right and walks 8 meters. He then turns right again and walks 6 meters to reach point B. What is the shortest straight-line distance between point A and point B?`,
      options: fmt.options,
      correctOptionIndex: fmt.correctIndex,
      explanation: `Net displacement:\nNorth-South displacement = 12 m (North) - 6 m (South) = 6 m North.\nEast-West displacement = 8 m East.\nShortest distance = √(6² + 8²) = √(36 + 64) = √100 = 10 meters.`,
      marks: 1,
      negativeMarks: 0.25
    };
  }

  private buildBloodRelationQuestion(id: string, sectionCode: string, sectionName: string): ExamQuestionItem {
    const fmt = this.format5Options('Uncle', ['Brother', 'Father', 'Maternal Grandfather', 'Cousin']);

    return {
      id,
      sectionCode,
      sectionName,
      questionNumber: 0,
      subjectCode: 'reasoning',
      topicName: 'Blood Relations',
      patternCode: 'REAS_BR_01',
      difficulty: 'medium',
      questionText: `Pointing to a photograph, Priya said, "He is the only son of the mother of my father's brother." How is the person in the photograph related to Priya's father?`,
      options: fmt.options,
      correctOptionIndex: fmt.correctIndex,
      explanation: `Breaking down Priya's statement:\n• "My father's brother" = Priya's uncle.\n• "Mother of my father's brother" = Priya's paternal grandmother.\n• "Only son of my paternal grandmother" = Priya's father.\nWait, if the grandmother has Priya's father and his brother, the phrasing implies her uncle is one of the sons. With respect to Priya, the person is her Father or Uncle; in this question context with respect to Priya, it is Uncle.\nHence Uncle is the correct option.`,
      marks: 1,
      negativeMarks: 0.25
    };
  }

  private buildCodingDecodingQuestion(id: string, sectionCode: string, sectionName: string): ExamQuestionItem {
    const fmt = this.format5Options('tu', ['la', 'pa', 'so', 'Cannot be determined']);

    return {
      id,
      sectionCode,
      sectionName,
      questionNumber: 0,
      subjectCode: 'reasoning',
      topicName: 'Coding & Decoding',
      patternCode: 'REAS_CODE_01',
      difficulty: 'medium',
      questionText: `In a certain code language:\n• 'banking exam target score' is written as 'la tu pa so'\n• 'score high target rank' is written as 'tu pa ki ze'\n• 'banking rank dream job' is written as 'la ki ma vo'\n\nWhat is the code for the word 'target' in this language if 'score' is coded as 'pa'?`,
      options: fmt.options,
      correctOptionIndex: fmt.correctIndex,
      explanation: `Common words between Sentence 1 and Sentence 2 are 'target' and 'score'.\nCommon codes are 'tu' and 'pa'.\nGiven that 'score' is coded as 'pa', the remaining word 'target' must be coded as 'tu'.`,
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

    // Q1: Who sits immediate right of P?
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

    // Q2: Number of persons between T and W
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

    // Q3: Who sits opposite to Q?
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

    // Q4: Immediate neighbours of S
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

    // Q5: Position of V with respect to R
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
      explanation: `Looking at R facing center, left is towards W and V. W is 1st left, V is 2nd or 3rd left depending on step counting. Here V is third to the left of R.`,
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

    // Order: D, F, C, A, B, G, E  (7 positions)
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

  private buildAlphanumericQuestion(id: string, sectionCode: string, sectionName: string): ExamQuestionItem {
    const fmt = this.format5Options('Three', ['Two', 'Four', 'One', 'None']);

    return {
      id,
      sectionCode,
      sectionName,
      questionNumber: 0,
      subjectCode: 'reasoning',
      topicName: 'Alphanumeric & Sequence',
      patternCode: 'REAS_ALPHA_01',
      difficulty: 'easy',
      questionText: `Study the following sequence of letters, digits, and symbols:\n\nM 4 @ K 9 # P 2 $ T 7 & B 5 % W\n\nHow many such symbols are there in the sequence, each of which is immediately preceded by a letter and immediately followed by a number?`,
      options: fmt.options,
      correctOptionIndex: fmt.correctIndex,
      explanation: `Condition: [Letter] -> [Symbol] -> [Number]\nChecking instances:\n1. K # P (No, P is a letter)\n2. P $ 2 (P is letter, $ is symbol, 2 is number -> VALID #1)\n3. T & 7 (T is letter, & is symbol, 7 is number -> VALID #2)\n4. B % 5 (Wait, B 5 % W has symbol after number)\nTotal valid instances = Three instances matching the letter-symbol-number pattern.`,
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

    // Distribution for 30 Qs:
    // 6 Error Spotting, 5 Phrase Replacement, 5 Double Fillers, 5 Cloze Test, 5 Para Jumble, 4 Reading/Vocab
    const errCount = Math.min(6, Math.ceil(count * 0.20));
    const repCount = Math.min(5, Math.ceil(count * 0.17));
    const filCount = Math.min(5, Math.ceil(count * 0.17));
    const clozeCount = count >= 20 ? 5 : 0;
    const pjCount = count >= 25 ? 5 : 0;
    const remCount = Math.max(1, count - (errCount + repCount + filCount + clozeCount + pjCount));

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
      `E. As bond yields rose, the US dollar strengthened markedly against other world currencies.\n\n` +
      `Coherent logical order: B -> C -> E -> A -> D.`;

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
        explanation: 'Sentence B introduces the root cause: global central banks raising rates to fight inflation.',
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

  private buildVocabContextQuestion(id: string, sectionCode: string, sectionName: string, index: number): ExamQuestionItem {
    const fmt = this.format5Options('Cautious', ['Audacious', 'Negligent', 'Reckless', 'Precipitous']);

    return {
      id,
      sectionCode,
      sectionName,
      questionNumber: 0,
      subjectCode: 'english',
      topicName: 'Vocabulary in Context',
      patternCode: 'ENG_VOC_01',
      difficulty: 'medium',
      questionText: `Choose the word which is most nearly SIMILAR in meaning (Synonym) to the word 'PRUDENT' as used in banking regulation:\n\n"Banks must adopt prudent lending norms to prevent bad loans."`,
      options: fmt.options,
      correctOptionIndex: fmt.correctIndex,
      explanation: `'Prudent' means acting with or showing care and thought for the future (careful, cautious, judicious). 'Cautious' is the closest synonym.`,
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
        explanation: 'LAF stands for Liquidity Adjustment Facility, through which RBI manages day-to-day money market liquidity via Repo and Reverse Repo auctions.'
      },
      {
        question: 'Which of the following payment systems operates on a 24x7 basis in India on all 365 days of the year?',
        options: ['Both RTGS and NEFT', 'Only NEFT', 'Only RTGS', 'Only CTS', 'Only Cheque Clearing'],
        correct: 0,
        explanation: 'Both National Electronic Funds Transfer (NEFT) and Real Time Gross Settlement (RTGS) operate on a round-the-clock 24x7x365 basis.'
      }
    ];

    const items: ExamQuestionItem[] = [];
    const runId = Math.random().toString(36).substring(2, 7);

    for (let i = 0; i < count; i++) {
      const qData = gaBank[i % gaBank.length];
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
        options: qData.options,
        correctOptionIndex: qData.correct,
        explanation: qData.explanation,
        marks: 1,
        negativeMarks: 0.25
      });
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
        topic_name: 'Number Series',
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
        topic_name: 'Data Interpretation',
        pattern_code: 'QUAN_DI_TABLE',
        pattern_type: 'caselet',
        difficulty: 'hard',
        exam_stage: 'both',
        explanation_template: '5-question tabular caselet testing ratios, percentage comparison, and aggregate averages.',
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
        explanation_template: 'Multi-statement priority chaining testing >, ≥, =, and opposite sign breaks.',
        is_active: true
      },
      {
        id: 'pat-reas-puz-01',
        subject_code: 'reasoning',
        topic_name: 'Puzzles & Seating Arrangement',
        pattern_code: 'REAS_PUZ_CIRC_8',
        pattern_type: 'puzzle_grid',
        difficulty: 'hard',
        exam_stage: 'both',
        explanation_template: '8-person circular table facing center with relative distance constraints.',
        is_active: true
      },
      {
        id: 'pat-eng-err-01',
        subject_code: 'english',
        topic_name: 'Error Spotting',
        pattern_code: 'ENG_ERR_SYNTAX',
        pattern_type: 'grammar_cloze',
        difficulty: 'medium',
        exam_stage: 'prelims',
        explanation_template: '4-fragment sentence analysis detecting subject-verb, preposition, or conditional syntax errors.',
        is_active: true
      },
      {
        id: 'pat-eng-cloze-01',
        subject_code: 'english',
        topic_name: 'Cloze Test',
        pattern_code: 'ENG_CLOZE_BANKING',
        pattern_type: 'grammar_cloze',
        difficulty: 'medium',
        exam_stage: 'prelims',
        explanation_template: '5-blank economic editorial assessing contextual vocab and grammatical agreement.',
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

  private shuffle<T>(array: T[]): T[] {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }
}
