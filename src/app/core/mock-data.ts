import { Injectable } from '@angular/core';

export type Currency = 'VND' | 'USD';

export interface Account {
  id: string;
  name: string;
  label: string;
  currency: Currency;
  balance: number;       // computed: initialBalance + sum(txns)
  initialBalance: number; // số tiền gốc (opening balance)
  masked?: string;
}

export interface Txn {
  id: string;
  accountId: string;
  dateISO: string;
  timeStr?: string;
  title: string;
  amount: number;
  currency?: Currency;
  note?: string;
  runningBalance?: number;
  refNo?: string;
  channel?: string;
  counterpartyBank?: string;
  counterpartyName?: string;
  counterpartyAccount?: string;
  transferNote?: string;
}

@Injectable({ providedIn: 'root' })
export class MockDataService {
  private accounts: Account[] = [
    {
      id: '100150765538',
      name: 'Saving Account',
      label: 'Tài khoản thanh toán',
      currency: 'VND',
      initialBalance: 8000352, // số tiền gốc — thay đổi giá trị này tuỳ ý
      balance: 0,                // sẽ được tính động bên dưới
      masked: 'VND *** ***'
    },
    {
      id: '407432******6056',
      name: 'WOORI VISA DEBIT CLASSIC',
      label: 'Thẻ',
      currency: 'VND',
      initialBalance: 0,
      balance: 0,
      masked: '**** 6056'
    }
  ];

  private txns: Txn[] = [
    { id: 't1', accountId: '100150765538', dateISO: '2026-02-26', timeStr: '13:30:30', title: 'DAO DUY HIEU', amount: -26800000, note: 'Chưa gắn thẻ', refNo: '26022026000001', channel: 'Internet Banking', counterpartyBank: 'WOORI BANK', counterpartyName: 'DAO DUY HIEU', counterpartyAccount: '100150765538', transferNote: 'Chuyển tiền' },
    { id: 't2', accountId: '100150765538', dateISO: '2026-03-20', timeStr: '14:02:02', title: 'ATM withdraw', amount: -1500000, note: 'Chưa gắn thẻ', refNo: '26022026000002', channel: 'ATM', counterpartyBank: 'WOORI BANK', counterpartyName: 'DAO DUY HIEU', counterpartyAccount: '100150765538', transferNote: 'ATM withdraw' },
    { id: 't3', accountId: '100150765538', dateISO: '2026-02-26', timeStr: '08:27:27', title: 'DAO DUY HIEU', amount: -13000000, note: 'Chưa gắn thẻ', refNo: '26022026000003', channel: 'Mobile Banking', counterpartyBank: 'WOORI BANK', counterpartyName: 'DAO DUY HIEU', counterpartyAccount: '100150765538', transferNote: 'Chuyển tiền' },
    { id: 't4', accountId: '100150765538', dateISO: '2026-02-25', timeStr: '08:00:00', title: 'LG CNS Vietnam Salary', amount: 40468877, note: 'Chưa gắn thẻ', refNo: '25022026000004', channel: 'Auto Transfer', counterpartyBank: 'WOORI BANK', counterpartyName: 'LG CNS VIETNAM', counterpartyAccount: '100150999999', transferNote: 'LG CNS Vietnam Salary' },
    { id: 't5', accountId: '100150765538', dateISO: '2026-02-25', timeStr: '11:30:00', title: 'CLOSE 100150782645', amount: 1105, note: 'Chưa gắn thẻ', refNo: '25022026000005', channel: 'Internet Banking', counterpartyBank: 'WOORI BANK', counterpartyName: 'DAO DUY HIEU', counterpartyAccount: '100150782645', transferNote: 'Tất toán' },
    { id: 't6', accountId: '100150765538', dateISO: '2026-02-25', timeStr: '14:45:00', title: 'DAO DUY HIEU', amount: -4600000, note: 'Chưa gắn thẻ', refNo: '25022026000006', channel: 'Mobile Banking', counterpartyBank: 'WOORI BANK', counterpartyName: 'DAO DUY HIEU', counterpartyAccount: '100150765538', transferNote: 'Chuyển tiền' },
    { id: 't7', accountId: '100150765538', dateISO: '2026-02-24', timeStr: '16:00:00', title: 'NGUYEN VAN AN', amount: -500000, note: 'Chưa gắn thẻ', refNo: '24022026000007', channel: 'ATM', counterpartyBank: 'WOORI BANK', counterpartyName: 'NGUYEN VAN AN', counterpartyAccount: '100150111111', transferNote: 'Rút ATM' },
    { id: 't8', accountId: '100150765538', dateISO: '2026-02-23', timeStr: '13:20:00', title: 'TRAN THI BICH', amount: 300000, note: 'Chưa gắn thẻ', refNo: '23022026000008', channel: 'Mobile Banking', counterpartyBank: 'WOORI BANK', counterpartyName: 'TRAN THI BICH', counterpartyAccount: '100150222222', transferNote: 'Chuyển tiền' },
    { id: 't9', accountId: '100150765538', dateISO: '2026-02-14', timeStr: '09:00:00', title: 'DAO DUY HIEU', amount: -15000000, note: 'Chưa gắn thẻ', refNo: '14022026000009', channel: 'Internet Banking', counterpartyBank: 'WOORI BANK', counterpartyName: 'DAO DUY HIEU', counterpartyAccount: '100150765538', transferNote: 'Chuyển tiền' },
    { id: 't10', accountId: '100150765538', dateISO: '2026-02-10', timeStr: '08:00:00', title: 'LG CNS Vietnam Salary', amount: 19561317, note: 'Chưa gắn thẻ', refNo: '10022026000010', channel: 'Auto Transfer', counterpartyBank: 'WOORI BANK', counterpartyName: 'LG CNS VIETNAM', counterpartyAccount: '100150999999', transferNote: 'LG CNS Vietnam Salary' },
    { id: 't11', accountId: '100150765538', dateISO: '2026-01-25', timeStr: '15:30:00', title: 'DAO DUY HIEU', amount: -8000000, note: 'Chưa gắn thẻ', refNo: '25012026000011', channel: 'Mobile Banking', counterpartyBank: 'WOORI BANK', counterpartyName: 'DAO DUY HIEU', counterpartyAccount: '100150765538', transferNote: 'Chuyển tiền' },
    { id: 't13', accountId: '100150765538', dateISO: '2026-03-25', timeStr: '16:08:08', title: 'LG CNS Vietnam Salary', amount: 38762562, note: 'Chưa gắn thẻ', refNo: '10012026000013', channel: 'Auto Transfer', counterpartyBank: 'WOORI BANK', counterpartyName: 'LG CNS VIETNAM', counterpartyAccount: '100150999999', transferNote: 'LG CNS Vietnam Salary' },
    { id: 't14', accountId: '100150765538', dateISO: '2026-03-25', timeStr: '22:40:40', title: 'DAO DUY HIEU', amount: -28800000, note: 'Chưa gắn thẻ', refNo: '10012026000014', channel: 'Mobile Banking', counterpartyBank: 'WOORI BANK', counterpartyName: 'DAO DUY HIEU', counterpartyAccount: '100150765538', transferNote: 'DAO DUY HIEU chuyen tien' },
    { id: 't15', accountId: '100150765538', dateISO: '2026-03-25', timeStr: '22:46:46', title: 'DAO DUY HIEU', amount: -2750000, note: 'Chưa gắn thẻ', refNo: '10012026000015', channel: 'Mobile Banking', counterpartyBank: 'WOORI BANK', counterpartyName: 'DAO DUY HIEU', counterpartyAccount: '100150765538', transferNote: 'DAO DUY HIEU chuyen tien' },
    { id: 't16', accountId: '100150765538', dateISO: '2026-03-28', timeStr: '20:37:37', title: 'DAO DUY HIEU', amount: -6000000, note: 'Chưa gắn thẻ', refNo: '10012026000016', channel: 'Mobile Banking', counterpartyBank: 'WOORI BANK', counterpartyName: 'DAO DUY HIEU', counterpartyAccount: '100150765538', transferNote: 'DAO DUY HIEU chuyen tien' },
    { id: 't17', accountId: '100150765538', dateISO: '2026-04-18', timeStr: '11:16:16', title: 'Int Pay', amount: 46, note: 'Chưa gắn thẻ', refNo: '10012026000017', channel: 'Auto Transfer', counterpartyBank: 'WOORI BANK', counterpartyName: 'DAO DUY HIEU', counterpartyAccount: '100150765538', transferNote: 'DAO DUY HIEU chuyen tien' },
    { id: 't18', accountId: '100150765538', dateISO: '2026-04-24', timeStr: '15:01:01', title: 'LG CNS Vietnam Salary', amount: 39237313, note: 'Chưa gắn thẻ', refNo: '10012026000018', channel: 'Auto Transfer', counterpartyBank: 'WOORI BANK', counterpartyName: 'DAO DUY HIEU', counterpartyAccount: '100150765538', transferNote: 'LG CNS Vietnam Salary' }
  ];

  private computedBalance(accountId: string): number {
    const acc = this.accounts.find(a => a.id === accountId);
    if (!acc) return 0;
    const net = this.txns
      .filter(t => t.accountId === accountId)
      .reduce((s, t) => s + t.amount, 0);
    return acc.initialBalance + net;
  }

  getAccounts(): Account[] {
    return this.accounts.map(a => ({ ...a, balance: this.computedBalance(a.id) }));
  }

  getAccount(id: string): Account | undefined {
    const a = this.accounts.find(a => a.id === id);
    if (!a) return undefined;
    return { ...a, balance: this.computedBalance(id) };
  }

  getTransactions(accountId: string): Txn[] {
    const toDateTime = (t: Txn) => `${t.dateISO}T${t.timeStr ?? '00:00:00'}`;
    const list = this.txns
      .filter(t => t.accountId === accountId)
      .sort((a, b) => toDateTime(b).localeCompare(toDateTime(a)));

    let bal = this.computedBalance(accountId);
    return list.map(t => {
      const out = { ...t, runningBalance: bal };
      bal -= t.amount;
      return out;
    });
  }
}
