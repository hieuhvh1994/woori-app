import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule, DecimalPipe, DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { MockDataService, Account, Txn } from '../../core/mock-data';
import { LoadingService } from '../../core/loading';

@Component({
  selector: 'app-transactions',
  imports: [CommonModule, DecimalPipe, DatePipe, MatIconModule, MatButtonModule],
  templateUrl: './transactions.html',
  styleUrls: ['./transactions.scss'],
})
export class TransactionsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private data = inject(MockDataService);
  private loadingService = inject(LoadingService);

  account?: Account;
  txns: Txn[] = [];
  isLoading = signal(true);

  constructor() {
    const id = this.route.snapshot.paramMap.get('accountId') || '';
    this.account = this.data.getAccount(id);
    this.txns = this.data.getTransactions(id);
  }

  ngOnInit() {
    // Show loading overlay for 3 seconds
    this.loadingService.show(3000);

    // Update local loading state after 3 seconds
    setTimeout(() => {
      this.isLoading.set(false);
    }, 3000);
  }


  back() { this.router.navigateByUrl('/home'); }
  sign(v: number) { return v >= 0 ? '+' : '-'; }
  abs(v: number) { return Math.abs(v); }
}
