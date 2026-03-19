import {
  ChangeDetectionStrategy, Component, OnDestroy, OnInit,
  inject, signal, computed,
} from '@angular/core';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-mobile-otp',
  imports: [],
  templateUrl: './mobile-otp.html',
  styleUrls: ['./mobile-otp.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileOtpComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private doc = inject(DOCUMENT);

  // Mã OTP 6 số random, sinh mới mỗi lần vào trang
  readonly otpCode = signal(this.generateOtp());
  readonly timer = signal(180); // 3 phút

  readonly timerLabel = computed(() => {
    const s = this.timer();
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  });

  private interval: ReturnType<typeof setInterval> | null = null;

  ngOnInit(): void {
    this.setThemeColor('#5a9cf8');
    this.startTimer();
  }

  ngOnDestroy(): void {
    this.stopTimer();
    this.setThemeColor('#5a9cf8');
  }

  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private startTimer(): void {
    this.stopTimer();
    this.interval = setInterval(() => {
      const cur = this.timer();
      if (cur <= 0) {
        this.stopTimer();
        // Sinh mã mới khi hết giờ và reset timer
        this.otpCode.set(this.generateOtp());
        this.timer.set(180);
        this.startTimer();
        return;
      }
      this.timer.set(cur - 1);
    }, 1000);
  }

  private stopTimer(): void {
    if (this.interval !== null) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  private setThemeColor(color: string): void {
    const meta = this.doc.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (meta) meta.content = color;
  }

  done(): void {
    history.back();
  }
}

