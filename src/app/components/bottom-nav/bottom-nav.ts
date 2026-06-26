import { Component, Input, inject, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

/** Thanh điều hướng dưới cùng dùng chung (home, sản phẩm, ...). */
@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './bottom-nav.html',
  styleUrls: ['./bottom-nav.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BottomNavComponent {
  /** Mục đang active: 'home' | 'products' | 'notifications' | 'services' */
  @Input() active: 'home' | 'products' | 'notifications' | 'services' | null = null;

  private router = inject(Router);

  go(target: 'home' | 'products' | 'qr' | 'notifications' | 'services'): void {
    switch (target) {
      case 'home': this.router.navigateByUrl('/home'); break;
      case 'products': this.router.navigateByUrl('/products'); break;
      case 'qr': this.router.navigateByUrl('/qr-scan'); break;
      case 'notifications': this.router.navigateByUrl('/notifications'); break;
      case 'services': this.router.navigateByUrl('/services'); break;
    }
  }
}
