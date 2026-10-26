import { Injectable, signal, computed } from '@angular/core';
import { ExamTrack } from '../models/database.types';

export interface ExamTrackOption {
  id: ExamTrack;
  label: string;
  shortLabel: string;
  icon: string;
  badge: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class ExamTrackService {
  private readonly STORAGE_KEY = 'preptrack_active_exam_track';

  public readonly trackOptions: ExamTrackOption[] = [
    {
      id: 'bank',
      label: 'Bank Examinations',
      shortLabel: 'Bank Exams',
      icon: 'bank',
      badge: 'IBPS / SBI / RRB',
      description: 'Probationary Officers, Clerical Cadre, RRB Multipurpose & Regulatory examinations.'
    },
    {
      id: 'kerala_hca',
      label: 'Kerala High Court Assistant',
      shortLabel: 'Kerala HCA',
      icon: 'court',
      badge: 'High Court of Kerala',
      description: 'Objective Test (100 M), Descriptive Test (60 M), and Interview / Viva.'
    },
    {
      id: 'all',
      label: 'Combined Overview',
      shortLabel: 'All Exams',
      icon: 'all',
      badge: 'Combined',
      description: 'Unified cross-track overview for candidates appearing in both examinations.'
    }
  ];

  // Active track signal
  public activeTrack = signal<ExamTrack>(this.loadSavedTrack());

  // Computed helpers
  public isKeralaHca = computed(() => this.activeTrack() === 'kerala_hca');
  public isBank = computed(() => this.activeTrack() === 'bank');
  public isAll = computed(() => this.activeTrack() === 'all');

  public currentTrackOption = computed(() => {
    return this.trackOptions.find(t => t.id === this.activeTrack()) || this.trackOptions[0];
  });

  public setTrack(track: ExamTrack): void {
    this.activeTrack.set(track);
    try {
      localStorage.setItem(this.STORAGE_KEY, track);
    } catch (e) {
      console.warn('Failed to save exam track preference:', e);
    }
  }

  private loadSavedTrack(): ExamTrack {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY) as ExamTrack;
      if (saved && (saved === 'all' || saved === 'bank' || saved === 'kerala_hca')) {
        return saved;
      }
    } catch {}
    return 'bank';
  }
}
