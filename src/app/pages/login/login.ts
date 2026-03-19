import {
  Component, inject, OnInit, OnDestroy,
  ChangeDetectionStrategy, signal, computed,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { AuthService } from '../../core/auth';
import { LoadingService } from '../../core/loading';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    NgOptimizedImage,
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit, OnDestroy {
  private auth = inject(AuthService);
  private router = inject(Router);
  private loading = inject(LoadingService);
  private doc = inject(DOCUMENT);

  pw = '';
  readonly error = signal('');
  readonly busy = signal(false);

  /** true khi thiết bị hỗ trợ Face ID / Touch ID qua WebAuthn */
  readonly faceIdAvailable = signal(false);
  /** true khi người dùng đã đăng ký passkey trên thiết bị này */
  readonly faceIdRegistered = signal(false);

  /** Nhãn nút Face ID */
  readonly faceIdLabel = computed(() =>
    this.faceIdRegistered() ? 'FaceID' : 'Bật FaceID'
  );

  get name(): string { return this.auth.username; }

  async ngOnInit(): Promise<void> {
    this.doc.documentElement.classList.add('notch-blue');
    this.setThemeColor('#5a9cf8');

    // Kiểm tra hỗ trợ WebAuthn (platform authenticator = Face ID / Touch ID)
    const available = await this.auth.isFaceIdAvailable();
    this.faceIdAvailable.set(available);
    this.faceIdRegistered.set(this.auth.hasFaceIdRegistered());
  }

  ngOnDestroy(): void {
    this.doc.documentElement.classList.remove('notch-blue');
    this.setThemeColor('#f4f6fb');
    if (this.toastTimer) clearTimeout(this.toastTimer);
  }

  private setThemeColor(color: string): void {
    let meta = this.doc.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (!meta) {
      meta = this.doc.createElement('meta');
      meta.name = 'theme-color';
      this.doc.head.appendChild(meta);
    }
    meta.content = color;
  }

  loginPassword(): void {
    this.error.set('');
    this.loading.show();

    setTimeout(() => {
      const ok = this.auth.loginWithPassword(this.pw);

      if (!ok) {
        this.loading.hide();
        this.error.set('Mật khẩu không đúng');
        return;
      }

      setTimeout(() => {
        this.loading.hide();
        this.router.navigateByUrl('/home');
      }, 300);
    }, 1500);
  }

  /**
   * Nếu chưa đăng ký: hiện prompt Face ID để tạo passkey.
   * Nếu đã đăng ký: hiện prompt Face ID để đăng nhập.
   */
  async loginFaceId(): Promise<void> {
    this.error.set('');
    this.busy.set(true);
    try {
      if (!this.faceIdRegistered()) {
        await this.auth.setupFaceId();
        this.faceIdRegistered.set(true);
      } else {
        await this.auth.loginWithFaceId();
      }

      this.loading.show();
      setTimeout(() => {
        this.loading.hide();
        this.router.navigateByUrl('/home');
      }, 800);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Đăng nhập Face ID thất bại';
      this.error.set(msg);
      console.error(e);
    } finally {
      this.busy.set(false);
    }
  }

  /** true khi hiện banner "Quý khách chưa đăng ký A-OTP" */
  readonly otpToastVisible = signal(false);
  private toastTimer: ReturnType<typeof setTimeout> | null = null;

  showOtpToast(): void {
    this.otpToastVisible.set(true);
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      this.otpToastVisible.set(false);
    }, 4000);
  }

  dismissOtpToast(): void {
    this.otpToastVisible.set(false);
    if (this.toastTimer) clearTimeout(this.toastTimer);
  }

  goFindId(): void {
    this.router.navigateByUrl('/find-id');
  }

  goForgotPassword(): void {
    this.router.navigateByUrl('/forgot-password');
  }

  goRegister(): void {
    this.router.navigateByUrl('/register');
  }

  goMobileOtp(): void {
    this.router.navigateByUrl('/mobile-otp');
  }
}


