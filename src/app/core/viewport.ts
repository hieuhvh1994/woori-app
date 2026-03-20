import { Injectable, inject, OnDestroy, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Sets --app-height CSS variable to window.innerHeight on startup and on resize.
 * This fixes the mobile browser toolbar issue where 100dvh is unstable on first load.
 */
@Injectable({ providedIn: 'root' })
export class ViewportService implements OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly bound = () => this.update();

  init(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.update();
    window.addEventListener('resize', this.bound);
    // Also listen to visualViewport resize (handles iOS toolbar show/hide)
    window.visualViewport?.addEventListener('resize', this.bound);
  }

  private update(): void {
    const h = window.visualViewport?.height ?? window.innerHeight;
    document.documentElement.style.setProperty('--app-height', `${h}px`);
  }

  ngOnDestroy(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    window.removeEventListener('resize', this.bound);
    window.visualViewport?.removeEventListener('resize', this.bound);
  }
}

