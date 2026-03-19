import {
  ChangeDetectionStrategy, Component, OnDestroy, OnInit,
  computed, inject, signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DOCUMENT } from '@angular/common';

export type FindStep = 'phone' | 'account' | 'email' | 'otp';

@Component({
  selector: 'app-find-id',
  imports: [
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './find-id.html',
  styleUrls: ['./find-id.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FindIdComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private doc = inject(DOCUMENT);

  readonly step = signal<FindStep>('phone');
  readonly sheetOpen = signal(false);

  readonly phone = signal('');
  readonly accountNo = signal('');
  readonly accountPw = signal('');
  readonly email = signal('');
  readonly otp = signal('');
  readonly otpSent = signal(false);
  readonly otpTimer = signal(180);
  readonly tooltipVisible = signal(false);
  readonly busy = signal(false);

  readonly maskedPhone = computed(() => {
    const p = this.phone();
    if (p.length >= 6) return p.slice(0, 4) + '***' + p.slice(-3);
    return p;
  });

  readonly timerLabel = computed(() => {
    const s = this.otpTimer();
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  });

  readonly heading = computed(() => {
    switch (this.step()) {
      case 'phone':   return 'Nhập số điện thoại đã đăng ký.';
      case 'account': return null;
      case 'email':   return 'Nhập địa chỉ email đã đăng ký.';
      case 'otp':     return 'Nhập mã xác thực đã được gửi đến số điện thoại đăng kí.';
    }
  });

  private timerInterval: ReturnType<typeof setInterval> | null = null;

  ngOnInit(): void {
    this.setThemeColor('#ffffff');
  }

  ngOnDestroy(): void {
    this.clearTimer();
    this.setThemeColor('#5a9cf8');
  }

  private setThemeColor(color: string): void {
    const meta = this.doc.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (meta) meta.content = color;
  }

  goBack(): void {
    if (this.step() === 'otp') {
      this.clearTimer();
      this.otpSent.set(false);
      this.otp.set('');
      this.step.set('phone');
    } else {
      this.router.navigateByUrl('/login');
    }
  }

  openMethodSheet(): void {
    this.sheetOpen.set(true);
  }

  closeSheet(): void {
    this.sheetOpen.set(false);
  }

  pickMethod(method: FindStep): void {
    this.sheetOpen.set(false);
    this.resetForm();
    this.step.set(method);
  }

  private resetForm(): void {
    this.phone.set('');
    this.accountNo.set('');
    this.accountPw.set('');
    this.email.set('');
    this.otp.set('');
    this.otpSent.set(false);
    this.clearTimer();
  }

  sendOtp(): void {
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

  submit(): void {
    const s = this.step();
    if (s === 'phone' || s === 'email') {
      this.step.set('otp');
    } else if (s === 'account') {
      alert('Tìm tài khoản thành công! (demo)');
      this.router.navigateByUrl('/login');
    } else if (s === 'otp') {
      alert('Xác nhận thành công! ID của bạn: daoduyhieu (demo)');
      this.router.navigateByUrl('/login');
    }
  }

  toggleTooltip(): void {
    this.tooltipVisible.set(!this.tooltipVisible());
  }

  goForgotPassword(): void {
    this.router.navigateByUrl('/forgot-password');
  }

  get canSubmitPhone(): boolean   { return this.phone().trim().length >= 9; }
  get canSubmitAccount(): boolean { return this.accountNo().trim().length > 0 && this.accountPw().trim().length > 0; }
  get canSubmitEmail(): boolean   { return this.email().trim().includes('@'); }
  get canConfirmOtp(): boolean    { return this.otp().trim().length >= 4; }
}

