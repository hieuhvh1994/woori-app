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

  sign(v: number): string { return v >= 0 ? '+' : '-'; }
  abs(v: number): number { return Math.abs(v); }

  back(): void {
    const accountId = this.route.snapshot.paramMap.get('accountId') ?? '';
    this.router.navigateByUrl(`/transactions/${accountId}`);
  }
}

