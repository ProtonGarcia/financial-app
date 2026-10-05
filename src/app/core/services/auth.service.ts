import { Injectable } from '@angular/core';
import { LoginData } from '../models/auth/login-response.model';

const TOKEN_KEY = 'access_token';
const TOKEN_TYPE_KEY = 'token_type';
const EXPIRES_AT_KEY = 'token_expires_at';
const MOCK_TOKEN = 'mock-jwt-token-financiaplus';

@Injectable({ providedIn: 'root' })
export class AuthService {
  setSession(data: LoginData): void {
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(TOKEN_TYPE_KEY, data.tokenType);
    localStorage.setItem(EXPIRES_AT_KEY, String(Date.now() + data.expiresIn * 1000));
  }

  loginMock(): void {
    localStorage.setItem(TOKEN_KEY, MOCK_TOKEN);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_TYPE_KEY);
    localStorage.removeItem(EXPIRES_AT_KEY);
  }
}
