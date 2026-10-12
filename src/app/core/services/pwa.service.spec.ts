import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { PwaService } from './pwa.service';
import { ToastService } from './toast.service';

describe('PwaService', () => {
  let service: PwaService;
  let toastMock: Partial<ToastService>;

  beforeEach(() => {
    toastMock = {
      info: () => {},
      success: () => {},
      warning: () => {},
      error: () => {}
    };

    TestBed.configureTestingModule({
      providers: [
        PwaService,
        { provide: ToastService, useValue: toastMock }
      ]
    });

    service = TestBed.inject(PwaService);
  });

  it('should initialize with signals for install and online state', () => {
    expect(service).toBeTruthy();
    expect(typeof service.canInstall()).toBe('boolean');
    expect(typeof service.isInstalled()).toBe('boolean');
    expect(typeof service.isOnline()).toBe('boolean');
    expect(typeof service.isUpdateAvailable()).toBe('boolean');
  });

  it('should respond appropriately when promptInstall is called without prompt event', async () => {
    const result = await service.promptInstall();
    expect(result).toBe(false);
  });
});
