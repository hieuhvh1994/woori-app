import { Injectable } from '@angular/core';

/**
 * PasskeyService – Demo mode (không cần backend).
 *
 * Dùng WebAuthn API của trình duyệt trực tiếp:
 *  - register(): tạo credential mới, lưu credentialId vào localStorage.
 *  - login(): yêu cầu trình duyệt xác thực bằng credential đã đăng ký.
 *
 * Trên iPhone (iOS 16+) được cài làm PWA (Add to Home Screen),
 * Safari sẽ hiện prompt Face ID khi gọi create() / get().
 *
 * Để deploy thật: thay bằng gọi backend + @simplewebauthn/server để
 * verify challenge đúng nghĩa.
 */

const LS_CRED_KEY = 'webauthn_credential_id';
const RP_NAME = 'WON Banking Demo';

/** Tạo random ArrayBuffer dùng làm challenge / userId */
function randomBuffer(len: number): ArrayBuffer {
  const buf = new Uint8Array(new ArrayBuffer(len));
  crypto.getRandomValues(buf);
  return buf.buffer as ArrayBuffer;
}

/** Chuyển base64url → ArrayBuffer */
function base64urlToBuffer(b64: string): ArrayBuffer {
  const pad = b64.length % 4;
  const padded = pad ? b64 + '='.repeat(4 - pad) : b64;
  const binary = atob(padded.replace(/-/g, '+').replace(/_/g, '/'));
  const arr = new Uint8Array(new ArrayBuffer(binary.length));
  for (let i = 0; i < binary.length; i++) arr[i] = binary.charCodeAt(i);
  return arr.buffer as ArrayBuffer;
}

/** Chuyển ArrayBuffer → base64url string */
function bufferToBase64url(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let binary = '';
  bytes.forEach(b => (binary += String.fromCharCode(b)));
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

@Injectable({ providedIn: 'root' })
export class PasskeyService {
  /**
   * Kiểm tra trình duyệt có hỗ trợ WebAuthn (platform authenticator) không.
   * Trên iPhone 11 iOS 16+ + HTTPS: trả về true → Safari dùng Face ID.
   */
  async isAvailable(): Promise<boolean> {
    if (typeof window === 'undefined') return false;
    if (!window.PublicKeyCredential) return false;
    try {
      return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    } catch {
      return false;
    }
  }

  /** Kiểm tra đã có credential được lưu chưa */
  hasRegistered(): boolean {
    return !!localStorage.getItem(LS_CRED_KEY);
  }

  /**
   * Đăng ký Face ID lần đầu.
   * iOS Safari sẽ hiện prompt "Dùng Face ID để đăng nhập vào [domain]?".
   */
  async register(username: string): Promise<void> {
    const credential = await navigator.credentials.create({
      publicKey: {
        rp: { name: RP_NAME },
        user: {
          id: randomBuffer(16),
          name: username,
          displayName: username,
        },
        challenge: randomBuffer(32),
        pubKeyCredParams: [
          { type: 'public-key', alg: -7 },   // ES256
          { type: 'public-key', alg: -257 },  // RS256
        ],
        authenticatorSelection: {
          authenticatorAttachment: 'platform', // chỉ dùng Face ID / Touch ID
          userVerification: 'required',         // bắt buộc xác thực sinh trắc
          residentKey: 'preferred',
        },
        timeout: 60000,
        attestation: 'none',
      },
    }) as PublicKeyCredential | null;

    if (!credential) throw new Error('Đăng ký bị huỷ hoặc thất bại');

    // Lưu credentialId để dùng lúc authenticate
    localStorage.setItem(LS_CRED_KEY, bufferToBase64url(credential.rawId));
  }

  /**
   * Đăng nhập bằng Face ID.
   * iOS Safari sẽ hiện prompt Face ID.
   */
  async login(): Promise<void> {
    const credIdStr = localStorage.getItem(LS_CRED_KEY);

    const allowCredentials: PublicKeyCredentialDescriptor[] = credIdStr
      ? [{ type: 'public-key', id: base64urlToBuffer(credIdStr) }]
      : [];

    const assertion = await navigator.credentials.get({
      publicKey: {
        challenge: randomBuffer(32),
        allowCredentials,
        userVerification: 'required',
        timeout: 60000,
      },
    }) as PublicKeyCredential | null;

    if (!assertion) throw new Error('Xác thực bị huỷ hoặc thất bại');

    // Demo: chấp nhận nếu assertion thành công (trình duyệt đã xác minh sinh trắc)
    // Production: gửi assertion lên backend để verify chữ ký
    const response = assertion.response as AuthenticatorAssertionResponse;
    if (!response.authenticatorData) {
      throw new Error('Phản hồi xác thực không hợp lệ');
    }
  }
}
