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
  VALUES (p_user_id, 'Banking Awareness', '#059669', 5) RETURNING id INTO v_sub_banking;

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
  (p_user_id, v_sub_reasoning, 'Puzzles (Floor, Box, Day & Month)', 'High weightage puzzle patterns for Prelims & Mains', 'high', 'learning', 1),
  (p_user_id, v_sub_reasoning, 'Seating Arrangement (Circular & Linear)', 'Facing inside/outside, parallel rows', 'high', 'learning', 2),
  (p_user_id, v_sub_reasoning, 'Syllogism (Only a few cases)', 'Venn diagram technique, reverse syllogism', 'high', 'learned', 3),
  (p_user_id, v_sub_reasoning, 'Blood Relations & Family Tree', 'Coded relations and generation diagrams', 'medium', 'learned', 4),
  (p_user_id, v_sub_reasoning, 'Coding - Decoding', 'Chinese coding, new pattern conditional coding', 'medium', 'not_started', 5),
  (p_user_id, v_sub_reasoning, 'Inequalities (Direct & Coded)', 'Mathematical statements and conclusions', 'high', 'revision_completed', 6),
  (p_user_id, v_sub_reasoning, 'Direction Sense & Distance', 'Pythagoras theorem, coded direction paths', 'low', 'learned', 7),
  (p_user_id, v_sub_reasoning, 'Machine Input - Output', 'Shift and rearrangement steps (Mains focus)', 'medium', 'not_started', 8),
  (p_user_id, v_sub_reasoning, 'Critical & Logical Reasoning', 'Assumptions, course of action, cause & effect', 'medium', 'not_started', 9);

  -- Seed Quantitative Aptitude Topics
  INSERT INTO public.topics (user_id, subject_id, name, description, priority, learning_status, display_order) VALUES
  (p_user_id, v_sub_quant, 'Simplification & Approximation', 'BODMAS, square/cube roots, percentages shortcuts', 'high', 'revision_completed', 1),
  (p_user_id, v_sub_quant, 'Quadratic Equations & Comparisons', 'Sign method for root comparison (x vs y)', 'high', 'learned', 2),
  (p_user_id, v_sub_quant, 'Number Series (Missing & Wrong)', 'Multiplication, difference, alternate patterns', 'high', 'learning', 3),
  (p_user_id, v_sub_quant, 'Data Interpretation (Table, Pie, Bar, Line)', 'Calculation speed and ratio/percentage questions', 'high', 'learning', 4),
  (p_user_id, v_sub_quant, 'Caselet DI & Radar Charts', 'Paragraph and Venn diagram based sets', 'medium', 'not_started', 5),
  (p_user_id, v_sub_quant, 'Arithmetic - Percentage & Profit/Loss', 'Fraction values, discount and markup', 'high', 'learned', 6),
  (p_user_id, v_sub_quant, 'Arithmetic - Simple & Compound Interest', 'Tree method, difference between CI and SI', 'medium', 'not_started', 7),
  (p_user_id, v_sub_quant, 'Arithmetic - Ratio & Mixture Alligation', 'Replacement and ratio balancing formulas', 'medium', 'not_started', 8),
  (p_user_id, v_sub_quant, 'Arithmetic - Time, Work & Pipes/Cisterns', 'Efficiency method and alternate working hours', 'high', 'learning', 9),
  (p_user_id, v_sub_quant, 'Arithmetic - Speed, Distance & Boats', 'Relative speed, upstream & downstream', 'medium', 'not_started', 10);

  -- Seed English Topics
  INSERT INTO public.topics (user_id, subject_id, name, description, priority, learning_status, display_order) VALUES
  (p_user_id, v_sub_english, 'Reading Comprehension', 'Inference, central idea, vocabulary in context', 'high', 'learning', 1),
  (p_user_id, v_sub_english, 'Cloze Test & Blank Fillers', 'Grammar and contextual elimination', 'high', 'learned', 2),
  (p_user_id, v_sub_english, 'Error Detection & Sentence Correction', 'Subject-verb agreement, tenses, prepositions', 'high', 'learned', 3),
  (p_user_id, v_sub_english, 'Para Jumbles & Sentence Rearrangement', 'Mandatory pair identification', 'medium', 'not_started', 4),
  (p_user_id, v_sub_english, 'Phrase Replacement & Idioms', 'Phrasal verbs and common banking idioms', 'medium', 'not_started', 5);

  -- Seed General Awareness Topics
  INSERT INTO public.topics (user_id, subject_id, name, description, priority, learning_status, display_order) VALUES
  (p_user_id, v_sub_ga, 'Monthly Current Affairs (Last 6 Months)', 'National, international, appointments, summits', 'high', 'learning', 1),
  (p_user_id, v_sub_ga, 'Government Schemes & Portfolios', 'PMJDY, PMSBY, PMJJBY, Atal Pension Yojana', 'high', 'not_started', 2),
  (p_user_id, v_sub_ga, 'Static GK (National Parks, Dams, Capitals)', 'Frequent states and geographical facts', 'medium', 'not_started', 3),
  (p_user_id, v_sub_ga, 'Awards, Honours & Sports News', 'Grand Slams, Cricket World Cup, Nobel Prizes', 'low', 'not_started', 4);

  -- Seed Banking Awareness Topics
  INSERT INTO public.topics (user_id, subject_id, name, description, priority, learning_status, display_order) VALUES
  (p_user_id, v_sub_banking, 'RBI Structure & Monetary Policy', 'Repo, Reverse Repo, CRR, SLR, MSF, MPC meeting', 'high', 'learning', 1),
  (p_user_id, v_sub_banking, 'Banking Types & Account Operations', 'Commercial, Small Finance, Payments banks, KYC', 'high', 'not_started', 2),
  (p_user_id, v_sub_banking, 'Priority Sector Lending (PSL) & Targets', 'Agriculture, MSME, Weaker sections targets', 'high', 'not_started', 3),
  (p_user_id, v_sub_banking, 'NPA, SARFAESI Act & IBC 2016', 'SMA categories, asset classification, DRT', 'high', 'not_started', 4),
  (p_user_id, v_sub_banking, 'Digital Payments & Financial Systems', 'UPI, NEFT, RTGS, IMPS, CTS, BBPS, NPCI', 'medium', 'not_started', 5);

  -- Seed upcoming bank exam calendar events
  INSERT INTO public.exam_events (user_id, exam_id, title, event_type, event_date, date_status, description) VALUES
  (p_user_id, v_ibps_po, 'IBPS PO Prelims 2026', 'exam_date', CURRENT_DATE + INTERVAL '45 days', 'tentative', 'Tentative Prelims exam date as per annual calendar'),
  (p_user_id, v_sbi_po, 'SBI PO Notification Release', 'application_open', CURRENT_DATE + INTERVAL '20 days', 'tentative', 'Expected release of SBI PO recruitment notification'),
  (p_user_id, v_ibps_clerk, 'IBPS Clerk Application Deadline', 'application_deadline', CURRENT_DATE + INTERVAL '12 days', 'confirmed', 'Last date to submit online application form');
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
