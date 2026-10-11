-- ==============================================================================
-- PREPTRACK: FIX FOR "Database error saving new user"
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/bxzfrusibipifrhukpdx/sql/new
-- ==============================================================================

-- 1. Ensure the exams table has the announcement and timeline columns
ALTER TABLE public.exams
ADD COLUMN IF NOT EXISTS conducting_body TEXT DEFAULT 'IBPS',
ADD COLUMN IF NOT EXISTS vacancies INTEGER,
ADD COLUMN IF NOT EXISTS notification_date DATE,
ADD COLUMN IF NOT EXISTS application_start_date DATE,
ADD COLUMN IF NOT EXISTS application_end_date DATE,
ADD COLUMN IF NOT EXISTS prelims_date DATE,
ADD COLUMN IF NOT EXISTS mains_date DATE,
ADD COLUMN IF NOT EXISTS official_url TEXT,
ADD COLUMN IF NOT EXISTS notification_status TEXT DEFAULT 'announced';

-- 2. Ensure profiles table has target preferences columns
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS target_exam_id UUID REFERENCES public.exams(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS target_exam_name TEXT,
ADD COLUMN IF NOT EXISTS target_exam_date DATE,
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false;

-- 3. Ensure quiz_attempts table exists
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quiz_type TEXT NOT NULL DEFAULT 'subject',
  subject_id TEXT,
  topic_id TEXT,
  topic_name TEXT,
  total_questions INT NOT NULL DEFAULT 5,
  correct_answers INT NOT NULL DEFAULT 0,
  score_percentage NUMERIC(5,2) NOT NULL DEFAULT 0.0,
  total_time_seconds INT NOT NULL DEFAULT 0,
  weak_topics TEXT[] DEFAULT '{}',
  answers JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'quiz_attempts' AND policyname = 'Users can view their own quiz attempts'
  ) THEN
    CREATE POLICY "Users can view their own quiz attempts"
      ON public.quiz_attempts FOR SELECT USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'quiz_attempts' AND policyname = 'Users can insert their own quiz attempts'
  ) THEN
    CREATE POLICY "Users can insert their own quiz attempts"
      ON public.quiz_attempts FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'quiz_attempts' AND policyname = 'Users can delete their own quiz attempts'
  ) THEN
    CREATE POLICY "Users can delete their own quiz attempts"
      ON public.quiz_attempts FOR DELETE USING (auth.uid() = user_id);
  END IF;
END;
$$;

-- 4. Update the seed function
CREATE OR REPLACE FUNCTION public.seed_user_bank_exam_data(p_user_id UUID)
RETURNS void AS $$
DECLARE
  v_ibps_po UUID;
  v_sbi_po UUID;
  v_ibps_clerk UUID;
  v_sbi_clerk UUID;
  v_rrb_po UUID;
  v_rbi_grade_b UUID;
  v_sub_reasoning UUID;
  v_sub_quant UUID;
  v_sub_english UUID;
  v_sub_ga UUID;
  v_sub_computer UUID;
BEGIN
  -- Insert Default Exams
  INSERT INTO public.exams (user_id, name, conducting_body, vacancies, description, prelims_date, mains_date, application_start_date, application_end_date, official_url, notification_status, is_active, display_order)
  VALUES (p_user_id, 'IBPS PO 2026', 'IBPS', 4455, 'Probationary Officer / Management Trainee recruitment', '2026-10-18', '2026-11-29', '2026-08-01', '2026-08-28', 'https://ibps.in', 'announced', true, 1)
  RETURNING id INTO v_ibps_po;

  INSERT INTO public.exams (user_id, name, conducting_body, vacancies, description, prelims_date, mains_date, application_start_date, application_end_date, official_url, notification_status, is_active, display_order)
  VALUES (p_user_id, 'SBI PO 2026', 'SBI', 2000, 'Probationary Officer recruitment across State Bank of India branches', '2026-11-01', '2026-12-15', '2026-09-05', '2026-09-30', 'https://sbi.bank/web/careers', 'announced', true, 2)
  RETURNING id INTO v_sbi_po;

  INSERT INTO public.exams (user_id, name, conducting_body, vacancies, description, prelims_date, mains_date, application_start_date, application_end_date, official_url, notification_status, is_active, display_order)
  VALUES (p_user_id, 'IBPS Clerk 2026', 'IBPS', 6128, 'Customer Service Associate (Clerical Cadre) examination', '2026-10-10', '2026-11-23', '2026-07-01', '2026-07-28', 'https://ibps.in', 'announced', true, 3)
  RETURNING id INTO v_ibps_clerk;

  INSERT INTO public.exams (user_id, name, conducting_body, vacancies, description, prelims_date, mains_date, application_start_date, application_end_date, official_url, notification_status, is_active, display_order)
  VALUES (p_user_id, 'SBI Clerk 2026', 'SBI', 8283, 'Junior Associates (Customer Support & Sales) recruitment', '2026-10-25', '2026-12-06', '2026-08-15', '2026-09-10', 'https://sbi.bank/web/careers', 'announced', true, 4)
  RETURNING id INTO v_sbi_clerk;

  INSERT INTO public.exams (user_id, name, conducting_body, vacancies, description, prelims_date, mains_date, application_start_date, application_end_date, official_url, notification_status, is_active, display_order)
  VALUES (p_user_id, 'IBPS RRB Officer Scale-I 2026', 'IBPS', 5500, 'Regional Rural Banks PO Scale-I recruitment', '2026-08-03', '2026-09-29', '2026-06-07', '2026-06-30', 'https://ibps.in', 'announced', true, 5)
  RETURNING id INTO v_rrb_po;

  INSERT INTO public.exams (user_id, name, conducting_body, vacancies, description, prelims_date, mains_date, application_start_date, application_end_date, official_url, notification_status, is_active, display_order)
  VALUES (p_user_id, 'RBI Grade B Officer 2026', 'RBI', 291, 'Direct recruitment for Officers in Grade B', '2026-09-08', '2026-10-19', '2026-07-15', '2026-08-10', 'https://opportunities.rbi.org.in', 'announced', true, 6)
  RETURNING id INTO v_rbi_grade_b;

  -- Insert Core Bank Exam Subjects
  INSERT INTO public.subjects (user_id, name, color, display_order)
  VALUES (p_user_id, 'Reasoning Ability', '#2563eb', 1) RETURNING id INTO v_sub_reasoning;

  INSERT INTO public.subjects (user_id, name, color, display_order)
  VALUES (p_user_id, 'Quantitative Aptitude', '#0891b2', 2) RETURNING id INTO v_sub_quant;

  INSERT INTO public.subjects (user_id, name, color, display_order)
  VALUES (p_user_id, 'English Language', '#7c3aed', 3) RETURNING id INTO v_sub_english;

  INSERT INTO public.subjects (user_id, name, color, display_order)
  VALUES (p_user_id, 'General & Banking Awareness', '#d97706', 4) RETURNING id INTO v_sub_ga;

  INSERT INTO public.subjects (user_id, name, color, display_order)
  VALUES (p_user_id, 'Computer Aptitude', '#059669', 5) RETURNING id INTO v_sub_computer;

  -- Map Subjects to Prelims & Mains
  INSERT INTO public.exam_subjects (user_id, exam_id, subject_id, stage, display_order) VALUES
  (p_user_id, v_ibps_po, v_sub_reasoning, 'prelims', 1),
  (p_user_id, v_ibps_po, v_sub_quant, 'prelims', 2),
  (p_user_id, v_ibps_po, v_sub_english, 'prelims', 3),
  (p_user_id, v_ibps_po, v_sub_reasoning, 'mains', 1),
  (p_user_id, v_ibps_po, v_sub_quant, 'mains', 2),
  (p_user_id, v_ibps_po, v_sub_english, 'mains', 3),
  (p_user_id, v_ibps_po, v_sub_ga, 'mains', 4),
  (p_user_id, v_ibps_po, v_sub_computer, 'mains', 5);

  -- Seed Topics with 'not_started' status (0% usage for new users)
  INSERT INTO public.topics (user_id, subject_id, name, description, priority, learning_status, display_order) VALUES
  (p_user_id, v_sub_reasoning, 'Puzzles: Floor & Flat Based', 'High weightage puzzles for Prelims & Mains', 'high', 'not_started', 1),
  (p_user_id, v_sub_reasoning, 'Seating: Circular & Linear', 'Inside/outside & parallel row variations', 'high', 'not_started', 2),
  (p_user_id, v_sub_reasoning, 'Syllogisms: Only a Few Cases', 'Venn diagram deduction rules', 'high', 'not_started', 3),
  (p_user_id, v_sub_reasoning, 'Inequalities: Direct & Coded', 'Mathematical statements and conclusions', 'high', 'not_started', 4),
  (p_user_id, v_sub_reasoning, 'Blood Relations & Family Tree', 'Coded and multi-generation relationships', 'high', 'not_started', 5),
  (p_user_id, v_sub_reasoning, 'Direction Sense & Distance', 'Pythagoras theorem applications', 'medium', 'not_started', 6),
  (p_user_id, v_sub_reasoning, 'Coding - Decoding', 'Chinese and conditional pattern codes', 'medium', 'not_started', 7),
  (p_user_id, v_sub_reasoning, 'Machine Input - Output', 'Step rearrangement for Mains', 'high', 'not_started', 8),
  (p_user_id, v_sub_reasoning, 'Data Sufficiency', 'Two and three statement sufficiency', 'high', 'not_started', 9),
  (p_user_id, v_sub_reasoning, 'Critical Reasoning', 'Statement, Assumptions, Arguments', 'high', 'not_started', 10);

  INSERT INTO public.topics (user_id, subject_id, name, description, priority, learning_status, display_order) VALUES
  (p_user_id, v_sub_quant, 'Simplification & Approximation', 'BODMAS, square roots shortcuts', 'high', 'not_started', 1),
  (p_user_id, v_sub_quant, 'Number Series: Missing & Wrong', 'Multiplying and difference patterns', 'high', 'not_started', 2),
  (p_user_id, v_sub_quant, 'Quadratic Equations & Roots', 'Root comparison shortcuts', 'high', 'not_started', 3),
  (p_user_id, v_sub_quant, 'Data Interpretation: Tables & Graphs', 'Bar, line, pie chart calculation speed', 'high', 'not_started', 4),
  (p_user_id, v_sub_quant, 'Caselet Data Interpretation', 'Paragraph-based DI & Venn diagrams', 'high', 'not_started', 5),
  (p_user_id, v_sub_quant, 'Percentages & Fraction Equivalence', '1/2 to 1/20 fraction rules', 'high', 'not_started', 6),
  (p_user_id, v_sub_quant, 'Profit, Loss & Discount', 'Markup, successive discounts', 'high', 'not_started', 7),
  (p_user_id, v_sub_quant, 'Ratio, Proportion & Partnership', 'Capital investment duration', 'high', 'not_started', 8),
  (p_user_id, v_sub_quant, 'Simple & Compound Interest', 'CI vs SI differences and installments', 'high', 'not_started', 9),
  (p_user_id, v_sub_quant, 'Time & Work / Pipes & Cisterns', 'LCM efficiency unit approach', 'high', 'not_started', 10),
  (p_user_id, v_sub_quant, 'Speed, Distance, Trains & Boats', 'Relative velocity and upstream/downstream', 'high', 'not_started', 11);

  INSERT INTO public.topics (user_id, subject_id, name, description, priority, learning_status, display_order) VALUES
  (p_user_id, v_sub_english, 'Reading Comprehension', 'Editorial tone, fact-finding, vocab', 'high', 'not_started', 1),
  (p_user_id, v_sub_english, 'Cloze Test: New Pattern', 'Contextual elimination techniques', 'high', 'not_started', 2),
  (p_user_id, v_sub_english, 'Error Spotting & Grammar Rules', 'Subject-verb agreement, tenses', 'high', 'not_started', 3),
  (p_user_id, v_sub_english, 'Sentence Improvement & Word Swap', 'Grammar alternatives and replacements', 'high', 'not_started', 4),
  (p_user_id, v_sub_english, 'Para Jumbles', 'Mandatory pairs and concluding lines', 'high', 'not_started', 5),
  (p_user_id, v_sub_english, 'Fillers & Column Matching', 'Single/double fillers and sentence connections', 'medium', 'not_started', 6);

  INSERT INTO public.topics (user_id, subject_id, name, description, priority, learning_status, display_order) VALUES
  (p_user_id, v_sub_ga, 'Monthly Current Affairs (Last 6 Months)', 'National and global developments', 'high', 'not_started', 1),
  (p_user_id, v_sub_ga, 'RBI Structure & Monetary Policy', 'Repo, Reverse repo, CRR, SLR, MPC', 'high', 'not_started', 2),
  (p_user_id, v_sub_ga, 'Types of Banks & Financial Institutions', 'Commercial, SFBs, Payments banks, NABARD', 'high', 'not_started', 3),
  (p_user_id, v_sub_ga, 'NPA, SARFAESI Act & IBC 2016', 'Bad bank (NARCL) and asset recovery', 'high', 'not_started', 4),
  (p_user_id, v_sub_ga, 'Digital Banking (NPCI, UPI, RTGS)', 'IMPS, NACH, CBDC frameworks', 'high', 'not_started', 5),
  (p_user_id, v_sub_ga, 'Priority Sector Lending (PSL)', 'Agriculture and MSME targets', 'high', 'not_started', 6);

  INSERT INTO public.topics (user_id, subject_id, name, description, priority, learning_status, display_order) VALUES
  (p_user_id, v_sub_computer, 'Computer Architecture & Memory', 'CPU, RAM, ROM, storage hierarchies', 'medium', 'not_started', 1),
  (p_user_id, v_sub_computer, 'Networking & Internet Protocols', 'LAN, WAN, TCP/IP, OSI model', 'high', 'not_started', 2),
  (p_user_id, v_sub_computer, 'Cyber Security & Phishing', 'Malware, encryption, firewalls', 'high', 'not_started', 3),
  (p_user_id, v_sub_computer, 'Microsoft Office (Word, Excel, PowerPoint)', 'Formulas, VLOOKUP, pivot tables', 'high', 'not_started', 4),
  (p_user_id, v_sub_computer, 'Keyboard Shortcuts & IT Abbreviations', 'Common hotkeys and acronyms', 'high', 'not_started', 5);

  -- Insert Initial Calendar Milestones
  INSERT INTO public.exam_events (user_id, exam_id, title, event_type, event_date, date_status, description, reminder_enabled)
  VALUES 
  (p_user_id, v_ibps_po, 'IBPS PO Prelims Exam 2026', 'exam_date', '2026-10-18', 'confirmed', 'Prelims across nationwide centers', true),
  (p_user_id, v_ibps_po, 'IBPS PO Mains Exam 2026', 'exam_date', '2026-11-29', 'confirmed', 'Mains objective + descriptive test', true),
  (p_user_id, v_sbi_po, 'SBI PO Prelims Exam 2026', 'exam_date', '2026-11-01', 'tentative', 'Tentative schedule as per annual cycle', true),
  (p_user_id, v_ibps_clerk, 'IBPS Clerk Prelims Exam 2026', 'exam_date', '2026-10-10', 'confirmed', 'Online preliminary examination', true);

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Safe handle_new_user trigger function (creates profile and catches errors so user signup never fails)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Always create the user's profile first
  INSERT INTO public.profiles (id, display_name, timezone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    'Asia/Kolkata'
  )
  ON CONFLICT (id) DO UPDATE SET
    display_name = EXCLUDED.display_name,
    updated_at = now();

  -- Attempt syllabus seeding in a safe block
  BEGIN
    PERFORM public.seed_user_bank_exam_data(NEW.id);
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'Automatic syllabus seeding warning for %: %', NEW.id, SQLERRM;
  END;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Recreate the trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
