import { Injectable, signal } from '@angular/core';
import { DashboardWidgetConfig } from '../models/database.types';

const DEFAULT_CONFIG: DashboardWidgetConfig = {
  showNextExamBanner: true,
  showSyllabusCard: true,
  showTodayPlanCard: true,
  showStudyTimeCard: true,
  showMockExamCard: true,
  showSubjectProgress: true,
  showTodayChecklist: true,
  showWeeklyTrend: true,
  showUpcomingDeadlines: true,
};

@Injectable({
  providedIn: 'root'
})
export class WidgetConfigService {
  private configSignal = signal<DashboardWidgetConfig>(this.loadConfig());
  public readonly config = this.configSignal.asReadonly();

  private loadConfig(): DashboardWidgetConfig {
    try {
      const saved = localStorage.getItem('preptrack_dashboard_widgets');
      if (saved) return { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
    } catch {}
    return DEFAULT_CONFIG;
  }

  public updateConfig(newConfig: DashboardWidgetConfig): void {
    this.configSignal.set(newConfig);
    try {
      localStorage.setItem('preptrack_dashboard_widgets', JSON.stringify(newConfig));
    } catch (e) {
      console.error('Failed to save widget config:', e);
    }
  }

  public toggleWidget(key: keyof DashboardWidgetConfig): void {
    const current = this.configSignal();
    const updated = { ...current, [key]: !current[key] };
    this.updateConfig(updated);
  }

  public resetToDefaults(): void {
    this.updateConfig(DEFAULT_CONFIG);
  }
}
