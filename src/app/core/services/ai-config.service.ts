import { Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';

export interface GeminiTokenConfig {
  enabled: boolean;
  primaryKey: string;
  fallbackKey: string;
  model: string;
  temperature: number;
  maxCacheSize: number;
  lastTestedAt?: string;
  primaryKeyStatus?: 'valid' | 'invalid' | 'untested' | 'testing';
  primaryKeyLatencyMs?: number;
  fallbackKeyStatus?: 'valid' | 'invalid' | 'untested' | 'testing';
  fallbackKeyLatencyMs?: number;
  errorMessage?: string;
}

export interface TokenTestResult {
  success: boolean;
  status: 'valid' | 'invalid';
  message: string;
  latencyMs: number;
  httpStatus?: number;
}

const STORAGE_KEY = 'preptrack_gemini_config';

@Injectable({
  providedIn: 'root'
})
export class AiConfigService {
  private readonly defaultPrimaryKey = (environment as any).geminiApiKey || '';
  private readonly defaultFallbackKey = (environment as any).geminiApiKeyFallback || '';
  private readonly defaultModel = 'gemini-3.1-flash-lite-preview';

  public readonly config = signal<GeminiTokenConfig>(this.loadConfig());

  constructor() {
    // If not in storage yet, persist initial state
    if (!localStorage.getItem(STORAGE_KEY)) {
      this.persistConfig(this.config());
    }
  }

  private loadConfig(): GeminiTokenConfig {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          enabled: parsed.enabled !== undefined ? !!parsed.enabled : true,
          primaryKey: parsed.primaryKey !== undefined ? parsed.primaryKey : this.defaultPrimaryKey,
          fallbackKey: parsed.fallbackKey !== undefined ? parsed.fallbackKey : this.defaultFallbackKey,
          model: parsed.model || this.defaultModel,
          temperature: typeof parsed.temperature === 'number' ? parsed.temperature : 0.7,
          maxCacheSize: typeof parsed.maxCacheSize === 'number' ? parsed.maxCacheSize : 300,
          lastTestedAt: parsed.lastTestedAt,
          primaryKeyStatus: parsed.primaryKeyStatus || 'untested',
          primaryKeyLatencyMs: parsed.primaryKeyLatencyMs,
          fallbackKeyStatus: parsed.fallbackKeyStatus || 'untested',
          fallbackKeyLatencyMs: parsed.fallbackKeyLatencyMs,
          errorMessage: parsed.errorMessage
        };
      }
    } catch (e) {
      console.warn('Failed to parse Gemini config from storage, using defaults:', e);
    }

    return {
      enabled: true,
      primaryKey: this.defaultPrimaryKey,
      fallbackKey: this.defaultFallbackKey,
      model: this.defaultModel,
      temperature: 0.7,
      maxCacheSize: 300,
      primaryKeyStatus: 'untested',
      fallbackKeyStatus: 'untested'
    };
  }

  private persistConfig(conf: GeminiTokenConfig): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(conf));
    } catch (e) {
      console.warn('Failed to persist Gemini config:', e);
    }
  }

  public updateConfig(partial: Partial<GeminiTokenConfig>): void {
    const updated: GeminiTokenConfig = {
      ...this.config(),
      ...partial
    };
    this.config.set(updated);
    this.persistConfig(updated);
  }

  public setAiEnabled(enabled: boolean): void {
    this.updateConfig({ enabled });
  }

  public resetToDefaults(): void {
    const resetConf: GeminiTokenConfig = {
      enabled: true,
      primaryKey: this.defaultPrimaryKey,
      fallbackKey: this.defaultFallbackKey,
      model: this.defaultModel,
      temperature: 0.7,
      maxCacheSize: 300,
      primaryKeyStatus: 'untested',
      fallbackKeyStatus: 'untested',
      lastTestedAt: undefined,
      errorMessage: undefined
    };
    this.config.set(resetConf);
    this.persistConfig(resetConf);
  }

  public isAiGloballyEnabled(): boolean {
    return this.config().enabled;
  }

  public getEffectivePrimaryKey(): string {
    const key = this.config().primaryKey?.trim();
    return key || this.defaultPrimaryKey;
  }

  public getEffectiveFallbackKey(): string {
    const key = this.config().fallbackKey?.trim();
    return key || this.defaultFallbackKey;
  }

  public getEffectiveModel(): string {
    return this.config().model?.trim() || this.defaultModel;
  }

  public getTemperature(): number {
    return this.config().temperature ?? 0.7;
  }

  public getMaxCacheSize(): number {
    return this.config().maxCacheSize ?? 300;
  }

  /**
   * Test an API Key against Google's Gemini API with a lightweight ping
   */
  public async testToken(apiKey: string, modelOverride?: string): Promise<TokenTestResult> {
    const key = apiKey?.trim();
    if (!key) {
      return {
        success: false,
        status: 'invalid',
        message: 'API Key is empty. Please enter a valid Gemini token.',
        latencyMs: 0
      };
    }

    const model = modelOverride || this.getEffectiveModel();
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
    const startTime = performance.now();

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Respond with the word "OK"' }] }],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 5
          }
        })
      });

      const latencyMs = Math.round(performance.now() - startTime);

      if (response.ok) {
        return {
          success: true,
          status: 'valid',
          message: `Connected successfully! 200 OK (${latencyMs}ms)`,
          latencyMs,
          httpStatus: response.status
        };
      } else {
        const errorText = await response.text();
        let errorMsg = `HTTP ${response.status}`;
        try {
          const parsed = JSON.parse(errorText);
          if (parsed.error?.message) {
            errorMsg += `: ${parsed.error.message}`;
          }
        } catch {
          errorMsg += `: ${errorText.slice(0, 100)}`;
        }

        return {
          success: false,
          status: 'invalid',
          message: errorMsg,
          latencyMs,
          httpStatus: response.status
        };
      }
    } catch (err: any) {
      const latencyMs = Math.round(performance.now() - startTime);
      return {
        success: false,
        status: 'invalid',
        message: err.message || 'Network connection failed',
        latencyMs
      };
    }
  }

  /**
   * Quick action to test and update the primary key
   */
  public async applyAndVerifyPrimaryKey(newKey: string): Promise<TokenTestResult> {
    this.updateConfig({ primaryKey: newKey.trim(), primaryKeyStatus: 'testing' });
    const result = await this.testToken(newKey);
    this.updateConfig({
      primaryKeyStatus: result.status,
      primaryKeyLatencyMs: result.latencyMs,
      lastTestedAt: new Date().toISOString(),
      errorMessage: result.success ? undefined : result.message
    });
    return result;
  }

  /**
   * Quick action to test and update the fallback key
   */
  public async applyAndVerifyFallbackKey(newKey: string): Promise<TokenTestResult> {
    this.updateConfig({ fallbackKey: newKey.trim(), fallbackKeyStatus: 'testing' });
    const result = await this.testToken(newKey);
    this.updateConfig({
      fallbackKeyStatus: result.status,
      fallbackKeyLatencyMs: result.latencyMs,
      lastTestedAt: new Date().toISOString()
    });
    return result;
  }
}
