import { Injectable, inject, OnDestroy, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Sets --app-height CSS variable from the visual viewport.
 * This avoids first-render gaps on iOS/PWA where 100dvh can be stale
 * until the browser chrome settles.
 */
@Injectable({ providedIn: 'root' })
export class ViewportService implements OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly bound = () => this.update();

  init(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.update();
    requestAnimationFrame(this.bound);
    window.setTimeout(this.bound, 60);
    window.setTimeout(this.bound, 240);

    window.addEventListener('resize', this.bound, { passive: true });
    window.addEventListener('orientationchange', this.bound, { passive: true });
    window.visualViewport?.addEventListener('resize', this.bound, { passive: true });
    window.visualViewport?.addEventListener('scroll', this.bound, { passive: true });
  }

  private update(): void {
    const height = window.visualViewport?.height ?? window.innerHeight;
    document.documentElement.style.setProperty('--app-height', `${Math.round(height)}px`);
  }

  ngOnDestroy(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    window.removeEventListener('resize', this.bound);
    window.removeEventListener('orientationchange', this.bound);
    window.visualViewport?.removeEventListener('resize', this.bound);
    window.visualViewport?.removeEventListener('scroll', this.bound);
  }
}
