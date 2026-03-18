import { Component, signal, OnDestroy, OnInit, computed } from '@angular/core';
import { CommonModule, NgOptimizedImage, DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { MockDataService, Account } from '../../core/mock-data';
import { AuthService } from '../../core/auth';
import { SearchOverlayComponent } from '../../components/search-overlay/search-overlay';

interface Feature {
  icon?: string;
  image?: string;
  label: string;
  action?: string;
  badge?: 'New' | 'Hot';
  bgColor?: string;
}

interface FinancialOverviewCard {
  type: 'overview';
  title: string;
  income: number;
  savings: number;
  expenses: number;
}

interface TimeSeriesDataPoint {
  label: string;
  value: number;
}

interface TimeSeriesCard {
  type: 'timeseries';
  title: string;
  dateRange: string;
  expenseData: TimeSeriesDataPoint[];
  incomeData: TimeSeriesDataPoint[];
}

interface CombinedPointCard {
  type: 'combinedpoints';
  wpoint: {
    title: string;
    points: number;
    label: string;
    bgColor: string;
    image: string;
  };
  cardpoint: {
    title: string;
    points: number;
    label: string;
    bgColor: string;
    image: string;
  };
}

type FinancialCard = FinancialOverviewCard | TimeSeriesCard | CombinedPointCard;

@Component({
  selector: 'app-home',
  imports: [CommonModule, MatIconModule, MatButtonModule, NgOptimizedImage, SearchOverlayComponent, DecimalPipe],
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  accounts: Account[] = [];
  showSearchOverlay = signal(false);
  showCopyNotification = signal(false);

  // Account carousel
  currentAccountIndex = signal(0);
  balanceVisible = signal(true);
  private accountTouchStartX = 0;
  private accountTouchEndX = 0;
  private copyNotificationTimeout?: number;

  // Banner carousel
  banners = [
    { image: 'images/banner_1.png', zoom: 1 },
    { image: 'images/banner_2.png', zoom: 1 },
    { image: 'images/banner_3.png', zoom: 1 },
    { image: 'images/banner_4.png', zoom: 1 },
  ];
  currentBannerIndex = signal(0);
  private autoSlideInterval?: number;
  private touchStartX = 0;
  private touchEndX = 0;

  features: Feature[] = [
    { image: 'images/Logo_Chuyen_tien.png', label: 'Chuyển tiền', bgColor: '#fff5ed' },
    { image: 'images/Logo_Tiet_kiem.png', label: 'Tiết kiệm', bgColor: '#fef3f4' },
    { image: 'images/Logo_Vay.png', label: 'Vay', bgColor: '#f0f5ff' },
    { image: 'images/Logo_Lich_Su_GIao_dich.png', label: 'Lịch sử\ngiao dịch', action: 'tx', bgColor: '#eef3ff' },
    { image: 'images/Logo_Nap_tien_dien_thoai.png', label: 'Nạp tiền\nđiện thoại', bgColor: '#f5ecfd' },
    { image: 'images/Logo_Woori_Ting_ting.png', label: 'Woori\nTing Ting', badge: 'New', bgColor: '#fef3f4' },
    { image: 'images/Logo_The.png', label: 'Thẻ', bgColor: '#eef7fe' },
    { image: 'images/Logo_Vietlott.png', label: 'Vietlott SMS', badge: 'Hot', bgColor: '#fcf3f4', action: 'vietlott' },
  ];

  // Financial overview data
  financialCards: FinancialCard[] = [
    {
      type: 'overview',
      title: 'Tổng quan tài chính VND 02/2026',
      income: 19561317,
      savings: 0,
      expenses: 20101105,
    },
    {
      type: 'timeseries',
      title: '',
      dateRange: '04/2025~03/2026',
      expenseData: [
        { label: 'T4', value: 0 },
        { label: 'T5', value: 0 },
        { label: 'T6', value: 0 },
        { label: 'T7', value: 0 },
        { label: 'T8', value: 0 },
        { label: 'T9', value: 3500000 },
        { label: 'T10', value: 4200000 },
        { label: 'T11', value: 3800000 },
        { label: 'T12', value: 5200000 },
        { label: 'T1', value: 4500000 },
        { label: 'T2', value: 4800000 },
        { label: 'T3', value: 0 },
      ],
      incomeData: [
        { label: 'T4', value: 0 },
        { label: 'T5', value: 0 },
        { label: 'T6', value: 0 },
        { label: 'T7', value: 0 },
        { label: 'T8', value: 0 },
        { label: 'T9', value: 3800000 },
        { label: 'T10', value: 4400000 },
        { label: 'T11', value: 4000000 },
        { label: 'T12', value: 5500000 },
        { label: 'T1', value: 4800000 },
        { label: 'T2', value: 5000000 },
        { label: 'T3', value: 0 },
      ],
    },
    {
      type: 'combinedpoints',
      wpoint: {
        title: 'W-point',
        points: 850,
        label: 'Đổi điểm',
        bgColor: 'linear-gradient(135deg, #ffb3d9 0%, #ff8cc5 100%)',
        image: 'images/W-Point.png',
      },
      cardpoint: {
        title: 'Card-point',
        points: 0,
        label: 'Đổi điểm',
        bgColor: 'linear-gradient(135deg, #8dd4ff 0%, #5eb8ff 100%)',
        image: 'images/Card-point.png',
      },
    },
  ] as const;

  // Bottom navigation visibility
  showFinancialOverview = signal(true);
  currentFinancialIndex = signal(0);
  timeSeriesMode = signal<'expense' | 'income'>('expense'); // Toggle for timeseries chart

  // Financial carousel touch handling
  private financialTouchStartX = 0;
  private financialTouchEndX = 0;

  // Computed max value for timeseries chart
  timeSeriesMaxValue = computed(() => {
    const card = this.financialCards[1]; // Timeseries card is at index 1
    if (card.type !== 'timeseries') return 1;

    const allValues = [
      ...card.expenseData.map(d => d.value),
      ...card.incomeData.map(d => d.value)
    ].filter(v => v > 0);

    return allValues.length > 0 ? Math.max(...allValues) : 1;
  });

  constructor(
    private data: MockDataService,
    private router: Router,
    private auth: AuthService,
  ) {
    this.accounts = this.data.getAccounts();
  }

  ngOnInit() {
    this.startAutoSlide();
  }


  ngOnDestroy() {
    this.stopAutoSlide();
    if (this.copyNotificationTimeout) {
      clearTimeout(this.copyNotificationTimeout);
    }
  }

  startAutoSlide() {
    this.autoSlideInterval = window.setInterval(() => {
      this.nextBanner();
    }, 7000);
  }

  stopAutoSlide() {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }
  }

  nextBanner() {
    this.currentBannerIndex.update(index =>
      (index + 1) % this.banners.length
    );
  }

  prevBanner() {
    this.currentBannerIndex.update(index =>
      (index - 1 + this.banners.length) % this.banners.length
    );
  }

  goToBanner(index: number) {
    this.currentBannerIndex.set(index);
    this.stopAutoSlide();
    this.startAutoSlide();
  }

  onTouchStart(event: TouchEvent) {
    this.touchStartX = event.changedTouches[0].screenX;
  }

  onTouchEnd(event: TouchEvent) {
    this.touchEndX = event.changedTouches[0].screenX;
    this.handleSwipe();
  }

  handleSwipe() {
    const swipeThreshold = 50;
    const diff = this.touchStartX - this.touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swipe left - next banner
        this.nextBanner();
      } else {
        // Swipe right - previous banner
        this.prevBanner();
      }
      // Reset auto-slide after manual swipe
      this.stopAutoSlide();
      this.startAutoSlide();
    }
  }

  openTx(acc: Account) {
    this.router.navigate(['/transactions', acc.id]);
  }

  onFeature(f: any) {
    if (f.action === 'tx') this.openTx(this.accounts[0]);
  }

  logout() {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }

  openSearch() {
    this.showSearchOverlay.set(true);
  }

  closeSearch() {
    this.showSearchOverlay.set(false);
  }

  goToProfile() {
    this.router.navigateByUrl('/profile');
  }

  // Account carousel methods
  get currentAccount(): Account | undefined {
    return this.accounts[this.currentAccountIndex()];
  }

  toggleBalanceVisibility() {
    this.balanceVisible.update(visible => !visible);
  }

  copyAccountNumber(event: Event, accountNumber: string) {
    event.stopPropagation();
    navigator.clipboard.writeText(accountNumber).then(() => {
      // Show notification popup
      this.showCopyNotification.set(true);

      // Clear existing timeout if any
      if (this.copyNotificationTimeout) {
        clearTimeout(this.copyNotificationTimeout);
      }

      // Hide notification after 3 seconds
      this.copyNotificationTimeout = window.setTimeout(() => {
        this.showCopyNotification.set(false);
      }, 3000);
    }).catch(err => {
      console.error('Failed to copy:', err);
    });
  }

  onAccountTouchStart(event: TouchEvent) {
    this.accountTouchStartX = event.changedTouches[0].screenX;
  }

  onAccountTouchEnd(event: TouchEvent) {
    this.accountTouchEndX = event.changedTouches[0].screenX;
    this.handleAccountSwipe();
  }

  handleAccountSwipe() {
    const swipeThreshold = 50;
    const diff = this.accountTouchStartX - this.accountTouchEndX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swipe left - next account
        this.nextAccount();
      } else {
        // Swipe right - previous account
        this.prevAccount();
      }
    }
  }

  nextAccount() {
    this.currentAccountIndex.update(index =>
      (index + 1) % this.accounts.length
    );
  }

  prevAccount() {
    this.currentAccountIndex.update(index =>
      (index - 1 + this.accounts.length) % this.accounts.length
    );
  }

  goToAccount(index: number) {
    this.currentAccountIndex.set(index);
  }

  toggleFinancialOverview() {
    this.showFinancialOverview.update(show => !show);
  }

  // Financial carousel methods
  onFinancialTouchStart(event: TouchEvent) {
    this.financialTouchStartX = event.changedTouches[0].screenX;
  }

  onFinancialTouchEnd(event: TouchEvent) {
    this.financialTouchEndX = event.changedTouches[0].screenX;
    this.handleFinancialSwipe();
  }

  handleFinancialSwipe() {
    const swipeThreshold = 50;
    const diff = this.financialTouchStartX - this.financialTouchEndX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swipe left - next card
        this.nextFinancialCard();
      } else {
        // Swipe right - previous card
        this.prevFinancialCard();
      }
    }
  }

  nextFinancialCard() {
    this.currentFinancialIndex.update(index =>
      (index + 1) % this.financialCards.length
    );
  }

  prevFinancialCard() {
    this.currentFinancialIndex.update(index =>
      (index - 1 + this.financialCards.length) % this.financialCards.length
    );
  }

  goToFinancialCard(index: number) {
    this.currentFinancialIndex.set(index);
  }

  // Tính toán transform offset cho carousel
  getFinancialTransform(): string {
    const index = this.currentFinancialIndex();

    if (index === 0) {
      return 'translateX(0)';
    }

    // Slide 1 (index 0) có width 85%, cần tính toán khác
    // Khi chuyển sang slide 2: cần di chuyển 85% + 14px (margin)
    // Khi chuyển sang slide 3: cần di chuyển 85% + 14px + 100% + 14px

    let offset = 0;
    for (let i = 0; i < index; i++) {
      if (i === 0) {
        offset += 100; // Slide đầu 85% (SỬA: trước đây là 100%)
      } else {
        offset += 100; // Các slide khác 100%
      }
    }

    const marginOffset = index * 14; // 14px margin cho mỗi slide đã qua

    return `translateX(calc(-${offset}% - ${marginOffset}px))`;
  }

  toggleTimeSeriesMode() {
    this.timeSeriesMode.update(mode => mode === 'expense' ? 'income' : 'expense');
  }

  setTimeSeriesMode(mode: 'expense' | 'income') {
    this.timeSeriesMode.set(mode);
  }
}
