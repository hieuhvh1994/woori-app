import { Injectable } from '@angular/core';
import { startRegistration, startAuthentication } from '@simplewebauthn/browser';

/**
 * WebAuthn/Passkey cần BACKEND để generate & verify challenge.
 * Mặc định gọi API cùng domain:
 * - POST /api/webauthn/register/options
 * - POST /api/webauthn/register/verify
 * - POST /api/webauthn/auth/options
 * - POST /api/webauthn/auth/verify
 */
@Injectable({ providedIn: 'root' })
export class PasskeyService {
  async register(username: string): Promise<void> {
    const optRes = await fetch('/api/webauthn/register/options', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username }),
      credentials: 'include',
    });
    if (!optRes.ok) throw new Error('register/options failed');
    const options = await optRes.json();

    const credential = await startRegistration(options);

    const verRes = await fetch('/api/webauthn/register/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credential }),
      credentials: 'include',
    });
    if (!verRes.ok) throw new Error('register/verify failed');
  }

  async login(username: string): Promise<void> {
    const optRes = await fetch('/api/webauthn/auth/options', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username }),
      credentials: 'include',
    });
    if (!optRes.ok) throw new Error('auth/options failed');
    const options = await optRes.json();

    const credential = await startAuthentication(options);

    const verRes = await fetch('/api/webauthn/auth/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credential }),
      credentials: 'include',
    });
    if (!verRes.ok) throw new Error('auth/verify failed');
  }
}
