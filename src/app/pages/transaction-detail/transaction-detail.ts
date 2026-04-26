import {
  Component,
  computed,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core';
import { DecimalPipe, DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MockDataService, Txn } from '../../core/mock-data';

@Component({
  selector: 'app-transaction-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DecimalPipe, DatePipe, MatIconModule, MatButtonModule, MatRippleModule],
  templateUrl: './transaction-detail.html',
  styleUrls: ['./transaction-detail.scss'],
})
export class TransactionDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly mockData = inject(MockDataService);

  readonly txn = computed<Txn | undefined>(() => {
    const accountId = this.route.snapshot.paramMap.get('accountId') ?? '';
    const txnId = this.route.snapshot.paramMap.get('txnId') ?? '';
    return this.mockData.getTransactions(accountId).find(t => t.id === txnId);
  });

  /** Tên tài khoản gửi */
  readonly senderName = computed(() => {
    const t = this.txn();
    if (!t) return '';
    return t.senderName ?? (t.amount < 0 ? (t.counterpartyName ?? t.title) : (t.counterpartyName ?? t.title));
  });

  /** Số tài khoản gửi */
  readonly senderAccount = computed(() => {
    const t = this.txn();
    if (!t) return '';
    return t.senderAccount ?? (t.amount < 0 ? t.accountId : (t.counterpartyAccount ?? ''));
  });

  /** Ngân hàng gửi */
  readonly senderBank = computed(() => {
    const t = this.txn();
    if (!t) return 'WOORI BANK';
    return t.senderBank ?? (t.amount < 0 ? 'WOORI BANK' : (t.counterpartyBank ?? 'WOORI BANK'));
  });

  /** Tên tài khoản nhận */
  readonly receiverName = computed(() => {
    const t = this.txn();
    if (!t) return '';
    return t.receiverName ?? (t.amount < 0 ? (t.counterpartyName ?? t.title) : (t.counterpartyName ?? t.title));
  });

  /** Số tài khoản nhận */
  readonly receiverAccount = computed(() => {
    const t = this.txn();
    if (!t) return '';
    return t.receiverAccount ?? (t.amount < 0 ? (t.counterpartyAccount ?? '') : t.accountId);
  });

  /** Ngân hàng nhận */
  readonly receiverBank = computed(() => {
    const t = this.txn();
    if (!t) return 'WOORI BANK';
    return t.receiverBank ?? (t.amount < 0 ? (t.counterpartyBank ?? 'WOORI BANK') : 'WOORI BANK');
  });

  sign(v: number): string { return v >= 0 ? '+' : '-'; }
  abs(v: number): number { return Math.abs(v); }

  back(): void {
    const accountId = this.route.snapshot.paramMap.get('accountId') ?? '';
    this.router.navigateByUrl(`/transactions/${accountId}`);
  }
}

