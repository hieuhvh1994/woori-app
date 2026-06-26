import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoadingService } from './loading';
import { MaintenanceDialogComponent } from '../components/maintenance-dialog/maintenance-dialog';

/**
 * Dùng cho các tính năng CHƯA có màn hình: quay spinner rồi hiện popup
 * "Hệ thống đang bảo trì". Tái dùng spinner global (LoadingService) + dialog bảo trì.
 */
@Injectable({ providedIn: 'root' })
export class MaintenanceService {
  private dialog = inject(MatDialog);
  private loading = inject(LoadingService);
  private opening = false;

  comingSoon(): void {
    if (this.opening) return; // tránh bấm nhiều lần
    this.opening = true;
    this.loading.show();
    setTimeout(() => {
      this.loading.hide();
      this.opening = false;
      this.dialog.open(MaintenanceDialogComponent, { panelClass: 'maintenance-panel' });
    }, 1500);
  }
}
