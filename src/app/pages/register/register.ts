import {
  ChangeDetectionStrategy, Component, OnDestroy, OnInit,
  inject, signal, computed,
} from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [FormsModule, MatButtonModule, MatIconModule],
  templateUrl: './register.html',
  styleUrls: ['./register.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private doc = inject(DOCUMENT);

  readonly phone = signal('');
  readonly otp = signal('');
  readonly phoneError = signal(false);
  readonly otpSent = signal(false);
  readonly otpTimer = signal(180);

  readonly isPhoneValid = computed(() => /^0\d{9}$/.test(this.phone().trim()));
  readonly canNext = computed(() => this.isPhoneValid() && this.otp().trim().length >= 4);

  readonly timerLabel = computed(() => {
    const s = this.otpTimer();
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  });

  private timerInterval: ReturnType<typeof setInterval> | null = null;

  ngOnInit(): void {
    this.setThemeColor('#5a9cf8');
  }

  ngOnDestroy(): void {
    this.clearTimer();
    this.setThemeColor('#5a9cf8');
  }

  private setThemeColor(color: string): void {
    const meta = this.doc.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (meta) meta.content = color;
  }

  onPhoneInput(value: string): void {
    this.phone.set(value);
    this.phoneError.set(false);
  }

  clearPhone(): void {
    this.phone.set('');
    this.phoneError.set(false);
  }

  sendOtp(): void {
    if (!this.isPhoneValid()) {
      this.phoneError.set(true);
      return;
    }
    this.phoneError.set(false);
    this.otpSent.set(true);
    this.otpTimer.set(180);
    this.clearTimer();
    this.timerInterval = setInterval(() => {
      const cur = this.otpTimer();
      if (cur <= 0) { this.clearTimer(); return; }
      this.otpTimer.set(cur - 1);
    }, 1000);
  }

  private clearTimer(): void {
    if (this.timerInterval !== null) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  cancel(): void {
    this.router.navigateByUrl('/login');
  }

  goBack(): void {
    history.back();
  }

  submit(): void {
    if (!this.isPhoneValid()) {
      this.phoneError.set(true);
      return;
    }
    // Demo: tiếp tục luồng đăng ký
    alert('Đăng ký thành công! (demo)');
    this.router.navigateByUrl('/login');
  }
}

