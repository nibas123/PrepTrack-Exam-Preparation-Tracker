import { Injectable, signal, computed, inject } from '@angular/core';
import { DataStorageService } from './data-storage.service';
import { ToastService } from './toast.service';
import confetti from 'canvas-confetti';

export interface ActiveTimerState {
  subjectId: string;
  topicId: string | null;
  startedAtTimestamp: number;
  accumulatedSeconds: number;
  isRunning: boolean;
  notes?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TimerService {
  private dataStorage = inject(DataStorageService);
  private toast = inject(ToastService);

  private timerStateSignal = signal<ActiveTimerState | null>(null);
  private elapsedSecondsSignal = signal<number>(0);
  private isSavingSignal = signal<boolean>(false);
  private tickerInterval: any = null;

  public readonly activeTimer = this.timerStateSignal.asReadonly();
  public readonly elapsedSeconds = this.elapsedSecondsSignal.asReadonly();
  public readonly isSaving = this.isSavingSignal.asReadonly();
  public readonly isRunning = computed(() => !!this.timerStateSignal()?.isRunning);
  public readonly formattedElapsed = computed(() => {
    const totalSecs = this.elapsedSecondsSignal();
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  });

  constructor() {
    this.restoreTimerState();
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          const current = this.timerStateSignal();
          if (current) {
            this.updateDerivedElapsed(current);
          }
        }
      });
    }
  }

  private restoreTimerState(): void {
    try {
      const saved = localStorage.getItem('preptrack_active_timer');
      if (saved) {
        const state: ActiveTimerState = JSON.parse(saved);
        if (!state || typeof state.startedAtTimestamp !== 'number' || isNaN(state.startedAtTimestamp) || isNaN(state.accumulatedSeconds)) {
          localStorage.removeItem('preptrack_active_timer');
          return;
        }
        this.timerStateSignal.set(state);
        this.updateDerivedElapsed(state);

        if (state.isRunning) {
          this.startTicker();
        }
      }
    } catch (e) {
      localStorage.removeItem('preptrack_active_timer');
    }
  }

  private persistTimerState(state: ActiveTimerState | null): void {
    if (state) {
      localStorage.setItem('preptrack_active_timer', JSON.stringify(state));
    } else {
      localStorage.removeItem('preptrack_active_timer');
    }
  }

  private updateDerivedElapsed(state: ActiveTimerState): void {
    if (!state) {
      this.elapsedSecondsSignal.set(0);
      return;
    }
    const additional = state.isRunning ? Math.max(0, Math.floor((Date.now() - state.startedAtTimestamp) / 1000)) : 0;
    this.elapsedSecondsSignal.set(state.accumulatedSeconds + additional);
  }

  private startTicker(): void {
    if (this.tickerInterval) clearInterval(this.tickerInterval);
    this.tickerInterval = setInterval(() => {
      const current = this.timerStateSignal();
      if (current && current.isRunning) {
        this.updateDerivedElapsed(current);
      }
    }, 1000);
  }

  private stopTicker(): void {
    if (this.tickerInterval) {
      clearInterval(this.tickerInterval);
      this.tickerInterval = null;
    }
  }

  startTimer(subjectId: string, topicId: string | null = null, notes: string = ''): void {
    if (this.timerStateSignal()?.isRunning) {
      this.toast.warning('A study session is already running!');
      return;
    }

    const state: ActiveTimerState = {
      subjectId,
      topicId,
      startedAtTimestamp: Date.now(),
      accumulatedSeconds: 0,
      isRunning: true,
      notes
    };

    this.timerStateSignal.set(state);
    this.persistTimerState(state);
    this.elapsedSecondsSignal.set(0);
    this.startTicker();
    this.toast.info('Study session started. Stay focused!');
  }

  pauseTimer(): void {
    const current = this.timerStateSignal();
    if (!current || !current.isRunning) return;

    const sessionDurationThisRun = Math.max(0, Math.floor((Date.now() - current.startedAtTimestamp) / 1000));
    const updatedState: ActiveTimerState = {
      ...current,
      accumulatedSeconds: current.accumulatedSeconds + sessionDurationThisRun,
      isRunning: false
    };

    this.stopTicker();
    this.timerStateSignal.set(updatedState);
    this.persistTimerState(updatedState);
    this.updateDerivedElapsed(updatedState);
    this.toast.info('Timer paused.');
  }

  resumeTimer(): void {
    const current = this.timerStateSignal();
    if (!current || current.isRunning) return;

    const updatedState: ActiveTimerState = {
      ...current,
      startedAtTimestamp: Date.now(),
      isRunning: true
    };

    this.timerStateSignal.set(updatedState);
    this.persistTimerState(updatedState);
    this.startTicker();
    this.toast.info('Timer resumed.');
  }

  async finishSession(notes: string = ''): Promise<boolean> {
    const current = this.timerStateSignal();
    if (!current || this.isSavingSignal()) return false;

    this.isSavingSignal.set(true);
    this.stopTicker();

    try {
      this.updateDerivedElapsed(current);
      const totalDuration = this.elapsedSecondsSignal();

      if (totalDuration < 5) {
        this.toast.warning('Session was too short (< 5 seconds) and was discarded.');
        this.reset();
        return false;
      }

      const now = new Date();
      const startTime = new Date(now.getTime() - totalDuration * 1000);

      await this.dataStorage.saveStudySession({
        subject_id: current.subjectId,
        topic_id: current.topicId,
        started_at: startTime.toISOString(),
        ended_at: now.toISOString(),
        duration_seconds: totalDuration,
        notes: notes || current.notes || null
      });

      this.toast.success(`Study session recorded: ${this.formatDuration(totalDuration)}!`);
      this.fireCelebration();
      this.reset();
      return true;
    } catch (e: any) {
      this.toast.error(e.message || 'Failed to save study session');
      return false;
    } finally {
      this.isSavingSignal.set(false);
    }
  }

  discardTimer(): void {
    this.stopTicker();
    this.reset();
    this.toast.info('Timer cancelled.');
  }

  private reset(): void {
    this.timerStateSignal.set(null);
    this.elapsedSecondsSignal.set(0);
    this.persistTimerState(null);
  }

  formatDuration(seconds: number): string {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs}h ${mins}m ${secs}s`;
    }
    return `${mins}m ${secs}s`;
  }

  private fireCelebration(): void {
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch {}
  }
}
