import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { AiConfigService } from './ai-config.service';

describe('AiConfigService', () => {
  let service: AiConfigService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(AiConfigService);
  });

  it('should initialize with default enabled state and parameters', () => {
    expect(service.isAiGloballyEnabled()).toBe(true);
    expect(service.getEffectiveModel()).toBe('gemini-3.1-flash-lite-preview');
    expect(service.getTemperature()).toBe(0.7);
    expect(service.getMaxCacheSize()).toBe(300);
  });

  it('should toggle AI enabled/disabled state and persist', () => {
    service.setAiEnabled(false);
    expect(service.isAiGloballyEnabled()).toBe(false);

    const stored = JSON.parse(localStorage.getItem('preptrack_gemini_config') || '{}');
    expect(stored.enabled).toBe(false);

    service.setAiEnabled(true);
    expect(service.isAiGloballyEnabled()).toBe(true);
  });

  it('should update and retrieve primary and fallback keys', () => {
    service.updateConfig({
      primaryKey: 'custom-primary-key-123',
      fallbackKey: 'custom-fallback-key-456'
    });

    expect(service.getEffectivePrimaryKey()).toBe('custom-primary-key-123');
    expect(service.getEffectiveFallbackKey()).toBe('custom-fallback-key-456');
  });

  it('should return error result when testing empty token', async () => {
    const res = await service.testToken('');
    expect(res.success).toBe(false);
    expect(res.status).toBe('invalid');
    expect(res.message).toContain('empty');
  });

  it('should reset to defaults properly', () => {
    service.updateConfig({
      enabled: false,
      model: 'gemini-1.5-pro',
      temperature: 0.2,
      maxCacheSize: 500
    });

    expect(service.isAiGloballyEnabled()).toBe(false);

    service.resetToDefaults();
    expect(service.isAiGloballyEnabled()).toBe(true);
    expect(service.getEffectiveModel()).toBe('gemini-3.1-flash-lite-preview');
    expect(service.getTemperature()).toBe(0.7);
    expect(service.getMaxCacheSize()).toBe(300);
  });
});
