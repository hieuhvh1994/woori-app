# Hướng dẫn tùy chỉnh từng slide riêng biệt

## Cấu trúc mới

Mỗi slide giờ được wrap trong `.financial-slide`, cho phép bạn tùy chỉnh riêng từng slide:

```html
<div class="financial-track">
  <div class="financial-slide">          <!-- Wrapper cho slide 1 -->
    <div class="financial-card">
      <!-- Nội dung card 1 -->
    </div>
  </div>
  
  <div class="financial-slide">          <!-- Wrapper cho slide 2 -->
    <div class="financial-card">
      <!-- Nội dung card 2 -->
    </div>
  </div>
  
  <div class="financial-slide">          <!-- Wrapper cho slide 3 -->
    <div class="financial-card">
      <!-- Nội dung card 3 -->
    </div>
  </div>
</div>
```

## Cách tùy chỉnh từng slide

### 1. Tùy chỉnh theo index trong template

```html
@for (card of financialCards; track $index) {
  <div class="financial-slide" 
       [class.slide-first]="$index === 0"
       [class.slide-last]="$index === financialCards.length - 1">
    <div class="financial-card">
      <!-- Content -->
    </div>
  </div>
}
```

### 2. Tùy chỉnh theo type của card

```html
@for (card of financialCards; track $index) {
  <div class="financial-slide" 
       [class.slide-overview]="card.type === 'overview'"
       [class.slide-timeseries]="card.type === 'timeseries'"
       [class.slide-points]="card.type === 'combinedpoints'">
    <div class="financial-card">
      <!-- Content -->
    </div>
  </div>
}
```

### 3. Tùy chỉnh inline style

```html
@for (card of financialCards; track $index) {
  <div class="financial-slide" 
       [style.width]="card.type === 'overview' ? '100%' : '90%'"
       [style.padding-right]="$index === financialCards.length - 1 ? '0' : '14px'">
    <div class="financial-card">
      <!-- Content -->
    </div>
  </div>
}
```

## Ví dụ SCSS tùy chỉnh

### Tùy chỉnh slide đầu tiên

```scss
.financial-slide {
  width: 100%;
  flex-shrink: 0;
  padding-right: 14px;

  &.slide-first {
    // Slide đầu có thể có style riêng
    .financial-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }
  }

  &:last-child {
    padding-right: 0;
  }
}
```

### Tùy chỉnh theo type

```scss
.financial-slide {
  width: 100%;
  flex-shrink: 0;
  padding-right: 14px;

  // Slide overview - Full width
  &.slide-overview {
    width: 100%;
  }

  // Slide timeseries - 95% width
  &.slide-timeseries {
    width: 95%;
    
    .financial-card {
      background: #f8f9fa;
    }
  }

  // Slide points - 90% width, centered
  &.slide-points {
    width: 90%;
    margin: 0 auto;
    
    .financial-card {
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
  }

  &:last-child {
    padding-right: 0;
  }
}
```

### Tùy chỉnh margin giữa các slides

```scss
.financial-slide {
  width: 100%;
  flex-shrink: 0;
  
  // Mặc định margin-right 14px
  margin-right: 14px;
  
  // Slide 1 có margin lớn hơn
  &:nth-child(1) {
    margin-right: 20px;
  }
  
  // Slide 2 có margin nhỏ hơn
  &:nth-child(2) {
    margin-right: 10px;
  }

  &:last-child {
    margin-right: 0;
  }
}
```

### Tùy chỉnh kích thước card bên trong

```scss
.financial-slide {
  width: 100%;
  flex-shrink: 0;
  padding-right: 14px;

  .financial-card {
    width: 100%;
    background: #fff;
    padding: 16px;
    border-radius: 18px;
  }

  // Card trong slide đầu tiên lớn hơn
  &:nth-child(1) .financial-card {
    padding: 24px;
    font-size: 1.1em;
  }

  // Card trong slide cuối nhỏ hơn
  &:last-child .financial-card {
    padding: 12px;
    font-size: 0.9em;
  }
}
```

## Ví dụ thực tế

### Slide overview nổi bật

```scss
.financial-slide.slide-overview {
  .financial-card {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    
    .financial-title {
      color: white;
      font-size: 15px;
      font-weight: 700;
    }
    
    .legend-value {
      color: white !important;
    }
  }
}
```

### Slide timeseries có shadow

```scss
.financial-slide.slide-timeseries {
  .financial-card {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    border: 1px solid rgba(0, 0, 0, 0.05);
  }
}
```

### Slide points có hiệu ứng 3D

```scss
.financial-slide.slide-points {
  .financial-card {
    transform: perspective(1000px) rotateY(-2deg);
    transition: transform 0.3s ease;
    
    &:hover {
      transform: perspective(1000px) rotateY(0deg);
    }
  }
}
```

## Lưu ý quan trọng

### 1. Transform vẫn hoạt động bình thường

Dù có tùy chỉnh width của slide, carousel vẫn hoạt động:

```typescript
// Transform di chuyển 100% cho mỗi slide
translateX(-0%)   // Slide 1
translateX(-100%) // Slide 2
translateX(-200%) // Slide 3
```

### 2. Padding-right vs Margin-right

**Hiện tại đang dùng `padding-right: 14px`:**
- ✅ Khoảng cách giữa slides cố định
- ✅ Không ảnh hưởng đến transform calculation
- ✅ Slide cuối không có padding

**Nếu muốn dùng `margin-right`:**
```scss
.financial-slide {
  margin-right: 14px;
  padding-right: 0; // Xóa padding
  
  &:last-child {
    margin-right: 0;
  }
}
```

### 3. Width linh hoạt

Nếu muốn slides có width khác nhau:

```html
@for (card of financialCards; track $index) {
  <div class="financial-slide" 
       [style.width]="getSlideWidth(card.type)">
    <!-- Content -->
  </div>
}
```

```typescript
getSlideWidth(type: string): string {
  switch(type) {
    case 'overview': return '100%';
    case 'timeseries': return '95%';
    case 'combinedpoints': return '90%';
    default: return '100%';
  }
}
```

## Kết luận

Với cấu trúc mới có `.financial-slide` wrapper:

✅ **Có thể tùy chỉnh:**
- Width riêng cho từng slide
- Padding/margin khác nhau
- Style riêng cho từng type
- Hiệu ứng riêng cho từng vị trí
- Background, shadow, border...

✅ **Vẫn giữ:**
- Swipe gesture hoạt động
- Transform mượt mà
- Indicators chính xác
- Responsive tốt

🎨 **Tùy biến thoải mái mà không lo carousel bị hỏng!**

