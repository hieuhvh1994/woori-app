import { Component, signal, OnInit, inject, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, DecimalPipe, DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { MockDataService, Account, Txn } from '../../core/mock-data';
import { LoadingService } from '../../core/loading';

export type FilterType = 'all' | 'credit' | 'debit';
export type SortType = 'newest' | 'oldest';
export type PickerPreset = '1w' | '1m' | '3m';

@Component({
  selector: 'app-transactions',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, DecimalPipe, DatePipe, MatIconModule, MatButtonModule, FormsModule],
  templateUrl: './transactions.html',
  styleUrls: ['./transactions.scss'],
})
export class TransactionsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly mockData = inject(MockDataService);
  private readonly loadingService = inject(LoadingService);

  account?: Account;
  private allTxns: Txn[] = [];

  isLoading = signal(true);
  activeFilter = signal<FilterType>('all');
  activeSort = signal<SortType>('newest');

  // Date range (ISO strings YYYY-MM-DD)
  rangeFrom = signal('2025-12-20');
  rangeTo = signal('2026-03-20');
  // Label shown in the row button
  rangeBtnLabel = signal('3 tháng');

  // Date picker sheet
  showDatePicker = signal(false);
  pickerPreset = signal<PickerPreset>('3m');
  pickerFrom = signal('');
  pickerTo = signal('');

  filteredTxns = computed(() => {
    const filter = this.activeFilter();
    const sort = this.activeSort();
    const from = this.rangeFrom();
    const to = this.rangeTo();
    let list = [...this.allTxns];

    list = list.filter(t => t.dateISO >= from && t.dateISO <= to);

    if (filter === 'credit') {
      list = list.filter(t => t.amount >= 0);
    } else if (filter === 'debit') {
      list = list.filter(t => t.amount < 0);
    }

    list.sort((a, b) => {
      const cmp = b.dateISO.localeCompare(a.dateISO);
      return sort === 'newest' ? cmp : -cmp;
    });
    return list;
  });

  constructor() {
    const id = this.route.snapshot.paramMap.get('accountId') ?? '';
    this.account = this.mockData.getAccount(id);
    this.allTxns = this.mockData.getTransactions(id);
  }

  ngOnInit(): void {
    this.loadingService.show(3000);
    setTimeout(() => this.isLoading.set(false), 3000);
  }

  back(): void { this.router.navigateByUrl('/home'); }
  sign(v: number): string { return v >= 0 ? '+' : '-'; }
  abs(v: number): number { return Math.abs(v); }

  openTxn(t: Txn): void {
    const accountId = this.route.snapshot.paramMap.get('accountId') ?? '';
    this.router.navigateByUrl(`/transactions/${accountId}/detail/${t.id}`);
  }

  setFilter(f: FilterType): void { this.activeFilter.set(f); }

  toggleSort(): void {
    this.activeSort.set(this.activeSort() === 'newest' ? 'oldest' : 'newest');
  }

  // ── Date Picker ─────────────────────────────────────────────
  openDatePicker(): void {
    this.pickerFrom.set(this.rangeFrom());
    this.pickerTo.set(this.rangeTo());
    // Detect current preset
    const diffDays = this.daysBetween(this.rangeFrom(), this.rangeTo());
    if (diffDays <= 8) this.pickerPreset.set('1w');
    else if (diffDays <= 32) this.pickerPreset.set('1m');
    else this.pickerPreset.set('3m');
    this.showDatePicker.set(true);
  }

  closeDatePicker(): void {
    this.showDatePicker.set(false);
  }

  applyPreset(preset: PickerPreset): void {
    this.pickerPreset.set(preset);
    const today = '2026-03-20'; // current date
    let from = '';
    if (preset === '1w') {
      from = this.addDays(today, -7);
      this.rangeBtnLabel.set('1 tuần');
    } else if (preset === '1m') {
      from = this.addDays(today, -30);
      this.rangeBtnLabel.set('1 tháng');
    } else {
      from = this.addDays(today, -90);
      this.rangeBtnLabel.set('3 tháng');
    }
    this.pickerFrom.set(from);
    this.pickerTo.set(today);
  }

  confirmDateRange(): void {
    this.rangeFrom.set(this.pickerFrom());
    this.rangeTo.set(this.pickerTo());
    this.showDatePicker.set(false);
  }

  formatDisplayDate(iso: string): string {
    if (!iso) return '';
    const [y, m, d] = iso.split('-');
    return `${d}.${m}.${y}`;
  }

  private addDays(iso: string, days: number): string {
    const [y, m, d] = iso.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    date.setDate(date.getDate() + days);
    const yy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yy}-${mm}-${dd}`;
  }

  private daysBetween(a: string, b: string): number {
    const [ay, am, ad] = a.split('-').map(Number);
    const [by, bm, bd] = b.split('-').map(Number);
    const da = new Date(ay, am - 1, ad);
    const db = new Date(by, bm - 1, bd);
    return Math.round(Math.abs(db.getTime() - da.getTime()) / 86400000);
  }
}
