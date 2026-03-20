import { Injectable } from '@angular/core';

export type Currency = 'VND' | 'USD';

export interface Account {
  id: string;
  name: string;
  label: string;
  currency: Currency;
  balance: number;
  masked?: string;
}

export interface Txn {
  id: string;
  accountId: string;
  dateISO: string;
  title: string;
  amount: number;
  currency?: Currency;
  note?: string;
  runningBalance?: number;
  refNo?: string;
  channel?: string;
}

@Injectable({ providedIn: 'root' })
export class MockDataService {
  private accounts: Account[] = [
    {
      id: '100150765538',
      name: 'Saving Account',
      label: 'Tài khoản thanh toán',
      currency: 'VND',
      balance: 8690,
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
    { id: 't1', accountId: '100150765538', dateISO: '2026-02-26', title: 'DAO DUY HIEU', amount: -26000000, note: 'Chưa gắn thẻ', refNo: '26022026000001', channel: 'Internet Banking' },
    { id: 't2', accountId: '100150765538', dateISO: '2026-02-26', title: 'DAO DUY HIEU', amount: -1500000, note: 'Chưa gắn thẻ', refNo: '26022026000002', channel: 'Internet Banking' },
    { id: 't3', accountId: '100150765538', dateISO: '2026-02-26', title: 'DAO DUY HIEU', amount: -13000000, note: 'Chưa gắn thẻ', refNo: '26022026000003', channel: 'Mobile Banking' },
    { id: 't4', accountId: '100150765538', dateISO: '2026-02-25', title: 'LG CNS Vietnam Salary', amount: 40468877, note: 'Chưa gắn thẻ', refNo: '25022026000004', channel: 'Auto Transfer' },
    { id: 't5', accountId: '100150765538', dateISO: '2026-02-25', title: 'CLOSE 100150782645', amount: 1105, note: 'Chưa gắn thẻ', refNo: '25022026000005', channel: 'Internet Banking' },
    { id: 't6', accountId: '100150765538', dateISO: '2026-02-25', title: 'DAO DUY HIEU', amount: -4600000, note: 'Chưa gắn thẻ', refNo: '25022026000006', channel: 'Mobile Banking' },
    { id: 't7', accountId: '100150765538', dateISO: '2026-02-24', title: 'NGUYEN VAN AN', amount: -500000, note: 'Chưa gắn thẻ', refNo: '24022026000007', channel: 'ATM' },
    { id: 't8', accountId: '100150765538', dateISO: '2026-02-23', title: 'TRAN THI BICH', amount: 300000, note: 'Chưa gắn thẻ', refNo: '23022026000008', channel: 'Mobile Banking' },
    { id: 't9', accountId: '100150765538', dateISO: '2026-02-14', title: 'DAO DUY HIEU', amount: -15000000, note: 'Chưa gắn thẻ', refNo: '14022026000009', channel: 'Internet Banking' },
    { id: 't10', accountId: '100150765538', dateISO: '2026-02-10', title: 'LG CNS Vietnam Salary', amount: 19561317, note: 'Chưa gắn thẻ', refNo: '10022026000010', channel: 'Auto Transfer' },
    { id: 't11', accountId: '100150765538', dateISO: '2026-01-25', title: 'DAO DUY HIEU', amount: -8000000, note: 'Chưa gắn thẻ', refNo: '25012026000011', channel: 'Mobile Banking' },
    { id: 't12', accountId: '100150765538', dateISO: '2026-01-10', title: 'LG CNS Vietnam Salary', amount: 19561317, note: 'Chưa gắn thẻ', refNo: '10012026000012', channel: 'Auto Transfer' },
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

    let bal = this.getAccount(accountId)?.balance ?? 0;
    return list.map(t => {
      const out = { ...t, runningBalance: bal };
      bal -= t.amount;
      return out;
    });
  }
}
