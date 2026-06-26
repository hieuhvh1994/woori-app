import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MaintenanceService } from '../../core/maintenance';

type MainTab = 'savings' | 'loan';

/**
 * Công cụ tính lãi (tham khảo).
 *  - Tiết kiệm: Kỳ hạn (lãi đơn) | Tích lũy (gửi góp hàng tháng)
 *  - Vay: Gốc chia đều - lãi giảm dần | Gốc + lãi chia đều (trả góp đều)
 */
@Component({
  selector: 'app-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './calculator.html',
  styleUrls: ['./calculator.scss'],
})
export class CalculatorComponent {
  private router = inject(Router);
  readonly maintenance = inject(MaintenanceService);

  mainTab: MainTab = 'savings';
  subTab = 'term';

  amountInput = '';
  rateInput = '';
  termInput = '';

  get subTabs(): { key: string; label: string }[] {
    return this.mainTab === 'savings'
      ? [{ key: 'term', label: 'Kỳ hạn' }, { key: 'tichluy', label: 'Tích lũy' }]
      : [{ key: 'reducing', label: 'Gốc chia đều,\nlãi giảm dần' }, { key: 'annuity', label: 'Gốc lãi chia đều' }];
  }

  get amount(): number { return +this.amountInput.replace(/\D/g, '') || 0; }
  get rate(): number { return parseFloat(this.rateInput) || 0; }
  get term(): number { return parseInt(this.termInput, 10) || 0; }

  setMain(t: MainTab): void {
    this.mainTab = t;
    this.subTab = this.subTabs[0].key;
  }

  /** Định dạng số tiền có dấu chấm ngăn cách khi gõ */
  onAmountChange(v: string): void {
    const d = v.replace(/\D/g, '');
    this.amountInput = d ? Number(d).toLocaleString('vi-VN') : '';
  }

  get result(): { interest: number; total: number } {
    const P = this.amount, r = this.rate, n = this.term;
    const i = r / 1200; // lãi suất tháng (từ %/năm)
    if (P <= 0 || n <= 0) return { interest: 0, total: 0 };

    if (this.mainTab === 'savings') {
      if (this.subTab === 'term') {
        const interest = P * (r / 100) * (n / 12);          // lãi đơn theo kỳ hạn
        return { interest, total: P + interest };
      }
      // Tích lũy: gửi P mỗi tháng, mỗi khoản hưởng lãi theo số tháng còn lại
      const interest = P * i * (n * (n + 1) / 2);
      return { interest, total: P * n + interest };
    }

    // Vay
    if (this.subTab === 'reducing') {
      // Gốc chia đều, lãi tính trên dư nợ giảm dần -> tổng lãi = P*i*(n+1)/2
      const interest = P * i * (n + 1) / 2;
      return { interest, total: P + interest };
    }
    // Gốc + lãi chia đều (trả góp đều - annuity)
    const pmt = i === 0 ? P / n : (P * i) / (1 - Math.pow(1 + i, -n));
    const total = pmt * n;
    return { interest: total - P, total };
  }

  back(): void {
    this.router.navigateByUrl('/products');
  }
}
