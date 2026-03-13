# Custom Carousel Solution - Thay thế Ngx-Slick-Carousel

## Vấn đề với ngx-slick-carousel

❌ **Ngx-slick-carousel không hoạt động tốt vì:**
1. Không tương thích với Angular 21+ control flow mới (`@for`, `@if`)
2. Phụ thuộc jQuery - tăng bundle size
3. Không phải standalone component
4. Cấu hình phức tạp
5. Khó debug và maintain

## Giải pháp: Custom Carousel với CSS Transform

✅ **Ưu điểm:**
1. **Đơn giản** - Chỉ cần CSS transform
2. **Nhẹ** - Không cần thư viện bên ngoài
3. **Hiệu năng cao** - Sử dụng GPU acceleration
4. **Dễ customize** - Toàn quyền kiểm soát
5. **Tương thích** - Hoạt động với mọi Angular feature

## Implementation

### HTML Template

```html
<div class="financial-carousel-wrapper">
  <div class="financial-carousel"
       (touchstart)="onFinancialTouchStart($event)"
       (touchend)="onFinancialTouchEnd($event)">
    <div class="financial-track"
         [style.transform]="'translateX(calc(-' + currentFinancialIndex() * 100 + '% - ' + currentFinancialIndex() * 14 + 'px))'">
      @for (card of financialCards; track $index) {
        <div class="financial-card card-rounded">
          <!-- Card content -->
        </div>
      }
    </div>
  </div>
  
  @if (financialCards.length > 1) {
    <div class="financial-indicators">
      @for (card of financialCards; track $index) {
        <div class="indicator"
             [class.active]="currentFinancialIndex() === $index"
             (click)="goToFinancialCard($index)"></div>
      }
    </div>
  }
</div>
```

### TypeScript Component

```typescript
// State
currentFinancialIndex = signal(0);
private financialTouchStartX = 0;
private financialTouchEndX = 0;

// Touch handlers
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
      this.nextFinancialCard();
    } else {
      this.prevFinancialCard();
    }
  }
}

// Navigation
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
```

### SCSS Styles

```scss
.financial-carousel-wrapper {
  margin-top: 18px;
  position: relative;
  padding: 0 14px;

  .financial-carousel {
    overflow: hidden;
    margin: 0 -14px;
  }

  .financial-track {
    display: flex;
    transition: transform 0.3s ease-in-out;
    padding: 0 14px;
    gap: 14px;
  }

  .financial-card {
    min-width: calc(100% - 28px);
    flex-shrink: 0;
    background: #fff;
    padding: 16px;
    border-radius: 18px;
  }

  .financial-indicators {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-top: 16px;

    .indicator {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: rgba(77, 140, 255, 0.3);
      cursor: pointer;
      transition: all 0.3s ease;

      &.active {
        background: rgba(77, 140, 255, 0.95);
        width: 24px;
        border-radius: 4px;
      }

      &:hover:not(.active) {
        background: rgba(77, 140, 255, 0.5);
      }
    }
  }
}
```

## Cách hoạt động

1. **Flex Layout**: `.financial-track` sử dụng `display: flex` với `gap: 14px`
2. **Transform**: Tính toán `translateX` dựa trên `currentFinancialIndex`
   - Mỗi card chiếm 100% width
   - Cộng thêm gap (14px) cho mỗi slide
3. **Touch Events**: Detect swipe left/right để chuyển slide
4. **Indicators**: Hiển thị vị trí hiện tại và cho phép click để jump

## Formula giải thích

```typescript
translateX(calc(-' + currentFinancialIndex() * 100 + '% - ' + currentFinancialIndex() * 14 + 'px))
```

- `currentFinancialIndex() * 100%` - Di chuyển theo % của container
- `currentFinancialIndex() * 14px` - Bù trừ cho gap giữa các cards
- Dấu `-` để di chuyển sang trái

**Ví dụ:**
- Index 0: `translateX(0)` - Card đầu tiên
- Index 1: `translateX(calc(-100% - 14px))` - Card thứ 2
- Index 2: `translateX(calc(-200% - 28px))` - Card thứ 3

## So sánh với Slick Carousel

| Feature | Custom Solution | Ngx-Slick-Carousel |
|---------|----------------|-------------------|
| Bundle size | ~0 KB | ~100 KB (jQuery + Slick) |
| Dependencies | None | jQuery, slick-carousel |
| Angular compatibility | ✅ Full | ⚠️ Limited |
| Control flow support | ✅ @for, @if | ❌ Only *ngFor |
| Customization | ✅ Easy | ⚠️ Complex |
| Performance | ✅ GPU accelerated | ⚠️ jQuery manipulation |
| Accessibility | ✅ Full control | ⚠️ Limited |

## Tính năng

✅ **Đã có:**
- Swipe left/right trên mobile
- Indicators với click navigation
- Smooth transitions
- Auto-sizing cho các cards
- Gap giữa slides

🔧 **Có thể thêm:**
- Auto-play
- Infinite loop
- Keyboard navigation
- Mouse drag
- Animation effects

## Uninstall ngx-slick-carousel (Optional)

Nếu không dùng ở nơi khác, có thể xóa:

```bash
npm uninstall ngx-slick-carousel slick-carousel jquery @types/jquery
```

Và xóa khỏi `angular.json`:
```json
{
  "styles": [
    // Xóa 2 dòng này:
    // "node_modules/slick-carousel/slick/slick.css",
    // "node_modules/slick-carousel/slick/slick-theme.css"
  ],
  "scripts": [
    // Xóa 2 dòng này:
    // "node_modules/jquery/dist/jquery.min.js",
    // "node_modules/slick-carousel/slick/slick.min.js"
  ]
}
```

## Kết luận

Custom carousel solution đơn giản hơn, nhẹ hơn, và hoạt động tốt hơn với Angular modern. Không cần phụ thuộc vào jQuery hay thư viện bên ngoài nào cả!

