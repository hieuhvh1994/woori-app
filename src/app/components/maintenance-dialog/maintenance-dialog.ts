import { Component, inject } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-maintenance-dialog',
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="maintenance-dialog">
      <div class="dialog-icon">
        <mat-icon>construction</mat-icon>
      </div>
      <h2 class="dialog-title">Thông báo</h2>
      <div class="dialog-content">
        <p>Hệ thống hiện đang bảo trì</p>
        <p>vui lòng thử lại sau!</p>
      </div>
      <div class="dialog-actions">
        <button mat-raised-button class="close-btn" (click)="close()">Đóng</button>
      </div>
    </div>
  `,
  styles: [`
    .maintenance-dialog {
      text-align: center;
      padding: 32px 24px 24px;

      .dialog-icon {
        margin-bottom: 20px;

        mat-icon {
          font-size: 72px;
          width: 72px;
          height: 72px;
          color: #ff9800;
        }
      }

      .dialog-title {
        font-size: 22px;
        font-weight: 700;
        color: #333;
        margin: 0 0 16px;
      }

      .dialog-content {
        margin-bottom: 28px;

        p {
          font-size: 15px;
          color: #666;
          margin: 0;
          line-height: 1.6;
        }
      }

      .dialog-actions {
        display: flex;
        justify-content: center;

        .close-btn {
          min-width: 140px;
          padding: 12px 32px;
          font-size: 16px;
          font-weight: 600;
          background: #5b8fff !important;
          color: #fff !important;
          border-radius: 8px;
          box-shadow: none !important;
          text-transform: none;

          &:hover {
            background: #4a7aee !important;
          }
        }
      }
    }
  `]
})
export class MaintenanceDialogComponent {
  private dialogRef = inject(MatDialogRef<MaintenanceDialogComponent>);

  close() {
    this.dialogRef.close();
  }
}

