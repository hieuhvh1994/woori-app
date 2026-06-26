import {
  Component, signal, computed, inject, ChangeDetectionStrategy, ViewChild, ElementRef, AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { BottomNavComponent } from '../../components/bottom-nav/bottom-nav';
import { MaintenanceService } from '../../core/maintenance';

interface Tab { key: string; label: string; }

interface SuggestCard {
  badge: string;
  badgeType: 'savings' | 'loan';
  title: string;
  desc: string;          // dùng \n để xuống dòng (white-space: pre-line)
  ratePrefix: string;    // 'Lên tới' | 'Chỉ từ'
  rateValue: string;     // '6.3%' | '0.8%/tháng'
  rateSuffix: string;    // '/năm' | ''
  image: string;
}

interface ListCard {
  title: string;
  desc: string;
  icon?: string;         // ảnh minh hoạ
  matIcon?: string;      // hoặc material icon (khi không có ảnh)
  rateLabel?: string;    // 'Tối đa' | 'Thấp nhất'
  rateValue?: string;    // '6.3%' | '1.8%/tháng'
  chevron?: boolean;     // hiện mũi tên ">" bên phải (vd: Bảo hiểm)
}

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, MatIconModule, BottomNavComponent],
  templateUrl: './products.html',
  styleUrls: ['./products.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsComponent implements AfterViewInit {
  @ViewChild('contentEl') contentEl?: ElementRef<HTMLElement>;

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private host: ElementRef<HTMLElement> = inject(ElementRef);
  readonly maintenance = inject(MaintenanceService);

  readonly tabs: Tab[] = [
    { key: 'goiy', label: 'Gợi ý' },
    { key: 'thanhtoan', label: 'Tài khoản thanh toán' },
    { key: 'tietkiem', label: 'Tiết kiệm' },
    { key: 'vay', label: 'Vay' },
    { key: 'the', label: 'Thẻ' },
    { key: 'baohiem', label: 'Bảo hiểm' },
    { key: 'dautu', label: 'Đầu tư' },
  ];

  readonly active = signal<string>('goiy');

  readonly suggestions: SuggestCard[] = [
    { badge: 'Tiết kiệm', badgeType: 'savings', title: 'Tiền gửi tích lũy WON Challenge', desc: 'Tích lũy thảnh thơi\nSinh lời đều đặn!', ratePrefix: 'Lên tới', rateValue: '6.3%', rateSuffix: '/năm', image: 'images/Logo_Tiet_kiem.png' },
    { badge: 'Tiết kiệm', badgeType: 'savings', title: 'Tiền gửi có kỳ hạn WON', desc: 'Kỳ hạn linh hoạt, lãi suất đặc biệt\nTối ưu lợi ích từ 1 đến 60 tháng!', ratePrefix: 'Lên tới', rateValue: '6.3%', rateSuffix: '/năm', image: 'images/Logo_Tiet_kiem.png' },
    { badge: 'Vay', badgeType: 'loan', title: 'We Home Loan', desc: 'Lãi suất thấp - kỳ hạn dài\nMua nhà trả góp - còn gì đắn đo?', ratePrefix: 'Chỉ từ', rateValue: '0.8%/tháng', rateSuffix: '', image: 'images/Logo_Vay.png' },
  ];

  readonly lists: Record<string, ListCard[]> = {
    thanhtoan: [
      { title: 'Tài khoản thanh toán WON', desc: 'Mở tài khoản nhanh chóng qua ứng dụng WON\nNạp tiền dễ dàng, rút tiền linh hoạt!', icon: 'images/Logo_Chuyen_tien.png' },
      { title: 'Tài khoản thanh toán trực tuyến', desc: 'Dễ dàng mở mới thêm tài khoản thanh toán!', icon: 'images/Logo_Chuyen_tien.png' },
      { title: 'Tiền gửi đảm bảo chi phí du học', desc: 'Hành trình Hàn Quốc của bạn bắt đầu tại đây!', icon: 'images/Logo_Chuyen_tien.png' },
      { title: 'Tài khoản Happy Salary', desc: 'Nhận và chi trả tiền lương với lãi suất ưu đãi!', icon: 'images/Logo_Chuyen_tien.png' },
    ],
    tietkiem: [
      { title: 'Tiền gửi tích lũy theo ngày', desc: 'Tích đều mỗi ngày, nhận ngay ưu đãi', icon: 'images/Logo_Tiet_kiem.png', rateLabel: 'Tối đa', rateValue: '4.0%' },
      { title: 'Tiền gửi tích lũy WON Challenge', desc: 'Tích lũy thảnh thơi\nSinh lời đều đặn!', icon: 'images/Logo_Tiet_kiem.png', rateLabel: 'Tối đa', rateValue: '6.3%' },
      { title: 'Tiền gửi tích lũy WON Goal', desc: 'Đặt 1 mục tiêu - Tích lũy hàng tháng\nBắt đầu thôi!!', icon: 'images/Logo_Tiet_kiem.png', rateLabel: 'Tối đa', rateValue: '7.8%' },
      { title: 'Tiền gửi có kỳ hạn WON', desc: 'Kỳ hạn linh hoạt, lãi suất đặc biệt\nTối ưu lợi ích từ 1 đến 60 tháng!', icon: 'images/Logo_Tiet_kiem.png', rateLabel: 'Tối đa', rateValue: '6.3%' },
      { title: 'Tiền gửi tích lũy Woori V Free', desc: 'Tích lũy tự do\nKhông lo giới hạn', icon: 'images/Logo_Tiet_kiem.png', rateLabel: 'Tối đa', rateValue: '6.8%' },
      { title: 'Tiền gửi tích lũy thông thường', desc: 'Tích lũy định kỳ hàng tháng\nThỏa sức lựa chọn kỳ hạn!', icon: 'images/Logo_Tiet_kiem.png', rateLabel: 'Tối đa', rateValue: '7.8%' },
      { title: 'Tiền gửi có kỳ hạn thông thường', desc: 'Cố định lãi suất - Linh hoạt kỳ hạn\nAn tâm gửi tiền', icon: 'images/Logo_Tiet_kiem.png', rateLabel: 'Tối đa', rateValue: '6.5%' },
      { title: 'Tiền gửi tiết kiệm có kỳ hạn', desc: 'Lựa chọn an toàn dành cho KHCN Việt Nam (gồm VND/USD/EUR)', icon: 'images/Logo_Tiet_kiem.png', rateLabel: 'Tối đa', rateValue: '6.3%' },
      { title: 'Tiền gửi tiết kiệm không kỳ hạn', desc: 'An toàn-linh hoạt, dành cho KHCN Việt Nam (gồm VND/USD/EUR)', icon: 'images/Logo_Tiet_kiem.png', rateLabel: 'Tối đa', rateValue: '0.1%' },
    ],
    vay: [
      { title: 'S-Loan', desc: 'Vay 50 triệu lãi suất cố định\nĐăng ký ngay, nhận tiền liền tay!', icon: 'images/Logo_Vay.png', rateLabel: 'Thấp nhất', rateValue: '1.8%/tháng' },
      { title: 'We Home Loan', desc: 'Lãi suất thấp - kỳ hạn dài\nMua nhà trả góp - còn gì đắn đo?', icon: 'images/Logo_Vay.png', rateLabel: 'Thấp nhất', rateValue: '0.8%/tháng' },
      { title: 'My Car Loan', desc: 'Mua xe - điều bạn muốn\nHỗ trợ vốn - việc của Woori', icon: 'images/Logo_Vay.png', rateLabel: 'Thấp nhất', rateValue: '0.7%/tháng' },
      { title: 'E-Loan', desc: 'Dành cho người Việt Nam làm việc tại tổ chức trong lĩnh vực giáo dục', icon: 'images/Logo_Vay.png', rateLabel: 'Thấp nhất', rateValue: '1.1%/tháng' },
      { title: 'Prime Power Loan', desc: 'Đừng bỏ lỡ! Khoản vay ưu đãi dành cho nhân viên công ty Hàn Quốc', icon: 'images/Logo_Vay.png', rateLabel: 'Thấp nhất', rateValue: '0.9%/tháng' },
      { title: 'M-Loan', desc: 'Dành cho cá nhân đang làm việc trong lĩnh vực y tế tại Việt Nam!', icon: 'images/Logo_Vay.png', rateLabel: 'Thấp nhất', rateValue: '1.1%/tháng' },
      { title: 'G Loan', desc: 'Vay dễ dàng tới 500 triệu VNĐ dành cho KH có bảo lãnh vay vốn', icon: 'images/Logo_Vay.png', rateLabel: 'Thấp nhất', rateValue: '0.8%/tháng' },
      { title: 'Prime Power Loan II', desc: 'Cho nhân viên của DN niêm yết trên sàn chứng khoán!', icon: 'images/Logo_Vay.png', rateLabel: 'Thấp nhất', rateValue: '1.1%/tháng' },
      { title: 'Vay cầm cố tiền gửi', desc: 'Cần tiền nhanh, gọn? Chọn vay cầm cố!', icon: 'images/Logo_Vay.png', rateLabel: 'Thấp nhất', rateValue: '0.5%/tháng' },
      { title: 'High Prime Loan', desc: 'Ưu đãi lãi suất dành cho nhân viên DN nước ngoài !', icon: 'images/Logo_Vay.png', rateLabel: 'Thấp nhất', rateValue: '1.2%/tháng' },
    ],
    the: [
      { title: 'Thẻ tín dụng quốc tế hạng Bạch Kim - Woori Visa Korean Air', desc: 'Tích lũy dặm bay không giới hạn: 1 USD = 1 Dặm SKYPASS, ...', icon: 'images/Logo_The.png' },
      { title: 'Thẻ tín dụng quốc tế hạng Bạch Kim - Woori VV Premium', desc: 'Tích lũy 10% khi chi tiêu Golf; Làm đẹp; Dịch vụ Ăn uống; Khách sạn', icon: 'images/Logo_The.png' },
      { title: 'Thẻ tín dụng quốc tế hạng Vàng - Woori VV Hype Point', desc: 'Tích lũy đến 10% lĩnh vực Thương mại điện tử, Ăn uống, Siêu thị, Du lịch', icon: 'images/Logo_The.png' },
      { title: 'Thẻ tín dụng quốc tế hạng Chuẩn - Woori VV Plus Point', desc: 'Tích lũy 5% lĩnh vực Thương mại điện tử, Du lịch', icon: 'images/Logo_The.png' },
      { title: 'Thẻ tín dụng Woori Visa Platinum', desc: 'Tích lũy 0.3% giá trị giao dịch thành Tiền hoàn hoặc Điểm thưởng', icon: 'images/Logo_The.png' },
      { title: 'Thẻ tín dụng Woori Visa Classic', desc: 'Tích lũy 0.2% giá trị giao dịch thành điểm thưởng', icon: 'images/Logo_The.png' },
      { title: 'Thẻ ghi nợ Woori Visa Classic', desc: 'Tích lũy 0.1% chi tiêu không giới hạn thành điểm thưởng', icon: 'images/Logo_The.png' },
      { title: 'Thẻ ghi nợ Woori Visa Z', desc: 'Tích lũy 2% khi chi tiêu online thành điểm thưởng', icon: 'images/Logo_The.png' },
    ],
    baohiem: [
      { title: 'Bảo hiểm nhân thọ', desc: 'Đồng hành bảo vệ bạn và gia đình trước mọi rủi ro trong cuộc sống.', chevron: true },
      { title: 'Bảo hiểm phi nhân thọ', desc: 'Giải pháp an toàn và bảo vệ tài sản, sức khỏe và công việc của bạn', chevron: true },
    ],
    dautu: [
      { title: 'KIM Vietnam - Đầu tư chứng chỉ quỹ', desc: 'Cty Quản lý quỹ KIM Việt Nam khai phá tiềm năng thị trường Việt Nam', matIcon: 'trending_up' },
      { title: 'Fmarket - Đầu tư chứng chỉ quỹ', desc: 'Xây dựng kế hoạch tài chính ưu việt hơn', matIcon: 'trending_up' },
    ],
  };

  readonly currentList = computed<ListCard[]>(() => this.lists[this.active()] ?? []);

  constructor() {
    // Mở sẵn tab theo query param (vd: home bấm "Tiết kiệm" -> ?tab=tietkiem)
    const tab = this.route.snapshot.queryParamMap.get('tab');
    if (tab && this.tabs.some(t => t.key === tab)) this.active.set(tab);
  }

  ngAfterViewInit(): void {
    // Cuộn chip đang active vào giữa nếu nó nằm ngoài vùng nhìn
    queueMicrotask(() => {
      this.host.nativeElement
        .querySelector<HTMLElement>('.tabs .chip.active')
        ?.scrollIntoView({ inline: 'center', block: 'nearest' });
    });
  }

  selectTab(key: string, ev: Event): void {
    this.active.set(key);
    (ev.currentTarget as HTMLElement | null)?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
    if (this.contentEl) this.contentEl.nativeElement.scrollTop = 0;
  }

  /** Nút máy tính -> màn Công cụ tính lãi */
  goCalc(): void {
    this.router.navigateByUrl('/calculator');
  }
}
