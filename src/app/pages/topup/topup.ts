import { Component, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MockDataService } from '../../core/mock-data';
import { MaintenanceDialogComponent } from '../../components/maintenance-dialog/maintenance-dialog';
import { MaintenanceService } from '../../core/maintenance';

/** Nạp tiền điện thoại (demo): điền thông tin -> Tiếp -> xác nhận -> spinner -> bảo trì. */
@Component({
  selector: 'app-topup',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './topup.html',
  styleUrls: ['./topup.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopupComponent {
  private router = inject(Router);
  private data = inject(MockDataService);
  private dialog = inject(MatDialog);
  readonly maintenance = inject(MaintenanceService);

  readonly account = this.data.getAccounts()[0];

  phone = '';
  readonly provider = signal('Viettel');
  readonly amount = signal(10000);

  readonly providers = ['GTel', 'Mobifone', 'VNPAY', 'Viettel', 'Vinaphone', 'vietnamMB'];
  readonly amounts = [10000, 20000, 30000, 50000, 100000, 200000, 300000, 500000];

  readonly showInfo = signal(false);
  readonly showProvider = signal(false);
  readonly showAmount = signal(false);
  readonly showConfirm = signal(false);
  readonly isLoading = signal(false);

  get amountStr(): string { return this.amount().toLocaleString('vi-VN'); }
  get balanceStr(): string { return (this.account?.balance ?? 0).toLocaleString('vi-VN'); }
  get accountId(): string { return this.account?.id ?? ''; }

  back(): void { this.router.navigateByUrl('/home'); }

  selectProvider(p: string): void { this.provider.set(p); this.showProvider.set(false); }
  selectAmount(a: number): void { this.amount.set(a); this.showAmount.set(false); }

  /** Tiếp -> mở modal xác nhận */
  next(): void {
    if (!this.phone.trim()) return;
    this.showConfirm.set(true);
  }

  /** Xác nhận -> spinner -> thông báo bảo trì */
  confirm(): void {
    this.showConfirm.set(false);
    this.isLoading.set(true);
    setTimeout(() => {
      this.isLoading.set(false);
      this.dialog.open(MaintenanceDialogComponent, { panelClass: 'maintenance-panel' });
    }, 2500);
  }
}
