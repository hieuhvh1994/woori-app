import { Injectable } from '@angular/core';
import { PasskeyService } from './passkey';

const LS_KEY = 'demo_banking_logged_in';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // demo: 1 user cố định (bạn có thể đổi)
  readonly username = 'DAO DUY HIEU';

  isLoggedInSync(): boolean {
    return localStorage.getItem(LS_KEY) === '1';
  }

  logout(): void {
    localStorage.setItem(LS_KEY, '0');
  }

  loginWithPassword(pw: string): boolean {
    // demo password: 123456
    const ok = pw === '123456';
    localStorage.setItem(LS_KEY, ok ? '1' : '0');
    return ok;
  }

  constructor(private passkey: PasskeyService) {}

  /** Thiết lập passkey lần đầu (Safari sẽ hiện Face ID) */
  async setupFaceId(): Promise<void> {
    await this.passkey.register(this.username);
    localStorage.setItem(LS_KEY, '1');
  }

  /** Đăng nhập bằng passkey (Safari sẽ hiện Face ID) */
  async loginWithFaceId(): Promise<void> {
    await this.passkey.login(this.username);
    localStorage.setItem(LS_KEY, '1');
  }
}
