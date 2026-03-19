import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
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
  constructor(private router: Router, private auth: AuthService) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.router.navigateByUrl(this.auth.isLoggedInSync() ? '/home' : '/login');
    }, 700);
  }
}
