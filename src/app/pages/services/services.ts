import { Component, signal, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { BottomNavComponent } from '../../components/bottom-nav/bottom-nav';
import { AuthService } from '../../core/auth';
import { MaintenanceService } from '../../core/maintenance';

interface SvcItem { label: string; action?: string; }
interface SvcGroup { key: string; title: string; items: SvcItem[]; }
interface Category { key: string; label: string; icon: string; groups: SvcGroup[]; }

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, MatIconModule, BottomNavComponent],
  templateUrl: './services.html',
  styleUrls: ['./services.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServicesComponent {
  private router = inject(Router);
  private auth = inject(AuthService);
  private maintenance = inject(MaintenanceService);

  readonly name = this.auth.username;
  readonly recent = this.formatNow();

  readonly quickActions = [
    { label: 'Bản tin', icon: 'article', dot: true },
    { label: 'Hướng dẫn', icon: 'bookmark_border' },
    { label: 'Xác thực', icon: 'lock_outline' },
    { label: 'Cài đặt', icon: 'person_outline', action: 'profile' },
  ];

  readonly categories: Category[] = [
    {
      key: 'nganhang', label: 'Ngân hàng', icon: 'account_balance_wallet', groups: [
        {
          key: 'chuyen', title: 'Chuyển/ Rút tiền', items: [
            { label: 'Chuyển tiền đơn giản' },
            { label: 'Chuyển nhanh (Napas247)', action: 'transfer' },
            { label: 'Chuyển tiền thường/ đặt lịch' },
            { label: 'Lịch sử chuyển tiền' },
            { label: 'Rút tiền bằng WON app' },
            { label: 'Chuyển tiền tự động' },
            { label: 'Chia hóa đơn' },
            { label: 'Người hưởng thường dùng' },
            { label: 'Quản lý hạn mức' },
          ],
        },
        {
          key: 'tiengui', title: 'Tiền gửi', items: [
            { label: 'Tính lãi tiền gửi', action: 'calculator' },
            { label: 'Đóng tài khoản tiền gửi' },
            { label: 'Tiền gửi online' },
          ],
        },
        {
          key: 'tienvay', title: 'Tiền vay', items: [
            { label: 'Tính lãi tiền vay', action: 'calculator' },
            { label: 'Truy vấn ngày đến hạn' },
            { label: 'Thông tin lãi suất' },
          ],
        },
        {
          key: 'khac', title: 'Dịch vụ khác', items: [
            { label: 'Chia sẻ biến động số dư' },
          ],
        },
      ],
    },
    {
      key: 'the', label: 'Thẻ', icon: 'credit_card', groups: [
        { key: 'the', title: 'Dịch vụ thẻ', items: [{ label: 'Danh sách thẻ' }, { label: 'Đăng ký mở thẻ' }, { label: 'Khóa/Mở khóa thẻ' }] },
      ],
    },
    {
      key: 'thanhtoan', label: 'Thanh toán', icon: 'receipt_long', groups: [
        { key: 'tt', title: 'Thanh toán', items: [{ label: 'Thanh toán hóa đơn' }, { label: 'Nạp tiền điện thoại' }, { label: 'Lịch sử thanh toán' }] },
      ],
    },
    {
      key: 'ngoaihoi', label: 'Ngoại hối', icon: 'currency_exchange', groups: [
        { key: 'nh', title: 'Ngoại hối', items: [{ label: 'Tỷ giá hối đoái' }, { label: 'Chuyển tiền quốc tế' }] },
      ],
    },
    {
      key: 'tienich', label: 'Tiện ích', icon: 'widgets', groups: [
        { key: 'ti', title: 'Tiện ích', items: [{ label: 'Chia sẻ biến động số dư' }, { label: 'Tìm chi nhánh / ATM' }, { label: 'Liên hệ hỗ trợ' }] },
      ],
    },
  ];

  readonly activeCat = signal('nganhang');
  readonly collapsed = signal<Set<string>>(new Set());
  readonly current = computed<Category>(() => this.categories.find(c => c.key === this.activeCat())!);

  isCollapsed(groupKey: string): boolean {
    return this.collapsed().has(`${this.activeCat()}:${groupKey}`);
  }

  toggleGroup(groupKey: string): void {
    const k = `${this.activeCat()}:${groupKey}`;
    const s = new Set(this.collapsed());
    s.has(k) ? s.delete(k) : s.add(k);
    this.collapsed.set(s);
  }

  onQuick(a: { action?: string }): void {
    if (a.action === 'profile') this.router.navigateByUrl('/profile');
    else this.maintenance.comingSoon(); // Bản tin / Hướng dẫn / Xác thực: chưa có màn
  }

  onItem(it: SvcItem): void {
    if (it.action === 'transfer') {
      this.router.navigate(['/transactions', '100150765538', 'transfer']);
    } else if (it.action === 'calculator') {
      this.router.navigateByUrl('/calculator');
    } else {
      this.maintenance.comingSoon(); // mục chưa có màn -> bảo trì
    }
  }

  logout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }

  private formatNow(): string {
    const d = new Date();
    const p = (n: number) => String(n).padStart(2, '0');
    return `${p(d.getDate())}.${p(d.getMonth() + 1)}.${d.getFullYear()} ${p(d.getHours())}:${p(d.getMinutes())}`;
  }
}
