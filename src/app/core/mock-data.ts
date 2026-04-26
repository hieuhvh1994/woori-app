import { Injectable } from '@angular/core';
export type Currency = 'VND' | 'USD';
export interface Account {
  id: string;
  name: string;
  label: string;
  currency: Currency;
  balance: number;        // computed: initialBalance + sum(txns)
  initialBalance: number; // so tien goc (opening balance)
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
  senderName?: string;
  senderAccount?: string;
  senderBank?: string;
  receiverName?: string;
  receiverAccount?: string;
  receiverBank?: string;
  /** true = hien khoi "Nguoi chuyen" (mac dinh: true) */
  showSender?: boolean;
  /** true = hien khoi "Nguoi nhan"  (mac dinh: true) */
  showReceiver?: boolean;
}
@Injectable({ providedIn: 'root' })
export class MockDataService {
  private accounts: Account[] = [
    {
      id: '100150765538',
      name: 'Saving Account',
      label: 'Tai khoan thanh toan',
      currency: 'VND',
      initialBalance: 7000352,
      balance: 0,
      masked: 'VND *** ***'
    },
    {
      id: '407432******6056',
      name: 'WOORI VISA DEBIT CLASSIC',
      label: 'The',
      currency: 'VND',
      initialBalance: 0,
      balance: 0,
      masked: '**** 6056'
    }
  ];
  private txns: Txn[] = [
    {
      id: 't1',
      accountId: '100150765538',
      dateISO: '2026-01-25', timeStr: '15:30:00',
      title: 'DAO DUY HIEU', amount: -8000000,
      refNo: '25012026000001', channel: 'Mobile Banking', transferNote: 'Chuyen tien',
      senderName: 'DAO DUY HIEU', senderAccount: '100150765538', senderBank: 'WOORI BANK',
      receiverName: 'DAO DUY HIEU', receiverAccount: '0181003556697', receiverBank: 'Vietcombank (VCB)',
      showSender: true, showReceiver: true
    },
    {
      id: 't2',
      accountId: '100150765538',
      dateISO: '2026-02-10', timeStr: '08:00:00',
      title: 'LG CNS Vietnam Salary', amount: 19561317,
      refNo: '10022026000002', channel: 'Auto Transfer', transferNote: 'LG CNS Vietnam Salary',
      senderName: '', senderAccount: '', senderBank: 'WOORI BANK',
      receiverName: 'DAO DUY HIEU', receiverAccount: '100150765538', receiverBank: 'WOORI BANK',
      showSender: false, showReceiver: true
    },
    {
      id: 't3',
      accountId: '100150765538',
      dateISO: '2026-02-14', timeStr: '09:00:00',
      title: 'DAO DUY HIEU', amount: -15000000,
      refNo: '14022026000003', channel: 'Internet Banking', transferNote: 'Chuyen tien',
      senderName: 'DAO DUY HIEU', senderAccount: '100150765538', senderBank: 'WOORI BANK',
      receiverName: 'DAO DUY HIEU', receiverAccount: '0181003556697', receiverBank: 'Vietcombank (VCB)',
      showSender: true, showReceiver: true
    },
    {
      id: 't4',
      accountId: '100150765538',
      dateISO: '2026-02-23', timeStr: '13:20:00',
      title: 'DAO DUY HIEU', amount: 300000,
      refNo: '23022026000004', channel: 'Mobile Banking', transferNote: 'Chuyen tien',
      senderName: 'DAO DUY HIEU', senderAccount: '100150782645', senderBank: 'WOORI BANK',
      receiverName: 'DAO DUY HIEU', receiverAccount: '100150765538', receiverBank: 'WOORI BANK',
      showSender: true, showReceiver: true
    },
    {
      id: 't5',
      accountId: '100150765538',
      dateISO: '2026-02-24', timeStr: '16:00:00',
      title: 'DAO DUY HIEU', amount: -500000,
      refNo: '24022026000005', channel: 'ATM', transferNote: 'ATM withdraw',
      senderName: 'DAO DUY HIEU', senderAccount: '100150765538', senderBank: 'WOORI BANK',
      receiverName: 'DAO DUY HIEU', receiverAccount: 'ATM Withdraw', receiverBank: 'WOORI BANK',
      showSender: true, showReceiver: false
    },
    {
      id: 't6',
      accountId: '100150765538',
      dateISO: '2026-02-25', timeStr: '08:00:00',
      title: 'LG CNS Vietnam Salary', amount: 40468877,
      refNo: '25022026000006', channel: 'Auto Transfer', transferNote: 'LG CNS Vietnam Salary',
      senderName: 'LG CNS Vietnam', senderAccount: 'LG CNS Vietnam Account', senderBank: 'WOORI BANK',
      receiverName: 'DAO DUY HIEU', receiverAccount: '100150765538', receiverBank: 'WOORI BANK',
      showSender: false, showReceiver: true
    },
    {
      id: 't7',
      accountId: '100150765538',
      dateISO: '2026-02-25', timeStr: '11:30:00',
      title: 'CLOSE 100150782645', amount: 1105,
      refNo: '25022026000007', channel: 'Internet Banking', transferNote: 'Tat toan',
      senderName: 'DAO DUY HIEU', senderAccount: '100150782645', senderBank: 'WOORI BANK',
      receiverName: 'DAO DUY HIEU', receiverAccount: '100150765538', receiverBank: 'WOORI BANK',
      showSender: true, showReceiver: true
    },
    {
      id: 't8',
      accountId: '100150765538',
      dateISO: '2026-02-25', timeStr: '14:45:00',
      title: 'DAO DUY HIEU', amount: -4600000,
      refNo: '25022026000008', channel: 'Mobile Banking', transferNote: 'Chuyen tien',
      senderName: 'DAO DUY HIEU', senderAccount: '100150765538', senderBank: 'WOORI BANK',
      receiverName: 'DAO DUY HIEU', receiverAccount: '0181003556697', receiverBank: 'Vietcombank (VCB)',
      showSender: true, showReceiver: true
    },
    {
      id: 't9',
      accountId: '100150765538',
      dateISO: '2026-02-26', timeStr: '08:27:27',
      title: 'DAO DUY HIEU', amount: -13000000,
      refNo: '26022026000009', channel: 'Mobile Banking', transferNote: 'Chuyen tien',
      senderName: 'DAO DUY HIEU', senderAccount: '100150765538', senderBank: 'WOORI BANK',
      receiverName: 'DAO DUY HIEU', receiverAccount: '0181003556697', receiverBank: 'Vietcombank (VCB)',
      showSender: true, showReceiver: true
    },
    {
      id: 't10',
      accountId: '100150765538',
      dateISO: '2026-02-26', timeStr: '13:30:30',
      title: 'DAO DUY HIEU', amount: -26000000,
      refNo: '26022026000010', channel: 'Internet Banking', transferNote: 'Chuyen tien',
      senderName: 'DAO DUY HIEU', senderAccount: '100150765538', senderBank: 'WOORI BANK',
      receiverName: 'DAO DUY HIEU', receiverAccount: '0181003556697', receiverBank: 'Vietcombank (VCB)',
      showSender: true, showReceiver: true
    },
    {
      id: 't11',
      accountId: '100150765538',
      dateISO: '2026-03-20', timeStr: '14:02:02',
      title: 'ATM withdraw', amount: -1500000,
      refNo: '20032026000011', channel: 'ATM', transferNote: 'ATM withdraw',
      senderName: 'DAO DUY HIEU', senderAccount: '100150765538', senderBank: 'WOORI BANK',
      receiverName: 'DAO DUY HIEU', receiverAccount: 'ATM Withdraw', receiverBank: 'WOORI BANK',
      showSender: true, showReceiver: false
    },
    {
      id: 't12',
      accountId: '100150765538',
      dateISO: '2026-03-25', timeStr: '16:08:08',
      title: 'LG CNS Vietnam Salary', amount: 38762562,
      refNo: '25032026000012', channel: 'Auto Transfer', transferNote: 'LG CNS Vietnam Salary',
      senderName: 'LG CNS Vietnam', senderAccount: 'LG CNS Vietnam Account', senderBank: 'WOORI BANK',
      receiverName: 'DAO DUY HIEU', receiverAccount: '100150765538', receiverBank: 'WOORI BANK',
      showSender: false, showReceiver: true
    },
    {
      id: 't13',
      accountId: '100150765538',
      dateISO: '2026-03-25', timeStr: '22:40:40',
      title: 'DAO DUY HIEU', amount: -28800000,
      refNo: '25032026000013', channel: 'Mobile Banking', transferNote: 'DAO DUY HIEU chuyen tien',
      senderName: 'DAO DUY HIEU', senderAccount: '100150765538', senderBank: 'WOORI BANK',
      receiverName: 'DAO DUY HIEU', receiverAccount: '0181003556697', receiverBank: 'Vietcombank (VCB)',
      showSender: true, showReceiver: true
    },
    {
      id: 't14',
      accountId: '100150765538',
      dateISO: '2026-03-25', timeStr: '22:46:46',
      title: 'DAO DUY HIEU', amount: -2750000,
      refNo: '25032026000014', channel: 'Mobile Banking', transferNote: 'DAO DUY HIEU chuyen tien',
      senderName: 'DAO DUY HIEU', senderAccount: '100150765538', senderBank: 'WOORI BANK',
      receiverName: 'DAO DUY HIEU', receiverAccount: '0181003556697', receiverBank: 'Vietcombank (VCB)',
      showSender: true, showReceiver: true
    },
    {
      id: 't15',
      accountId: '100150765538',
      dateISO: '2026-03-28', timeStr: '20:37:37',
      title: 'DAO DUY HIEU', amount: -6000000,
      refNo: '28032026000015', channel: 'Mobile Banking', transferNote: 'DAO DUY HIEU chuyen tien',
      senderName: 'DAO DUY HIEU', senderAccount: '100150765538', senderBank: 'WOORI BANK',
      receiverName: 'DAO DUY HIEU', receiverAccount: '0181003556697', receiverBank: 'Vietcombank (VCB)',
      showSender: true, showReceiver: true
    },
    {
      id: 't16',
      accountId: '100150765538',
      dateISO: '2026-04-18', timeStr: '11:16:16',
      title: 'Int Pay', amount: 46,
      refNo: '18042026000016', channel: 'Auto Transfer', transferNote: 'Int Pay',
      senderName: '', senderAccount: '', senderBank: 'WOORI BANK',
      receiverName: 'DAO DUY HIEU', receiverAccount: '100150765538', receiverBank: 'WOORI BANK',
      showSender: false, showReceiver: true
    },
    {
      id: 't17',
      accountId: '100150765538',
      dateISO: '2026-04-24', timeStr: '15:01:01',
      title: 'LG CNS Vietnam Salary', amount: 39237313,
      refNo: '24042026000017', channel: 'Auto Transfer', transferNote: 'LG CNS Vietnam Salary',
      senderName: '', senderAccount: '', senderBank: 'WOORI BANK',
      receiverName: 'DAO DUY HIEU', receiverAccount: '100150765538', receiverBank: 'WOORI BANK',
      showSender: false, showReceiver: true
    },
    {
      id: 't18',
      accountId: '100150765538',
      dateISO: '2026-04-24', timeStr: '23:04:04',
      title: 'DAO DUY HIEU', amount: -39000000,
      refNo: '24042026000018', channel: 'Auto Transfer', transferNote: 'DAO DUY HIEU chuyen tien',
      senderName: 'DAO DUY HIEU', senderAccount: '100150765538', senderBank: 'WOORI BANK',
      receiverName: 'DAO DUY HIEU', receiverAccount: '0181003556697', receiverBank: 'Vietcombank (VCB)',
      showSender: true, showReceiver: true
    },
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
