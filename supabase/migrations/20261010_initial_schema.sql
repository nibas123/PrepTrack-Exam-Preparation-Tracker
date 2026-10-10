-- PrepTrack Database Schema & Migrations
-- Target: Supabase PostgreSQL
-- Supports Multi-user with strict Row Level Security (RLS)

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  timezone TEXT DEFAULT 'Asia/Kolkata',
  daily_target_hours NUMERIC(4,2) DEFAULT 4.00,
  daily_target_topics INTEGER DEFAULT 3,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. EXAMS TABLE
CREATE TABLE IF NOT EXISTS public.exams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. SUBJECTS TABLE
CREATE TABLE IF NOT EXISTS public.subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#2563eb',
  display_order INTEGER DEFAULT 0,
  archived_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. EXAM_SUBJECTS (Stage linking for Prelims / Mains)
CREATE TABLE IF NOT EXISTS public.exam_subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  exam_id UUID NOT NULL REFERENCES public.exams(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  stage TEXT NOT NULL CHECK (stage IN ('prelims', 'mains', 'both')),
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, exam_id, subject_id, stage)
);

-- 5. TOPICS TABLE
CREATE TABLE IF NOT EXISTS public.topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  parent_topic_id UUID REFERENCES public.topics(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  learning_status TEXT NOT NULL DEFAULT 'not_started' CHECK (learning_status IN ('not_started', 'learning', 'learned', 'revision_completed')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  target_date DATE,
  display_order INTEGER DEFAULT 0,
  archived_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 6. DAILY_GOALS TABLE
CREATE TABLE IF NOT EXISTS public.daily_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  goal_date DATE NOT NULL,
  target_topic_count INTEGER DEFAULT 3,
  target_study_minutes INTEGER DEFAULT 240,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, goal_date)
);

-- 7. DAILY_GOAL_TOPICS TABLE
CREATE TABLE IF NOT EXISTS public.daily_goal_topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  daily_goal_id UUID NOT NULL REFERENCES public.daily_goals(id) ON DELETE CASCADE,
  topic_id UUID NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(daily_goal_id, topic_id)
);

-- 8. STUDY_SESSIONS TABLE
CREATE TABLE IF NOT EXISTS public.study_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE RESTRICT,
  topic_id UUID REFERENCES public.topics(id) ON DELETE SET NULL,
  started_at TIMESTAMPTZ NOT NULL,
  ended_at TIMESTAMPTZ NOT NULL,
  duration_seconds INTEGER NOT NULL CHECK (duration_seconds >= 0),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 9. MOCK_EXAMS TABLE
CREATE TABLE IF NOT EXISTS public.mock_exams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  exam_id UUID REFERENCES public.exams(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  exam_stage TEXT NOT NULL CHECK (exam_stage IN ('prelims', 'mains')),
  attended_at DATE NOT NULL,
  marks_obtained NUMERIC(6,2) NOT NULL CHECK (marks_obtained >= 0),
  maximum_marks NUMERIC(6,2) NOT NULL CHECK (maximum_marks > 0 AND marks_obtained <= maximum_marks),
  duration_seconds INTEGER CHECK (duration_seconds IS NULL OR duration_seconds >= 0),
  total_questions INTEGER,
  attempted_questions INTEGER,
  correct_answers INTEGER,
  weak_areas TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 10. MOCK_EXAM_SUBJECT_SCORES TABLE
CREATE TABLE IF NOT EXISTS public.mock_exam_subject_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  mock_exam_id UUID NOT NULL REFERENCES public.mock_exams(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE RESTRICT,
  marks_obtained NUMERIC(6,2) NOT NULL CHECK (marks_obtained >= 0),
  maximum_marks NUMERIC(6,2) NOT NULL CHECK (maximum_marks > 0 AND marks_obtained <= maximum_marks),
  attempted_questions INTEGER,
  correct_answers INTEGER,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 11. EXAM_EVENTS TABLE
CREATE TABLE IF NOT EXISTS public.exam_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  exam_id UUID REFERENCES public.exams(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('exam_date', 'application_open', 'application_deadline', 'admit_card', 'result', 'syllabus_deadline', 'other')),
  event_date DATE NOT NULL,
  date_status TEXT NOT NULL DEFAULT 'tentative' CHECK (date_status IN ('tentative', 'confirmed')),
  description TEXT,
  reminder_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_exams_user_id ON public.exams(user_id);
CREATE INDEX IF NOT EXISTS idx_subjects_user_id ON public.subjects(user_id);
CREATE INDEX IF NOT EXISTS idx_topics_user_subject ON public.topics(user_id, subject_id);
CREATE INDEX IF NOT EXISTS idx_topics_status ON public.topics(learning_status);
CREATE INDEX IF NOT EXISTS idx_daily_goals_user_date ON public.daily_goals(user_id, goal_date);
CREATE INDEX IF NOT EXISTS idx_daily_goal_topics_goal ON public.daily_goal_topics(daily_goal_id);
CREATE INDEX IF NOT EXISTS idx_study_sessions_user_date ON public.study_sessions(user_id, started_at);
CREATE INDEX IF NOT EXISTS idx_mock_exams_user_date ON public.mock_exams(user_id, attended_at);
CREATE INDEX IF NOT EXISTS idx_exam_events_user_date ON public.exam_events(user_id, event_date);

-- ROW LEVEL SECURITY POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_goal_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mock_exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mock_exam_subject_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_events ENABLE ROW LEVEL SECURITY;

-- 1. Profiles RLS
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Helper macro for standard user_id RLS
DO $$
DECLARE
  tbl text;
BEGIN
  FOR tbl IN
    SELECT unnest(ARRAY[
      'exams', 'subjects', 'exam_subjects', 'topics',
      'daily_goals', 'daily_goal_topics', 'study_sessions',
      'mock_exams', 'mock_exam_subject_scores', 'exam_events'
    ])
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS "%s_select_own" ON public.%I;', tbl, tbl);
    EXECUTE format('CREATE POLICY "%s_select_own" ON public.%I FOR SELECT USING (auth.uid() = user_id);', tbl, tbl);

    EXECUTE format('DROP POLICY IF EXISTS "%s_insert_own" ON public.%I;', tbl, tbl);
    EXECUTE format('CREATE POLICY "%s_insert_own" ON public.%I FOR INSERT WITH CHECK (auth.uid() = user_id);', tbl, tbl);

    EXECUTE format('DROP POLICY IF EXISTS "%s_update_own" ON public.%I;', tbl, tbl);
    EXECUTE format('CREATE POLICY "%s_update_own" ON public.%I FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);', tbl, tbl);

    EXECUTE format('DROP POLICY IF EXISTS "%s_delete_own" ON public.%I;', tbl, tbl);
    EXECUTE format('CREATE POLICY "%s_delete_own" ON public.%I FOR DELETE USING (auth.uid() = user_id);', tbl, tbl);
  END LOOP;
END $$;

-- 12. AUTOMATIC PROFILE & DEFAULT SYLLABUS SEED FUNCTION
CREATE OR REPLACE FUNCTION public.seed_user_bank_exam_data(p_user_id UUID)
RETURNS void AS $$
DECLARE
  v_ibps_po UUID;
  v_sbi_po UUID;
  v_ibps_clerk UUID;
  v_sub_reasoning UUID;
  v_sub_quant UUID;
  v_sub_english UUID;
  v_sub_ga UUID;
  v_sub_banking UUID;
BEGIN
  -- Insert Default Exams
  INSERT INTO public.exams (user_id, name, description, display_order)
  VALUES (p_user_id, 'IBPS PO 2026', 'Probationary Officer exam by IBPS', 1)
  RETURNING id INTO v_ibps_po;

  INSERT INTO public.exams (user_id, name, description, display_order)
  VALUES (p_user_id, 'SBI PO 2026', 'Probationary Officer exam by State Bank of India', 2)
  RETURNING id INTO v_sbi_po;

  INSERT INTO public.exams (user_id, name, description, display_order)
  VALUES (p_user_id, 'IBPS Clerk 2026', 'Clerical Cadre recruitment exam', 3)
  RETURNING id INTO v_ibps_clerk;

  -- Insert Core Bank Exam Subjects
  INSERT INTO public.subjects (user_id, name, color, display_order)
  VALUES (p_user_id, 'Reasoning', '#2563eb', 1) RETURNING id INTO v_sub_reasoning;

  INSERT INTO public.subjects (user_id, name, color, display_order)
  VALUES (p_user_id, 'Quantitative Aptitude', '#0891b2', 2) RETURNING id INTO v_sub_quant;

  INSERT INTO public.subjects (user_id, name, color, display_order)
  VALUES (p_user_id, 'English', '#7c3aed', 3) RETURNING id INTO v_sub_english;

  INSERT INTO public.subjects (user_id, name, color, display_order)
  VALUES (p_user_id, 'General Awareness', '#d97706', 4) RETURNING id INTO v_sub_ga;

  INSERT INTO public.subjects (user_id, name, color, display_order)
  VALUES (p_user_id, 'Computer Aptitude', '#059669', 5) RETURNING id INTO v_sub_banking;

  -- Map Subjects to Prelims & Mains Stages for IBPS PO
  INSERT INTO public.exam_subjects (user_id, exam_id, subject_id, stage, display_order) VALUES
  (p_user_id, v_ibps_po, v_sub_reasoning, 'prelims', 1),
  (p_user_id, v_ibps_po, v_sub_quant, 'prelims', 2),
  (p_user_id, v_ibps_po, v_sub_english, 'prelims', 3),
  (p_user_id, v_ibps_po, v_sub_reasoning, 'mains', 1),
  (p_user_id, v_ibps_po, v_sub_quant, 'mains', 2),
  (p_user_id, v_ibps_po, v_sub_english, 'mains', 3),
  (p_user_id, v_ibps_po, v_sub_ga, 'mains', 4),
  (p_user_id, v_ibps_po, v_sub_banking, 'mains', 5);

  -- Map for SBI PO
  INSERT INTO public.exam_subjects (user_id, exam_id, subject_id, stage, display_order) VALUES
  (p_user_id, v_sbi_po, v_sub_reasoning, 'prelims', 1),
  (p_user_id, v_sbi_po, v_sub_quant, 'prelims', 2),
  (p_user_id, v_sbi_po, v_sub_english, 'prelims', 3),
  (p_user_id, v_sbi_po, v_sub_reasoning, 'mains', 1),
  (p_user_id, v_sbi_po, v_sub_quant, 'mains', 2),
  (p_user_id, v_sbi_po, v_sub_english, 'mains', 3),
  (p_user_id, v_sbi_po, v_sub_ga, 'mains', 4),
  (p_user_id, v_sbi_po, v_sub_banking, 'mains', 5);

  -- Map for IBPS Clerk
  INSERT INTO public.exam_subjects (user_id, exam_id, subject_id, stage, display_order) VALUES
  (p_user_id, v_ibps_clerk, v_sub_reasoning, 'prelims', 1),
  (p_user_id, v_ibps_clerk, v_sub_quant, 'prelims', 2),
  (p_user_id, v_ibps_clerk, v_sub_english, 'prelims', 3),
  (p_user_id, v_ibps_clerk, v_sub_reasoning, 'mains', 1),
  (p_user_id, v_ibps_clerk, v_sub_quant, 'mains', 2),
  (p_user_id, v_ibps_clerk, v_sub_english, 'mains', 3),
  (p_user_id, v_ibps_clerk, v_sub_ga, 'mains', 4),
  (p_user_id, v_ibps_clerk, v_sub_banking, 'mains', 5);

    -- Seed Reasoning Topics
  INSERT INTO public.topics (user_id, subject_id, name, description, priority, learning_status, display_order) VALUES
  (p_user_id, v_sub_reasoning, 'Puzzle', 'Floor, Box, Day & Month based puzzles', 'high', 'not_started', 1),
  (p_user_id, v_sub_reasoning, 'Seating Arrangement', 'Circular, Linear, Square, Inside/Outside', 'high', 'not_started', 2),
  (p_user_id, v_sub_reasoning, 'Direction Sense', 'Distance and direction based problems', 'medium', 'not_started', 3),
  (p_user_id, v_sub_reasoning, 'Blood Relation', 'Family tree and coded relations', 'medium', 'not_started', 4),
  (p_user_id, v_sub_reasoning, 'Syllogism', 'Statement and conclusions, Only a few cases', 'high', 'not_started', 5),
  (p_user_id, v_sub_reasoning, 'Order and Ranking', 'Position based ranking', 'low', 'not_started', 6),
  (p_user_id, v_sub_reasoning, 'Coding-Decoding', 'Fictitious language, conditional coding', 'medium', 'not_started', 7),
  (p_user_id, v_sub_reasoning, 'Machine Input-Output', 'Pattern shifts for Mains stage', 'high', 'not_started', 8),
  (p_user_id, v_sub_reasoning, 'Inequalities', 'Mathematical statements, Coded inequalities', 'medium', 'not_started', 9),
  (p_user_id, v_sub_reasoning, 'Alpha-Numeric-Symbol Series', 'Series operations', 'low', 'not_started', 10),
  (p_user_id, v_sub_reasoning, 'Data Sufficiency', 'Determining if data is sufficient', 'high', 'not_started', 11),
  (p_user_id, v_sub_reasoning, 'Logical Reasoning', 'Inference, Statement & Assumption, Argument', 'high', 'not_started', 12);

  -- Seed Quantitative Aptitude Topics
  INSERT INTO public.topics (user_id, subject_id, name, description, priority, learning_status, display_order) VALUES
  (p_user_id, v_sub_quant, 'Number Series', 'Missing and Wrong number series', 'high', 'not_started', 1),
  (p_user_id, v_sub_quant, 'Simplification & Approximation', 'BODMAS, basic calculations', 'high', 'not_started', 2),
  (p_user_id, v_sub_quant, 'Ratio & Proportion, Partnership', 'Basic ratio and business partnership', 'medium', 'not_started', 3),
  (p_user_id, v_sub_quant, 'Percentage', 'Fractions to percentage conversion', 'high', 'not_started', 4),
  (p_user_id, v_sub_quant, 'Mixtures & Allegations', 'Mixture replacements', 'medium', 'not_started', 5),
  (p_user_id, v_sub_quant, 'Average & Ages', 'Age relations and average concepts', 'medium', 'not_started', 6),
  (p_user_id, v_sub_quant, 'Profit & Loss', 'Discount, Markup, Successive discount', 'high', 'not_started', 7),
  (p_user_id, v_sub_quant, 'Time and work & Pipe and cistern', 'Efficiency based problems', 'high', 'not_started', 8),
  (p_user_id, v_sub_quant, 'Simple Interest & Compound Interest', 'Interest calculation and differences', 'medium', 'not_started', 9),
  (p_user_id, v_sub_quant, 'Time & Distance, Boat & stream', 'Relative speed, upstream/downstream', 'high', 'not_started', 10),
  (p_user_id, v_sub_quant, 'Permutation, Combination & Probability', 'Arrangements and event probability', 'medium', 'not_started', 11),
  (p_user_id, v_sub_quant, 'Mensuration (2D & 3D)', 'Area and volume formulas', 'low', 'not_started', 12),
  (p_user_id, v_sub_quant, 'Data Interpretation', 'Bar, line, pie, mixed, missing DI', 'high', 'not_started', 13),
  (p_user_id, v_sub_quant, 'Caselet DI', 'Paragraph based data interpretation', 'high', 'not_started', 14),
  (p_user_id, v_sub_quant, 'Quadratic Equation', 'Finding and comparing roots', 'high', 'not_started', 15);

  -- Seed English Language Topics
  INSERT INTO public.topics (user_id, subject_id, name, description, priority, learning_status, display_order) VALUES
  (p_user_id, v_sub_english, 'Reading Comprehension', 'Passage reading and fact finding', 'high', 'not_started', 1),
  (p_user_id, v_sub_english, 'Cloze Test', 'Fill in the blanks in a passage', 'high', 'not_started', 2),
  (p_user_id, v_sub_english, 'Fillers', 'Single and double fillers', 'medium', 'not_started', 3),
  (p_user_id, v_sub_english, 'Sentence Errors', 'Grammar and error detection', 'high', 'not_started', 4),
  (p_user_id, v_sub_english, 'Vocabulary based questions', 'Synonyms, antonyms, word usage', 'medium', 'not_started', 5),
  (p_user_id, v_sub_english, 'Sentence Improvement', 'Correcting phrases and sentences', 'medium', 'not_started', 6),
  (p_user_id, v_sub_english, 'Jumbled Paragraph', 'Rearranging sentences', 'high', 'not_started', 7),
  (p_user_id, v_sub_english, 'Paragraph Based Questions', 'Fillers, Conclusion, Restatement', 'high', 'not_started', 8);

  -- Seed General Awareness Topics
  INSERT INTO public.topics (user_id, subject_id, name, description, priority, learning_status, display_order) VALUES
  (p_user_id, v_sub_ga, 'Banking and Financial Awareness', 'RBI, monetary policy, banking terms', 'high', 'not_started', 1),
  (p_user_id, v_sub_ga, 'Current Affairs', 'National and international news (Last 6 Months)', 'high', 'not_started', 2),
  (p_user_id, v_sub_ga, 'Static GK', 'National Parks, Dams, Capitals', 'medium', 'not_started', 3);

  -- Seed Computer Aptitude Topics (Reusing Banking Awareness Subject)
  INSERT INTO public.topics (user_id, subject_id, name, description, priority, learning_status, display_order) VALUES
  (p_user_id, v_sub_banking, 'Internet & Networking', 'Web, topologies, network protocols', 'medium', 'not_started', 1),
  (p_user_id, v_sub_banking, 'Memory & Hardware', 'RAM, ROM, Storage devices', 'medium', 'not_started', 2),
  (p_user_id, v_sub_banking, 'Keyboard Shortcuts & Abbreviations', 'Common shortcuts and IT acronyms', 'high', 'not_started', 3),
  (p_user_id, v_sub_banking, 'Microsoft Office', 'Word, Excel, PowerPoint basics', 'high', 'not_started', 4),
  (p_user_id, v_sub_banking, 'Computer Software & OS', 'Types of software, OS concepts', 'medium', 'not_started', 5),
  (p_user_id, v_sub_banking, 'Computer Fundamentals & Number System', 'Generations, Binary conversions', 'low', 'not_started', 6),
  (p_user_id, v_sub_banking, 'Basic of Logic Gates', 'AND, OR, NOT, NAND, NOR gates', 'low', 'not_started', 7);

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile and seed bank exam data on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, timezone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    'Asia/Kolkata'
  );

  -- Automatically seed Indian bank exam catalog for the new user
  PERFORM public.seed_user_bank_exam_data(NEW.id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
