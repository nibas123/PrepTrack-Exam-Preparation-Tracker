-- ==============================================================================
-- PREPTRACK: ENHANCEMENT MIGRATION FOR QUIZ ATTEMPTS & ONBOARDING
-- ==============================================================================

-- 1. Extend profiles table with target exam preferences
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS target_exam_id UUID REFERENCES public.exams(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS target_exam_name TEXT,
ADD COLUMN IF NOT EXISTS target_exam_date DATE,
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false;

-- 2. Create quiz_attempts table for personal study ledger
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

-- 3. Row Level Security for quiz_attempts
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'quiz_attempts' AND policyname = 'Users can view their own quiz attempts'
  ) THEN
    CREATE POLICY "Users can view their own quiz attempts"
      ON public.quiz_attempts FOR SELECT
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'quiz_attempts' AND policyname = 'Users can insert their own quiz attempts'
  ) THEN
    CREATE POLICY "Users can insert their own quiz attempts"
      ON public.quiz_attempts FOR INSERT
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'quiz_attempts' AND policyname = 'Users can delete their own quiz attempts'
  ) THEN
    CREATE POLICY "Users can delete their own quiz attempts"
      ON public.quiz_attempts FOR DELETE
      USING (auth.uid() = user_id);
  END IF;
END;
$$;

-- 4. Performance Index
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_created ON public.quiz_attempts(user_id, created_at DESC);
