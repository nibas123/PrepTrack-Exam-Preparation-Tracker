import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';
import { LoginComponent } from './features/auth/login.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { SyllabusComponent } from './features/syllabus/syllabus.component';
import { DailyGoalsComponent } from './features/daily-goals/daily-goals.component';
import { StudySessionsComponent } from './features/study-sessions/study-sessions.component';
import { MockExamsComponent } from './features/mock-exams/mock-exams.component';
import { ExamCalendarComponent } from './features/exam-calendar/exam-calendar.component';
import { QuizzesComponent } from './features/quizzes/quizzes.component';
import { GrowthStatsComponent } from './features/growth-stats/growth-stats.component';
import { SettingsComponent } from './features/settings/settings.component';
import { AdminComponent } from './features/admin/admin.component';
import { KeralaHcaComponent } from './features/kerala-hca/kerala-hca.component';
import { StudyLibraryComponent } from './features/study-library/study-library.component';
import { DescriptiveLabComponent } from './features/descriptive-lab/descriptive-lab.component';
import { RevisionComponent } from './features/revision/revision.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'kerala-high-court', component: KeralaHcaComponent, canActivate: [authGuard] },
  { path: 'study-library', component: StudyLibraryComponent, canActivate: [authGuard] },
  { path: 'descriptive-lab', component: DescriptiveLabComponent, canActivate: [authGuard] },
  { path: 'revision', component: RevisionComponent, canActivate: [authGuard] },
  { path: 'syllabus', component: SyllabusComponent, canActivate: [authGuard] },
  { path: 'daily-goals', component: DailyGoalsComponent, canActivate: [authGuard] },
  { path: 'study-sessions', component: StudySessionsComponent, canActivate: [authGuard] },
  { path: 'mock-exams', component: MockExamsComponent, canActivate: [authGuard] },
  { path: 'exam-calendar', component: ExamCalendarComponent, canActivate: [authGuard] },
  { path: 'quizzes', component: QuizzesComponent, canActivate: [authGuard] },
  { path: 'growth-stats', component: GrowthStatsComponent, canActivate: [authGuard] },
  { path: 'settings', component: SettingsComponent, canActivate: [authGuard] },
  { path: 'admin', component: AdminComponent, canActivate: [authGuard, adminGuard] },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'dashboard' },
];
