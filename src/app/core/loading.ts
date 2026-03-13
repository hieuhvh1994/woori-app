import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  isLoading = signal(false);
  private timeoutId?: number;

  /**
   * Hiển thị loading với thời gian tùy chỉnh
   * @param duration Thời gian loading (ms). Nếu không truyền, loading sẽ hiển thị cho đến khi gọi hide()
   */
  show(duration?: number): void {
    this.isLoading.set(true);

    if (duration && duration > 0) {
      this.clearTimeout();
      this.timeoutId = window.setTimeout(() => {
        this.hide();
      }, duration);
    }
  }

  hide(): void {
    this.clearTimeout();
    this.isLoading.set(false);
  }

  private clearTimeout(): void {
    if (this.timeoutId) {
      window.clearTimeout(this.timeoutId);
      this.timeoutId = undefined;
    }
  }
}

