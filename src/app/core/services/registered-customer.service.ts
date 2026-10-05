import { Injectable } from '@angular/core';

// OTP MOCK: el unico codigo valido es 123456. No hay llamadas HTTP.
const MOCK_OTP = '123456';

@Injectable({ providedIn: 'root' })
export class RegisteredCustomerService {
  verifyOtp(code: string): boolean {
    return code === MOCK_OTP;
  }
}
