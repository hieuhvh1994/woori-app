# Slick Carousel Setup Guide

## Vấn đề

Ngx-slick-carousel không hoạt động với Angular 21+ standalone components khi sử dụng control flow mới (`@for`, `@if`).

## Nguyên nhân

1. **Ngx-slick-carousel không phải là standalone component** - phải import qua NgModule
2. **Angular control flow mới (`@for`) không tương thích** - ngx-slick-carousel được thiết kế cho cú pháp cũ (`*ngFor`)
3. **jQuery và slick-carousel phải được load trước** - cần cấu hình đúng trong `angular.json`

## Giải pháp

### 1. Cấu hình angular.json

Đảm bảo jQuery và slick-carousel được load trong `angular.json`:

```json
{
  "styles": [
    "src/styles.scss",
    "node_modules/slick-carousel/slick/slick.css",
    "node_modules/slick-carousel/slick/slick-theme.css"
  ],
  "scripts": [
    "node_modules/jquery/dist/jquery.min.js",
    "node_modules/slick-carousel/slick/slick.min.js"
  ]
}
```

### 2. Import SlickCarouselModule

Trong component TypeScript:

```typescript
import { SlickCarouselModule } from 'ngx-slick-carousel';

@Component({
  selector: 'app-home',
  imports: [CommonModule, SlickCarouselModule],
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
})
export class HomeComponent {
  slickConfig: any = {
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: true,
    arrows: false,
    infinite: false,
    speed: 500,
    swipe: true,
    dotsClass: 'slick-dots custom-dots'
  };
}
```

### 3. Sử dụng *ngFor thay vì @for trong template

**❌ KHÔNG ĐÚNG:**
```html
<ngx-slick-carousel [config]="slickConfig">
  @for (item of items; track $index) {
    <div ngxSlickItem>{{ item }}</div>
  }
</ngx-slick-carousel>
```

**✅ ĐÚNG:**
```html
<ngx-slick-carousel [config]="slickConfig">
  <div ngxSlickItem *ngFor="let item of items">
    {{ item }}
  </div>
</ngx-slick-carousel>
```

### 4. Custom Styles cho Dots

```scss
::ng-deep .slick-dots.custom-dots {
  display: flex !important;
  justify-content: center;
  gap: 8px;
  list-style: none;
  padding: 0;
  margin-top: 16px;

  li {
    margin: 0;
    padding: 0;
    width: 6px;
    height: 6px;

    button {
      width: 6px;
      height: 6px;
      padding: 0;
      border: none;
      border-radius: 50%;
      background: rgba(0, 0, 0, 0.3);
      cursor: pointer;
      font-size: 0;
      
      &:before {
        display: none;
      }
    }

    &.slick-active button {
      background: #4d8cff;
      width: 24px;
      border-radius: 4px;
    }
  }
}
```

## Debugging

Kiểm tra xem jQuery và slick đã được load chưa:

```typescript
ngAfterViewInit() {
  console.log('jQuery:', typeof (window as any).$);
  console.log('Slick:', typeof (window as any).$.fn?.slick);
}
```

## Lưu ý quan trọng

1. **Không thể sử dụng Angular control flow mới** trong ngx-slick-carousel
2. **Phải sử dụng `*ngFor`** thay vì `@for`
3. **Directive `ngxSlickItem`** phải được đặt trên element trực tiếp bên trong `<ngx-slick-carousel>`
4. **Config phải là `any` type** để tránh strict type checking
5. **Slick sẽ tự động khởi tạo** sau khi view được render

## Alternative: Tự implement carousel

Nếu ngx-slick-carousel gây nhiều vấn đề, có thể tự implement carousel đơn giản bằng Angular:

```typescript
currentIndex = signal(0);

next() {
  this.currentIndex.update(i => (i + 1) % this.items.length);
}

prev() {
  this.currentIndex.update(i => (i - 1 + this.items.length) % this.items.length);
}
```

```html
<div class="carousel">
  <div class="track" [style.transform]="'translateX(-' + currentIndex() * 100 + '%)'">
    @for (item of items; track $index) {
      <div class="slide">{{ item }}</div>
    }
  </div>
</div>
```

```scss
.carousel {
  overflow: hidden;
  
  .track {
    display: flex;
    transition: transform 0.3s ease;
  }
  
  .slide {
    min-width: 100%;
  }
}
```

