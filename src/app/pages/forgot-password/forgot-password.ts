import {
  ChangeDetectionStrategy, Component, OnDestroy, OnInit,
  inject, signal, computed,
} from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  imports: [
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private doc = inject(DOCUMENT);

  readonly userId = signal('');
  readonly cccd = signal('');

  readonly canSubmit = computed(() =>
    this.userId().trim().length > 0 && this.cccd().trim().length > 0
  );

  ngOnInit(): void {
    this.setThemeColor('#ffffff');
  }

  ngOnDestroy(): void {
    this.setThemeColor('#5a9cf8');
  }

  private setThemeColor(color: string): void {
    const meta = this.doc.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (meta) meta.content = color;
  }

  cancel(): void {
    this.router.navigateByUrl('/login');
  }

  goBack(): void {
    history.back();
  }

  submit(): void {
    // Demo: chuyển bước tiếp theo (OTP hoặc xác nhận)
    alert('Tiếp tục xử lý quên mật khẩu (demo)');
  }
}

