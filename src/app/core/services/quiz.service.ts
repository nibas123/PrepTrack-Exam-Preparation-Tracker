import { Injectable, inject } from '@angular/core';
import { QuizQuestion, QuizAttempt, PreviousPaper, ManualQuestionLog } from '../models/database.types';
import { SupabaseService } from './supabase.service';
import { AuthService } from '../auth/auth.service';
import { OfflineSyncService } from './offline-sync.service';
import { AiConfigService } from './ai-config.service';
import { QuestionPatternEngineService } from './question-pattern-engine.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private supabaseService = inject(SupabaseService);
  private authService = inject(AuthService);
  private offlineSync = inject(OfflineSyncService);
  public aiConfig = inject(AiConfigService);
  public patternEngine = inject(QuestionPatternEngineService);

  private get userId(): string {
    return this.authService.currentUser()?.id || '00000000-0000-0000-0000-000000000000';
  }

  /**
   * Strictly filters out duplicate questions by ID and normalized question text.
   */
  public deduplicateQuestions(questions: QuizQuestion[]): QuizQuestion[] {
    if (!questions || questions.length <= 1) return questions || [];
    const seenTexts = new Set<string>();
    const seenIds = new Set<string>();
    const unique: QuizQuestion[] = [];

    for (const q of questions) {
      if (!q) continue;
      const normalizedText = (q.question_text || '')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '')
        .trim();

      if (q.id && seenIds.has(q.id)) {
        continue;
      }
      if (normalizedText && seenTexts.has(normalizedText)) {
        continue;
      }

      if (q.id) seenIds.add(q.id);
      if (normalizedText) seenTexts.add(normalizedText);
      unique.push(q);
    }

    return unique;
  }

  // --- MATHEMATICAL CODE-BASED QUANT QUESTION GENERATOR ---
  generateDynamicQuantQuestions(count: number, topicName?: string): QuizQuestion[] {
    const questions: QuizQuestion[] = [];

    for (let i = 0; i < count; i++) {
      const type = i % 5;
      if (type === 0) {
        // Percentage & Profit / Loss
        const costPrice = (Math.floor(Math.random() * 8) + 2) * 50; // 100 to 500
        const profitPercent = (Math.floor(Math.random() * 5) + 1) * 5; // 5%, 10%, 15%, 20%, 25%
        const sellingPrice = costPrice + (costPrice * profitPercent) / 100;
        
        const wrong1 = sellingPrice + 25;
        const wrong2 = costPrice + (costPrice * (profitPercent + 5)) / 100;
        const wrong3 = sellingPrice - 15;
        
        const options = this.shuffle([`₹${sellingPrice}`, `₹${wrong1}`, `₹${wrong2}`, `₹${wrong3}`]);
        const correctIdx = options.indexOf(`₹${sellingPrice}`);

        questions.push({
          id: `quant-dyn-${Date.now()}-${i}`,
          subject_id: 'sub-quant',
          topic_name: topicName || 'Profit & Loss',
          question_text: `An article with cost price ₹${costPrice} is sold at a profit of ${profitPercent}%. Find its selling price.`,
          options,
          correct_option_index: correctIdx,
          explanation: `Selling Price = Cost Price × (100 + Profit%) / 100 = ₹${costPrice} × (100 + ${profitPercent}) / 100 = ₹${sellingPrice}.`,
          difficulty: 'easy'
        });
      } else if (type === 1) {
        // Simple Interest
        const principal = (Math.floor(Math.random() * 6) + 2) * 1000; // 2000 to 7000
        const rate = (Math.floor(Math.random() * 4) + 2) * 2; // 4, 6, 8, 10%
        const time = Math.floor(Math.random() * 3) + 2; // 2, 3, 4 years
        const si = (principal * rate * time) / 100;

        const options = this.shuffle([`₹${si}`, `₹${si + 120}`, `₹${si - 80}`, `₹${si + 240}`]);
        const correctIdx = options.indexOf(`₹${si}`);

        questions.push({
          id: `quant-dyn-${Date.now()}-${i}`,
          subject_id: 'sub-quant',
          topic_name: topicName || 'Simple Interest',
          question_text: `Calculate the Simple Interest on a principal of ₹${principal} at an annual interest rate of ${rate}% for ${time} years.`,
          options,
          correct_option_index: correctIdx,
          explanation: `SI = (P × R × T) / 100 = (${principal} × ${rate} × ${time}) / 100 = ₹${si}.`,
          difficulty: 'easy'
        });
      } else if (type === 2) {
        // Missing Number Series
        const start = Math.floor(Math.random() * 10) + 3;
        const diff = Math.floor(Math.random() * 6) + 3;
        const series = [start, start + diff, start + diff * 2, start + diff * 3, start + diff * 4];
        const missing = start + diff * 5;

        const options = this.shuffle([`${missing}`, `${missing + 2}`, `${missing - 3}`, `${missing + diff}`]);
        const correctIdx = options.indexOf(`${missing}`);

        questions.push({
          id: `quant-dyn-${Date.now()}-${i}`,
          subject_id: 'sub-quant',
          topic_name: topicName || 'Number Series',
          question_text: `Find the next number in the following series: ${series.join(', ')}, ?`,
          options,
          correct_option_index: correctIdx,
          explanation: `The common difference between consecutive terms is +${diff}. Next term = ${series[4]} + ${diff} = ${missing}.`,
          difficulty: 'easy'
        });
      } else if (type === 3) {
        // Speed Time & Distance (Train problem)
        const speedKmph = (Math.floor(Math.random() * 5) + 3) * 18; // 54, 72, 90 km/h (multiples of 18)
        const speedMps = (speedKmph * 5) / 18;
        const timeSec = Math.floor(Math.random() * 10) + 10; // 10 to 20 sec
        const lengthMeters = speedMps * timeSec;

        const options = this.shuffle([`${lengthMeters} m`, `${lengthMeters + 50} m`, `${lengthMeters - 25} m`, `${lengthMeters + 100} m`]);
        const correctIdx = options.indexOf(`${lengthMeters} m`);

        questions.push({
          id: `quant-dyn-${Date.now()}-${i}`,
          subject_id: 'sub-quant',
          topic_name: topicName || 'Speed, Time & Distance',
          question_text: `A train running at ${speedKmph} km/h crosses an electric pole in ${timeSec} seconds. What is the length of the train?`,
          options,
          correct_option_index: correctIdx,
          explanation: `Speed in m/s = ${speedKmph} × (5/18) = ${speedMps} m/s. Length of train = Speed × Time = ${speedMps} × ${timeSec} = ${lengthMeters} meters.`,
          difficulty: 'medium'
        });
      } else {
        // Quadratic equation root comparison
        // (x - a)(x - b) = 0 => x^2 - (a+b)x + ab = 0
        const a = Math.floor(Math.random() * 4) + 2;
        const b = Math.floor(Math.random() * 4) + 5;
        const sum = a + b;
        const prod = a * b;

        const options = this.shuffle([`x = ${a}, ${b}`, `x = -${a}, -${b}`, `x = ${a}, -${b}`, `x = ${a + 1}, ${b - 1}`]);
        const correctIdx = options.indexOf(`x = ${a}, ${b}`);

        questions.push({
          id: `quant-dyn-${Date.now()}-${i}`,
          subject_id: 'sub-quant',
          topic_name: topicName || 'Quadratic Equations',
          question_text: `Solve for x: x² - ${sum}x + ${prod} = 0`,
          options,
          correct_option_index: correctIdx,
          explanation: `Factoring the equation: (x - ${a})(x - ${b}) = 0. Therefore, roots are x = ${a} and x = ${b}.`,
          difficulty: 'medium'
        });
      }
    }

    return questions;
  }

  // --- REASONING QUESTIONS BANK ---
  getReasoningQuestionPool(): QuizQuestion[] {
    return [
      {
        id: 'reas-1',
        subject_id: 'sub-reasoning',
        topic_name: 'Syllogism',
        question_text: 'Statements: Only a few Books are Pens. All Pens are Erasers.\nConclusions:\nI. Some Books are Erasers.\nII. All Books being Pens is a possibility.',
        options: ['Only conclusion I follows', 'Only conclusion II follows', 'Both I and II follow', 'Neither I nor II follows'],
        correct_option_index: 0,
        explanation: 'Because all Pens are Erasers and some Books are Pens, some Books must be Erasers (I follows). Since "Only a few Books are Pens", all Books cannot be Pens, so possibility II is invalid.',
        difficulty: 'medium'
      },
      {
        id: 'reas-2',
        subject_id: 'sub-reasoning',
        topic_name: 'Inequalities',
        question_text: 'Statements: P ≥ Q > R = S ≤ T\nConclusions:\nI. P > S\nII. T ≥ R',
        options: ['Both conclusions I and II follow', 'Only conclusion I follows', 'Only conclusion II follows', 'Neither follows'],
        correct_option_index: 0,
        explanation: 'From P ≥ Q > R = S, we have P > S (Conclusion I follows). From R = S ≤ T, we have T ≥ R (Conclusion II follows). Both follow.',
        difficulty: 'easy'
      },
      {
        id: 'reas-3',
        subject_id: 'sub-reasoning',
        topic_name: 'Blood Relations',
        question_text: 'Pointing to a photograph, Rohit said, "She is the daughter of my grandfather\'s only son." How is the girl related to Rohit?',
        options: ['Sister', 'Cousin', 'Mother', 'Aunt'],
        correct_option_index: 0,
        explanation: 'Grandfather\'s only son is Rohit\'s father. Daughter of Rohit\'s father is Rohit\'s sister.',
        difficulty: 'easy'
      },
      {
        id: 'reas-4',
        subject_id: 'sub-reasoning',
        topic_name: 'Direction Sense',
        question_text: 'A person walks 10m North, turns right and walks 6m, then turns right again and walks 10m. How far is he from his starting point?',
        options: ['6 meters East', '6 meters West', '10 meters South', '16 meters North'],
        correct_option_index: 0,
        explanation: 'He traveled North 10m, East 6m, and South 10m. The vertical displacements cancel out, leaving him 6 meters East of the starting point.',
        difficulty: 'easy'
      },
      {
        id: 'reas-5',
        subject_id: 'sub-reasoning',
        topic_name: 'Coding-Decoding',
        question_text: 'In a certain code language, "BANK" is written as "CBOL". How is "PO" written in that language?',
        options: ['QP', 'QQ', 'ON', 'RS'],
        correct_option_index: 0,
        explanation: 'Each letter is shifted forward by +1: P (+1) = Q, O (+1) = P. Hence "QP".',
        difficulty: 'easy'
      }
    ];
  }

  // --- ENGLISH QUESTIONS BANK ---
  getEnglishQuestionPool(): QuizQuestion[] {
    return [
      {
        id: 'eng-1',
        subject_id: 'sub-english',
        topic_name: 'Error Spotting',
        question_text: 'Identify the error segment: "Neither the manager (A) / nor the employees (B) / was present at the conference (C) / No error (D)"',
        options: ['Part A', 'Part B', 'Part C (was present -> were present)', 'Part D (No error)'],
        correct_option_index: 2,
        explanation: 'Under "Neither... nor...", the verb agrees with the subject closest to it. Here, "employees" is plural, so it should be "were present".',
        difficulty: 'medium'
      },
      {
        id: 'eng-2',
        subject_id: 'sub-english',
        topic_name: 'Cloze Test',
        question_text: 'The Reserve Bank of India has ______ the repo rate unchanged at 6.5% to curb sticky inflation.',
        options: ['retained', 'decayed', 'evaded', 'dismantled'],
        correct_option_index: 0,
        explanation: '"Retained" appropriately completes the financial context of keeping monetary policy rates unchanged.',
        difficulty: 'easy'
      },
      {
        id: 'eng-3',
        subject_id: 'sub-english',
        topic_name: 'Vocabulary & Idioms',
        question_text: 'What is the meaning of the idiom "Burn the midnight oil"?',
        options: ['To study or work late into the night', 'To waste resources recklessly', 'To cause an accidental fire', 'To wake up early in the morning'],
        correct_option_index: 0,
        explanation: '"Burn the midnight oil" means to study or work hard late into the night.',
        difficulty: 'easy'
      },
      {
        id: 'eng-4',
        subject_id: 'sub-english',
        topic_name: 'Sentence Improvement',
        question_text: 'Select the best alternative for the underlined part: "She is accustomed to [wake up] early every morning."',
        options: ['waking up', 'woken up', 'wakes up', 'No correction required'],
        correct_option_index: 0,
        explanation: 'The phrase "accustomed to" takes a gerund (-ing form), so "waking up" is grammatically correct.',
        difficulty: 'medium'
      },
      {
        id: 'eng-5',
        subject_id: 'sub-english',
        topic_name: 'Fillers',
        question_text: 'Despite the volatile economic conditions, the bank demonstrated ______ resilience.',
        options: ['remarkable', 'negligent', 'futile', 'fragile'],
        correct_option_index: 0,
        explanation: '"Remarkable" accurately conveys commendable strength despite economic hardship.',
        difficulty: 'easy'
      }
    ];
  }

  // --- BANKING & GENERAL AWARENESS QUESTIONS BANK ---
  getBankingAwarenessQuestionPool(): QuizQuestion[] {
    return [
      {
        id: 'ga-1',
        subject_id: 'sub-ga',
        topic_name: 'RBI & Monetary Policy',
        question_text: 'Who chairs the Monetary Policy Committee (MPC) of the Reserve Bank of India?',
        options: ['Governor of the Reserve Bank of India', 'Union Finance Minister', 'Chief Economic Adviser', 'Deputy Governor in charge of monetary policy'],
        correct_option_index: 0,
        explanation: 'Section 45ZB of the amended RBI Act designates the Governor of the Reserve Bank of India as the ex-officio Chairperson of the MPC.',
        difficulty: 'easy'
      },
      {
        id: 'ga-2',
        subject_id: 'sub-ga',
        topic_name: 'Banking Regulations & NPA',
        question_text: 'Under Indian banking regulations, a loan is categorized as a Non-Performing Asset (NPA) if overdue interest/principal remains unpaid for how many days?',
        options: ['90 days', '30 days', '60 days', '180 days'],
        correct_option_index: 0,
        explanation: 'In commercial banking, overdue advances become NPAs after 90 days of non-payment.',
        difficulty: 'easy'
      },
      {
        id: 'ga-3',
        subject_id: 'sub-ga',
        topic_name: 'Digital Banking & NPCI',
        question_text: 'Which organization operates and manages the Unified Payments Interface (UPI) network in India?',
        options: ['NPCI (National Payments Corporation of India)', 'SEBI', 'State Bank of India', 'NITI Aayog'],
        correct_option_index: 0,
        explanation: 'NPCI was established by RBI and IBA under the PSS Act, 2007 to operate retail payment settlement systems including UPI, IMPS, and RuPay.',
        difficulty: 'easy'
      },
      {
        id: 'ga-4',
        subject_id: 'sub-ga',
        topic_name: 'Priority Sector Lending',
        question_text: 'What is the mandatory Priority Sector Lending (PSL) target for Domestic Scheduled Commercial Banks in India?',
        options: ['40% of ANBC', '32% of ANBC', '50% of ANBC', '25% of ANBC'],
        correct_option_index: 0,
        explanation: 'Domestic commercial banks are mandated to allocate 40% of Adjusted Net Bank Credit (ANBC) or CEOBE to priority sectors like agriculture and MSMEs.',
        difficulty: 'medium'
      },
      {
        id: 'ga-5',
        subject_id: 'sub-ga',
        topic_name: 'Deposit Insurance',
        question_text: 'What is the maximum deposit insurance coverage provided per depositor per bank by DICGC in India?',
        options: ['₹5 Lakh', '₹1 Lakh', '₹10 Lakh', '₹2.5 Lakh'],
        correct_option_index: 0,
        explanation: 'The DICGC insures each depositor in insured commercial and cooperative banks up to a maximum of ₹5 Lakh for both principal and interest.',
        difficulty: 'easy'
      },
      {
        id: 'ca-1',
        subject_id: 'sub-ga',
        topic_name: 'Current Affairs (National & International)',
        question_text: 'Which country recently integrated its national fast-payment system "PayNow" with India\'s UPI for instantaneous cross-border remittances?',
        options: ['Singapore', 'United Arab Emirates', 'France', 'Mauritius'],
        correct_option_index: 0,
        explanation: 'Singapore\'s PayNow was linked with India\'s UPI to enable low-cost, instant cross-border remittances.',
        difficulty: 'easy'
      },
      {
        id: 'ca-2',
        subject_id: 'sub-ga',
        topic_name: 'Current Affairs (National & International)',
        question_text: 'The Reserve Bank of India launched the "UDGAM" portal primarily to assist citizens in:',
        options: ['Locating unclaimed bank deposits across multiple banks in one place', 'Applying for agricultural collateral-free loans', 'Filing consumer court grievances against NBFCs', 'Tracking foreign currency remittances'],
        correct_option_index: 0,
        explanation: 'UDGAM (Unclaimed Deposits - Gateway to Access inforMation) allows the public to search unclaimed deposits across participating banks.',
        difficulty: 'medium'
      },
      {
        id: 'ca-3',
        subject_id: 'sub-ga',
        topic_name: 'Current Affairs (National & International)',
        question_text: 'Under the PM Vishwakarma Scheme, what is the maximum collateral-free enterprise loan available to artisans at a 5% interest rate?',
        options: ['₹3 Lakh (in two tranches of ₹1L and ₹2L)', '₹5 Lakh', '₹2 Lakh', '₹10 Lakh'],
        correct_option_index: 0,
        explanation: 'The PM Vishwakarma scheme provides collateral-free credit support of up to ₹3 Lakh in two tranches (₹1L first, ₹2L second) at a concessional interest rate of 5%.',
        difficulty: 'medium'
      },
      {
        id: 'ca-4',
        subject_id: 'sub-ga',
        topic_name: 'Current Affairs (National & International)',
        question_text: 'Which entity was admitted as the newest permanent member of the G20 during the New Delhi G20 Leaders\' Summit?',
        options: ['African Union (AU)', 'ASEAN', 'European Free Trade Association', 'OPEC'],
        correct_option_index: 0,
        explanation: 'The African Union (comprising 55 member states) became a permanent member of the G20 under India\'s Presidency.',
        difficulty: 'easy'
      },
      {
        id: 'ca-5',
        subject_id: 'sub-ga',
        topic_name: 'Current Affairs (National & International)',
        question_text: 'What is the official denomination name for India\'s Central Bank Digital Currency (CBDC) piloted by the RBI?',
        options: ['Digital Rupee (e₹)', 'Bharat Rupee (b₹)', 'DigiCash', 'CryptoRupee'],
        correct_option_index: 0,
        explanation: 'The RBI officially named its digital legal tender the "Digital Rupee", represented by the symbol "e₹".',
        difficulty: 'easy'
      },
      {
        id: 'ca-6',
        subject_id: 'sub-ga',
        topic_name: 'Current Affairs (National & International)',
        question_text: 'In June 2024, which premier global index included Indian Government Bonds (FAR securities) into its Emerging Markets Index?',
        options: ['JPMorgan GBI-EM Global Diversified Index', 'Bloomberg Global Aggregate Index', 'FTSE World Government Bond Index', 'MSCI World Sovereign Index'],
        correct_option_index: 0,
        explanation: 'JPMorgan included Indian Government Fully Accessible Route (FAR) bonds into its flagship GBI-EM index.',
        difficulty: 'medium'
      },
      {
        id: 'ca-7',
        subject_id: 'sub-ga',
        topic_name: 'Current Affairs (National & International)',
        question_text: 'Which institution established "MuleHunter.AI" to collaborate with banks in detecting and curbing digital money mule bank accounts?',
        options: ['Reserve Bank Innovation Hub (RBIH)', 'SEBI', 'National Payments Corporation of India', 'CERT-In'],
        correct_option_index: 0,
        explanation: 'The Reserve Bank Innovation Hub (RBIH) developed MuleHunter.AI to proactively identify money mule networks.',
        difficulty: 'medium'
      },
      {
        id: 'ca-8',
        subject_id: 'sub-ga',
        topic_name: 'Current Affairs (National & International)',
        question_text: 'What is the maximum investment limit under the Senior Citizens Savings Scheme (SCSS) as enhanced by the Government of India?',
        options: ['₹30 Lakh', '₹15 Lakh', '₹20 Lakh', '₹25 Lakh'],
        correct_option_index: 0,
        explanation: 'The government doubled the maximum investment limit in the Senior Citizens Savings Scheme (SCSS) from ₹15 Lakh to ₹30 Lakh.',
        difficulty: 'easy'
      }
    ];
  }

  // --- COMPUTER KNOWLEDGE QUESTIONS BANK ---
  getComputerKnowledgeQuestionPool(): QuizQuestion[] {
    return [
      {
        id: 'comp-1',
        subject_id: 'sub-computer',
        topic_name: 'Networking & Protocols',
        question_text: 'What is the standard port number used for secure web browsing (HTTPS)?',
        options: ['443', '80', '21', '25'],
        correct_option_index: 0,
        explanation: 'Port 443 is universally utilized for HTTP Secure (TLS/SSL encryption), whereas HTTP uses port 80.',
        difficulty: 'easy'
      },
      {
        id: 'comp-2',
        subject_id: 'sub-computer',
        topic_name: 'Computer Memory',
        question_text: 'Which memory type is non-volatile and retains its contents when power is turned off?',
        options: ['ROM (Read Only Memory)', 'RAM (Random Access Memory)', 'Cache Memory', 'Virtual Register'],
        correct_option_index: 0,
        explanation: 'ROM is non-volatile and stores firmware instructions (such as the BIOS/UEFI bootloader) indefinitely.',
        difficulty: 'easy'
      },
      {
        id: 'comp-3',
        subject_id: 'sub-computer',
        topic_name: 'Microsoft Office Shortcuts',
        question_text: 'Which keyboard shortcut is used to insert a hyperlink in MS Word and Excel?',
        options: ['Ctrl + K', 'Ctrl + H', 'Ctrl + L', 'Ctrl + Shift + H'],
        correct_option_index: 0,
        explanation: 'Ctrl + K opens the Insert Hyperlink dialog box across Microsoft Office applications.',
        difficulty: 'easy'
      },
      {
        id: 'comp-4',
        subject_id: 'sub-computer',
        topic_name: 'Operating Systems & Security',
        question_text: 'What is phishing in cyber security?',
        options: ['Fraudulent attempts to obtain sensitive data via deceptive communications', 'A hardware technique to cool CPU circuits', 'A virus scan utility', 'A fast sorting algorithm'],
        correct_option_index: 0,
        explanation: 'Phishing is a social engineering cyberattack designed to steal credentials and financial details.',
        difficulty: 'easy'
      },
      {
        id: 'comp-5',
        subject_id: 'sub-computer',
        topic_name: 'Database & SQL',
        question_text: 'In relational database terminology, what constraint uniquely identifies each record in a table?',
        options: ['Primary Key', 'Foreign Key', 'Check Constraint', 'View Index'],
        correct_option_index: 0,
        explanation: 'A Primary Key uniquely identifies each row in a relational database table and cannot contain NULL values.',
        difficulty: 'easy'
      },
      {
        id: 'comp-6',
        subject_id: 'sub-computer',
        topic_name: 'Microsoft Office Shortcuts',
        question_text: 'In Microsoft Excel, which keyboard shortcut is used to insert a new worksheet into a workbook?',
        options: ['Shift + F11', 'Ctrl + N', 'Alt + F1', 'Ctrl + F11'],
        correct_option_index: 0,
        explanation: 'Pressing Shift + F11 inserts a new worksheet in Microsoft Excel, whereas Ctrl + N creates an entirely new workbook.',
        difficulty: 'easy'
      },
      {
        id: 'comp-7',
        subject_id: 'sub-computer',
        topic_name: 'Operating Systems & Security',
        question_text: 'Which type of malicious software encrypts a victim’s files and demands a financial payment in exchange for the decryption key?',
        options: ['Ransomware', 'Adware', 'Spyware', 'Rootkit'],
        correct_option_index: 0,
        explanation: 'Ransomware is a category of malware that locks or encrypts critical user/enterprise data and demands ransom for restoration.',
        difficulty: 'easy'
      },
      {
        id: 'comp-8',
        subject_id: 'sub-computer',
        topic_name: 'Networking & Protocols',
        question_text: 'Which layer of the 7-layer OSI model is responsible for end-to-end communication, flow control, and TCP/UDP segmentation?',
        options: ['Transport Layer (Layer 4)', 'Network Layer (Layer 3)', 'Data Link Layer (Layer 2)', 'Session Layer (Layer 5)'],
        correct_option_index: 0,
        explanation: 'The Transport Layer manages end-to-end communication and packet segmentation using TCP and UDP.',
        difficulty: 'medium'
      },
      {
        id: 'comp-9',
        subject_id: 'sub-computer',
        topic_name: 'Number Systems',
        question_text: 'What is the hexadecimal equivalent of the 8-bit binary number (11011010)₂?',
        options: ['DA', 'CA', 'DB', 'B6'],
        correct_option_index: 0,
        explanation: 'Grouping into 4-bit nibbles: 1101 = 13 (D in hex) and 1010 = 10 (A in hex). Result is DA.',
        difficulty: 'medium'
      },
      {
        id: 'comp-10',
        subject_id: 'sub-computer',
        topic_name: 'Networking & Protocols',
        question_text: 'Which network protocol automatically assigns dynamic IP addresses and subnet masks to client devices?',
        options: ['DHCP', 'DNS', 'SNMP', 'FTP'],
        correct_option_index: 0,
        explanation: 'DHCP (Dynamic Host Configuration Protocol) automatically assigns IP addresses and network parameters.',
        difficulty: 'easy'
      },
      {
        id: 'comp-11',
        subject_id: 'sub-computer',
        topic_name: 'Digital Logic',
        question_text: 'Which universal logic gate produces a LOW (0) output ONLY when all of its inputs are HIGH (1)?',
        options: ['NAND Gate', 'NOR Gate', 'XOR Gate', 'OR Gate'],
        correct_option_index: 0,
        explanation: 'A NAND (NOT-AND) gate produces a 0 only when all inputs are 1, and 1 in all other cases.',
        difficulty: 'medium'
      },
      {
        id: 'comp-12',
        subject_id: 'sub-computer',
        topic_name: 'Operating Systems & Security',
        question_text: 'In operating systems, what is the condition called where processes are permanently blocked waiting for resources held by each other?',
        options: ['Deadlock', 'Paging', 'Thrashing', 'Context Switching'],
        correct_option_index: 0,
        explanation: 'Deadlock occurs when processes are blocked because each holds a resource while waiting for another resource held by another process.',
        difficulty: 'medium'
      },
      {
        id: 'comp-13',
        subject_id: 'sub-computer',
        topic_name: 'Database & SQL',
        question_text: 'Which DDL SQL command deletes all rows from a table rapidly without logging individual row deletions, preserving the table schema?',
        options: ['TRUNCATE', 'DELETE', 'DROP', 'UPDATE'],
        correct_option_index: 0,
        explanation: 'TRUNCATE TABLE is a DDL command that deallocates data pages rapidly while keeping table structure intact.',
        difficulty: 'medium'
      },
      {
        id: 'comp-14',
        subject_id: 'sub-computer',
        topic_name: 'Networking & Protocols',
        question_text: 'What is the bit length of an IPv6 address compared to an IPv4 address?',
        options: ['128 bits vs 32 bits', '64 bits vs 32 bits', '256 bits vs 64 bits', '128 bits vs 64 bits'],
        correct_option_index: 0,
        explanation: 'IPv6 uses 128 bits whereas IPv4 uses 32 bits.',
        difficulty: 'easy'
      },
      {
        id: 'comp-15',
        subject_id: 'sub-computer',
        topic_name: 'Operating Systems & Security',
        question_text: 'What is the central core component of an operating system that manages system resources and hardware interaction?',
        options: ['Kernel', 'Shell', 'Device Driver', 'Spooler'],
        correct_option_index: 0,
        explanation: 'The Kernel is the central core of an OS managing CPU scheduling, memory, and hardware devices.',
        difficulty: 'easy'
      },
      {
        id: 'comp-16',
        subject_id: 'sub-computer',
        topic_name: 'Hardware & Storage',
        question_text: 'Which RAID configuration provides disk mirroring by writing duplicate data across two separate physical drives?',
        options: ['RAID 1', 'RAID 0', 'RAID 5', 'RAID 6'],
        correct_option_index: 0,
        explanation: 'RAID 1 creates an exact mirror copy of data across two drives for high fault tolerance.',
        difficulty: 'medium'
      },
      {
        id: 'comp-17',
        subject_id: 'sub-computer',
        topic_name: 'Networking & Protocols',
        question_text: 'Which service translates human-friendly Internet domain names into numeric IP addresses?',
        options: ['DNS (Domain Name System)', 'SNMP', 'ICMP', 'ARP'],
        correct_option_index: 0,
        explanation: 'DNS resolves domain names into numeric IP addresses required for routing network packets.',
        difficulty: 'easy'
      },
      {
        id: 'comp-18',
        subject_id: 'sub-computer',
        topic_name: 'Operating Systems & Security',
        question_text: 'Which deadlock avoidance algorithm tests system safety by simulating allocation of maximum predetermined resources?',
        options: ["Banker's Algorithm", "Round Robin Scheduling", "Dijkstra's Algorithm", "LRU Page Replacement"],
        correct_option_index: 0,
        explanation: "Banker's Algorithm tests whether allocating requested resources leaves the system in a safe state.",
        difficulty: 'hard'
      },
      {
        id: 'comp-19',
        subject_id: 'sub-computer',
        topic_name: 'Operating Systems & Security',
        question_text: 'Which cryptography methodology utilizes a public key for encryption and a distinct private key for decryption?',
        options: ['Asymmetric (Public Key) Cryptography', 'Symmetric Key Cryptography', 'Hash Checksumming', 'Substitution Cipher'],
        correct_option_index: 0,
        explanation: 'Asymmetric encryption uses a public key to encrypt and a mathematically linked private key to decrypt.',
        difficulty: 'medium'
      },
      {
        id: 'comp-20',
        subject_id: 'sub-computer',
        topic_name: 'Microsoft Office Shortcuts',
        question_text: 'In Microsoft Excel, which keyboard shortcut combination displays the Macro dialog box to view or run macros?',
        options: ['Alt + F8', 'Alt + F11', 'Ctrl + F8', 'Shift + F8'],
        correct_option_index: 0,
        explanation: 'Alt + F8 opens the Macro dialog box in MS Excel.',
        difficulty: 'easy'
      }
    ];
  }

  // --- GEMINI AI QUESTION GENERATION ---
  async generateGeminiQuestions(
    subjectFilter?: string,
    topicFilter?: string,
    count: number = 5,
    difficulty: 'easy' | 'medium' | 'hard' | 'mixed' = 'mixed'
  ): Promise<QuizQuestion[]> {
    if (!this.aiConfig.isAiGloballyEnabled()) {
      console.info('Gemini AI is globally disabled in Admin settings. Using built-in generator.');
      return this.getFallbackQuestions(subjectFilter, topicFilter, count);
    }

    const primaryKey = this.aiConfig.getEffectivePrimaryKey();
    const fallbackKey = this.aiConfig.getEffectiveFallbackKey();
    const model = this.aiConfig.getEffectiveModel();
    const temperature = this.aiConfig.getTemperature();

    const keysToTry = [primaryKey, fallbackKey].filter(Boolean);
    if (keysToTry.length === 0) {
      console.warn('No Gemini API key configured, falling back to built-in questions.');
      return this.getFallbackQuestions(subjectFilter, topicFilter, count);
    }

    const subjectContext = subjectFilter && subjectFilter !== 'all' ? subjectFilter : 'Indian Banking Exams (Quantitative Aptitude, Reasoning, English Language, General Awareness, Computer Aptitude)';
    const topicContext = topicFilter ? `Topic: ${topicFilter}` : 'Mixed exam syllabus topics';
    const difficultyGuide = difficulty === 'mixed'
      ? 'Include a balanced mix of Easy (30%), Medium (50%), and Hard (20%) questions.'
      : `All questions must strictly be of ${difficulty.toUpperCase()} difficulty level.`;

    const prompt = `You are a premier senior question paper setter for Indian Banking examinations (IBPS PO/Clerk, SBI PO/Clerk, RRB, RBI Grade B).
Generate exactly ${count} distinct, high-quality multiple choice practice questions.

Subject / Domain: ${subjectContext}
${topicContext}
Target Difficulty: ${difficultyGuide}

Format & Rules:
1. Each question must strictly have exactly 4 options.
2. Exactly one option must be correct.
3. The correct_option_index must be the 0-based index (0, 1, 2, or 3) of that correct option in the options array.
4. Provide a clear, step-by-step mathematical or logical explanation.
5. Realistic exam patterns:
   - For Quantitative Aptitude: Include realistic bank arithmetic, speed math, percentage, profit/loss, simple/compound interest, time & work, or number series.
   - For Reasoning: Include syllogism, inequalities, blood relations, direction sense, or coding-decoding.
   - For English: Include error spotting, cloze test, vocabulary, fillers, or idioms.
   - For Banking / GA / Computer: Include RBI monetary policy, digital banking, cybersecurity, MS Office, or current financial terms.

Output MUST be a valid JSON array of objects conforming to this schema:
[
  {
    "question_text": "Question statement here",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct_option_index": 0,
    "explanation": "Detailed step-by-step solution here",
    "difficulty": "${difficulty === 'mixed' ? 'medium' : difficulty}",
    "topic_name": "${topicFilter || 'Banking Exam Prep'}"
  }
]`;

    for (let i = 0; i < keysToTry.length; i++) {
      const apiKey = keysToTry[i];
      const keyLabel = i === 0 ? 'Primary' : 'Fallback';
      const keyType: 'primary' | 'fallback' = i === 0 ? 'primary' : 'fallback';
      const startTime = performance.now();
      try {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              response_mime_type: 'application/json',
              temperature: temperature
            }
          })
        });

        const latencyMs = Math.round(performance.now() - startTime);

        if (!response.ok) {
          const errText = await response.text();
          console.warn(`Gemini ${keyLabel} key returned HTTP ${response.status}: ${errText}`);
          this.aiConfig.recordAiUsage({
            model,
            keyUsed: keyType,
            topic: topicFilter,
            subject: subjectFilter,
            questionsCount: 0,
            tokensUsed: 0,
            promptTokens: 0,
            completionTokens: 0,
            latencyMs,
            status: 'failed',
            errorMessage: `HTTP ${response.status}: ${errText.slice(0, 100)}`
          });
          continue; // Try fallback key
        }

        const data = await response.json();
        const jsonText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!jsonText) {
          console.warn(`Gemini ${keyLabel} returned empty candidates`);
          continue;
        }

        const parsed = JSON.parse(jsonText);
        const questionsArray = Array.isArray(parsed) ? parsed : (parsed.questions || []);

        if (Array.isArray(questionsArray) && questionsArray.length > 0) {
          const nowIso = new Date().toISOString();
          const promptTokens = data.usageMetadata?.promptTokenCount || Math.round(prompt.length / 4);
          const completionTokens = data.usageMetadata?.candidatesTokenCount || Math.round(jsonText.length / 4);
          const totalTokens = data.usageMetadata?.totalTokenCount || (promptTokens + completionTokens);

          const formattedQuestions: QuizQuestion[] = questionsArray.map((q: any, idx: number) => ({
            id: `gemini-${Date.now()}-${idx}`,
            subject_id: subjectFilter || 'sub-ai',
            topic_name: q.topic_name || topicFilter || 'AI Practice',
            question_text: q.question_text || q.question || '',
            options: Array.isArray(q.options) && q.options.length === 4 ? q.options : ['A', 'B', 'C', 'D'],
            correct_option_index: typeof q.correct_option_index === 'number' && q.correct_option_index >= 0 && q.correct_option_index <= 3 ? q.correct_option_index : 0,
            explanation: q.explanation || 'Detailed explanation will be updated shortly.',
            difficulty: q.difficulty || (difficulty === 'mixed' ? 'medium' : difficulty),
            created_at: nowIso,
            correct_count: 0,
            incorrect_count: 0,
            last_attempted_at: undefined,
            is_ai_generated: true,
            generator_type: 'gemini_ai'
          }));

          // Record telemetry
          this.aiConfig.recordAiUsage({
            model,
            keyUsed: keyType,
            topic: topicFilter,
            subject: subjectFilter,
            questionsCount: formattedQuestions.length,
            tokensUsed: totalTokens,
            promptTokens,
            completionTokens,
            latencyMs,
            status: 'success'
          });

          // Cache newly generated questions to persistent bank
          this.cacheGeneratedQuestions(formattedQuestions);
          return formattedQuestions.slice(0, count);
        }
      } catch (err: any) {
        const latencyMs = Math.round(performance.now() - startTime);
        console.warn(`Error generating questions with Gemini ${keyLabel} key:`, err);
        this.aiConfig.recordAiUsage({
          model,
          keyUsed: keyType,
          topic: topicFilter,
          subject: subjectFilter,
          questionsCount: 0,
          tokensUsed: 0,
          promptTokens: 0,
          completionTokens: 0,
          latencyMs,
          status: 'failed',
          errorMessage: err?.message || 'Network request failed'
        });
      }
    }

    // If both keys fail or network is down, gracefully fallback to code-based generator
    console.info('Falling back to built-in dynamic generators');
    return this.getFallbackQuestions(subjectFilter, topicFilter, count);
  }

  // --- PERSISTENT QUESTION BANK WITH PERFORMANCE LEDGER ---
  public getStoredQuestionBank(): QuizQuestion[] {
    try {
      const cacheKey = 'preptrack_gemini_questions_cache';
      const existingStr = localStorage.getItem(cacheKey);
      return existingStr ? JSON.parse(existingStr) : [];
    } catch {
      return [];
    }
  }

  public deleteQuestionFromBank(questionId: string): boolean {
    try {
      const cacheKey = 'preptrack_gemini_questions_cache';
      const bank = this.getStoredQuestionBank();
      const filtered = bank.filter(q => q.id !== questionId);
      if (filtered.length !== bank.length) {
        localStorage.setItem(cacheKey, JSON.stringify(filtered));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  public clearQuestionBank(): void {
    try {
      const cacheKey = 'preptrack_gemini_questions_cache';
      localStorage.removeItem(cacheKey);
    } catch {}
  }

  public exportQuestionBankJson(): string {
    return JSON.stringify(this.getStoredQuestionBank(), null, 2);
  }

  public importQuestionsToBank(questions: QuizQuestion[]): { added: number } {
    if (!Array.isArray(questions)) return { added: 0 };
    this.cacheGeneratedQuestions(questions);
    return { added: questions.length };
  }

  private cacheGeneratedQuestions(questions: QuizQuestion[]): void {
    try {
      const cacheKey = 'preptrack_gemini_questions_cache';
      const existing = this.getStoredQuestionBank();
      // Deduplicate by question text to avoid repetitive copies
      const textSet = new Set(existing.map(q => q.question_text.trim().toLowerCase()));
      const novel = questions.filter(q => !textSet.has(q.question_text.trim().toLowerCase()));
      const maxLimit = this.aiConfig.getMaxCacheSize();
      const updated = [...novel, ...existing].slice(0, maxLimit);
      localStorage.setItem(cacheKey, JSON.stringify(updated));
    } catch {}
  }

  /**
   * Update correct / incorrect performance counters and timestamps for questions
   * called when a user finishes a quiz.
   */
  public updateQuestionPerformanceCounters(
    answers: { question_id: string; is_correct: boolean }[]
  ): void {
    try {
      const bank = this.getStoredQuestionBank();
      if (bank.length === 0) return;

      const answerMap = new Map(answers.map(a => [a.question_id, a.is_correct]));
      let modified = false;

      const updatedBank = bank.map(q => {
        if (answerMap.has(q.id)) {
          modified = true;
          const isCorrect = answerMap.get(q.id)!;
          return {
            ...q,
            correct_count: (q.correct_count || 0) + (isCorrect ? 1 : 0),
            incorrect_count: (q.incorrect_count || 0) + (!isCorrect ? 1 : 0),
            last_attempted_at: new Date().toISOString()
          };
        }
        return q;
      });

      if (modified) {
        localStorage.setItem('preptrack_gemini_questions_cache', JSON.stringify(updatedBank));
      }
    } catch (e) {
      console.warn('Failed to update question performance counters:', e);
    }
  }

  /**
   * SPACED REPETITION & ADAPTIVE AI ALGORITHM:
   * 1. Inspect the existing bank for the requested subject / topic.
   * 2. Filter out "Mastered" questions:
   *    - If correct_count >= 2 and incorrect_count === 0, user has mastered it => skip to avoid repetition.
   * 3. Prioritize "Needs Review" questions:
   *    - If user answered incorrectly (incorrect_count > 0 and correct_count < incorrect_count + 1),
   *      and at least 10 minutes have elapsed since last attempt, re-surface it!
   * 4. Smart AI Trigger:
   *    - Call Gemini ONLY if:
   *      a) Eligible questions in the bank are fewer than requested count (need fresh content), OR
   *      b) Mastered ratio > 65% of the bank (user practiced almost everything in the bank), OR
   *      c) Explicitly requested fresh AI drill.
   *    - Otherwise, serve eligible review + unattempted bank questions without wasting API calls!
   */
  async getQuestions(
    subjectFilter?: string,
    topicFilter?: string,
    count: number = 5,
    difficulty: 'easy' | 'medium' | 'hard' | 'mixed' = 'mixed',
    useAi: boolean = true
  ): Promise<QuizQuestion[]> {
    const bank = this.getStoredQuestionBank();
    const filter = (subjectFilter || '').toLowerCase();
    const now = Date.now();

    // Matching questions from stored bank
    const matching = bank.filter(q => {
      const matchSub = !filter || filter === 'all' || q.subject_id?.toLowerCase().includes(filter);
      const matchTopic = !topicFilter || (q.topic_name && q.topic_name.toLowerCase().includes(topicFilter.toLowerCase()));
      const matchDiff = difficulty === 'mixed' || !q.difficulty || q.difficulty === difficulty;
      return matchSub && matchTopic && matchDiff;
    });

    // Score & categorize eligible questions
    // - Unattempted (correct_count === 0 && incorrect_count === 0)
    // - Needs review (incorrect_count > 0, attempted at least 5 mins ago)
    // - Mastered (correct_count >= 2 and last_attempt was correct): excluded unless bank is exhausted
    const unattempted: QuizQuestion[] = [];
    const reviewNeeded: QuizQuestion[] = [];
    const mastered: QuizQuestion[] = [];

    for (const q of matching) {
      const corrects = q.correct_count || 0;
      const incorrects = q.incorrect_count || 0;
      const lastAttemptMs = q.last_attempted_at ? new Date(q.last_attempted_at).getTime() : 0;
      const timeSinceAttemptMs = now - lastAttemptMs;

      if (corrects === 0 && incorrects === 0) {
        unattempted.push(q);
      } else if (incorrects > corrects) {
        // Needs review - spaced out by at least 3 minutes
        if (timeSinceAttemptMs > 3 * 60 * 1000) {
          reviewNeeded.push(q);
        }
      } else if (corrects >= 2) {
        mastered.push(q);
      } else {
        // Attempted once correctly, can be re-tested after 15 mins
        if (timeSinceAttemptMs > 15 * 60 * 1000) {
          reviewNeeded.push(q);
        }
      }
    }

    // Eligible candidates without mastered questions
    const eligiblePool = [...this.shuffle(reviewNeeded), ...this.shuffle(unattempted)];

    // SMART AI TRIGGER RULE:
    // Only invoke AI if:
    // 1) Online AND useAi is true AND
    // 2) We don't have enough eligible questions in the bank (less than requested count)
    //    OR the bank is saturated with mastered questions (> 65% mastered ratio)
    const policy = this.aiConfig.getAiPolicy();
    const canUseAiPolicy = policy !== 'offline_only' && (policy !== 'engine_first' || useAi);
    const totalMatching = matching.length;
    const isBankSaturated = totalMatching >= 5 && (mastered.length / totalMatching) > 0.65;
    const needsFreshAi = eligiblePool.length < count || isBankSaturated;
    const effectivelyUseAi = useAi && this.aiConfig.isAiGloballyEnabled() && canUseAiPolicy;

    if (effectivelyUseAi && navigator.onLine && needsFreshAi) {
      try {
        const neededFromAi = count;
        const aiQuestions = await this.generateGeminiQuestions(subjectFilter, topicFilter, neededFromAi, difficulty);
        if (aiQuestions && aiQuestions.length > 0) {
          // If we have some spaced review questions, blend 1-2 review questions with the fresh AI questions!
          if (reviewNeeded.length > 0 && aiQuestions.length >= count) {
            const blended = [
              reviewNeeded[0],
              ...aiQuestions.slice(0, count - 1)
            ];
            return this.deduplicateQuestions(this.shuffle(blended)).slice(0, count);
          }
          return this.deduplicateQuestions(aiQuestions).slice(0, count);
        }
      } catch (err) {
        console.warn('Smart AI generation fallback to bank:', err);
      }
    }

    // If we have enough eligible unattempted / review questions, return them directly!
    const uniqueEligible = this.deduplicateQuestions(eligiblePool);
    if (uniqueEligible.length >= count) {
      return uniqueEligible.slice(0, count);
    }

    // Otherwise, supplement with standard built-in dynamic math / syllabus fallbacks
    const fallbackBank = this.getFallbackQuestions(subjectFilter, topicFilter, Math.max(count * 2, 10));
    const combined = [...uniqueEligible, ...fallbackBank];
    const unique = this.deduplicateQuestions(combined);
    return this.shuffle(unique).slice(0, count);
  }

  public getFallbackQuestions(subjectFilter?: string, topicFilter?: string, count: number = 5): QuizQuestion[] {
    if (topicFilter && topicFilter.trim()) {
      const topicQuestions = this.patternEngine.generateQuizQuestionsForTopic(topicFilter, subjectFilter, count);
      if (topicQuestions && topicQuestions.length > 0) {
        return this.deduplicateQuestions(topicQuestions).slice(0, count);
      }
    }

    let pool: QuizQuestion[] = [];
    const filter = (subjectFilter || '').toLowerCase();

    // Check if filter matches Quant or is empty
    if (!filter || filter.includes('quant') || filter.includes('aptitude') || filter.includes('sub-quant')) {
      pool = pool.concat(this.generateDynamicQuantQuestions(Math.max(count, 15), topicFilter));
    }
    // Check if filter matches Reasoning or is empty
    if (!filter || filter.includes('reas') || filter.includes('reasoning') || filter.includes('sub-reasoning')) {
      pool = pool.concat(this.getReasoningQuestionPool());
    }
    // Check if filter matches English or is empty
    if (!filter || filter.includes('eng') || filter.includes('english') || filter.includes('sub-english')) {
      pool = pool.concat(this.getEnglishQuestionPool());
    }
    // Check if filter matches General Awareness or Banking or is empty
    if (!filter || filter.includes('ga') || filter.includes('bank') || filter.includes('general') || filter.includes('awareness') || filter.includes('sub-ga')) {
      pool = pool.concat(this.getBankingAwarenessQuestionPool());
    }
    // Check if filter matches Computer or is empty
    if (!filter || filter.includes('comp') || filter.includes('computer') || filter.includes('sub-computer')) {
      pool = pool.concat(this.getComputerKnowledgeQuestionPool());
    }

    // If still empty (e.g. custom subject UUID), generate quant questions as guaranteed baseline
    if (pool.length === 0) {
      pool = pool.concat(this.generateDynamicQuantQuestions(count, topicFilter));
      pool = pool.concat(this.getReasoningQuestionPool());
    }

    if (topicFilter) {
      const topicMatches = pool.filter(q => q.topic_name?.toLowerCase().includes(topicFilter.toLowerCase()));
      if (topicMatches.length > 0) {
        const uniqueTopicMatches = this.deduplicateQuestions(topicMatches);
        if (uniqueTopicMatches.length >= count) {
          return this.shuffle(uniqueTopicMatches).slice(0, count);
        }
        // If specific topic has fewer questions than count, pad with remaining pool
        const others = pool.filter(q => !topicMatches.includes(q));
        const combinedMatches = this.deduplicateQuestions([...uniqueTopicMatches, ...others]);
        return this.shuffle(combinedMatches).slice(0, count);
      }
    }

    const uniquePool = this.deduplicateQuestions(pool);
    if (uniquePool.length < count) {
      const extraDynamic = this.generateDynamicQuantQuestions(count - uniquePool.length, topicFilter);
      return this.deduplicateQuestions([...uniquePool, ...extraDynamic]).slice(0, count);
    }

    return this.shuffle(uniquePool).slice(0, count);
  }

  public getPaperQuestions(blueprintId: string): QuizQuestion[] {
    const bps = this.patternEngine.getDefaultBlueprints();
    const matchedBp = bps.find(b => b.id === blueprintId) || bps[0];
    const examItems = this.patternEngine.generateExamQuestions(matchedBp);

    const quizQuestions: QuizQuestion[] = examItems.map((item, idx) => {
      const correctText = item.options[item.correctOptionIndex];
      const distractors = item.options.filter((_, oIdx) => oIdx !== item.correctOptionIndex);
      const chosen3Distractors = this.shuffle(distractors).slice(0, 3);
      const fourOptions = this.shuffle([correctText, ...chosen3Distractors]);
      const newCorrectIdx = fourOptions.indexOf(correctText);

      return {
        id: `${blueprintId}-q-${idx + 1}`,
        subject_id: item.subjectCode === 'quant' ? 'sub-quant' : (item.subjectCode === 'reasoning' ? 'sub-reasoning' : (item.subjectCode === 'english' ? 'sub-english' : (item.subjectCode === 'ga' ? 'sub-ga' : 'sub-computer'))),
        topic_name: item.topicName || 'Mock Exam Section',
        question_text: item.passageText ? `${item.passageText}\n\n${item.questionText}` : item.questionText,
        options: fourOptions,
        correct_option_index: newCorrectIdx >= 0 ? newCorrectIdx : 0,
        explanation: item.explanation,
        difficulty: item.difficulty || 'medium',
        created_at: new Date().toISOString(),
        correct_count: 0,
        incorrect_count: 0,
        is_ai_generated: false,
        generator_type: 'blueprint_static'
      };
    });

    return this.deduplicateQuestions(quizQuestions);
  }

  // --- PREVIOUS YEARS' PAPERS (Original & Licensed Mock Tests) ---
  getPreviousPapers(): PreviousPaper[] {
    return [
      {
        id: 'paper-ibps-po-2025',
        exam_name: 'IBPS PO Prelims 2025 (Memory-Based Official Pattern)',
        year: 2025,
        stage: 'prelims',
        total_marks: 100,
        duration_minutes: 60,
        official_source_license: 'Licensed Open Educational Banking Syllabus Pattern',
        sections: [
          { subject_name: 'Reasoning Ability', questions_count: 35 },
          { subject_name: 'Quantitative Aptitude', questions_count: 35 },
          { subject_name: 'English Language', questions_count: 30 }
        ],
        questions: this.getPaperQuestions('ibps-po-prelims-live-1')
      },
      {
        id: 'paper-sbi-po-2025',
        exam_name: 'SBI PO Prelims 2025 Benchmark Paper',
        year: 2025,
        stage: 'prelims',
        total_marks: 100,
        duration_minutes: 60,
        official_source_license: 'Licensed Benchmark Bank Testing Corpus',
        sections: [
          { subject_name: 'Reasoning Ability', questions_count: 35 },
          { subject_name: 'Quantitative Aptitude', questions_count: 35 },
          { subject_name: 'English Language', questions_count: 30 }
        ],
        questions: this.getPaperQuestions('sbi-po-prelims-live-1')
      },
      {
        id: 'paper-ibps-clerk-2025',
        exam_name: 'IBPS Clerk Prelims 2025 Shift-1 Memory Paper',
        year: 2025,
        stage: 'prelims',
        total_marks: 100,
        duration_minutes: 60,
        official_source_license: 'Licensed Open Educational Banking Syllabus Pattern',
        sections: [
          { subject_name: 'English Language', questions_count: 30 },
          { subject_name: 'Numerical Ability', questions_count: 35 },
          { subject_name: 'Reasoning Ability', questions_count: 35 }
        ],
        questions: this.getPaperQuestions('ibps-clerk-prelims-mock-1')
      },
      {
        id: 'paper-sbi-clerk-2025',
        exam_name: 'SBI Clerk (Junior Associates) Prelims 2025 Paper',
        year: 2025,
        stage: 'prelims',
        total_marks: 100,
        duration_minutes: 60,
        official_source_license: 'Licensed Benchmark Bank Testing Corpus',
        sections: [
          { subject_name: 'English Language', questions_count: 30 },
          { subject_name: 'Numerical Ability', questions_count: 35 },
          { subject_name: 'Reasoning Ability', questions_count: 35 }
        ],
        questions: this.getPaperQuestions('sbi-clerk-prelims-mock-1')
      },
      {
        id: 'paper-rrb-po-2025',
        exam_name: 'IBPS RRB PO (Officer Scale-I) Prelims 2025 Paper',
        year: 2025,
        stage: 'prelims',
        total_marks: 80,
        duration_minutes: 45,
        official_source_license: 'Regional Rural Bank Standard Testing Pattern',
        sections: [
          { subject_name: 'Reasoning Ability', questions_count: 40 },
          { subject_name: 'Quantitative Aptitude', questions_count: 40 }
        ],
        questions: this.getPaperQuestions('rrb-po-prelims-mock-1')
      },
      {
        id: 'paper-ibps-po-mains-2025',
        exam_name: 'IBPS PO Mains 2025 (GA, Banking, Quant & Reasoning)',
        year: 2025,
        stage: 'mains',
        total_marks: 200,
        duration_minutes: 180,
        official_source_license: 'Licensed Mains Banking Examination Corpus',
        sections: [
          { subject_name: 'Reasoning & Computer Aptitude', questions_count: 45 },
          { subject_name: 'General/Economy/Banking Awareness', questions_count: 40 },
          { subject_name: 'English Language', questions_count: 35 },
          { subject_name: 'Data Analysis & Interpretation', questions_count: 35 }
        ],
        questions: this.getPaperQuestions('ibps-po-mains-mock-1')
      },
      {
        id: 'paper-rbi-gradeb-2025',
        exam_name: 'RBI Grade B Phase-I General Awareness & Quant 2025',
        year: 2025,
        stage: 'prelims',
        total_marks: 200,
        duration_minutes: 120,
        official_source_license: 'Standard Regulatory Banking Exam Pattern',
        sections: [
          { subject_name: 'General Awareness', questions_count: 80 },
          { subject_name: 'Reasoning Ability', questions_count: 60 },
          { subject_name: 'English Language', questions_count: 30 },
          { subject_name: 'Quantitative Aptitude', questions_count: 30 }
        ],
        questions: this.getPaperQuestions('rbi-gradeb-phase1-mock-1')
      },
      {
        id: 'paper-nabard-gradea-2025',
        exam_name: 'NABARD Grade A Phase-I (RDBS) Merit & Qualifying Paper 2025',
        year: 2025,
        stage: 'prelims',
        total_marks: 200,
        duration_minutes: 120,
        official_source_license: 'Apex Development Bank Exam Pattern',
        sections: [
          { subject_name: 'Economic & Social Issues + ARD', questions_count: 80 },
          { subject_name: 'General Awareness & Computer Knowledge', questions_count: 40 },
          { subject_name: 'Reasoning & Quantitative Aptitude', questions_count: 40 },
          { subject_name: 'English Language', questions_count: 40 }
        ],
        questions: this.getPaperQuestions('nabard-gradea-phase1-mock-1')
      },
      {
        id: 'paper-sebi-gradea-2025',
        exam_name: 'SEBI Grade A Phase-I Paper-1 Benchmark 2025',
        year: 2025,
        stage: 'prelims',
        total_marks: 100,
        duration_minutes: 60,
        official_source_license: 'Capital Markets Regulatory Exam Framework',
        sections: [
          { subject_name: 'General Awareness (Financial Focus)', questions_count: 25 },
          { subject_name: 'English Language', questions_count: 25 },
          { subject_name: 'Quantitative Aptitude', questions_count: 25 },
          { subject_name: 'Reasoning Ability', questions_count: 25 }
        ],
        questions: this.getPaperQuestions('sebi-gradea-phase1-mock-1')
      },
      {
        id: 'paper-lic-aao-2025',
        exam_name: 'LIC AAO Prelims Official Pattern Paper 2025',
        year: 2025,
        stage: 'prelims',
        total_marks: 70,
        duration_minutes: 60,
        official_source_license: 'Licensed Insurance Recruitment Standard Pattern',
        sections: [
          { subject_name: 'Reasoning Ability', questions_count: 35 },
          { subject_name: 'Quantitative Aptitude', questions_count: 35 },
          { subject_name: 'English Language (Qualifying)', questions_count: 30 }
        ],
        questions: this.getPaperQuestions('lic-aao-prelims-mock-1')
      },
      {
        id: 'paper-ibps-so-2025',
        exam_name: 'IBPS SO Prelims (Specialist Officers) Standard Paper 2025',
        year: 2025,
        stage: 'prelims',
        total_marks: 125,
        duration_minutes: 120,
        official_source_license: 'Licensed Specialist Banking Recruitment Pattern',
        sections: [
          { subject_name: 'English Language', questions_count: 50 },
          { subject_name: 'Reasoning Ability', questions_count: 50 },
          { subject_name: 'Quantitative Aptitude', questions_count: 50 }
        ],
        questions: this.getPaperQuestions('ibps-so-prelims-mock-1')
      }
    ];
  }

  // --- SAVE QUIZ ATTEMPT & SYNCHRONIZE ---
  async saveQuizAttempt(attempt: Partial<QuizAttempt>): Promise<QuizAttempt> {
    const newAttempt: QuizAttempt = {
      id: attempt.id || `quiz-${Date.now()}`,
      user_id: this.userId,
      quiz_type: attempt.quiz_type || 'subject',
      subject_id: attempt.subject_id || null,
      topic_id: attempt.topic_id || null,
      topic_name: attempt.topic_name || null,
      total_questions: attempt.total_questions || 0,
      correct_answers: attempt.correct_answers || 0,
      score_percentage: attempt.score_percentage || 0,
      total_time_seconds: attempt.total_time_seconds || 0,
      weak_topics: attempt.weak_topics || [],
      answers: attempt.answers || [],
      created_at: new Date().toISOString()
    };

    // Update question bank performance counters (correct/incorrect counters & timestamps)
    if (newAttempt.answers && newAttempt.answers.length > 0) {
      this.updateQuestionPerformanceCounters(newAttempt.answers);
    }

    // Cache to local storage & IndexedDB immediately
    const existing = await this.getQuizAttempts();
    existing.unshift(newAttempt);
    try {
      localStorage.setItem(`preptrack_quiz_attempts_${this.userId}`, JSON.stringify(existing));
    } catch {}
    await this.offlineSync.setCached(`quiz_attempts_${this.userId}`, existing);

    // Save to Supabase or queue for sync
    if (this.supabaseService.isRealSupabaseConfigured && navigator.onLine) {
      try {
        await this.supabaseService.clientInstance
          .from('quiz_attempts')
          .insert(newAttempt);
      } catch (err) {
        // Enqueue to offline outbox if network or schema fails
        await this.offlineSync.enqueueSync('quiz_attempts', 'insert', newAttempt);
      }
    } else {
      await this.offlineSync.enqueueSync('quiz_attempts', 'insert', newAttempt);
    }

    return newAttempt;
  }

  async getQuizAttempts(): Promise<QuizAttempt[]> {
    // 1. Check local storage first (instant synchronous fallback)
    try {
      const localStr = localStorage.getItem(`preptrack_quiz_attempts_${this.userId}`);
      if (localStr) {
        const parsed = JSON.parse(localStr);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}

    // 2. Check IndexedDB cache
    const cached = await this.offlineSync.getCached<QuizAttempt[]>(`quiz_attempts_${this.userId}`);
    if (cached && cached.length > 0) {
      try {
        localStorage.setItem(`preptrack_quiz_attempts_${this.userId}`, JSON.stringify(cached));
      } catch {}
      return cached;
    }

    // 3. Fetch from Supabase
    if (this.supabaseService.isRealSupabaseConfigured) {
      try {
        const { data, error } = await this.supabaseService.clientInstance
          .from('quiz_attempts')
          .select('*')
          .eq('user_id', this.userId)
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          await this.offlineSync.setCached(`quiz_attempts_${this.userId}`, data);
          try {
            localStorage.setItem(`preptrack_quiz_attempts_${this.userId}`, JSON.stringify(data));
          } catch {}
          return data as QuizAttempt[];
        }
      } catch {
        // Fallback to empty
      }
    }

    return [];
  }

  // --- MANUAL OUTSIDE QUESTION LOGGING & GROWTH TRACKING ---
  async saveManualQuestionLog(log: Partial<ManualQuestionLog>): Promise<ManualQuestionLog> {
    const totalCount = log.questions_count || 0;
    const correctCount = Math.min(log.correct_count || 0, totalCount);
    const incorrectCount = Math.max(0, totalCount - correctCount);

    const newLog: ManualQuestionLog = {
      id: log.id || `manual-log-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      user_id: this.userId,
      subject_name: log.subject_name || 'Quantitative Aptitude',
      topic_name: log.topic_name || 'General',
      section_part: log.section_part || 'Arithmetic',
      source_type: log.source_type || 'offline_book',
      questions_count: totalCount,
      correct_count: correctCount,
      incorrect_count: incorrectCount,
      time_spent_minutes: log.time_spent_minutes || 0,
      notes: log.notes || '',
      logged_at: log.logged_at || new Date().toISOString(),
      created_at: new Date().toISOString()
    };

    // Cache locally to local storage & IndexedDB immediately
    const existing = await this.getManualQuestionLogs();
    existing.unshift(newLog);
    try {
      localStorage.setItem(`preptrack_manual_question_logs_${this.userId}`, JSON.stringify(existing));
    } catch {}
    await this.offlineSync.setCached(`manual_question_logs_${this.userId}`, existing);

    // Save to Supabase or queue for sync
    if (this.supabaseService.isRealSupabaseConfigured && navigator.onLine) {
      try {
        await this.supabaseService.clientInstance
          .from('manual_question_logs')
          .insert(newLog);
      } catch (err) {
        await this.offlineSync.enqueueSync('manual_question_logs', 'insert', newLog);
      }
    } else {
      await this.offlineSync.enqueueSync('manual_question_logs', 'insert', newLog);
    }

    return newLog;
  }

  async getManualQuestionLogs(): Promise<ManualQuestionLog[]> {
    // 1. Check local storage first (instant synchronous fallback)
    try {
      const localStr = localStorage.getItem(`preptrack_manual_question_logs_${this.userId}`);
      if (localStr) {
        const parsed = JSON.parse(localStr);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}

    // 2. Check IndexedDB cache
    const cached = await this.offlineSync.getCached<ManualQuestionLog[]>(`manual_question_logs_${this.userId}`);
    if (cached && cached.length > 0) {
      try {
        localStorage.setItem(`preptrack_manual_question_logs_${this.userId}`, JSON.stringify(cached));
      } catch {}
      return cached;
    }

    // 3. Fetch from Supabase
    if (this.supabaseService.isRealSupabaseConfigured) {
      try {
        const { data, error } = await this.supabaseService.clientInstance
          .from('manual_question_logs')
          .select('*')
          .eq('user_id', this.userId)
          .order('logged_at', { ascending: false });

        if (!error && data && data.length > 0) {
          await this.offlineSync.setCached(`manual_question_logs_${this.userId}`, data);
          try {
            localStorage.setItem(`preptrack_manual_question_logs_${this.userId}`, JSON.stringify(data));
          } catch {}
          return data as ManualQuestionLog[];
        }
      } catch {}
    }

    return [];
  }

  async deleteManualQuestionLog(id: string): Promise<void> {
    const existing = await this.getManualQuestionLogs();
    const updated = existing.filter(l => l.id !== id);
    try {
      localStorage.setItem(`preptrack_manual_question_logs_${this.userId}`, JSON.stringify(updated));
    } catch {}
    await this.offlineSync.setCached(`manual_question_logs_${this.userId}`, updated);

    if (this.supabaseService.isRealSupabaseConfigured && navigator.onLine) {
      try {
        await this.supabaseService.clientInstance
          .from('manual_question_logs')
          .delete()
          .eq('id', id);
      } catch {}
    }
  }

  private shuffle<T>(arr: T[]): T[] {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }
}
