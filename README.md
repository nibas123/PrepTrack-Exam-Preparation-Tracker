# PrepTrack — Indian Bank Exam Preparation Tracker

**PrepTrack** is a production-ready, data-driven web application tailored for candidates preparing for Indian banking examinations such as **IBPS PO, IBPS Clerk, SBI PO, and SBI Clerk**.

Built with **Angular 21 (Standalone Components, Signals)**, **Tailwind CSS**, and **Supabase (PostgreSQL + Auth + Row Level Security)**.

---

## 🚀 Key Features

### 1. Dynamic Preparation Dashboard
- **Syllabus Mastery**: Live calculated completion percentage, completed vs remaining topic counters.
- **Stage Switching**: Dynamic toggle between **Prelims (3 subjects)** and **Mains (5 subjects)** with no double-counting.
- **Today's Plan**: Interactive checklist with instant status updates and completion sync.
- **Study Time Today**: Track hours logged against the daily 4-hour target.
- **Mock Exam Snapshot**: Total attempts, per-attempt percentage averages, and best score.
- **Milestone Countdown**: Chronologically sorted upcoming exams and deadlines with prominent countdown banners.
- **7-Day Trend**: Visual bar graph of daily study hours.

### 2. My Syllabus Management
- Comprehensive topic catalog pre-seeded for:
  - **Reasoning**: Puzzles, Seating Arrangement, Syllogisms, Inequalities, Blood Relations, Coding-Decoding, etc.
  - **Quantitative Aptitude**: Simplification, Quadratic Equations, Number Series, DI, Arithmetic Word Problems.
  - **English**: Reading Comprehension, Cloze Test, Error Detection, Para Jumbles.
  - **General Awareness**: Current Affairs, Banking & Financial News, Government Schemes, Static GK.
  - **Banking Awareness**: RBI Structure, Monetary Policy, PSL Targets, NPA & IBC, Digital Banking.
- Four distinct learning statuses: `Not Started`, `Learning`, `Learned`, `Revision Completed` (*Learned and Revision Completed contribute to completed progress*).
- Custom subject creation with colored tags.
- Priority tagging (`High`, `Medium`, `Low`), target dates, search, and filtering.

### 3. Daily Goals & Checklist
- Plan target topics and study hour goals for any date.
- Choose topics directly from syllabus subjects.
- Single-click **"Carry Forward Yesterday's Unfinished"** feature that preserves historical records while scheduling pending tasks into today.
- Historical outcome tracking (`Target Achieved`, `In Progress`, `Pending`).

### 4. Timestamp-Resilient Study Sessions & Stopwatch
- Digital stopwatch with **Start**, **Pause**, **Resume**, **Finish**, and **Discard** controls.
- **Resilient**: Elapsed time is computed directly from timestamps (`startedAtTimestamp` and `accumulatedSeconds`). Page refreshes, background tabs, or browser restarts will never lose running state or distort duration.
- Manual session logging with subject, topic, duration, and notes.
- Historical log table with subject filtering and deletion.

### 5. Mock Exam Tracking & Analytics
- Log test name, stage (`Prelims` / `Mains`), date, marks obtained, and maximum marks.
- Validation: Marks obtained cannot be negative or exceed maximum marks.
- Automatic calculations:
  - Per-attempt percentage calculated first, then averaged across attempts.
  - Best score percentage.
  - Accuracy percentage based on attempted and correct questions.
- Sequential visual progression bar chart.
- Weak areas notes and tactical feedback.

### 6. Exam Calendar & Milestones
- Add official exam dates, application opening dates, deadlines, admit card releases, and personal goals.
- Precise countdown calculator (`Today!`, `X days left`, `Past`).
- Date status indicator (`Confirmed` vs `Tentative`).

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | Angular 21 (Standalone Components, Signals, Reactive Forms) |
| **Styling** | Tailwind CSS v3 |
| **Database** | Supabase PostgreSQL |
| **Authentication** | Supabase Auth (Email & Password, Session Persistence) |
| **Database Security**| PostgreSQL Row Level Security (RLS) on all user-owned tables |
| **Build Tooling** | Angular CLI 21 + Vite / esbuild |
| **Unit Testing** | Vitest |

---

## 📂 Project Directory Structure

```
src/
├── app/
│   ├── core/
│   │   ├── auth/
│   │   │   ├── auth.service.ts         # Supabase Auth & session manager
│   │   │   └── auth.guard.ts           # Route guard protecting private routes
│   │   ├── models/
│   │   │   └── database.types.ts       # Typed TypeScript interfaces & enums
│   │   └── services/
│   │       ├── supabase.service.ts     # Supabase client initializer & config status
│   │       ├── data-storage.service.ts # Unified data storage & PostgreSQL queries
│   │       ├── timer.service.ts        # Timestamp-resilient stopwatch engine
│   │       ├── analytics.service.ts    # Dashboard metrics & progress calculator
│   │       └── toast.service.ts        # Toast notifications service
│   ├── shared/
│   │   └── components/
│   │       ├── navbar/                 # Responsive header with timer pill
│   │       ├── sidebar/                # Collapsible desktop & mobile drawer
│   │       ├── stat-card/              # Reusable metric card
│   │       ├── progress-bar/           # Animated progress bar
│   │       └── toast-container/        # Toast alerts overlay
│   └── features/
│       ├── auth/login.component.ts     # Login & Account Registration
│       ├── dashboard/dashboard.component.ts
│       ├── syllabus/syllabus.component.ts
│       ├── daily-goals/daily-goals.component.ts
│       ├── study-sessions/study-sessions.component.ts
│       ├── mock-exams/mock-exams.component.ts
│       ├── exam-calendar/exam-calendar.component.ts
│       └── settings/settings.component.ts
├── environments/
│   ├── environment.ts                  # Production Supabase credentials
│   └── environment.development.ts      # Local development configuration
└── styles.css                          # Tailwind directives & design system utilities
supabase/
└── migrations/
    └── 20261010_initial_schema.sql     # Full PostgreSQL schema with RLS & triggers
```

---

## 🗄️ Supabase PostgreSQL Setup & Migrations

### 1. Create a Supabase Project
1. Log in to [Supabase](https://supabase.com) and click **"New Project"**.
2. Give your project a name (e.g. `preptrack-db`) and select your closest region (e.g. `ap-south-1` Mumbai).

### 2. Run Database Migration Script
1. In the Supabase Dashboard, navigate to the **SQL Editor**.
2. Open [`supabase/migrations/20261010_initial_schema.sql`](file:///c:/Users/USER/Downloads/bankoo/supabase/migrations/20261010_initial_schema.sql).
3. Copy and run the entire script.

#### What the Migration Script Configures:
- Creates all 11 normalized tables: `profiles`, `exams`, `subjects`, `exam_subjects`, `topics`, `daily_goals`, `daily_goal_topics`, `study_sessions`, `mock_exams`, `mock_exam_subject_scores`, `exam_events`.
- Enforces foreign keys with cascade deletions where appropriate.
- Enables **Row Level Security (RLS)** on every table, with policies ensuring authenticated users can only access their own rows (`auth.uid() = user_id`).
- Creates a database trigger `on_auth_user_created` that automatically provisions the candidate's profile and seeds the default bank exam catalog (Reasoning, Quant, English, GA, Banking Awareness) upon signup!

### 3. Configure Frontend Environment Variables
1. In the Supabase dashboard, go to **Project Settings** -> **API**.
2. Copy your **Project URL** and **anon public key**.
3. Update `src/environments/environment.ts` and `src/environments/environment.development.ts`:

```typescript
export const environment = {
  production: true,
  supabaseUrl: 'https://your-project-id.supabase.co',
  supabaseAnonKey: 'your-actual-anon-key-here',
};
```

*(Never commit your secret `service_role` key to frontend code).*

---

## 💻 Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm start
```
The application will launch at `http://localhost:4200/`.

> **Note on Instant Evaluation:**
> PrepTrack is built with a seamless demo fallback. If you start the app before configuring your external Supabase keys, you can click **"Quick Login as Demo Aspirant"** on the login screen to immediately test all features with persistent local storage and sample data. Once you plug in your Supabase credentials, it communicates directly with your remote database.

### 3. Run Unit Tests
```bash
npm test
```
Runs the automated test suite with Vitest.

### 4. Build for Production
```bash
npm run build
```
Creates an optimized, tree-shaken static production bundle in `dist/preptrack/`.

---

## 🌐 Deployment Guide

### Deploying to Netlify
1. Connect your repository to Netlify.
2. Build Settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist/preptrack/browser` (or `dist/preptrack`)
3. Single Page Application (SPA) Routing:
   Create a `public/_redirects` file with:
   ```text
   /*    /index.html   200
   ```
4. Set Environment Variables in Netlify Dashboard:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`

### Deploying to Vercel
1. Import repository into Vercel.
2. Framework Preset: **Angular**.
3. Output Directory: `dist/preptrack/browser`.
4. Configure SPA rewrite in `vercel.json`:
   ```json
   {
     "rewrites": [
       { "source": "/(.*)", "destination": "/index.html" }
     ]
   }
   ```
5. Deploy.
