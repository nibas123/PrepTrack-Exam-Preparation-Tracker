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

  public readonly currentUser = this.currentUserSignal.asReadonly();
  public readonly currentProfile = this.currentProfileSignal.asReadonly();
  public readonly isLoading = this.isLoadingSignal.asReadonly();
  public readonly isAuthenticated = computed(() => !!this.currentUserSignal());

  constructor() {
    this.initializeAuth();
  }

  private async initializeAuth(): Promise<void> {
    if (!this.supabaseService.isRealSupabaseConfigured) {
      // Local fallback session check
      const savedUser = localStorage.getItem('preptrack_mock_user');
      if (savedUser) {
        try {
          const userObj = JSON.parse(savedUser) as User;
          this.currentUserSignal.set(userObj);
          this.currentProfileSignal.set({
            id: userObj.id,
            display_name: userObj.user_metadata?.['full_name'] || 'Aspirant',
            timezone: 'Asia/Kolkata',
            daily_target_hours: 4.0,
            daily_target_topics: 3,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        } catch {
          localStorage.removeItem('preptrack_mock_user');
        }
      }
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
      // Local demo fallback login
      const mockId = 'demo-user-12345';
      const mockUser: Partial<User> = {
        id: mockId,
        email: email,
        user_metadata: { full_name: email.split('@')[0] || 'Bank Aspirant' },
        app_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      };
      this.currentUserSignal.set(mockUser as User);
      this.currentProfileSignal.set({
        id: mockId,
        display_name: email.split('@')[0] || 'Bank Aspirant',
        timezone: 'Asia/Kolkata',
        daily_target_hours: 4.0,
        daily_target_topics: 3,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      localStorage.setItem('preptrack_mock_user', JSON.stringify(mockUser));
      this.isLoadingSignal.set(false);
      this.toast.success(`Welcome back, ${email.split('@')[0]}!`);
      this.router.navigate(['/dashboard']);
      return true;
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
      const mockId = 'demo-user-12345';
      const mockUser: Partial<User> = {
        id: mockId,
        email: email,
        user_metadata: { full_name: fullName },
        app_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      };
      this.currentUserSignal.set(mockUser as User);
      this.currentProfileSignal.set({
        id: mockId,
        display_name: fullName,
        timezone: 'Asia/Kolkata',
        daily_target_hours: 4.0,
        daily_target_topics: 3,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      localStorage.setItem('preptrack_mock_user', JSON.stringify(mockUser));
      this.isLoadingSignal.set(false);
      this.toast.success('Account created! Default banking syllabus seeded.');
      this.router.navigate(['/dashboard']);
      return true;
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
        this.toast.error(error.message, 'Registration Failed');
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
      localStorage.removeItem('preptrack_mock_user');
      this.currentUserSignal.set(null);
      this.currentProfileSignal.set(null);
      this.toast.info('Signed out successfully');
      this.router.navigate(['/login']);
      return;
    }

    try {
      await this.supabaseService.clientInstance.auth.signOut();
      this.currentUserSignal.set(null);
      this.currentProfileSignal.set(null);
      this.toast.info('Signed out successfully');
      this.router.navigate(['/login']);
    } catch (err: any) {
      this.toast.error(err.message || 'Error signing out');
    }
  }

  async updateProfile(displayName: string, targetHours: number, targetTopics: number): Promise<boolean> {
    const user = this.currentUserSignal();
    if (!user) return false;

    if (!this.supabaseService.isRealSupabaseConfigured) {
      this.currentProfileSignal.update(p => p ? {
        ...p,
        display_name: displayName,
        daily_target_hours: targetHours,
        daily_target_topics: targetTopics
      } : null);
      this.toast.success('Profile updated successfully');
      return true;
    }

    try {
      const { error } = await this.supabaseService.clientInstance
        .from('profiles')
        .update({
          display_name: displayName,
          daily_target_hours: targetHours,
          daily_target_topics: targetTopics,
          updated_at: new Date().toISOString()
        })
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
