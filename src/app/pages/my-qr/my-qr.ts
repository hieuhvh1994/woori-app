import {
  Component, OnInit, inject, signal, ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import * as QRCode from 'qrcode';

import { AuthService } from '../../core/auth';
import { MockDataService } from '../../core/mock-data';

/**
 * Màn "QR của tôi" – sinh mã QR nhận tiền NGAY TRÊN THIẾT BỊ (không gửi
 * thông tin tài khoản ra dịch vụ ngoài) bằng thư viện qrcode.
 */
@Component({
  selector: 'app-my-qr',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './my-qr.html',
  styleUrls: ['./my-qr.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyQrComponent implements OnInit {
  private router = inject(Router);
  private auth = inject(AuthService);
  private data = inject(MockDataService);

  readonly name = this.auth.username;
  readonly accountId = this.data.getAccounts()[0]?.id ?? '100150765538';
  readonly qrDataUrl = signal<string>('');

  async ngOnInit(): Promise<void> {
    // Payload demo (không phải VietQR chuẩn): đủ để render mã QR đúng dạng.
    const payload = `WOORIBANK|${this.accountId}|${this.name}`;
    try {
      const url = await QRCode.toDataURL(payload, {
        width: 480,
        margin: 1,
        errorCorrectionLevel: 'H', // 'H' cho phép logo WON che giữa mà vẫn quét được
        color: { dark: '#000000', light: '#ffffff' },
      });
      this.qrDataUrl.set(url);
    } catch {
      this.qrDataUrl.set('');
    }
  }

  back(): void {
    this.router.navigateByUrl('/home');
  }

  /** Tải ảnh QR về máy */
  save(): void {
    const url = this.qrDataUrl();
    if (!url) return;
    const a = document.createElement('a');
    a.href = url;
    a.download = `won-qr-${this.accountId}.png`;
    a.click();
  }

  /** Chia sẻ ảnh QR (Web Share API nếu hỗ trợ) */
  async share(): Promise<void> {
    const url = this.qrDataUrl();
    if (!url) return;
    try {
      const blob = await (await fetch(url)).blob();
      const file = new File([blob], 'won-qr.png', { type: 'image/png' });
      const navAny = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
      if (navAny.canShare?.({ files: [file] }) && navigator.share) {
        await navigator.share({ files: [file], title: 'QR của tôi' });
        return;
      }
      if (navigator.share) {
        await navigator.share({ title: 'QR của tôi', text: `${this.name} - ${this.accountId}` });
      }
    } catch {
      /* người dùng huỷ chia sẻ hoặc không hỗ trợ -> bỏ qua */
    }
  }
}
