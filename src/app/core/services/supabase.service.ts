import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private client: SupabaseClient | null = null;
  public readonly isRealSupabaseConfigured: boolean;

  constructor() {
    this.isRealSupabaseConfigured =
      !!environment.supabaseUrl &&
      !environment.supabaseUrl.includes('placeholder') &&
      !!environment.supabaseAnonKey &&
      !environment.supabaseAnonKey.includes('placeholder');

    if (this.isRealSupabaseConfigured) {
      try {
        this.client = createClient(environment.supabaseUrl, environment.supabaseAnonKey, {
          auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true,
          }
        });
      } catch (err) {
        console.error('Failed to initialize Supabase client:', err);
      }
    } else {
      console.warn(
        'PrepTrack: Running with placeholder Supabase credentials. ' +
        'Update src/environments/environment.ts or provide your SUPABASE_URL and SUPABASE_ANON_KEY to sync with your database.'
      );
    }
  }

  get clientInstance(): SupabaseClient {
    if (!this.client) {
      // In case user hasn't configured real credentials yet, create a client with dummy values so calls don't crash
      this.client = createClient(
        environment.supabaseUrl || 'https://placeholder.supabase.co',
        environment.supabaseAnonKey || 'placeholder-key',
        {
          auth: { persistSession: true, autoRefreshToken: false }
        }
      );
    }
    return this.client;
  }
}
