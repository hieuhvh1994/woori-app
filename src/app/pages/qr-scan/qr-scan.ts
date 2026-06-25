import {
  Component, ElementRef, ViewChild, inject, signal,
  AfterViewInit, OnDestroy, ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

/**
 * Màn "Quét mã QR" – hiển thị camera sau trong khung ngắm.
 * (Chỉ hiển thị luồng camera; chưa giải mã QR – có thể bổ sung jsQR/BarcodeDetector sau.)
 */
@Component({
  selector: 'app-qr-scan',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './qr-scan.html',
  styleUrls: ['./qr-scan.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QrScanComponent implements AfterViewInit, OnDestroy {
  private router = inject(Router);

  @ViewChild('video') videoRef?: ElementRef<HTMLVideoElement>;

  /** true khi không mở được camera (quyền bị từ chối / không hỗ trợ) */
  readonly cameraError = signal(false);
  private stream?: MediaStream;

  async ngAfterViewInit(): Promise<void> {
    if (!navigator.mediaDevices?.getUserMedia) {
      this.cameraError.set(true);
      return;
    }
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
        audio: false,
      });
      const v = this.videoRef?.nativeElement;
      if (v) {
        v.srcObject = this.stream;
        await v.play().catch(() => {});
      }
    } catch {
      this.cameraError.set(true);
    }
  }

  ngOnDestroy(): void {
    this.stream?.getTracks().forEach(t => t.stop());
  }

  back(): void {
    this.router.navigateByUrl('/home');
  }

  goToMyQr(): void {
    this.router.navigateByUrl('/my-qr');
  }
}
