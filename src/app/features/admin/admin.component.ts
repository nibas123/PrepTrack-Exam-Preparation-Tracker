import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AiConfigService, GeminiTokenConfig } from '../../core/services/ai-config.service';
import { QuizService } from '../../core/services/quiz.service';
import { QuestionPatternEngineService } from '../../core/services/question-pattern-engine.service';
import { DataStorageService } from '../../core/services/data-storage.service';
import { SupabaseService } from '../../core/services/supabase.service';
import { AuthService } from '../../core/auth/auth.service';
import { ToastService } from '../../core/services/toast.service';
import {
  MockExamBlueprint,
  QuestionPattern,
  QuizQuestion,
  ExamQuestionItem,
  Exam,
  Topic,
  QuizAttempt,
  MockExamAttempt
} from '../../core/models/database.types';

interface StorageKeyReport {
  key: string;
  sizeBytes: number;
  itemCount: number;
  description: string;
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="space-y-6 max-w-6xl mx-auto pb-12">
      <!-- Top Header & Breadcrumbs -->
      <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div class="flex items-center space-x-2">
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200">
              Admin & Diagnostics Console
            </span>
            <span class="text-xs text-slate-400">PrepTrack Engine v2.4</span>
          </div>
          <h2 class="text-xl font-bold text-slate-900 tracking-tight mt-1">Platform Control & Data Monitoring</h2>
          <p class="text-xs text-slate-500 mt-0.5">
            Monitor question banks, inspect algorithmic patterns & exams, and manage Gemini AI tokens in real time.
          </p>
        </div>

        <div class="flex items-center space-x-2 flex-wrap gap-y-2">
          <!-- AI Status Indicator -->
          <div
            class="flex items-center space-x-2 px-3 py-1.5 rounded-xl border text-xs font-semibold"
            [ngClass]="aiConfig.isAiGloballyEnabled() ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-slate-100 border-slate-200 text-slate-600'"
          >
            <span class="w-2 h-2 rounded-full" [ngClass]="aiConfig.isAiGloballyEnabled() ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'"></span>
            <span>Gemini AI: {{ aiConfig.isAiGloballyEnabled() ? 'Enabled' : 'Offline' }}</span>
          </div>

          <button
            type="button"
            (click)="openAiGenModal()"
            class="btn-primary text-xs py-1.5 px-3 font-semibold flex items-center space-x-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-xs"
            title="Generate fresh AI questions with Gemini and save to bank"
          >
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>+ Generate AI Questions</span>
          </button>

          <button
            type="button"
            (click)="refreshAllDiagnostics()"
            [disabled]="isLoading()"
            class="btn-secondary text-xs py-1.5 px-3 flex items-center space-x-1.5"
            title="Reload live diagnostics"
          >
            <svg class="w-3.5 h-3.5" [class.animate-spin]="isLoading()" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Refresh</span>
          </button>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="flex items-center space-x-1 border-b border-slate-200 bg-white p-1 rounded-xl shadow-xs overflow-x-auto text-xs font-semibold">
        <button
          type="button"
          (click)="activeTab.set('dashboard')"
          class="px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 whitespace-nowrap"
          [ngClass]="activeTab() === 'dashboard' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'"
        >
          <span>📊 Overview & AI Telemetry</span>
        </button>

        <button
          type="button"
          (click)="activeTab.set('gemini')"
          class="px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 whitespace-nowrap"
          [ngClass]="activeTab() === 'gemini' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'"
        >
          <span>🤖 Gemini AI & Tokens</span>
        </button>

        <button
          type="button"
          (click)="activeTab.set('bank')"
          class="px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 whitespace-nowrap"
          [ngClass]="activeTab() === 'bank' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'"
        >
          <span>📚 Question Bank & Cache ({{ cachedBank().length }})</span>
        </button>

        <button
          type="button"
          (click)="activeTab.set('patterns')"
          class="px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 whitespace-nowrap"
          [ngClass]="activeTab() === 'patterns' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'"
        >
          <span>⚙️ Exam Blueprints & Patterns ({{ blueprints.length }})</span>
        </button>

        <button
          type="button"
          (click)="activeTab.set('diagnostics')"
          class="px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 whitespace-nowrap"
          [ngClass]="activeTab() === 'diagnostics' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'"
        >
          <span>💾 Storage & System Data</span>
        </button>
      </div>

      <!-- =================================================================== -->
      <!-- TAB 0: DASHBOARD & AI TELEMETRY OVERVIEW -->
      <!-- =================================================================== -->
      @if (activeTab() === 'dashboard') {
        <div class="space-y-6">
          <!-- Top KPI Cards: Total Questions + AI vs Non-AI Split -->
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <!-- Total System Questions -->
            <div class="card p-4 space-y-1">
              <div class="flex items-center justify-between text-slate-500">
                <span class="text-xs font-semibold">Total Platform Questions</span>
                <div class="w-7 h-7 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-xs">
                  📚
                </div>
              </div>
              <p class="text-2xl font-black text-slate-900 font-mono">{{ totalSystemQuestions() }}</p>
              <p class="text-[11px] text-slate-500">Across Bank, Patterns & Blueprints</p>
            </div>

            <!-- AI-Generated Questions -->
            <div class="card p-4 space-y-1 border-indigo-200/80 bg-gradient-to-br from-white to-indigo-50/20">
              <div class="flex items-center justify-between text-slate-500">
                <span class="text-xs font-semibold text-indigo-900">AI-Generated Questions</span>
                <div class="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xs">
                  🤖
                </div>
              </div>
              <p class="text-2xl font-black text-indigo-700 font-mono">{{ aiQuestionsCount() }}</p>
              <div class="flex items-center justify-between text-[11px] text-indigo-600 font-semibold pt-0.5">
                <span>{{ aiPercentage() }}% of pool • Gemini API</span>
                <button
                  type="button"
                  (click)="openAiGenModal()"
                  class="font-bold underline hover:text-indigo-900 transition-colors"
                >
                  + Add AI
                </button>
              </div>
            </div>

            <!-- Algorithmic & Non-AI Questions -->
            <div class="card p-4 space-y-1 border-emerald-200/80 bg-gradient-to-br from-white to-emerald-50/20">
              <div class="flex items-center justify-between text-slate-500">
                <span class="text-xs font-semibold text-emerald-900">Non-AI / Engine Questions</span>
                <div class="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs">
                  ⚡
                </div>
              </div>
              <p class="text-2xl font-black text-emerald-700 font-mono">{{ engineQuestionsCount() }}</p>
              <div class="flex items-center space-x-1.5 text-[11px] text-emerald-600 font-semibold">
                <span>{{ enginePercentage() }}% of active pool</span>
                <span>•</span>
                <span>0 Tokens Used</span>
              </div>
            </div>

            <!-- AI Usage / Tokens Meter -->
            <div class="card p-4 space-y-1">
              <div class="flex items-center justify-between text-slate-500">
                <span class="text-xs font-semibold">AI Tokens Consumed</span>
                <div class="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-xs">
                  🔥
                </div>
              </div>
              <p class="text-2xl font-black text-amber-700 font-mono">{{ telemetry().totalTokensUsed }}</p>
              <div class="flex items-center space-x-1.5 text-[11px] text-slate-500">
                <span>{{ telemetry().totalRequests }} API calls</span>
                <span>•</span>
                <span>{{ telemetry().successfulRequests }} successful</span>
              </div>
            </div>
          </div>

          <!-- Difference & Generation Pipeline Comparison Card -->
          <div class="card p-5 space-y-4">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <h3 class="text-sm font-bold text-slate-900">Question Source Composition & Difference</h3>
                <p class="text-xs text-slate-500">Visual comparison of Gemini AI synthesis vs high-speed deterministic pattern engines</p>
              </div>
              <span class="text-xs font-mono font-bold text-slate-600">
                {{ aiQuestionsCount() }} AI vs {{ engineQuestionsCount() }} Engine
              </span>
            </div>

            <!-- Visual Split Progress Bar -->
            <div class="space-y-1.5">
              <div class="w-full h-3 rounded-full bg-slate-100 overflow-hidden flex">
                <div
                  class="h-full bg-indigo-600 transition-all duration-500 flex items-center justify-center text-[9px] text-white font-bold"
                  [style.width.%]="aiPercentage()"
                  title="AI-Generated: {{ aiQuestionsCount() }} ({{ aiPercentage() }}%)"
                ></div>
                <div
                  class="h-full bg-emerald-500 transition-all duration-500 flex items-center justify-center text-[9px] text-white font-bold"
                  [style.width.%]="enginePercentage()"
                  title="Engine & Blueprint: {{ engineQuestionsCount() }} ({{ enginePercentage() }}%)"
                ></div>
              </div>

              <div class="flex items-center justify-between text-xs text-slate-500 pt-1">
                <div class="flex items-center space-x-2">
                  <span class="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
                  <span class="font-semibold text-slate-800">AI Synthesized:</span>
                  <span>{{ aiQuestionsCount() }} questions ({{ aiPercentage() }}%)</span>
                </div>
                <div class="flex items-center space-x-2">
                  <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span class="font-semibold text-slate-800">Deterministic Engine & Blueprints:</span>
                  <span>{{ engineQuestionsCount() }} questions ({{ enginePercentage() }}%)</span>
                </div>
              </div>
            </div>

            <!-- Side by Side Comparative Breakdown Cards -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <!-- AI Characteristics -->
              <div class="p-4 rounded-xl border border-indigo-100 bg-indigo-50/30 space-y-2.5 text-xs">
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-2">
                    <span class="text-base">🤖</span>
                    <h4 class="font-bold text-slate-900">Google Gemini AI Engine</h4>
                  </div>
                  <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-700">
                    {{ aiConfig.isAiGloballyEnabled() ? 'ENABLED' : 'DISABLED' }}
                  </span>
                </div>
                <ul class="space-y-1.5 text-slate-600 text-[11px]">
                  <li class="flex items-start space-x-1.5">
                    <span class="text-indigo-600 font-bold">•</span>
                    <span><strong>Generation Type:</strong> LLM prompt synthesis via Gemini 3.1 Flash Lite</span>
                  </li>
                  <li class="flex items-start space-x-1.5">
                    <span class="text-indigo-600 font-bold">•</span>
                    <span><strong>Average Latency:</strong> {{ averageAiLatency() }} ms per drill</span>
                  </li>
                  <li class="flex items-start space-x-1.5">
                    <span class="text-indigo-600 font-bold">•</span>
                    <span><strong>Token Cost:</strong> ~600-900 tokens per 5 questions</span>
                  </li>
                  <li class="flex items-start space-x-1.5">
                    <span class="text-indigo-600 font-bold">•</span>
                    <span><strong>Best For:</strong> Novel reading comprehension passages, open-ended verbal analogies</span>
                  </li>
                </ul>
              </div>

              <!-- Engine Characteristics -->
              <div class="p-4 rounded-xl border border-emerald-100 bg-emerald-50/30 space-y-2.5 text-xs">
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-2">
                    <span class="text-base">⚡</span>
                    <h4 class="font-bold text-slate-900">Parametric Pattern Engine & Static Blueprints</h4>
                  </div>
                  <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    ALWAYS AVAILABLE
                  </span>
                </div>
                <ul class="space-y-1.5 text-slate-600 text-[11px]">
                  <li class="flex items-start space-x-1.5">
                    <span class="text-emerald-600 font-bold">•</span>
                    <span><strong>Generation Type:</strong> Mathematical algorithms, logic deduction & curated banking pools</span>
                  </li>
                  <li class="flex items-start space-x-1.5">
                    <span class="text-emerald-600 font-bold">•</span>
                    <span><strong>Latency:</strong> Instant (&lt; 1 ms) client-side evaluation</span>
                  </li>
                  <li class="flex items-start space-x-1.5">
                    <span class="text-emerald-600 font-bold">•</span>
                    <span><strong>Token Cost:</strong> 0 Tokens (100% Free & Unlimited)</span>
                  </li>
                  <li class="flex items-start space-x-1.5">
                    <span class="text-emerald-600 font-bold">•</span>
                    <span><strong>Accuracy:</strong> 100% verified math formulas and official banking regulations</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Subject-by-Subject Question Difference Table -->
          <div class="card p-5 space-y-4">
            <div class="pb-3 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h4 class="text-sm font-bold text-slate-900">Subject-Wise Difference (AI vs Non-AI Questions)</h4>
                <p class="text-xs text-slate-500">Detailed question availability by subject and generation pipeline</p>
              </div>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs">
                <thead>
                  <tr class="border-b border-slate-200 text-slate-500 uppercase font-semibold text-[11px]">
                    <th class="py-2.5 px-3">Subject</th>
                    <th class="py-2.5 px-3">Total Pool</th>
                    <th class="py-2.5 px-3">Non-AI / Engine</th>
                    <th class="py-2.5 px-3">AI-Generated</th>
                    <th class="py-2.5 px-3">Composition</th>
                    <th class="py-2.5 px-3">Primary Engine</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 text-slate-700">
                  @for (sub of subjectComparison(); track sub.code) {
                    <tr class="hover:bg-slate-50/70">
                      <td class="py-3 px-3 font-bold text-slate-900 flex items-center space-x-2">
                        <span class="w-2.5 h-2.5 rounded-full" [style.background-color]="sub.color"></span>
                        <span>{{ sub.name }}</span>
                      </td>
                      <td class="py-3 px-3 font-mono font-bold">{{ sub.total }}</td>
                      <td class="py-3 px-3">
                        <span class="px-2 py-0.5 rounded-md font-bold text-[11px] bg-emerald-50 text-emerald-700">
                          {{ sub.engineCount }} ({{ sub.enginePercent }}%)
                        </span>
                      </td>
                      <td class="py-3 px-3">
                        <span class="px-2 py-0.5 rounded-md font-bold text-[11px]" [ngClass]="sub.aiCount > 0 ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-100 text-slate-500'">
                          {{ sub.aiCount }} ({{ sub.aiPercent }}%)
                        </span>
                      </td>
                      <td class="py-3 px-3 w-40">
                        <div class="w-full h-2 rounded-full bg-slate-200 overflow-hidden flex">
                          <div class="h-full bg-indigo-600" [style.width.%]="sub.aiPercent"></div>
                          <div class="h-full bg-emerald-500" [style.width.%]="sub.enginePercent"></div>
                        </div>
                      </td>
                      <td class="py-3 px-3 text-[11px] text-slate-500">
                        @if (sub.code === 'quant') {
                          <span>Parametric Arithmetic & Series (0s)</span>
                        } @else if (sub.code === 'reasoning') {
                          <span>Deductive Logic & Grid Matrix</span>
                        } @else if (sub.code === 'ga') {
                          <span>Verified Current Affairs & Banking</span>
                        } @else if (sub.code === 'english') {
                          <span>Grammar Cloze & Vocabulary</span>
                        } @else {
                          <span>Hardware & Networking Bank</span>
                        }
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>

          <!-- AI Anti-Waste Controls & Usage Policy Card -->
          <div class="card p-5 space-y-4 bg-gradient-to-br from-white to-purple-50/30 border-purple-200">
            <div class="pb-3 border-b border-purple-100 flex items-center justify-between">
              <div>
                <h4 class="text-sm font-bold text-slate-900 flex items-center space-x-2">
                  <span>🛡️ AI Anti-Waste Policy & Frugality Controls</span>
                </h4>
                <p class="text-xs text-slate-500">
                  Prevent unnecessary AI consumption by enforcing deterministic math and offline generators
                </p>
              </div>

              <span class="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-purple-100 text-purple-800">
                Current: {{ aiConfig.getAiPolicy().replace('_', ' ') }}
              </span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <!-- Policy 1: Smart Frugal -->
              <button
                type="button"
                (click)="setPolicy('smart_frugal')"
                class="p-3.5 rounded-xl border text-left transition-all space-y-1.5 flex flex-col justify-between"
                [ngClass]="aiConfig.getAiPolicy() === 'smart_frugal' ? 'bg-purple-50 border-purple-500 text-purple-900 ring-1 ring-purple-500 shadow-xs' : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'"
              >
                <div>
                  <div class="flex items-center justify-between font-bold">
                    <span>🛡️ Smart & Frugal</span>
                    @if (aiConfig.getAiPolicy() === 'smart_frugal') {
                      <span class="text-[10px] text-purple-600 font-extrabold">ACTIVE</span>
                    }
                  </div>
                  <p class="text-[11px] text-slate-500 mt-1">
                    Uses offline parametric engine first. Only calls Gemini when pool is depleted or explicitly toggled.
                  </p>
                </div>
                <span class="text-[10px] font-bold text-emerald-700">Recommended (85% token savings)</span>
              </button>

              <!-- Policy 2: Engine First -->
              <button
                type="button"
                (click)="setPolicy('engine_first')"
                class="p-3.5 rounded-xl border text-left transition-all space-y-1.5 flex flex-col justify-between"
                [ngClass]="aiConfig.getAiPolicy() === 'engine_first' ? 'bg-purple-50 border-purple-500 text-purple-900 ring-1 ring-purple-500 shadow-xs' : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'"
              >
                <div>
                  <div class="flex items-center justify-between font-bold">
                    <span>⚡ Engine-First</span>
                    @if (aiConfig.getAiPolicy() === 'engine_first') {
                      <span class="text-[10px] text-purple-600 font-extrabold">ACTIVE</span>
                    }
                  </div>
                  <p class="text-[11px] text-slate-500 mt-1">
                    AI is never invoked automatically in quizzes. Instant 0ms latency on all practice drills.
                  </p>
                </div>
                <span class="text-[10px] font-bold text-indigo-700">Zero Unnecessary AI</span>
              </button>

              <!-- Policy 3: Always AI -->
              <button
                type="button"
                (click)="setPolicy('always_ai')"
                class="p-3.5 rounded-xl border text-left transition-all space-y-1.5 flex flex-col justify-between"
                [ngClass]="aiConfig.getAiPolicy() === 'always_ai' ? 'bg-purple-50 border-purple-500 text-purple-900 ring-1 ring-purple-500 shadow-xs' : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'"
              >
                <div>
                  <div class="flex items-center justify-between font-bold">
                    <span>🤖 Always AI</span>
                    @if (aiConfig.getAiPolicy() === 'always_ai') {
                      <span class="text-[10px] text-purple-600 font-extrabold">ACTIVE</span>
                    }
                  </div>
                  <p class="text-[11px] text-slate-500 mt-1">
                    Always calls Gemini API on every drill when online, maximizing novelty at the expense of tokens.
                  </p>
                </div>
                <span class="text-[10px] font-bold text-amber-700">Higher Token Footprint</span>
              </button>

              <!-- Policy 4: Offline Only -->
              <button
                type="button"
                (click)="setPolicy('offline_only')"
                class="p-3.5 rounded-xl border text-left transition-all space-y-1.5 flex flex-col justify-between"
                [ngClass]="aiConfig.getAiPolicy() === 'offline_only' ? 'bg-purple-50 border-purple-500 text-purple-900 ring-1 ring-purple-500 shadow-xs' : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'"
              >
                <div>
                  <div class="flex items-center justify-between font-bold">
                    <span>🔌 Offline-Only</span>
                    @if (aiConfig.getAiPolicy() === 'offline_only') {
                      <span class="text-[10px] text-purple-600 font-extrabold">ACTIVE</span>
                    }
                  </div>
                  <p class="text-[11px] text-slate-500 mt-1">
                    Strictly blocks all Gemini API outbound requests. Complete offline airplane mode.
                  </p>
                </div>
                <span class="text-[10px] font-bold text-rose-700">0 Tokens Guaranteed</span>
              </button>
            </div>
          </div>

          <!-- Live AI Generation Telemetry & Audit Log Table -->
          <div class="card p-5 space-y-4">
            <div class="pb-3 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h4 class="text-sm font-bold text-slate-900">Recent AI Request Audit Log</h4>
                <p class="text-xs text-slate-500">Live telemetry of all Gemini calls: tokens, latency, and status</p>
              </div>

              <div class="flex items-center space-x-2">
                <span class="text-xs font-semibold text-slate-500">{{ telemetry().logs.length }} logs recorded</span>
                <button
                  type="button"
                  (click)="clearTelemetryLogs()"
                  [disabled]="telemetry().logs.length === 0"
                  class="btn-secondary text-[11px] py-1 px-2.5 text-rose-600 disabled:opacity-40"
                >
                  Clear Logs
                </button>
              </div>
            </div>

            @if (telemetry().logs.length === 0) {
              <div class="py-10 text-center text-xs text-slate-400">
                No Gemini AI calls recorded yet in this browser session. Start a quiz with AI enabled to see live telemetry!
              </div>
            } @else {
              <div class="overflow-x-auto">
                <table class="w-full text-left text-xs">
                  <thead>
                    <tr class="border-b border-slate-200 text-[11px] text-slate-400 uppercase font-semibold">
                      <th class="py-2.5 px-3">Timestamp</th>
                      <th class="py-2.5 px-3">Subject / Topic</th>
                      <th class="py-2.5 px-3">Key & Model</th>
                      <th class="py-2.5 px-3">Questions</th>
                      <th class="py-2.5 px-3">Tokens Used</th>
                      <th class="py-2.5 px-3">Latency</th>
                      <th class="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100 text-slate-700">
                    @for (log of telemetry().logs; track log.id) {
                      <tr class="hover:bg-slate-50/60">
                        <td class="py-2.5 px-3 whitespace-nowrap text-slate-500">
                          {{ log.timestamp | date:'shortTime' }}
                        </td>
                        <td class="py-2.5 px-3 font-semibold text-slate-800">
                          {{ log.topic || log.subject || 'Mixed Drill' }}
                        </td>
                        <td class="py-2.5 px-3 font-mono text-[11px]">
                          <span class="font-bold text-purple-700">{{ log.keyUsed }}</span> • {{ log.model }}
                        </td>
                        <td class="py-2.5 px-3 font-bold">{{ log.questionsCount }} Qs</td>
                        <td class="py-2.5 px-3 font-mono font-bold text-amber-600">
                          {{ log.tokensUsed }} tok
                        </td>
                        <td class="py-2.5 px-3 font-mono">
                          {{ log.latencyMs }} ms
                        </td>
                        <td class="py-2.5 px-3">
                          <span
                            class="px-2 py-0.5 rounded-full text-[10px] font-bold"
                            [ngClass]="log.status === 'success' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'"
                          >
                            {{ log.status === 'success' ? '✓ OK' : '✕ ' + (log.errorMessage || 'Failed') }}
                          </span>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            }
          </div>
        </div>
      }

      <!-- =================================================================== -->
      <!-- TAB 1: GEMINI AI & TOKEN MANAGEMENT -->
      <!-- =================================================================== -->
      @if (activeTab() === 'gemini') {
        <div class="space-y-6">
          <!-- Master AI Toggle Card -->
          <div class="card p-5 space-y-4">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <div class="flex items-center space-x-2">
                  <h3 class="text-base font-bold text-slate-900">Gemini AI Synthesis Engine</h3>
                  @if (aiConfig.isAiGloballyEnabled()) {
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      ACTIVE & FRUGAL
                    </span>
                  } @else {
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                      DISABLED (OFFLINE ONLY)
                    </span>
                  }
                </div>
                <p class="text-xs text-slate-500 mt-1">
                  Controls whether Practice Quizzes call Google Generative AI to generate novel exam questions.
                  When disabled, quizzes operate 100% offline using client-side parametric math and static pools.
                </p>
              </div>

              <div class="flex items-center space-x-3">
                <span class="text-xs font-semibold text-slate-600">{{ aiConfig.isAiGloballyEnabled() ? 'Enabled' : 'Disabled' }}</span>
                <button
                  type="button"
                  (click)="toggleAiMaster()"
                  class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden"
                  [ngClass]="aiConfig.isAiGloballyEnabled() ? 'bg-purple-600' : 'bg-slate-300'"
                >
                  <span
                    class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out"
                    [ngClass]="aiConfig.isAiGloballyEnabled() ? 'translate-x-5' : 'translate-x-0'"
                  ></span>
                </button>
              </div>
            </div>

            <!-- Frugal Caching Explanation -->
            <div class="p-3.5 rounded-xl bg-purple-50/70 border border-purple-100 text-xs text-purple-950 flex items-start space-x-3">
              <span class="text-base">💡</span>
              <div class="space-y-1">
                <p class="font-bold">Frugal Token Architecture</p>
                <p class="text-purple-800 text-[11px] leading-relaxed">
                  Even when enabled, Gemini is <strong>only invoked</strong> when eligible local questions run low or when you have mastered >65% of your bank.
                  All generated questions are deduplicated and saved to localStorage (up to {{ aiConfig.getMaxCacheSize() }} questions) for continuous offline reuse!
                </p>
              </div>
            </div>
          </div>

          <!-- Quick Reapply / Batch Token Update Card -->
          <div class="card p-5 space-y-4 bg-gradient-to-br from-white to-purple-50/30 border-purple-200/80">
            <div class="pb-3 border-b border-purple-100 flex items-center justify-between">
              <div>
                <h3 class="text-sm font-bold text-slate-900 tracking-tight flex items-center space-x-2">
                  <span>⚡ Quick Reapply New Gemini API Token</span>
                </h3>
                <p class="text-xs text-slate-500">
                  Quickly replace the active API key with a new key from Google AI Studio. Tests connectivity immediately.
                </p>
              </div>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                class="text-xs font-semibold text-purple-600 hover:text-purple-700 underline flex items-center space-x-1"
              >
                <span>Get API Key from Google AI Studio</span>
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>

            <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div class="flex-1 relative">
                <input
                  type="text"
                  [(ngModel)]="quickTokenInput"
                  placeholder="Paste new Gemini API key here (AIzaSy...)"
                  class="input-field text-xs font-mono pr-10"
                />
              </div>

              <button
                type="button"
                (click)="applyQuickToken()"
                [disabled]="isTestingQuickToken || !quickTokenInput.trim()"
                class="btn-primary text-xs py-2.5 px-5 font-semibold bg-purple-600 hover:bg-purple-700 flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                @if (isTestingQuickToken) {
                  <svg class="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                  <span>Verifying Token...</span>
                } @else {
                  <span>Verify & Reapply Token</span>
                }
              </button>
            </div>

            @if (quickTokenResult) {
              <div
                class="p-3 rounded-xl border text-xs flex items-center justify-between"
                [ngClass]="quickTokenResult.success ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-rose-50 border-rose-200 text-rose-900'"
              >
                <div class="flex items-center space-x-2">
                  <span class="font-bold">{{ quickTokenResult.success ? '✓ Verified' : '✕ Verification Failed' }}:</span>
                  <span>{{ quickTokenResult.message }}</span>
                </div>
                @if (quickTokenResult.latencyMs > 0) {
                  <span class="font-mono text-[11px] font-bold opacity-80">{{ quickTokenResult.latencyMs }}ms</span>
                }
              </div>
            }
          </div>

          <!-- Dual Key Tokens Configuration Form -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <!-- Primary Key Card -->
            <div class="card p-5 space-y-4">
              <div class="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h4 class="text-sm font-bold text-slate-900">Primary Gemini Token</h4>
                  <span class="text-[11px] text-slate-400">First-priority key for question generation</span>
                </div>

                <!-- Status Badge -->
                @if (aiConfig.config().primaryKeyStatus === 'valid') {
                  <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    Verified ({{ aiConfig.config().primaryKeyLatencyMs }}ms)
                  </span>
                } @else if (aiConfig.config().primaryKeyStatus === 'invalid') {
                  <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                    Failed
                  </span>
                } @else if (aiConfig.config().primaryKeyStatus === 'testing') {
                  <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 animate-pulse">
                    Testing...
                  </span>
                } @else {
                  <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                    Untested
                  </span>
                }
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase mb-1">API Key</label>
                <div class="relative">
                  <input
                    [type]="showPrimaryKey ? 'text' : 'password'"
                    [(ngModel)]="primaryKeyModel"
                    class="input-field text-xs font-mono pr-20"
                    placeholder="Enter primary Gemini token"
                  />
                  <button
                    type="button"
                    (click)="showPrimaryKey = !showPrimaryKey"
                    class="absolute right-2 top-2 text-xs text-slate-400 hover:text-slate-600 px-1 py-0.5"
                  >
                    {{ showPrimaryKey ? 'Hide' : 'Show' }}
                  </button>
                </div>
              </div>

              <div class="flex items-center justify-between pt-2">
                <button
                  type="button"
                  (click)="testPrimaryKey()"
                  [disabled]="isTestingPrimary || !primaryKeyModel.trim()"
                  class="btn-secondary text-xs py-1.5 px-3 flex items-center space-x-1"
                >
                  @if (isTestingPrimary) {
                    <span class="animate-spin text-xs">🔄</span>
                  }
                  <span>Test Key</span>
                </button>

                <div class="flex items-center space-x-2">
                  <button
                    type="button"
                    (click)="savePrimaryKey()"
                    class="btn-primary text-xs py-1.5 px-4 font-semibold"
                  >
                    Save
                  </button>
                </div>
              </div>

              @if (primaryTestMessage) {
                <p class="text-[11px] p-2 rounded-lg bg-slate-50 border text-slate-700 break-all">
                  {{ primaryTestMessage }}
                </p>
              }
            </div>

            <!-- Fallback Key Card -->
            <div class="card p-5 space-y-4">
              <div class="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h4 class="text-sm font-bold text-slate-900">Fallback Gemini Token</h4>
                  <span class="text-[11px] text-slate-400">Engaged automatically if primary hits quota/rate limits</span>
                </div>

                <!-- Status Badge -->
                @if (aiConfig.config().fallbackKeyStatus === 'valid') {
                  <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    Verified ({{ aiConfig.config().fallbackKeyLatencyMs }}ms)
                  </span>
                } @else if (aiConfig.config().fallbackKeyStatus === 'invalid') {
                  <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                    Failed
                  </span>
                } @else if (aiConfig.config().fallbackKeyStatus === 'testing') {
                  <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 animate-pulse">
                    Testing...
                  </span>
                } @else {
                  <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                    Untested
                  </span>
                }
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Fallback API Key</label>
                <div class="relative">
                  <input
                    [type]="showFallbackKey ? 'text' : 'password'"
                    [(ngModel)]="fallbackKeyModel"
                    class="input-field text-xs font-mono pr-20"
                    placeholder="Enter secondary fallback token"
                  />
                  <button
                    type="button"
                    (click)="showFallbackKey = !showFallbackKey"
                    class="absolute right-2 top-2 text-xs text-slate-400 hover:text-slate-600 px-1 py-0.5"
                  >
                    {{ showFallbackKey ? 'Hide' : 'Show' }}
                  </button>
                </div>
              </div>

              <div class="flex items-center justify-between pt-2">
                <button
                  type="button"
                  (click)="testFallbackKey()"
                  [disabled]="isTestingFallback || !fallbackKeyModel.trim()"
                  class="btn-secondary text-xs py-1.5 px-3 flex items-center space-x-1"
                >
                  @if (isTestingFallback) {
                    <span class="animate-spin text-xs">🔄</span>
                  }
                  <span>Test Key</span>
                </button>

                <div class="flex items-center space-x-2">
                  <button
                    type="button"
                    (click)="saveFallbackKey()"
                    class="btn-primary text-xs py-1.5 px-4 font-semibold"
                  >
                    Save
                  </button>
                </div>
              </div>

              @if (fallbackTestMessage) {
                <p class="text-[11px] p-2 rounded-lg bg-slate-50 border text-slate-700 break-all">
                  {{ fallbackTestMessage }}
                </p>
              }
            </div>
          </div>

          <!-- Model & Generation Parameters Card -->
          <div class="card p-5 space-y-4">
            <div class="pb-3 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h4 class="text-sm font-bold text-slate-900">Model & Caching Parameters</h4>
                <p class="text-xs text-slate-500">Fine-tune Google Generative Language API model endpoint and local cache limit</p>
              </div>

              <button
                type="button"
                (click)="resetAiDefaults()"
                class="text-xs font-semibold text-purple-600 hover:text-purple-700"
              >
                Reset to Built-in Defaults
              </button>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label class="block font-bold text-slate-700 uppercase mb-1">Model Name</label>
                <select [(ngModel)]="modelModel" (change)="saveModelParameters()" class="input-field text-xs font-mono font-semibold">
                  <option value="gemini-3.1-flash-lite-preview">gemini-3.1-flash-lite-preview (Default, High Speed)</option>
                  <option value="gemini-2.5-flash">gemini-2.5-flash (Standard)</option>
                  <option value="gemini-1.5-flash">gemini-1.5-flash (Legacy Fast)</option>
                  <option value="gemini-1.5-pro">gemini-1.5-pro (High Reasoning)</option>
                </select>
              </div>

              <div>
                <label class="block font-bold text-slate-700 uppercase mb-1">
                  Temperature: {{ temperatureModel }}
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.1"
                  [(ngModel)]="temperatureModel"
                  (change)="saveModelParameters()"
                  class="w-full accent-purple-600 cursor-pointer"
                />
                <div class="flex justify-between text-[10px] text-slate-400 mt-0.5">
                  <span>0.1 (Strict)</span>
                  <span>0.7 (Balanced)</span>
                  <span>1.0 (Creative)</span>
                </div>
              </div>

              <div>
                <label class="block font-bold text-slate-700 uppercase mb-1">Max Bank Cache Size</label>
                <select [(ngModel)]="maxCacheModel" (change)="saveModelParameters()" class="input-field text-xs font-bold">
                  <option [value]="100">100 Curated Questions</option>
                  <option [value]="300">300 Curated Questions (Recommended)</option>
                  <option [value]="500">500 Curated Questions</option>
                  <option [value]="1000">1,000 Questions (High Storage)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      }

      <!-- =================================================================== -->
      <!-- TAB 2: QUESTION BANK & CACHE MONITOR -->
      <!-- =================================================================== -->
      @if (activeTab() === 'bank') {
        <div class="space-y-6">
          <!-- Bank Overview Metrics -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div class="card p-4">
              <span class="text-xs text-slate-500 font-semibold block">Total Cached Qs</span>
              <span class="text-2xl font-bold text-purple-700 mt-1 block font-mono">
                {{ cachedBank().length }} / {{ aiConfig.getMaxCacheSize() }}
              </span>
              <span class="text-[10px] text-slate-400 mt-1 block">In local offline bank</span>
            </div>

            <div class="card p-4">
              <span class="text-xs text-slate-500 font-semibold block">Mastered Questions</span>
              <span class="text-2xl font-bold text-emerald-600 mt-1 block font-mono">
                {{ bankStats().mastered }}
              </span>
              <span class="text-[10px] text-emerald-600/80 mt-1 block">Answered correctly ≥ 2 times</span>
            </div>

            <div class="card p-4">
              <span class="text-xs text-slate-500 font-semibold block">Needs Review</span>
              <span class="text-2xl font-bold text-amber-600 mt-1 block font-mono">
                {{ bankStats().needsReview }}
              </span>
              <span class="text-[10px] text-amber-600/80 mt-1 block">Spaced repetition queue</span>
            </div>

            <div class="card p-4">
              <span class="text-xs text-slate-500 font-semibold block">Fresh / Unattempted</span>
              <span class="text-2xl font-bold text-indigo-600 mt-1 block font-mono">
                {{ bankStats().unattempted }}
              </span>
              <span class="text-[10px] text-indigo-600/80 mt-1 block">Ready for practice</span>
            </div>
          </div>

          <!-- Subject Distribution Bar -->
          <div class="card p-4 space-y-3">
            <div class="flex items-center justify-between text-xs">
              <span class="font-bold text-slate-800">Subject Distribution in Local Bank</span>
              <span class="text-slate-500">{{ cachedBank().length }} total stored items</span>
            </div>

            <div class="flex flex-wrap gap-2 text-xs">
              @for (entry of bankStats().subjectCounts | keyvalue; track entry.key) {
                <span class="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 flex items-center space-x-1.5">
                  <span class="font-semibold">{{ entry.key }}:</span>
                  <span class="font-mono font-bold text-purple-700">{{ entry.value }}</span>
                </span>
              }
              @if ((bankStats().subjectCounts | keyvalue).length === 0) {
                <span class="text-xs text-slate-400 italic">No cached questions in local bank yet. Run a practice quiz or click "Seed Sample Questions".</span>
              }
            </div>
          </div>

          <!-- Question Explorer & Controls -->
          <div class="card p-5 space-y-4">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h4 class="text-sm font-bold text-slate-900">Question Bank Explorer</h4>
                <p class="text-xs text-slate-500">Inspect, search, and manage individual cached questions</p>
              </div>

              <div class="flex items-center space-x-2 flex-wrap gap-y-2">
                <button
                  type="button"
                  (click)="openAiGenModal()"
                  class="btn-primary text-xs py-1.5 px-3 font-semibold flex items-center space-x-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-xs"
                >
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>+ Generate AI Questions</span>
                </button>

                <button
                  type="button"
                  (click)="seedSampleQuestions()"
                  class="btn-secondary text-xs py-1.5 px-3 font-semibold"
                >
                  + Seed 5 Banking Qs
                </button>

                <button
                  type="button"
                  (click)="exportBankJson()"
                  [disabled]="cachedBank().length === 0"
                  class="btn-secondary text-xs py-1.5 px-3 font-semibold flex items-center space-x-1 disabled:opacity-40"
                >
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>Export JSON</span>
                </button>

                <button
                  type="button"
                  (click)="clearBankCache()"
                  [disabled]="cachedBank().length === 0"
                  class="text-xs py-1.5 px-3 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 font-semibold disabled:opacity-40"
                >
                  Clear Bank
                </button>
              </div>
            </div>

            <!-- Filters -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <input
                type="text"
                [(ngModel)]="searchBankQuery"
                placeholder="Search question statement or topic..."
                class="input-field text-xs"
              />

              <select [(ngModel)]="filterBankDifficulty" class="input-field text-xs">
                <option value="all">All Difficulties</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>

              <select [(ngModel)]="filterBankMastery" class="input-field text-xs">
                <option value="all">All Mastery States</option>
                <option value="unattempted">Unattempted</option>
                <option value="review">Needs Review</option>
                <option value="mastered">Mastered</option>
              </select>
            </div>

            <!-- Question Cards List -->
            <div class="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              @for (q of filteredBankQuestions(); track q.id; let idx = $index) {
                <div class="p-3.5 rounded-xl border border-slate-200/90 bg-slate-50/50 hover:bg-white transition-colors space-y-2 text-xs">
                  <div class="flex items-center justify-between gap-2">
                    <div class="flex items-center space-x-2 flex-wrap gap-y-1">
                      <span class="font-mono text-[10px] text-slate-400">#{{ idx + 1 }}</span>
                      <span class="px-2 py-0.5 rounded-full font-bold text-[10px] bg-purple-100 text-purple-800">
                        {{ q.topic_name || 'General' }}
                      </span>
                      <span
                        class="px-2 py-0.5 rounded-full font-semibold text-[10px]"
                        [ngClass]="{
                          'bg-emerald-100 text-emerald-800': q.difficulty === 'easy',
                          'bg-amber-100 text-amber-800': q.difficulty === 'medium',
                          'bg-rose-100 text-rose-800': q.difficulty === 'hard'
                        }"
                      >
                        {{ q.difficulty || 'medium' }}
                      </span>
                      <span class="text-[10px] text-slate-400 font-mono">
                        Correct: {{ q.correct_count || 0 }} | Wrong: {{ q.incorrect_count || 0 }}
                      </span>
                    </div>

                    <button
                      type="button"
                      (click)="deleteQuestion(q.id)"
                      class="text-slate-400 hover:text-rose-600 p-1"
                      title="Delete question from bank"
                    >
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>

                  <!-- Question Text -->
                  <p class="font-semibold text-slate-800 leading-relaxed">
                    {{ q.question_text }}
                  </p>

                  <!-- Options Grid -->
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                    @for (opt of q.options; track $index; let optIdx = $index) {
                      <div
                        class="px-2.5 py-1.5 rounded-lg border text-[11px] flex items-center justify-between"
                        [ngClass]="optIdx === q.correct_option_index ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold' : 'bg-white border-slate-200 text-slate-600'"
                      >
                        <span>{{ ['A', 'B', 'C', 'D'][optIdx] }}. {{ opt }}</span>
                        @if (optIdx === q.correct_option_index) {
                          <span class="text-emerald-700 font-bold text-[10px]">✓ Correct</span>
                        }
                      </div>
                    }
                  </div>

                  <!-- Explanation -->
                  <div class="pt-1 text-[11px] text-slate-500 bg-white p-2 rounded-lg border border-slate-100">
                    <span class="font-bold text-slate-700">Explanation:</span> {{ q.explanation }}
                  </div>
                </div>
              }
              @if (filteredBankQuestions().length === 0) {
                <div class="text-center py-8 text-slate-400 text-xs">
                  No questions match your current search criteria.
                </div>
              }
            </div>
          </div>

          <!-- Built-in Benchmark Papers Info -->
          <div class="card p-5 space-y-3">
            <h4 class="text-sm font-bold text-slate-900">Benchmark Previous Year Papers (11 Full Exams)</h4>
            <p class="text-xs text-slate-500">
              PrepTrack includes 11 authentic benchmark exam papers (IBPS PO, SBI PO, Clerk, RRB, RBI Grade B, NABARD, SEBI, LIC AAO, IBPS SO)
              comprising over 1,100 pre-calibrated bank exam questions stored in source code.
            </p>
            <div class="flex items-center space-x-2 text-xs">
              <span class="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200">
                11 Benchmark Exams
              </span>
              <span class="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                1,100 Pre-loaded Questions
              </span>
            </div>
          </div>
        </div>
      }

      <!-- =================================================================== -->
      <!-- TAB 3: EXAM BLUEPRINTS & PATTERNS -->
      <!-- =================================================================== -->
      @if (activeTab() === 'patterns') {
        <div class="space-y-6">
          <!-- Interactive Dry-Run Pattern Simulation Card -->
          <div class="card p-5 space-y-4 bg-gradient-to-br from-white to-indigo-50/30 border-indigo-200/80">
            <div class="pb-3 border-b border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 class="text-sm font-bold text-slate-900 tracking-tight flex items-center space-x-2">
                  <span>⚡ Real-Time Pattern Engine Dry-Run Simulator</span>
                </h3>
                <p class="text-xs text-slate-500">
                  Execute the client-side algorithmic question pattern engine on any blueprint without starting an exam.
                </p>
              </div>

              <div class="flex items-center space-x-2">
                <select [(ngModel)]="selectedSimulationBlueprintId" class="input-field text-xs font-semibold py-1.5">
                  @for (bp of blueprints; track bp.id) {
                    <option [value]="bp.id">{{ bp.title }} ({{ bp.total_marks }} Marks)</option>
                  }
                </select>

                <button
                  type="button"
                  (click)="runEngineDryRun()"
                  [disabled]="isSimulating"
                  class="btn-primary text-xs py-2 px-4 whitespace-nowrap bg-indigo-600 hover:bg-indigo-700 font-semibold flex items-center space-x-1.5"
                >
                  @if (isSimulating) {
                    <span class="animate-spin text-xs">🔄</span>
                    <span>Generating...</span>
                  } @else {
                    <span>▶ Test Simulation</span>
                  }
                </button>
              </div>
            </div>

            @if (dryRunResult) {
              <div class="space-y-3">
                <div class="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 flex items-center justify-between">
                  <div class="flex items-center space-x-2">
                    <span class="font-bold text-emerald-800">✓ Pattern Generation Successful:</span>
                    <span>Generated {{ dryRunResult.questions.length }} authentic questions across {{ dryRunResult.sectionCounts.length }} sections.</span>
                  </div>
                  <span class="font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                    Speed: {{ dryRunResult.latencyMs }}ms
                  </span>
                </div>

                <!-- Section breakdown of dry run -->
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  @for (sec of dryRunResult.sectionCounts; track sec.name) {
                    <div class="p-2.5 rounded-lg bg-white border border-slate-200">
                      <span class="font-bold text-slate-800 block truncate">{{ sec.name }}</span>
                      <span class="font-mono text-indigo-600 font-bold">{{ sec.count }} Questions</span>
                    </div>
                  }
                </div>

                <!-- Sample Generated Question Preview -->
                @if (dryRunResult.sampleQuestions.length > 0) {
                  <div class="space-y-2 pt-2">
                    <span class="text-xs font-bold text-slate-800 uppercase tracking-wider block">Generated Question Previews:</span>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      @for (sq of dryRunResult.sampleQuestions; track sq.id) {
                        <div class="p-3 rounded-xl bg-white border border-slate-200 space-y-1.5">
                          <div class="flex items-center justify-between text-[11px]">
                            <span class="font-bold text-indigo-700">{{ sq.sectionName }}</span>
                            <span class="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-mono text-[10px]">{{ sq.topicName }}</span>
                          </div>
                          <p class="font-semibold text-slate-800 line-clamp-2">{{ sq.questionText }}</p>
                          <div class="text-[10px] text-emerald-700 bg-emerald-50 p-1.5 rounded-md font-mono">
                            Correct: Option {{ ['A','B','C','D','E'][sq.correctOptionIndex] }}
                          </div>
                        </div>
                      }
                    </div>
                  </div>
                }
              </div>
            }
          </div>

          <!-- Catalog of 14 Exam Blueprints -->
          <div class="card p-5 space-y-4">
            <div class="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h4 class="text-sm font-bold text-slate-900">Registered Bank Exam Blueprints ({{ blueprints.length }})</h4>
                <p class="text-xs text-slate-500">Official banking exam patterns with sectional timers, negative marking, and cutoffs</p>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              @for (bp of blueprints; track bp.id) {
                <div class="p-4 rounded-xl border border-slate-200/90 bg-slate-50/50 hover:bg-white transition-all space-y-3 text-xs">
                  <div class="flex items-start justify-between gap-2">
                    <div>
                      <span class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {{ bp.exam_category }} • {{ bp.exam_stage }}
                      </span>
                      <h5 class="font-bold text-slate-900 text-sm mt-1">{{ bp.title }}</h5>
                    </div>

                    <span class="font-mono font-bold text-indigo-700 text-xs px-2 py-1 bg-indigo-50 rounded-lg">
                      {{ bp.total_duration_minutes }}m | {{ bp.total_marks }}M
                    </span>
                  </div>

                  <p class="text-slate-500 text-[11px] leading-relaxed line-clamp-2">
                    {{ bp.description }}
                  </p>

                  <!-- Sections breakdown pills -->
                  <div class="space-y-1.5 pt-1">
                    <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Sectional Configuration:</span>
                    <div class="flex flex-wrap gap-1.5">
                      @for (sec of bp.sections_config; track sec.code) {
                        <span class="px-2 py-1 rounded-md bg-white border border-slate-200 text-[11px] text-slate-700 font-semibold">
                          {{ sec.name }}: <strong class="text-indigo-600">{{ sec.questionsCount }}Q</strong> ({{ sec.durationMinutes }}m)
                        </span>
                      }
                    </div>
                  </div>

                  <div class="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                    <span>Negative: -{{ bp.negative_marking }}</span>
                    <span>Target Cutoff: {{ bp.target_cutoff || 'N/A' }}</span>
                    <span>Sectional Timers: {{ bp.has_sectional_timing ? 'Active' : 'Disabled' }}</span>
                  </div>
                </div>
              }
            </div>
          </div>

          <!-- Catalog of 15 Question Patterns -->
          <div class="card p-5 space-y-4">
            <div class="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h4 class="text-sm font-bold text-slate-900">Algorithmic Question Patterns Library ({{ patterns.length }})</h4>
                <p class="text-xs text-slate-500">Parametric and deductive logic generators used for authentic question crafting</p>
              </div>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs border-collapse">
                <thead>
                  <tr class="border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase">
                    <th class="py-2.5 px-3">Subject</th>
                    <th class="py-2.5 px-3">Pattern Code</th>
                    <th class="py-2.5 px-3">Topic</th>
                    <th class="py-2.5 px-3">Type</th>
                    <th class="py-2.5 px-3">Difficulty</th>
                    <th class="py-2.5 px-3">Explanation Engine</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  @for (pat of patterns; track pat.id) {
                    <tr class="hover:bg-slate-50 transition-colors">
                      <td class="py-2.5 px-3 font-semibold uppercase text-purple-700">{{ pat.subject_code }}</td>
                      <td class="py-2.5 px-3 font-mono text-[11px] font-bold text-slate-900">{{ pat.pattern_code }}</td>
                      <td class="py-2.5 px-3 font-medium text-slate-700">{{ pat.topic_name }}</td>
                      <td class="py-2.5 px-3">
                        <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700 font-mono">
                          {{ pat.pattern_type }}
                        </span>
                      </td>
                      <td class="py-2.5 px-3">
                        <span
                          class="px-2 py-0.5 rounded-full text-[10px] font-bold"
                          [ngClass]="{
                            'bg-emerald-100 text-emerald-800': pat.difficulty === 'easy',
                            'bg-amber-100 text-amber-800': pat.difficulty === 'medium',
                            'bg-rose-100 text-rose-800': pat.difficulty === 'hard'
                          }"
                        >
                          {{ pat.difficulty }}
                        </span>
                      </td>
                      <td class="py-2.5 px-3 text-[11px] text-slate-500 max-w-xs truncate" [title]="pat.explanation_template">
                        {{ pat.explanation_template }}
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      }

      <!-- =================================================================== -->
      <!-- TAB 4: ALL DATA & STORAGE DIAGNOSTICS -->
      <!-- =================================================================== -->
      @if (activeTab() === 'diagnostics') {
        <div class="space-y-6">
          <!-- Live Supabase Connection Status Card -->
          <div class="card p-5 space-y-4">
            <div class="pb-3 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h4 class="text-sm font-bold text-slate-900">Supabase PostgreSQL Database</h4>
                <p class="text-xs text-slate-500">Live cloud database status and active authenticated user</p>
              </div>

              <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center space-x-1.5">
                <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Connected Live</span>
              </span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div class="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                <span class="text-slate-400 block text-[10px] uppercase font-bold">Supabase Project Endpoint</span>
                <span class="font-mono text-slate-800 font-semibold truncate block mt-0.5">https://bxzfrusibipifrhukpdx.supabase.co</span>
              </div>

              <div class="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                <span class="text-slate-400 block text-[10px] uppercase font-bold">Active User Identity</span>
                <span class="font-mono text-slate-800 font-semibold truncate block mt-0.5">{{ authService.currentUser()?.email || 'Anonymous / Local' }}</span>
              </div>

              <div class="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                <span class="text-slate-400 block text-[10px] uppercase font-bold">Row Level Security</span>
                <span class="font-bold text-emerald-700 block mt-0.5">Enforced (RLS Active)</span>
              </div>
            </div>
          </div>

          <!-- Entity Counters Grid -->
          <div class="card p-5 space-y-4">
            <div class="pb-3 border-b border-slate-100">
              <h4 class="text-sm font-bold text-slate-900">Application Entity Ledger</h4>
              <p class="text-xs text-slate-500">Live record counts stored in Supabase & Local IndexedDB/LocalStorage</p>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div class="p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-100">
                <span class="text-slate-500 text-[11px] font-semibold block">Bank Exams Registered</span>
                <span class="text-2xl font-bold text-indigo-700 mt-1 block font-mono">{{ totalExams() }}</span>
                <span class="text-[10px] text-slate-400 mt-0.5 block">IBPS, SBI, RBI, NABARD, LIC</span>
              </div>

              <div class="p-3.5 rounded-xl bg-purple-50/60 border border-purple-100">
                <span class="text-slate-500 text-[11px] font-semibold block">Syllabus Topics</span>
                <span class="text-2xl font-bold text-purple-700 mt-1 block font-mono">{{ totalTopics() }}</span>
                <span class="text-[10px] text-slate-400 mt-0.5 block">Across 5 banking subjects</span>
              </div>

              <div class="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-100">
                <span class="text-slate-500 text-[11px] font-semibold block">Practice Quiz Attempts</span>
                <span class="text-2xl font-bold text-emerald-700 mt-1 block font-mono">{{ totalQuizAttempts() }}</span>
                <span class="text-[10px] text-slate-400 mt-0.5 block">In-app practice drills</span>
              </div>

              <div class="p-3.5 rounded-xl bg-amber-50/60 border border-amber-100">
                <span class="text-slate-500 text-[11px] font-semibold block">Mock Exam Attempts</span>
                <span class="text-2xl font-bold text-amber-700 mt-1 block font-mono">{{ totalMockAttempts() }}</span>
                <span class="text-[10px] text-slate-400 mt-0.5 block">Full exam simulations</span>
              </div>
            </div>
          </div>

          <!-- Local Storage Footprint Breakdown -->
          <div class="card p-5 space-y-4">
            <div class="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h4 class="text-sm font-bold text-slate-900">Local Storage Footprint ({{ totalStorageKb() }} KB)</h4>
                <p class="text-xs text-slate-500">Breakdown of persistent keys stored in browser client cache</p>
              </div>

              <button
                type="button"
                (click)="exportFullBackupJson()"
                class="btn-primary text-xs py-2 px-3.5 font-semibold bg-purple-600 hover:bg-purple-700 flex items-center space-x-1.5"
              >
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>Export System Data Backup (JSON)</span>
              </button>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs border-collapse">
                <thead>
                  <tr class="border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase">
                    <th class="py-2 px-3">Storage Key</th>
                    <th class="py-2 px-3">Size (Bytes)</th>
                    <th class="py-2 px-3">Item Count</th>
                    <th class="py-2 px-3">Description</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 font-mono text-[11px]">
                  @for (rep of storageReports(); track rep.key) {
                    <tr class="hover:bg-slate-50">
                      <td class="py-2 px-3 font-bold text-slate-800">{{ rep.key }}</td>
                      <td class="py-2 px-3 text-purple-700 font-semibold">{{ rep.sizeBytes | number }} B</td>
                      <td class="py-2 px-3 text-slate-600">{{ rep.itemCount }}</td>
                      <td class="py-2 px-3 font-sans text-slate-500 text-xs">{{ rep.description }}</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      }

      <!-- =================================================================== -->
      <!-- AI QUESTION GENERATOR MODAL -->
      <!-- =================================================================== -->
      @if (showAiGenModal()) {
        <div
          class="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
          (click)="closeAiGenModal()"
        >
          <div
            class="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden transform transition-all"
            (click)="$event.stopPropagation()"
          >
            <!-- Modal Header -->
            <div class="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-purple-50/60 to-indigo-50/60">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold shadow-md shadow-purple-200">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 class="text-base font-bold text-slate-900">Generate AI Questions</h3>
                  <p class="text-xs text-slate-500">Synthesize authentic bank exam questions with Gemini AI</p>
                </div>
              </div>

              <button
                type="button"
                (click)="closeAiGenModal()"
                [disabled]="isGeneratingAi()"
                class="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-40"
              >
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Modal Body -->
            <div class="p-6 space-y-4 text-xs">
              <!-- Warning if AI is disabled -->
              @if (!aiConfig.isAiGloballyEnabled()) {
                <div class="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start space-x-2.5">
                  <span class="text-base">⚠️</span>
                  <div class="space-y-1">
                    <p class="font-bold">Gemini AI is globally disabled</p>
                    <p class="text-[11px] text-amber-700">Please enable Gemini AI before generating questions.</p>
                    <button
                      type="button"
                      (click)="toggleAiMaster()"
                      class="mt-1 px-2.5 py-1 rounded-md bg-amber-600 text-white font-semibold text-[11px] hover:bg-amber-700"
                    >
                      Enable Gemini AI Now
                    </button>
                  </div>
                </div>
              }

              <!-- Subject Selection -->
              <div class="space-y-1.5">
                <label class="font-bold text-slate-700 block">Banking Subject</label>
                <select
                  [ngModel]="aiGenSubject()"
                  (ngModelChange)="onSubjectChange($event)"
                  class="input-field text-xs w-full font-medium"
                  [disabled]="isGeneratingAi()"
                >
                  <option value="Quantitative Aptitude">Quantitative Aptitude</option>
                  <option value="Reasoning Ability">Reasoning Ability</option>
                  <option value="English Language">English Language</option>
                  <option value="General & Banking Awareness">General & Banking Awareness</option>
                  <option value="Computer Aptitude">Computer Aptitude</option>
                </select>
              </div>

              <!-- Topic Selection & Suggestions -->
              <div class="space-y-1.5">
                <div class="flex items-center justify-between">
                  <label class="font-bold text-slate-700">Topic Focus (Optional)</label>
                  <span class="text-[10px] text-slate-400">Leave blank for mixed topics</span>
                </div>
                <input
                  type="text"
                  [ngModel]="aiGenTopic()"
                  (ngModelChange)="aiGenTopic.set($event)"
                  placeholder="e.g. Percentage, Syllogisms, Repo Rates..."
                  class="input-field text-xs w-full"
                  [disabled]="isGeneratingAi()"
                />

                <!-- Quick Topic Suggestions Chips -->
                <div class="pt-1">
                  <span class="text-[10px] font-semibold text-slate-400 block mb-1">Recommended Topics:</span>
                  <div class="flex flex-wrap gap-1.5">
                    @for (topic of currentTopicSuggestions; track topic) {
                      <button
                        type="button"
                        (click)="setAiTopic(topic)"
                        [disabled]="isGeneratingAi()"
                        class="px-2 py-0.5 rounded-md text-[10px] font-medium transition-colors"
                        [ngClass]="aiGenTopic() === topic ? 'bg-purple-600 text-white font-bold' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
                      >
                        {{ topic }}
                      </button>
                    }
                  </div>
                </div>
              </div>

              <!-- Difficulty and Count Grid -->
              <div class="grid grid-cols-2 gap-3 pt-1">
                <!-- Difficulty -->
                <div class="space-y-1.5">
                  <label class="font-bold text-slate-700 block">Difficulty</label>
                  <select
                    [ngModel]="aiGenDifficulty()"
                    (ngModelChange)="aiGenDifficulty.set($event)"
                    class="input-field text-xs w-full"
                    [disabled]="isGeneratingAi()"
                  >
                    <option value="mixed">Mixed (Recommended)</option>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>

                <!-- Number of Questions -->
                <div class="space-y-1.5">
                  <label class="font-bold text-slate-700 block">Number of Questions</label>
                  <select
                    [ngModel]="aiGenCount()"
                    (ngModelChange)="aiGenCount.set($event)"
                    class="input-field text-xs w-full font-mono font-semibold"
                    [disabled]="isGeneratingAi()"
                  >
                    <option [ngValue]="1">1 Question (Quick test)</option>
                    <option [ngValue]="3">3 Questions</option>
                    <option [ngValue]="5">5 Questions (Standard batch)</option>
                    <option [ngValue]="10">10 Questions (Full set)</option>
                  </select>
                </div>
              </div>

              <!-- Generation Result Banner -->
              @if (aiGenResult) {
                <div
                  class="p-3 rounded-xl border text-xs"
                  [ngClass]="aiGenResult.success ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'"
                >
                  @if (aiGenResult.success) {
                    <div class="flex items-center space-x-2">
                      <span class="text-base">✅</span>
                      <div>
                        <p class="font-bold">Successfully generated {{ aiGenResult.count }} questions!</p>
                        <p class="text-[11px] text-emerald-600">Saved to local question bank in {{ aiGenResult.latencyMs }}ms.</p>
                      </div>
                    </div>
                  } @else {
                    <div class="flex items-start space-x-2">
                      <span class="text-base">❌</span>
                      <div>
                        <p class="font-bold">Generation Failed</p>
                        <p class="text-[11px] text-rose-700">{{ aiGenResult.error }}</p>
                      </div>
                    </div>
                  }
                </div>
              }
            </div>

            <!-- Modal Footer -->
            <div class="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <span class="text-[11px] text-slate-400">
                Model: <span class="font-mono text-purple-700 font-semibold">{{ aiConfig.getEffectiveModel() }}</span>
              </span>

              <div class="flex items-center space-x-2">
                <button
                  type="button"
                  (click)="closeAiGenModal()"
                  [disabled]="isGeneratingAi()"
                  class="btn-secondary text-xs py-2 px-3.5 font-semibold"
                >
                  Close
                </button>

                <button
                  type="button"
                  (click)="generateAiQuestionsForBank()"
                  [disabled]="isGeneratingAi() || !aiConfig.isAiGloballyEnabled()"
                  class="btn-primary text-xs py-2 px-4 font-semibold flex items-center space-x-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-md shadow-purple-200 disabled:opacity-50"
                >
                  @if (isGeneratingAi()) {
                    <svg class="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Generating with Gemini...</span>
                  } @else {
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>Generate & Save Questions</span>
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class AdminComponent implements OnInit {
  public aiConfig = inject(AiConfigService);
  public quizService = inject(QuizService);
  public patternEngine = inject(QuestionPatternEngineService);
  public dataStorage = inject(DataStorageService);
  public supabaseService = inject(SupabaseService);
  public authService = inject(AuthService);
  private toast = inject(ToastService);

  public activeTab = signal<'dashboard' | 'gemini' | 'bank' | 'patterns' | 'diagnostics'>('dashboard');
  public isLoading = signal<boolean>(false);

  // Gemini token forms
  public primaryKeyModel: string = '';
  public fallbackKeyModel: string = '';
  public modelModel: string = 'gemini-3.1-flash-lite-preview';
  public temperatureModel: number = 0.7;
  public maxCacheModel: number = 300;

  public showPrimaryKey: boolean = false;
  public showFallbackKey: boolean = false;

  public isTestingPrimary: boolean = false;
  public isTestingFallback: boolean = false;
  public primaryTestMessage: string = '';
  public fallbackTestMessage: string = '';

  public quickTokenInput: string = '';
  public isTestingQuickToken: boolean = false;
  public quickTokenResult: { success: boolean; message: string; latencyMs: number } | null = null;

  // AI Question Generation Modal
  public showAiGenModal = signal<boolean>(false);
  public isGeneratingAi = signal<boolean>(false);
  public aiGenSubject = signal<string>('Quantitative Aptitude');
  public aiGenTopic = signal<string>('Percentage & Profit/Loss');
  public aiGenDifficulty = signal<'easy' | 'medium' | 'hard' | 'mixed'>('mixed');
  public aiGenCount = signal<number>(5);
  public aiGenResult: { success: boolean; count: number; latencyMs: number; error?: string } | null = null;

  public subjectTopicSuggestions: Record<string, string[]> = {
    'Quantitative Aptitude': [
      'Percentage & Profit/Loss',
      'Simple & Compound Interest',
      'Time, Speed & Distance',
      'Ratio, Proportion & Partnership',
      'Number Series & Speed Math',
      'Data Interpretation (DI)'
    ],
    'Reasoning Ability': [
      'Syllogisms (Only a Few)',
      'Inequalities & Logic',
      'Blood Relations & Family Tree',
      'Direction Sense & Distance',
      'Coding-Decoding'
    ],
    'English Language': [
      'Error Spotting & Grammar',
      'Cloze Test & Fillers',
      'Sentence Rearrangement (Para Jumbles)',
      'Vocabulary & Idioms'
    ],
    'General & Banking Awareness': [
      'RBI Monetary Policy & Repo Rates',
      'PCA Framework & Basel III Accords',
      'Union Budget & Government Schemes',
      'Digital Banking & Payment Systems (UPI, NEFT)'
    ],
    'Computer Aptitude': [
      'Computer Architecture & Memory Hierarchy',
      'Networking Protocols & OSI Model',
      'Cyber Security & Encryption',
      'DBMS, SQL & MS Office Tools'
    ]
  };

  public get currentTopicSuggestions(): string[] {
    return this.subjectTopicSuggestions[this.aiGenSubject()] || [];
  }

  // Question bank explorer
  public cachedBank = signal<QuizQuestion[]>([]);
  public searchBankQuery: string = '';
  public filterBankDifficulty: string = 'all';
  public filterBankMastery: string = 'all';

  // Blueprints & Patterns
  public blueprints: MockExamBlueprint[] = [];
  public patterns: QuestionPattern[] = [];
  public selectedSimulationBlueprintId: string = 'ibps-po-prelims-live-1';
  public isSimulating: boolean = false;
  public dryRunResult: {
    latencyMs: number;
    questions: ExamQuestionItem[];
    sectionCounts: { name: string; count: number }[];
    sampleQuestions: ExamQuestionItem[];
  } | null = null;

  // Diagnostics counters
  public totalExams = signal<number>(0);
  public totalTopics = signal<number>(0);
  public totalQuizAttempts = signal<number>(0);
  public totalMockAttempts = signal<number>(0);
  public storageReports = signal<StorageKeyReport[]>([]);
  public totalStorageKb = signal<number>(0);

  // Dashboard & AI usage telemetry computed properties
  public aiQuestionsCount = computed(() => {
    return this.cachedBank().filter(q => q.is_ai_generated || q.id?.startsWith('gemini-')).length;
  });

  public engineQuestionsCount = computed(() => {
    const nonAiInBank = this.cachedBank().filter(q => !q.is_ai_generated && !q.id?.startsWith('gemini-')).length;
    const blueprintQuestions = this.blueprints.reduce((acc, bp) => {
      return acc + bp.sections_config.reduce((sAcc, sec) => sAcc + (sec.questionsCount || 0), 0);
    }, 0);
    const patternVariations = this.patterns.length * 20;
    const benchmarkQuestions = 300;
    return nonAiInBank + (blueprintQuestions || 100) + patternVariations + benchmarkQuestions;
  });

  public totalSystemQuestions = computed(() => {
    return this.aiQuestionsCount() + this.engineQuestionsCount();
  });

  public aiPercentage = computed(() => {
    const total = this.totalSystemQuestions();
    if (total === 0) return 0;
    return Math.round((this.aiQuestionsCount() / total) * 100);
  });

  public enginePercentage = computed(() => {
    const total = this.totalSystemQuestions();
    if (total === 0) return 100;
    return 100 - this.aiPercentage();
  });

  public averageAiLatency = computed(() => {
    const tel = this.aiConfig.telemetry();
    if (tel.totalRequests === 0) return 0;
    return Math.round(tel.totalLatencyMs / tel.totalRequests);
  });

  public telemetry = computed(() => this.aiConfig.telemetry());

  public subjectComparison = computed(() => {
    const subjects = [
      { name: 'Quantitative Aptitude', code: 'quant', color: '#3b82f6' },
      { name: 'Reasoning Ability', code: 'reasoning', color: '#8b5cf6' },
      { name: 'English Language', code: 'english', color: '#10b981' },
      { name: 'General & Banking Awareness', code: 'ga', color: '#f59e0b' },
      { name: 'Computer Aptitude', code: 'computer', color: '#06b6d4' }
    ];

    const bank = this.cachedBank();

    return subjects.map(sub => {
      const match = bank.filter(q => {
        const top = (q.topic_name || '').toLowerCase();
        const sid = (q.subject_id || '').toLowerCase();
        return top.includes(sub.code) || sid.includes(sub.code) || top.includes(sub.name.toLowerCase());
      });

      const aiCount = match.filter(q => q.is_ai_generated || q.id?.startsWith('gemini-')).length;
      const bankEngineCount = match.length - aiCount;

      let blueprintCount = 0;
      for (const bp of this.blueprints) {
        for (const sec of bp.sections_config) {
          if (sec.subjectCode === sub.code) {
            blueprintCount += sec.questionsCount;
          }
        }
      }

      const totalEngine = bankEngineCount + (blueprintCount || 40);
      const total = aiCount + totalEngine;
      const aiPercent = total > 0 ? Math.round((aiCount / total) * 100) : 0;
      const enginePercent = 100 - aiPercent;

      return {
        name: sub.name,
        code: sub.code,
        color: sub.color,
        total,
        aiCount,
        engineCount: totalEngine,
        aiPercent,
        enginePercent
      };
    });
  });

  public setPolicy(policy: 'smart_frugal' | 'engine_first' | 'always_ai' | 'offline_only'): void {
    this.aiConfig.setAiPolicy(policy);
    this.toast.success(`AI Policy updated to "${policy.replace('_', ' ').toUpperCase()}"`);
  }

  public clearTelemetryLogs(): void {
    this.aiConfig.clearTelemetry();
    this.toast.info('AI request telemetry logs cleared.');
  }

  public bankStats = computed(() => {
    const list = this.cachedBank();
    let mastered = 0;
    let needsReview = 0;
    let unattempted = 0;
    const subjectCounts: Record<string, number> = {};

    for (const q of list) {
      const c = q.correct_count || 0;
      const ic = q.incorrect_count || 0;
      if (c >= 2) mastered++;
      else if (ic > c) needsReview++;
      else unattempted++;

      const sub = q.topic_name || q.subject_id || 'Other';
      subjectCounts[sub] = (subjectCounts[sub] || 0) + 1;
    }

    return { mastered, needsReview, unattempted, subjectCounts };
  });

  public filteredBankQuestions = computed(() => {
    const query = this.searchBankQuery.trim().toLowerCase();
    const diff = this.filterBankDifficulty;
    const mastery = this.filterBankMastery;

    return this.cachedBank().filter(q => {
      const matchText = !query ||
        q.question_text.toLowerCase().includes(query) ||
        (q.topic_name && q.topic_name.toLowerCase().includes(query)) ||
        q.explanation.toLowerCase().includes(query);

      const matchDiff = diff === 'all' || q.difficulty === diff;

      let matchMastery = true;
      const c = q.correct_count || 0;
      const ic = q.incorrect_count || 0;
      if (mastery === 'mastered') matchMastery = c >= 2;
      else if (mastery === 'review') matchMastery = ic > c;
      else if (mastery === 'unattempted') matchMastery = c === 0 && ic === 0;

      return matchText && matchDiff && matchMastery;
    });
  });

  ngOnInit(): void {
    this.syncFormWithConfig();
    this.refreshAllDiagnostics();
  }

  private syncFormWithConfig(): void {
    const conf = this.aiConfig.config();
    this.primaryKeyModel = conf.primaryKey;
    this.fallbackKeyModel = conf.fallbackKey;
    this.modelModel = conf.model;
    this.temperatureModel = conf.temperature;
    this.maxCacheModel = conf.maxCacheSize;
  }

  public async refreshAllDiagnostics(): Promise<void> {
    this.isLoading.set(true);
    try {
      // 1. Sync question bank
      this.cachedBank.set(this.quizService.getStoredQuestionBank());

      // 2. Load blueprints and patterns
      this.blueprints = this.patternEngine.getDefaultBlueprints();
      this.patterns = this.patternEngine.getPatternsLibrary();

      // 3. Load database & storage counters
      const exams = await this.dataStorage.getExams();
      this.totalExams.set(exams.length);

      const topics = await this.dataStorage.getTopics();
      this.totalTopics.set(topics.length);

      const quizAttempts = await this.quizService.getQuizAttempts();
      this.totalQuizAttempts.set(quizAttempts.length);

      const mockAttempts = await this.dataStorage.getMockExamSimulatorAttempts();
      this.totalMockAttempts.set(mockAttempts.length);

      // 4. Calculate local storage footprint
      this.calculateStorageFootprint();
    } catch (e) {
      console.warn('Diagnostics refresh notice:', e);
    } finally {
      this.isLoading.set(false);
    }
  }

  private calculateStorageFootprint(): void {
    const reports: StorageKeyReport[] = [];
    let totalBytes = 0;

    const descriptions: Record<string, string> = {
      preptrack_gemini_config: 'Gemini AI API keys, status, and generation settings',
      preptrack_gemini_questions_cache: 'Cached AI-generated bank exam practice questions',
      preptrack_mock_exam_simulator_attempts: 'Full mock exam simulation scores & detailed responses',
      preptrack_dashboard_widgets: 'User customized dashboard cards visibility configuration',
      preptrack_offline_sync_queue: 'Offline mutations queued for cloud Supabase sync',
      preptrack_cached_exams: 'Offline bank exam catalog and deadlines',
      preptrack_cached_topics: 'Offline syllabus topics hierarchy'
    };

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;

      if (key.startsWith('preptrack_') || key.startsWith('sb-')) {
        const val = localStorage.getItem(key) || '';
        const sizeBytes = new Blob([val]).size;
        totalBytes += sizeBytes;

        let itemCount = 1;
        try {
          const parsed = JSON.parse(val);
          if (Array.isArray(parsed)) itemCount = parsed.length;
          else if (typeof parsed === 'object' && parsed !== null) itemCount = Object.keys(parsed).length;
        } catch {}

        reports.push({
          key,
          sizeBytes,
          itemCount,
          description: descriptions[key] || (key.startsWith('sb-') ? 'Supabase Authentication token & session state' : 'Local PrepTrack state')
        });
      }
    }

    reports.sort((a, b) => b.sizeBytes - a.sizeBytes);
    this.storageReports.set(reports);
    this.totalStorageKb.set(Math.round(totalBytes / 1024));
  }

  // --- GEMINI ACTIONS ---

  public toggleAiMaster(): void {
    const newState = !this.aiConfig.isAiGloballyEnabled();
    this.aiConfig.setAiEnabled(newState);
    this.toast.info(`Gemini AI Generation ${newState ? 'ENABLED' : 'DISABLED'}`);
  }

  public async savePrimaryKey(): Promise<void> {
    this.aiConfig.updateConfig({ primaryKey: this.primaryKeyModel.trim() });
    this.toast.success('Primary Gemini API Key saved');
  }

  public async saveFallbackKey(): Promise<void> {
    this.aiConfig.updateConfig({ fallbackKey: this.fallbackKeyModel.trim() });
    this.toast.success('Fallback Gemini API Key saved');
  }

  public saveModelParameters(): void {
    this.aiConfig.updateConfig({
      model: this.modelModel,
      temperature: Number(this.temperatureModel),
      maxCacheSize: Number(this.maxCacheModel)
    });
    this.toast.success('Model & Cache configuration updated');
  }

  public resetAiDefaults(): void {
    this.aiConfig.resetToDefaults();
    this.syncFormWithConfig();
    this.toast.info('Restored default AI token settings');
  }

  public async testPrimaryKey(): Promise<void> {
    this.isTestingPrimary = true;
    this.primaryTestMessage = '';
    try {
      const res = await this.aiConfig.applyAndVerifyPrimaryKey(this.primaryKeyModel);
      this.primaryTestMessage = res.message;
      if (res.success) {
        this.toast.success(`Primary Token Verified! 200 OK (${res.latencyMs}ms)`);
      } else {
        this.toast.error(`Primary Token Failed: ${res.message}`);
      }
    } finally {
      this.isTestingPrimary = false;
    }
  }

  public async testFallbackKey(): Promise<void> {
    this.isTestingFallback = true;
    this.fallbackTestMessage = '';
    try {
      const res = await this.aiConfig.applyAndVerifyFallbackKey(this.fallbackKeyModel);
      this.fallbackTestMessage = res.message;
      if (res.success) {
        this.toast.success(`Fallback Token Verified! 200 OK (${res.latencyMs}ms)`);
      } else {
        this.toast.error(`Fallback Token Failed: ${res.message}`);
      }
    } finally {
      this.isTestingFallback = false;
    }
  }

  public async applyQuickToken(): Promise<void> {
    const key = this.quickTokenInput.trim();
    if (!key) return;

    this.isTestingQuickToken = true;
    this.quickTokenResult = null;
    try {
      const res = await this.aiConfig.applyAndVerifyPrimaryKey(key);
      this.quickTokenResult = res;
      if (res.success) {
        this.primaryKeyModel = key;
        this.quickTokenInput = '';
        this.toast.success(`New token applied & verified successfully! (${res.latencyMs}ms)`);
      } else {
        this.toast.error(`Token verification failed: ${res.message}`);
      }
    } finally {
      this.isTestingQuickToken = false;
    }
  }

  // --- QUESTION BANK ACTIONS ---

  public deleteQuestion(id: string): void {
    const success = this.quizService.deleteQuestionFromBank(id);
    if (success) {
      this.cachedBank.set(this.quizService.getStoredQuestionBank());
      this.toast.info('Question removed from local bank');
    }
  }

  public clearBankCache(): void {
    if (confirm('Are you sure you want to clear the entire cached question bank? Practice quizzes will regenerate questions or use built-in offline pools.')) {
      this.quizService.clearQuestionBank();
      this.cachedBank.set([]);
      this.calculateStorageFootprint();
      this.toast.success('Question bank cache cleared');
    }
  }

  public exportBankJson(): void {
    const jsonStr = this.quizService.exportQuestionBankJson();
    this.downloadJsonFile(jsonStr, `preptrack_gemini_bank_${Date.now()}.json`);
    this.toast.success('Question bank exported');
  }

  public seedSampleQuestions(): void {
    const sample: QuizQuestion[] = [
      {
        id: `seed-${Date.now()}-1`,
        subject_id: 'sub-quant',
        topic_name: 'Percentage & Profit/Loss',
        question_text: 'A trader marks his goods 30% above the cost price and allows a discount of 15% for cash payment. Find his overall profit percentage.',
        options: ['10.5%', '12.0%', '15.0%', '8.5%'],
        correct_option_index: 0,
        explanation: 'Let CP = 100. Marked Price MP = 130. Cash Selling Price SP = 130 × (1 - 0.15) = 130 × 0.85 = 110.5. Net profit = 110.5 - 100 = 10.5%.',
        difficulty: 'medium',
        correct_count: 0,
        incorrect_count: 0
      },
      {
        id: `seed-${Date.now()}-2`,
        subject_id: 'sub-quant',
        topic_name: 'Simple & Compound Interest',
        question_text: 'The difference between compound interest and simple interest on a sum of ₹15,000 for 2 years at 10% per annum is:',
        options: ['₹150', '₹125', '₹175', '₹200'],
        correct_option_index: 0,
        explanation: 'For 2 years, CI - SI = P × (R/100)² = 15000 × (10/100)² = 15000 × 0.01 = ₹150.',
        difficulty: 'easy',
        correct_count: 0,
        incorrect_count: 0
      },
      {
        id: `seed-${Date.now()}-3`,
        subject_id: 'sub-reasoning',
        topic_name: 'Syllogisms',
        question_text: 'Statements: Only a few Banks are NBFCs. All NBFCs are Lenders. Conclusions: I. Some Banks are Lenders. II. All Banks can never be NBFCs.',
        options: ['Both I and II follow', 'Only I follows', 'Only II follows', 'Neither I nor II follows'],
        correct_option_index: 0,
        explanation: 'Since all NBFCs are Lenders, the intersection of Banks and NBFCs is also within Lenders (I follows). "Only a few A are B" implies some A are not B, so all Banks can never be NBFCs (II follows).',
        difficulty: 'medium',
        correct_count: 0,
        incorrect_count: 0
      },
      {
        id: `seed-${Date.now()}-4`,
        subject_id: 'sub-english',
        topic_name: 'Error Spotting & Grammar',
        question_text: 'Identify the segment with an error: "Neither the branch manager (A) nor the loan officers (B) was present at (C) the credit review meeting (D)."',
        options: ['Segment (C)', 'Segment (B)', 'Segment (A)', 'Segment (D)'],
        correct_option_index: 0,
        explanation: 'Under the proximity rule for "Neither...nor", the verb agrees with the closer subject ("loan officers", plural). Hence "was present" must be "were present".',
        difficulty: 'medium',
        correct_count: 0,
        incorrect_count: 0
      },
      {
        id: `seed-${Date.now()}-5`,
        subject_id: 'sub-ga',
        topic_name: 'Banking & Financial Awareness',
        question_text: 'Under the prompt corrective action (PCA) framework of RBI, which of the following is NOT a primary monitoring metric?',
        options: ['Return on Assets (Net Profitability)', 'Capital to Risk-Weighted Assets Ratio (CRAR)', 'Net Non-Performing Assets (NNPA)', 'Tier-1 Leverage Ratio'],
        correct_option_index: 0,
        explanation: 'In the revised PCA framework, profitability (ROA) was removed as a direct trigger parameter; the primary triggers are Capital (CRAR/Tier 1), Asset Quality (NNPA), and Leverage.',
        difficulty: 'hard',
        correct_count: 0,
        incorrect_count: 0
      }
    ];

    this.quizService.importQuestionsToBank(sample);
    this.cachedBank.set(this.quizService.getStoredQuestionBank());
    this.calculateStorageFootprint();
    this.toast.success('Seeded 5 sample banking questions into local bank');
  }

  // --- AI QUESTION GENERATOR MODAL ACTIONS ---

  public openAiGenModal(): void {
    this.aiGenResult = null;
    this.showAiGenModal.set(true);
  }

  public closeAiGenModal(): void {
    if (this.isGeneratingAi()) return;
    this.showAiGenModal.set(false);
  }

  public setAiTopic(topic: string): void {
    this.aiGenTopic.set(topic);
  }

  public onSubjectChange(newSub: string): void {
    this.aiGenSubject.set(newSub);
    const suggestions = this.subjectTopicSuggestions[newSub];
    if (suggestions && suggestions.length > 0) {
      this.aiGenTopic.set(suggestions[0]);
    } else {
      this.aiGenTopic.set('');
    }
  }

  public async generateAiQuestionsForBank(): Promise<void> {
    if (!this.aiConfig.isAiGloballyEnabled()) {
      this.toast.error('Gemini AI is globally disabled. Please enable it in the Gemini AI & Tokens tab.');
      return;
    }

    const primaryKey = this.aiConfig.getEffectivePrimaryKey();
    const fallbackKey = this.aiConfig.getEffectiveFallbackKey();
    if (!primaryKey && !fallbackKey) {
      this.toast.error('No Gemini API Key found. Please add an API key in the Gemini AI & Tokens tab.');
      return;
    }

    this.isGeneratingAi.set(true);
    this.aiGenResult = null;
    const startTime = performance.now();

    try {
      const subject = this.aiGenSubject();
      const topic = this.aiGenTopic().trim() || undefined;
      const count = Number(this.aiGenCount());
      const diff = this.aiGenDifficulty();

      const questions = await this.quizService.generateGeminiQuestions(
        subject,
        topic,
        count,
        diff
      );

      const latencyMs = Math.round(performance.now() - startTime);

      // Verify whether questions were AI generated
      const aiItems = questions.filter(q => q.is_ai_generated || q.id?.startsWith('gemini-'));

      if (aiItems.length > 0) {
        // Ensure imported/cached into stored bank
        this.quizService.importQuestionsToBank(aiItems);
        this.cachedBank.set(this.quizService.getStoredQuestionBank());
        this.calculateStorageFootprint();

        this.aiGenResult = {
          success: true,
          count: aiItems.length,
          latencyMs
        };
        this.toast.success(`Successfully added ${aiItems.length} fresh AI question(s) to the Question Bank! (${latencyMs}ms)`);
      } else {
        this.aiGenResult = {
          success: false,
          count: 0,
          latencyMs,
          error: 'Gemini request did not return valid AI questions (API quota or network issue). Check AI Telemetry for details.'
        };
        this.toast.error('AI question generation did not succeed. Check telemetry logs.');
      }
    } catch (err: any) {
      const latencyMs = Math.round(performance.now() - startTime);
      this.aiGenResult = {
        success: false,
        count: 0,
        latencyMs,
        error: err?.message || 'Unexpected generation error'
      };
      this.toast.error(`Generation error: ${err?.message || 'Failed'}`);
    } finally {
      this.isGeneratingAi.set(false);
    }
  }

  // --- PATTERN ENGINE DRY-RUN SIMULATION ---

  public runEngineDryRun(): void {
    const bp = this.blueprints.find(b => b.id === this.selectedSimulationBlueprintId);
    if (!bp) return;

    this.isSimulating = true;
    const startTime = performance.now();

    try {
      const generated = this.patternEngine.generateExamQuestions(bp);
      const latencyMs = Math.round(performance.now() - startTime);

      const sectionCountsMap: Record<string, number> = {};
      for (const q of generated) {
        sectionCountsMap[q.sectionName] = (sectionCountsMap[q.sectionName] || 0) + 1;
      }

      const sectionCounts = Object.entries(sectionCountsMap).map(([name, count]) => ({ name, count }));
      const sampleQuestions = generated.slice(0, 4);

      this.dryRunResult = {
        latencyMs,
        questions: generated,
        sectionCounts,
        sampleQuestions
      };

      this.toast.success(`Simulated ${generated.length} questions in ${latencyMs}ms!`);
    } catch (err: any) {
      this.toast.error(`Dry run failed: ${err.message}`);
    } finally {
      this.isSimulating = false;
    }
  }

  // --- SYSTEM BACKUP & EXPORT ---

  public async exportFullBackupJson(): Promise<void> {
    try {
      const backup = {
        exportTimestamp: new Date().toISOString(),
        version: 'PrepTrack-v2.4',
        user: this.authService.currentUser()?.email || 'local',
        aiConfig: this.aiConfig.config(),
        cachedQuestions: this.quizService.getStoredQuestionBank(),
        quizAttempts: await this.quizService.getQuizAttempts(),
        mockAttempts: await this.dataStorage.getMockExamSimulatorAttempts(),
        exams: await this.dataStorage.getExams(),
        topics: await this.dataStorage.getTopics()
      };

      this.downloadJsonFile(JSON.stringify(backup, null, 2), `preptrack_system_backup_${Date.now()}.json`);
      this.toast.success('Complete system backup exported');
    } catch (e: any) {
      this.toast.error(`Export failed: ${e.message}`);
    }
  }

  private downloadJsonFile(content: string, fileName: string): void {
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
