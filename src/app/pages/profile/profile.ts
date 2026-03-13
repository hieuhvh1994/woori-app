import { Component, signal, inject } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../core/auth';
import { LoadingService } from '../../core/loading';
import { MaintenanceDialogComponent } from '../../components/maintenance-dialog/maintenance-dialog';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, MatIconModule, MatButtonModule, NgOptimizedImage],
  templateUrl: './profile.html',
  styleUrls: ['./profile.scss'],
})
export class ProfileComponent {
  private router = inject(Router);
  private auth = inject(AuthService);
  private loading = inject(LoadingService);
  private dialog = inject(MatDialog);

  userInfo = {
    name: 'DAO DUY HIEU',
    code: 'RI794414',
    points: 850,
  };

  settingsItems = [
    { label: 'Thông tin của tôi', icon: 'chevron_right' },
    { label: 'Đổi mật khẩu đăng nhập', icon: 'chevron_right' },
    { label: 'Cập nhật giấy tờ tuy thân', icon: 'chevron_right' },
  ];

  vibrationEnabled = signal(true);


  goBack() {
    this.router.navigateByUrl('/home');
  }

  logout() {
    this.loading.show();

    // Simulate logout process with delay
    setTimeout(() => {
      this.auth.logout();
      this.loading.hide();
      this.router.navigateByUrl('/login');
    }, 1500);
  }

  toggleVibration() {
    this.vibrationEnabled.update(value => !value);
  }

  showMaintenanceMessage() {
    this.loading.show();

    setTimeout(() => {
      this.loading.hide();
      this.dialog.open(MaintenanceDialogComponent, {
        width: '320px',
        panelClass: 'maintenance-dialog-panel'
      });
    }, 3000);
  }

  onSettingItemClick(label: string) {
    this.showMaintenanceMessage();
  }

  onEditAvatar() {
    this.showMaintenanceMessage();
  }

  onLanguageClick() {
    this.showMaintenanceMessage();
  }

  onBiometricClick() {
    this.showMaintenanceMessage();
  }

  onMotionBankingClick() {
    this.showMaintenanceMessage();
  }
}

