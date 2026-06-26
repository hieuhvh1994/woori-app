import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { BottomNavComponent } from '../../components/bottom-nav/bottom-nav';
import { MockDataService } from '../../core/mock-data';
import { MaintenanceService } from '../../core/maintenance';

interface NotifItem {
  id: string;
  title: string;      // 'Rút tiền' | 'Nhận tiền'
  isOut: boolean;     // true = tiền ra (đỏ)
  account: string;    // số tài khoản đã che
  time: string;       // giờ giao dịch
  amountStr: string;  // số tiền có dấu, định dạng vi-VN
}
interface DayGroup { date: string; weekday: string; items: NotifItem[]; }

/**
 * Màn Thông báo: hiển thị giao dịch như thông báo, nhóm theo ngày (thứ).
 */
@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, MatIconModule, BottomNavComponent],
  templateUrl: './notifications.html',
  styleUrls: ['./notifications.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationsComponent {
  private data = inject(MockDataService);
  readonly maintenance = inject(MaintenanceService);

  readonly groups: DayGroup[] = this.build();

  private build(): DayGroup[] {
    const txns = this.data.getAllTransactions();
    const key = (t: { dateISO: string; timeStr?: string }) => `${t.dateISO}T${t.timeStr ?? '00:00:00'}`;
    const sorted = [...txns].sort((a, b) => key(b).localeCompare(key(a))); // mới nhất trước

    const map = new Map<string, DayGroup>();
    for (const t of sorted) {
      let g = map.get(t.dateISO);
      if (!g) {
        g = { date: t.dateISO, weekday: this.weekday(t.dateISO), items: [] };
        map.set(t.dateISO, g);
      }
      g.items.push({
        id: t.id,
        title: t.amount < 0 ? 'Rút tiền' : 'Nhận tiền',
        isOut: t.amount < 0,
        account: this.mask(t.accountId),
        time: t.timeStr ?? '',
        amountStr: t.amount.toLocaleString('vi-VN'),
      });
    }
    return [...map.values()]; // Map giữ thứ tự chèn = ngày giảm dần
  }

  /** '100150765538' -> '100****65538' */
  private mask(id: string): string {
    const d = id.replace(/\D/g, '');
    return d.length > 8 ? `${d.slice(0, 3)}****${d.slice(-5)}` : id;
  }

  private weekday(dateISO: string): string {
    const [y, mo, d] = dateISO.split('-').map(Number);
    const wd = new Date(y, mo - 1, d).getDay(); // 0=CN..6=T7
    return ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'][wd];
  }
}
