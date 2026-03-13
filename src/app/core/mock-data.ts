import { Injectable } from '@angular/core';

export type Currency = 'VND' | 'USD';

export interface Account {
  id: string;
  name: string;      // "Saving Account"
  label: string;     // "Tài khoản thanh toán"
  currency: Currency;
  balance: number;
  masked?: string;   // "**** 6056"
}

export interface Txn {
  id: string;
  accountId: string;
  dateISO: string;    // "2026-02-25"
  title: string;
  amount: number;     // +/-
  note?: string;
  runningBalance?: number;
}

@Injectable({ providedIn: 'root' })
export class MockDataService {
  private accounts: Account[] = [
    {
      id: '100150765538',
      name: 'Salary Account',
      label: 'Tài khoản thanh toán',
      currency: 'VND',
      balance: 39813,
      masked: 'VND *** ***'
    },
    {
      id: '407432******6056',
      name: 'WOORI VISA DEBIT CLASSIC',
      label: 'Thẻ',
      currency: 'VND',
      balance: 0,
      masked: '**** 6056'
    }
  ];

  private txns: Txn[] = [
    { id: 't1', accountId: '100150765538', dateISO: '2026-02-25', title: 'CLOSE 100150782645', amount: 1105, note: 'Chưa gắn thẻ' },
    { id: 't2', accountId: '100150765538', dateISO: '2026-02-25', title: 'DAO DUY HIEU', amount: -4600000, note: 'Chưa gắn thẻ' },
    { id: 't3', accountId: '100150765538', dateISO: '2026-02-21', title: 'Int Pay', amount: 188, note: 'Chưa gắn thẻ' },
  ];

  getAccounts(): Account[] {
    return [...this.accounts];
  }

  getAccount(id: string): Account | undefined {
    return this.accounts.find(a => a.id === id);
  }

  getTransactions(accountId: string): Txn[] {
    const list = this.txns
      .filter(t => t.accountId === accountId)
      .sort((a, b) => b.dateISO.localeCompare(a.dateISO));

    // demo running balance
    let bal = this.getAccount(accountId)?.balance ?? 0;
    return list.map(t => {
      const out = { ...t, runningBalance: bal };
      bal -= t.amount;
      return out;
    });
  }
}
