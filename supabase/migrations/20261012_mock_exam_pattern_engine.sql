-- ============================================================================
-- Migration: 20261012_mock_exam_pattern_engine.sql
-- Description: Interactive Mock Exam Simulator & Question Pattern Engine Tables
-- ============================================================================

-- 1. Question Patterns Table
CREATE TABLE IF NOT EXISTS public.question_patterns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    subject_code TEXT NOT NULL CHECK (subject_code IN ('quant', 'reasoning', 'english', 'ga', 'computer')),
    topic_name TEXT NOT NULL,
    pattern_code TEXT NOT NULL UNIQUE,
    pattern_type TEXT NOT NULL CHECK (pattern_type IN ('parametric_numeric', 'logic_deduction', 'grammar_cloze', 'puzzle_grid', 'caselet', 'static_mcq')),
    difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
    exam_stage TEXT NOT NULL CHECK (exam_stage IN ('prelims', 'mains', 'both')),
    template_config JSONB DEFAULT '{}'::jsonb,
    explanation_template TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Indexes for question patterns
CREATE INDEX IF NOT EXISTS idx_question_patterns_subject ON public.question_patterns(subject_code);
CREATE INDEX IF NOT EXISTS idx_question_patterns_difficulty ON public.question_patterns(difficulty);
CREATE INDEX IF NOT EXISTS idx_question_patterns_topic ON public.question_patterns(topic_name);

-- 2. Mock Exam Blueprints Table
CREATE TABLE IF NOT EXISTS public.mock_exam_blueprints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    exam_category TEXT NOT NULL CHECK (exam_category IN ('IBPS_PO', 'SBI_PO', 'IBPS_CLERK', 'RRB_PO', 'MIXED_SPRINT')),
    exam_stage TEXT NOT NULL CHECK (exam_stage IN ('prelims', 'mains')),
    total_duration_minutes INTEGER NOT NULL,
    has_sectional_timing BOOLEAN NOT NULL DEFAULT true,
    total_marks NUMERIC(6, 2) NOT NULL DEFAULT 100.0,
    negative_marking NUMERIC(4, 2) NOT NULL DEFAULT 0.25,
    sections_config JSONB NOT NULL DEFAULT '[]'::jsonb,
    target_cutoff NUMERIC(6, 2),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Mock Exam Attempts Table
CREATE TABLE IF NOT EXISTS public.mock_exam_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    blueprint_id TEXT NOT NULL,
    mock_name TEXT NOT NULL,
    exam_stage TEXT NOT NULL CHECK (exam_stage IN ('prelims', 'mains')),
    started_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    completed_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    total_score NUMERIC(6, 2) NOT NULL DEFAULT 0.0,
    maximum_marks NUMERIC(6, 2) NOT NULL DEFAULT 100.0,
    total_questions INTEGER NOT NULL DEFAULT 100,
    attempted_questions INTEGER NOT NULL DEFAULT 0,
    correct_answers INTEGER NOT NULL DEFAULT 0,
    incorrect_answers INTEGER NOT NULL DEFAULT 0,
    accuracy_percentage NUMERIC(5, 2) NOT NULL DEFAULT 0.0,
    percentile_estimate NUMERIC(5, 2),
    time_spent_seconds INTEGER NOT NULL DEFAULT 0,
    cutoff_status TEXT CHECK (cutoff_status IN ('cleared', 'missed')),
    target_cutoff NUMERIC(6, 2),
    section_breakdown JSONB NOT NULL DEFAULT '[]'::jsonb,
    questions_payload JSONB DEFAULT '[]'::jsonb,
    user_responses JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Indexes for mock exam attempts
CREATE INDEX IF NOT EXISTS idx_mock_exam_attempts_user ON public.mock_exam_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_mock_exam_attempts_date ON public.mock_exam_attempts(completed_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.question_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mock_exam_blueprints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mock_exam_attempts ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Question patterns: everyone can view system or their own patterns; users can insert/update their own
CREATE POLICY "Allow public read access to system question patterns"
    ON public.question_patterns FOR SELECT
    USING (user_id IS NULL OR user_id = auth.uid());

CREATE POLICY "Allow users to manage own question patterns"
    ON public.question_patterns FOR ALL
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- Blueprints: read-only for all authenticated users
CREATE POLICY "Allow public read on mock exam blueprints"
    ON public.mock_exam_blueprints FOR SELECT
    USING (true);

-- Attempts: users can only see and manage their own attempts
CREATE POLICY "Users can manage own mock exam attempts"
    ON public.mock_exam_attempts FOR ALL
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());
