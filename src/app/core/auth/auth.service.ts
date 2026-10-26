import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { User, Session } from '@supabase/supabase-js';
import { SupabaseService } from '../services/supabase.service';
import { ToastService } from '../services/toast.service';
import { Profile } from '../models/database.types';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabaseService = inject(SupabaseService);
  private toast = inject(ToastService);
  private router = inject(Router);

  private currentUserSignal = signal<User | null>(null);
  private currentProfileSignal = signal<Profile | null>(null);
  private isLoadingSignal = signal<boolean>(true);

  public static readonly ADMIN_EMAIL = 'nibasnazeem@gmail.com';

  public readonly currentUser = this.currentUserSignal.asReadonly();
  public readonly currentProfile = this.currentProfileSignal.asReadonly();
  public readonly isLoading = this.isLoadingSignal.asReadonly();
  public readonly isAuthenticated = computed(() => !!this.currentUserSignal());
  public readonly isAdmin = computed(() => {
    const user = this.currentUserSignal();
    const userEmail = user?.email?.toLowerCase().trim();
    if (userEmail === AuthService.ADMIN_EMAIL) return true;
    const localEmail = localStorage.getItem('preptrack_user_email')?.toLowerCase().trim();
    return localEmail === AuthService.ADMIN_EMAIL;
  });
  private authInitPromise: Promise<void>;

  constructor() {
    this.authInitPromise = this.initializeAuth();
  }

  public async waitForAuthInit(): Promise<void> {
    await this.authInitPromise;
  }

  private async initializeAuth(): Promise<void> {
    if (!this.supabaseService.isRealSupabaseConfigured) {
      this.isLoadingSignal.set(false);
      return;
    }

    try {
      const client = this.supabaseService.clientInstance;
      const { data: { session } } = await client.auth.getSession();
      if (session?.user) {
        this.currentUserSignal.set(session.user);
        await this.loadProfile(session.user.id);
      }

      client.auth.onAuthStateChange(async (_event, session) => {
        if (session?.user) {
          this.currentUserSignal.set(session.user);
          await this.loadProfile(session.user.id);
        } else {
          this.currentUserSignal.set(null);
          this.currentProfileSignal.set(null);
        }
      });
    } catch (err) {
      console.error('Error initializing auth session:', err);
    } finally {
      this.isLoadingSignal.set(false);
    }
  }

  public async loadProfile(userId: string): Promise<void> {
    if (!this.supabaseService.isRealSupabaseConfigured) return;

    try {
      const { data, error } = await this.supabaseService.clientInstance
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (data && !error) {
        this.currentProfileSignal.set(data as Profile);
      }
    } catch (err) {
      console.error('Failed to load user profile:', err);
    }
  }

  async signIn(email: string, password: string): Promise<boolean> {
    this.isLoadingSignal.set(true);

    if (!this.supabaseService.isRealSupabaseConfigured) {
      this.isLoadingSignal.set(false);
      this.toast.error('Supabase is not configured.');
      return false;
    }

    try {
      const { data, error } = await this.supabaseService.clientInstance.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        this.toast.error(error.message, 'Login Failed');
        return false;
      }

      if (data.user) {
        if (data.user.email) {
          localStorage.setItem('preptrack_user_email', data.user.email);
        }
        this.currentUserSignal.set(data.user);
        await this.loadProfile(data.user.id);
        this.toast.success('Signed in successfully');
        this.router.navigate(['/dashboard']);
        return true;
      }
      return false;
    } catch (err: any) {
      this.toast.error(err.message || 'An unexpected error occurred during login');
      return false;
    } finally {
      this.isLoadingSignal.set(false);
    }
  }

  async signUp(email: string, password: string, fullName: string): Promise<boolean> {
    this.isLoadingSignal.set(true);

    if (!this.supabaseService.isRealSupabaseConfigured) {
      this.isLoadingSignal.set(false);
      this.toast.error('Supabase is not configured.');
      return false;
    }

    try {
      const { data, error } = await this.supabaseService.clientInstance.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      });

      if (error) {
        if (error.message.includes('Database error saving new user')) {
          this.toast.error('Database setup required: Please run fix_signup_database_error.sql in your Supabase SQL Editor.', 'Registration Failed');
        } else {
          this.toast.error(error.message, 'Registration Failed');
        }
        return false;
      }

      if (data.user) {
        this.toast.success('Account created! Please check your email or log in.');
        this.currentUserSignal.set(data.user);
        await this.loadProfile(data.user.id);
        this.router.navigate(['/dashboard']);
        return true;
      }
      return false;
    } catch (err: any) {
      this.toast.error(err.message || 'An unexpected error occurred during sign up');
      return false;
    } finally {
      this.isLoadingSignal.set(false);
    }
  }

  async signOut(): Promise<void> {
    if (!this.supabaseService.isRealSupabaseConfigured) {
      this.currentUserSignal.set(null);
      this.currentProfileSignal.set(null);
      this.toast.info('Signed out successfully');
      this.router.navigate(['/login']);
      return;
    }

    try {
      // Clear any preptrack local cache to ensure no stale data carries over between users
      Object.keys(localStorage)
        .filter(k => k.startsWith('preptrack_'))
        .forEach(k => localStorage.removeItem(k));

      await this.supabaseService.clientInstance.auth.signOut();
      this.currentUserSignal.set(null);
      this.currentProfileSignal.set(null);
      this.toast.info('Signed out successfully');
      this.router.navigate(['/login']);
    } catch (err: any) {
      this.toast.error(err.message || 'Error signing out');
    }
  }

  async updateProfile(
    displayName: string,
    targetHours: number,
    targetTopics: number,
    examId?: string | null,
    examDate?: string | null,
    examName?: string | null,
    onboardingCompleted?: boolean
  ): Promise<boolean> {
    const user = this.currentUserSignal();
    if (!user) return false;

    const payload: Partial<Profile> = {
      display_name: displayName,
      daily_target_hours: targetHours,
      daily_target_topics: targetTopics,
      ...(examId !== undefined && { target_exam_id: examId }),
      ...(examDate !== undefined && { target_exam_date: examDate }),
      ...(examName !== undefined && { target_exam_name: examName }),
      ...(onboardingCompleted !== undefined && { onboarding_completed: onboardingCompleted }),
      updated_at: new Date().toISOString()
    };

    if (!this.supabaseService.isRealSupabaseConfigured) {
      this.currentProfileSignal.update(p => p ? { ...p, ...payload } : null);
      this.toast.success('Profile updated successfully');
      return true;
    }

    try {
      const { error } = await this.supabaseService.clientInstance
        .from('profiles')
        .update(payload)
        .eq('id', user.id);

      if (error) {
        this.toast.error(error.message, 'Failed to update profile');
        return false;
      }

      await this.loadProfile(user.id);
      this.toast.success('Profile settings saved');
      return true;
    } catch (err: any) {
      this.toast.error(err.message || 'Error updating profile');
      return false;
    }
  }
}
