import { Component, inject, ChangeDetectorRef, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { CommonModule, NgOptimizedImage } from '@angular/common';
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
    CommonModule,
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
  pw = '';
  error = '';
  busy = false;

  private auth = inject(AuthService);
  private router = inject(Router);
  private loading = inject(LoadingService);
  private cdr = inject(ChangeDetectorRef);
  private doc = inject(DOCUMENT);

  get name(): string { return this.auth.username; }

  ngOnInit(): void {
    // Phủ màu xanh lên vùng notch (tai thỏ) trên iPhone
    this.doc.documentElement.style.background = '#5a9cf8';
  }

  ngOnDestroy(): void {
    // Khôi phục lại khi rời khỏi trang login
    this.doc.documentElement.style.background = '';
  }


  loginPassword(): void {
    this.error = '';
    this.loading.show();

    // Simulate authentication delay
    setTimeout(() => {
      const ok = this.auth.loginWithPassword(this.pw);

      if (!ok) {
        this.loading.hide();
        this.error = 'Mật khẩu không đúng';
        this.cdr.detectChanges(); // Manually trigger change detection
        return;
      }

      // Keep loading shown for a bit longer before navigating
      setTimeout(() => {
        this.loading.hide();
        this.router.navigateByUrl('/home');
      }, 300);
    }, 1500);
  }

  async loginFaceId(): Promise<void> {
    this.error = '';
    this.busy = true;
    try {
      await this.auth.loginWithFaceId();

      // Hiển thị loading 800ms trước khi chuyển màn hình
      this.loading.show();
      setTimeout(() => {
        this.loading.hide();
        this.router.navigateByUrl('/home');
      }, 800);
    } catch (e: any) {
      this.error = 'Đăng nhập Face ID thất bại';
      console.error(e);
    } finally {
      this.busy = false;
    }
  }
}
