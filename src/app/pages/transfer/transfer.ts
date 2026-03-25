import { Component, signal, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MockDataService, Account } from '../../core/mock-data';
import { MaintenanceDialogComponent } from '../../components/maintenance-dialog/maintenance-dialog';

export type TransferTab = 'account' | 'card';
export type ContactTab = 'recent' | 'frequent' | 'me';

export interface Bank {
  code: string;
  shortName: string;
  fullName: string;
  recent?: boolean;
}

export interface Contact {
  name: string;
  bank: string;
  accountNo: string;
  favorite?: boolean;
}

@Component({
  selector: 'app-transfer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, MatButtonModule],
  templateUrl: './transfer.html',
  styleUrls: ['./transfer.scss'],
})
export class TransferComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly mockData = inject(MockDataService);
  private readonly dialog = inject(MatDialog);

  account = computed<Account | undefined>(() => {
    const id = this.route.snapshot.paramMap.get('accountId') ?? '';
    return this.mockData.getAccount(id);
  });

  activeTab = signal<TransferTab>('account');
  amountControl = new FormControl<string>('');
  currency = signal<'VND' | 'USD'>('VND');

  // Bottom sheet states
  showBeneficiary = signal(false);
  showBankPicker = signal(false);
  showContactPicker = signal(false);
  showInfo = signal(false);
  isLoading = signal(false);

  // Beneficiary form
  selectedBank = signal<Bank | null>(null);
  accountNoControl = new FormControl<string>('');

  // Bank picker
  bankSearch = new FormControl<string>('');
  activeContactTab = signal<ContactTab>('recent');
  contactSearch = new FormControl<string>('');

  readonly allBanks: Bank[] = [
    { code: 'WOORI', shortName: 'WOORI BANK', fullName: 'NH TNHH MTV Woori Viet Nam' },
    { code: 'BVB', shortName: 'BVBANK', fullName: 'NH TMCP Ban Viet', recent: true },
    { code: 'VPB', shortName: 'VP BANK (VPB)', fullName: 'NH TMCP Viet Nam Thinh Vuong', recent: true },
    { code: 'VCB', shortName: 'VIETCOMBANK (VCB)', fullName: 'NH TMCP Ngoai Thuong Viet Nam', recent: true },
    { code: 'BIDV', shortName: 'BIDV', fullName: 'NH Dau tu va Phat trien Viet Nam' },
    { code: 'AGR', shortName: 'AGRIBANK', fullName: 'NH Nong nghiep va Phat trien Nong thon Viet Nam' },
    { code: 'CTG', shortName: 'VIETINBANK', fullName: 'NH TMCP Cong Thuong Viet Nam' },
    { code: 'ABB', shortName: 'AB BANK (ABB)', fullName: 'NH TMCP An Binh' },
    { code: 'TCB', shortName: 'TECHCOMBANK (TCB)', fullName: 'NH TMCP Ky Thuong Viet Nam' },
    { code: 'MBB', shortName: 'MB BANK (MBB)', fullName: 'NH TMCP Quan Doi' },
    { code: 'ACB', shortName: 'ACB', fullName: 'NH TMCP A Chau' },
    { code: 'TPB', shortName: 'TPBANK', fullName: 'NH TMCP Tien Phong' },
    { code: 'STB', shortName: 'SACOMBANK (STB)', fullName: 'NH TMCP Sai Gon Thuong Tin' },
    { code: 'EIB', shortName: 'EXIMBANK (EIB)', fullName: 'NH TMCP Xuat Nhap Khau Viet Nam' },
    { code: 'HDB', shortName: 'HDBANK', fullName: 'NH TMCP Phat trien TP Ho Chi Minh' },
    { code: 'VIB', shortName: 'VIB', fullName: 'NH TMCP Quoc te Viet Nam' },
    { code: 'OCB', shortName: 'OCB', fullName: 'NH TMCP Phuong Dong' },
    { code: 'MSB', shortName: 'MSB', fullName: 'NH TMCP Hang Hai Viet Nam' },
    { code: 'SHB', shortName: 'SHB', fullName: 'NH TMCP Sai Gon - Ha Noi' },
    { code: 'SCB', shortName: 'SCB', fullName: 'NH TMCP Sai Gon' },
    { code: 'LPB', shortName: 'LIENVIETPOSTBANK (LPB)', fullName: 'NH TMCP Buu Dien Lien Viet' },
    { code: 'KLB', shortName: 'KIENLONGBANK (KLB)', fullName: 'NH TMCP Kien Long' },
    { code: 'NAB', shortName: 'NAMABANK (NAB)', fullName: 'NH TMCP Nam A' },
    { code: 'PGB', shortName: 'PGBANK', fullName: 'NH TMCP Thinh Vuong Va Phat trien' },
    { code: 'VAB', shortName: 'VIETABANK (VAB)', fullName: 'NH TMCP Viet A' },
    { code: 'BAB', shortName: 'BACABANK (BAB)', fullName: 'NH TMCP Bac A' },
    { code: 'BID', shortName: 'VIETBANK', fullName: 'NH TMCP Viet Nam Thuong Tin' },
    { code: 'CBB', shortName: 'CB BANK', fullName: 'NH TM TNHH MTV Xay Dung Viet Nam' },
    { code: 'OJB', shortName: 'OCEANBANK', fullName: 'NH TM TNHH MTV Dai Duong' },
    { code: 'GPB', shortName: 'GPBANK', fullName: 'NH TM TNHH MTV Dau khi Toan cau' },
    { code: 'IVB', shortName: 'INDOVINA BANK (IVB)', fullName: 'NH Lien doanh Indovina' },
    { code: 'VBSP', shortName: 'VBSP', fullName: 'NH Chinh sach xa hoi Viet Nam' },
    { code: 'VDB', shortName: 'VDB', fullName: 'NH Phat trien Viet Nam' },
    { code: 'COOP', shortName: 'CO-OPBANK', fullName: 'NH Hop tac xa Viet Nam' },
    { code: 'SEAB', shortName: 'SEABANK', fullName: 'NH TMCP Dong Nam A' },
    { code: 'CAKE', shortName: 'CAKE BY VPB', fullName: 'NH so CAKE by VPBank' },
    { code: 'UBANK', shortName: 'UBANK BY VPB', fullName: 'NH so Ubank by VPBank' },
    { code: 'TNEX', shortName: 'TNEX', fullName: 'NH so TNEX' },
    { code: 'TIMO', shortName: 'TIMO', fullName: 'NH so Timo by Ban Viet Bank' },
    { code: 'CITIBANK', shortName: 'CITIBANK', fullName: 'NH Citibank Viet Nam' },
    { code: 'HSBC', shortName: 'HSBC', fullName: 'NH TNHH MTV HSBC Viet Nam' },
    { code: 'SHBVN', shortName: 'SHINHAN BANK', fullName: 'NH TNHH MTV Shinhan Viet Nam' },
    { code: 'ANZ', shortName: 'ANZ BANK', fullName: 'NH ANZ Viet Nam' },
    { code: 'SCVN', shortName: 'STANDARD CHARTERED', fullName: 'NH TNHH MTV Standard Chartered Viet Nam' },
    { code: 'PBVN', shortName: 'PUBLIC BANK', fullName: 'NH TNHH MTV Public Viet Nam' },
    { code: 'KBHN', shortName: 'KB KOOKMIN', fullName: 'NH Kookmin Viet Nam' },
    { code: 'UOB', shortName: 'UOB', fullName: 'NH TNHH MTV United Overseas Bank Viet Nam' },
  ];

  readonly allContacts: Contact[] = [
    { name: 'DAO DUY HIEU', bank: 'VIETCOMBANK (VCB)', accountNo: '0181003556697' },
    { name: 'PAYOO_UNIQLO VIET NAM', bank: 'BVBANK', accountNo: '99900182001664' },
    { name: 'DAO DUY HIEU', bank: 'VP BANK (VPB)', accountNo: '0374405765' },
    { name: 'DAO DUY HIEU', bank: 'WOORI BANK', accountNo: '100150782645' },
    { name: 'HOANG THI HOP', bank: 'TECHCOMBANK (TCB)', accountNo: '19034521067010' },
    { name: 'NGUYEN VAN AN', bank: 'MB BANK (MBB)', accountNo: '0123456789' },
    { name: 'TRAN THI BICH', bank: 'BIDV', accountNo: '31410000123456' },
  ];

  filteredBanks = computed(() => {
    const q = (this.bankSearch.value ?? '').toLowerCase().trim();
    if (!q) return this.allBanks;
    return this.allBanks.filter(b =>
      b.shortName.toLowerCase().includes(q) || b.fullName.toLowerCase().includes(q)
    );
  });

  filteredContacts = computed(() => {
    const q = (this.contactSearch.value ?? '').toLowerCase().trim();
    if (!q) return this.allContacts;
    return this.allContacts.filter(c =>
      c.name.toLowerCase().includes(q) || c.accountNo.includes(q)
    );
  });

  displayAmount = computed(() => {
    const raw = this.amountControl.value ?? '';
    const numeric = raw.replace(/\D/g, '');
    if (!numeric) return '';
    return Number(numeric).toLocaleString('vi-VN');
  });

  get accountId(): string {
    return this.route.snapshot.paramMap.get('accountId') ?? '';
  }

  back(): void {
    this.router.navigateByUrl(`/transactions/${this.accountId}`);
  }

  openInfo(): void { this.showInfo.set(true); }
  closeInfo(): void { this.showInfo.set(false); }

  setTab(tab: TransferTab): void {
    this.activeTab.set(tab);
  }

  onAmountInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const raw = input.value.replace(/\D/g, '');
    this.amountControl.setValue(raw);
    input.value = raw ? Number(raw).toLocaleString('vi-VN') : '';
  }

  toggleCurrency(): void {
    this.currency.set(this.currency() === 'VND' ? 'USD' : 'VND');
  }

  // Step 1: tap "Tiếp" — show beneficiary inline card
  next(): void {
    const raw = (this.amountControl.value ?? '').replace(/\D/g, '');
    if (!raw) return;
    this.showBeneficiary.set(true);
  }

  // Step 2: tap "Tiếp" on beneficiary card → loading 3s → maintenance
  submitBeneficiary(): void {
    if (!this.selectedBank() || !this.accountNoControl.value) return;
    this.isLoading.set(true);
    setTimeout(() => {
      this.isLoading.set(false);
      this.dialog.open(MaintenanceDialogComponent, {
        panelClass: 'maintenance-panel',
        disableClose: false,
      });
    }, 3000);
  }

  openBankPicker(): void {
    this.bankSearch.setValue('');
    this.showBankPicker.set(true);
  }

  closeBankPicker(): void {
    this.showBankPicker.set(false);
  }

  selectBank(bank: Bank): void {
    this.selectedBank.set(bank);
    this.showBankPicker.set(false);
  }

  openContactPicker(): void {
    this.contactSearch.setValue('');
    this.activeContactTab.set('recent');
    this.showContactPicker.set(true);
  }

  closeContactPicker(): void {
    this.showContactPicker.set(false);
  }

  setContactTab(tab: ContactTab): void {
    this.activeContactTab.set(tab);
  }

  selectContact(contact: Contact): void {
    const bank = this.allBanks.find(b => b.shortName === contact.bank)
      ?? { code: '', shortName: contact.bank, fullName: contact.bank };
    this.selectedBank.set(bank);
    this.accountNoControl.setValue(contact.accountNo);
    this.showContactPicker.set(false);
  }
}
