import { Injectable, signal, inject } from '@angular/core';
import { ToastService } from './toast.service';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

@Injectable({
  providedIn: 'root'
})
export class PwaService {
  private toast = inject(ToastService);

  private deferredPrompt: BeforeInstallPromptEvent | null = null;

  public canInstall = signal<boolean>(false);
  public isInstalled = signal<boolean>(false);
  public isOnline = signal<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);
  public isUpdateAvailable = signal<boolean>(false);
  public isIOS = signal<boolean>(false);

  private swRegistration: ServiceWorkerRegistration | null = null;

  constructor() {
    this.checkStandaloneMode();
    this.detectPlatform();
    this.initEventListeners();
    this.initServiceWorkerUpdates();
  }

  private checkStandaloneMode(): void {
    if (typeof window === 'undefined') return;

    const hasMatchMedia = typeof window.matchMedia === 'function';
    const isStandalone =
      (hasMatchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
      (hasMatchMedia && window.matchMedia('(display-mode: window-controls-overlay)').matches) ||
      (window.navigator as any)?.standalone === true ||
      (typeof document !== 'undefined' && document.referrer && document.referrer.includes('android-app://'));

    this.isInstalled.set(Boolean(isStandalone));
  }

  private detectPlatform(): void {
    if (typeof window === 'undefined') return;
    const ua = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(ua);
    this.isIOS.set(isIosDevice);
  }

  private initEventListeners(): void {
    if (typeof window === 'undefined') return;

    // Check if deferredPrompt was already captured globally
    if ((window as any).deferredPrompt) {
      this.deferredPrompt = (window as any).deferredPrompt;
      this.canInstall.set(true);
    }

    // Capture standard or forwarded beforeinstallprompt
    const handlePrompt = (e: any) => {
      const promptEvent = e.detail || e;
      if (promptEvent && typeof promptEvent.prompt === 'function') {
        this.deferredPrompt = promptEvent;
        this.canInstall.set(true);
      }
    };

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      handlePrompt(e);
    });
    window.addEventListener('pwa-prompt-ready', handlePrompt);

    // Installed event
    const handleInstalled = () => {
      this.deferredPrompt = null;
      this.canInstall.set(false);
      this.isInstalled.set(true);
      this.toast.success('PrepTrack has been added to your home screen!');
    };
    window.addEventListener('appinstalled', handleInstalled);
    window.addEventListener('pwa-installed', handleInstalled);

    // Online/Offline status
    window.addEventListener('online', () => {
      this.isOnline.set(true);
      this.toast.success('Back online! Synced with server.');
    });

    window.addEventListener('offline', () => {
      this.isOnline.set(false);
      this.toast.warning('Working in offline mode. Changes will sync when reconnected.');
    });
  }

  private initServiceWorkerUpdates(): void {
    if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return;

    navigator.serviceWorker.getRegistration().then((reg) => {
      if (!reg) return;
      this.swRegistration = reg;

      // Check for updates
      reg.addEventListener('updatefound', () => {
        const installingWorker = reg.installing;
        if (installingWorker) {
          installingWorker.addEventListener('statechange', () => {
            if (
              installingWorker.state === 'installed' &&
              navigator.serviceWorker.controller
            ) {
              this.isUpdateAvailable.set(true);
              this.toast.info('New PrepTrack version available. Refresh to update.');
            }
          });
        }
      });
    });

    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing) {
        refreshing = true;
        window.location.reload();
      }
    });
  }

  /**
   * Prompts the user to install the PWA or shows guidance
   */
  public async promptInstall(): Promise<boolean> {
    if (this.deferredPrompt) {
      try {
        await this.deferredPrompt.prompt();
        const choice = await this.deferredPrompt.userChoice;
        if (choice.outcome === 'accepted') {
          this.canInstall.set(false);
          this.deferredPrompt = null;
          return true;
        }
        return false;
      } catch (err) {
        console.warn('Install prompt error:', err);
      }
    }

    if (this.isIOS()) {
      this.toast.info(
        'To install PrepTrack on iPhone/iPad: tap the Share button in Safari, then tap "Add to Home Screen".'
      );
      return false;
    }

    if (this.isInstalled()) {
      this.toast.info('PrepTrack is already installed and running as an app.');
      return false;
    }

    this.toast.info(
      'To install PrepTrack: click the Install icon (computer screen / down arrow) in your browser address bar or menu.'
    );
    return false;
  }

  /**
   * Triggers the waiting service worker to activate and reload
   */
  public applyUpdate(): void {
    if (this.swRegistration && this.swRegistration.waiting) {
      this.swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
    } else {
      window.location.reload();
    }
  }
}
