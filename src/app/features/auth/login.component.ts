import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <!-- Logo -->
        <div class="w-14 h-14 mx-auto rounded-2xl bg-brand-600 flex items-center justify-center text-white shadow-lg shadow-brand-500/25 mb-4">
          <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>

        <h2 class="text-3xl font-extrabold text-slate-900 tracking-tight">
          Prep<span class="text-brand-600">Track</span>
        </h2>
        <p class="mt-2 text-sm text-slate-600">
          Indian Bank Exam Preparation Tracker (IBPS PO, SBI PO, Clerk)
        </p>
      </div>

      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div class="bg-white py-8 px-6 shadow-sm border border-slate-200/90 rounded-2xl sm:px-10">
          <!-- Auth Mode Tabs -->
          <div class="flex border-b border-slate-100 mb-6">
            <button
              type="button"
              (click)="isSignUp.set(false)"
              class="flex-1 pb-3 text-sm font-semibold text-center border-b-2 transition-colors"
              [ngClass]="!isSignUp() ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-400 hover:text-slate-600'"
            >
              Sign In
            </button>
            <button
              type="button"
              (click)="isSignUp.set(true)"
              class="flex-1 pb-3 text-sm font-semibold text-center border-b-2 transition-colors"
              [ngClass]="isSignUp() ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-400 hover:text-slate-600'"
            >
              Create Account
            </button>
          </div>

          <!-- Form -->
          <form [formGroup]="authForm" (ngSubmit)="onSubmit()" class="space-y-4">
            @if (isSignUp()) {
              <div>
                <label for="fullName" class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  formControlName="fullName"
                  placeholder="e.g. Rahul Sharma"
                  class="input-field"
                />
                @if (authForm.get('fullName')?.touched && authForm.get('fullName')?.invalid) {
                  <p class="mt-1 text-xs text-rose-600">Please enter your name</p>
                }
              </div>
            }

            <div>
              <label for="email" class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                formControlName="email"
                placeholder="aspirant@example.com"
                class="input-field"
              />
              @if (authForm.get('email')?.touched && authForm.get('email')?.invalid) {
                <p class="mt-1 text-xs text-rose-600">Please enter a valid email address</p>
              }
            </div>

            <div>
              <label for="password" class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                formControlName="password"
                placeholder="••••••••"
                class="input-field"
              />
              @if (authForm.get('password')?.touched && authForm.get('password')?.invalid) {
                <p class="mt-1 text-xs text-rose-600">Password must be at least 6 characters</p>
              }
            </div>

            <button
              type="submit"
              [disabled]="authForm.invalid || authService.isLoading()"
              class="w-full btn-primary py-2.5 mt-2 text-sm font-semibold"
            >
              @if (authService.isLoading()) {
                <span class="inline-flex items-center">
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              } @else {
                <span>{{ isSignUp() ? 'Register & Seed Syllabus' : 'Sign In to Dashboard' }}</span>
              }
            </button>
          </form>

          <!-- Divider -->
          <div class="relative my-6">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-slate-200"></div>
            </div>
            <div class="relative flex justify-center text-xs uppercase">
              <span class="bg-white px-2 text-slate-400 font-semibold tracking-wider">Fast Evaluation</span>
            </div>
          </div>

          <!-- Quick Demo Login Button -->
          <button
            type="button"
            (click)="quickDemoLogin()"
            class="w-full btn-secondary py-2.5 text-xs font-semibold text-slate-700 flex items-center justify-center space-x-2"
          >
            <svg class="w-4 h-4 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>Quick Login as Demo Aspirant</span>
          </button>
        </div>

        <!-- Security / Architecture notice -->
        <p class="text-center text-xs text-slate-400 mt-6">
          Protected by Supabase Auth with Row Level Security (RLS).
        </p>
      </div>
    </div>
  `
})
export class LoginComponent {
  public authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  public isSignUp = signal<boolean>(false);

  public authForm: FormGroup = this.fb.group({
    email: ['aspirant@preptrack.in', [Validators.required, Validators.email]],
    password: ['password123', [Validators.required, Validators.minLength(6)]],
    fullName: ['Rahul Sharma', []]
  });

  async onSubmit(): Promise<void> {
    if (this.authForm.invalid) return;

    const { email, password, fullName } = this.authForm.value;

    if (this.isSignUp()) {
      await this.authService.signUp(email, password, fullName || 'Bank Aspirant');
    } else {
      await this.authService.signIn(email, password);
    }
  }

  async quickDemoLogin(): Promise<void> {
    await this.authService.signIn('aspirant@preptrack.in', 'password123');
  }
}
