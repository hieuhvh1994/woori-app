import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.html',
  styleUrls: ['./splash.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
})
export class SplashComponent implements OnInit {
  private router = inject(Router);
  private auth = inject(AuthService);

  ngOnInit(): void {
    // Xoá session cũ: mỗi lần mở app phải đăng nhập lại
    this.auth.logout();
    setTimeout(() => {
      this.router.navigateByUrl('/login');
    }, 700);
  }
}
