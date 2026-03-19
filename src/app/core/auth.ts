import { Injectable, inject } from '@angular/core';
import { PasskeyService } from './passkey';

const LS_KEY = 'demo_banking_logged_in';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private passkey = inject(PasskeyService);

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
    const ok = pw === 'modafukaz27!';
    localStorage.setItem(LS_KEY, ok ? '1' : '0');
    return ok;
  }

  /** Trình duyệt/thiết bị có hỗ trợ Face ID / Touch ID không? */
  isFaceIdAvailable(): Promise<boolean> {
    return this.passkey.isAvailable();
  }

  /** Người dùng đã đăng ký Face ID trên thiết bị này chưa? */
  hasFaceIdRegistered(): boolean {
    return this.passkey.hasRegistered();
  }

  /** Thiết lập passkey lần đầu (Safari sẽ hiện Face ID) */
  async setupFaceId(): Promise<void> {
    await this.passkey.register(this.username);
    localStorage.setItem(LS_KEY, '1');
  }

  /** Đăng nhập bằng passkey (Safari sẽ hiện Face ID) */
  async loginWithFaceId(): Promise<void> {
    await this.passkey.login();
    localStorage.setItem(LS_KEY, '1');
  }
}
