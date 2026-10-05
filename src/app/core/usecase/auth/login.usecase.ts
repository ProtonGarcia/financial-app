import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginResponse } from '../../models/auth/login-response.model';
import { AuthRepository } from '../../repository/auth/auth.repository';

@Injectable({ providedIn: 'root' })
export class LoginUseCase {
  private readonly authRepository = inject(AuthRepository);

  execute(documentNumber: string): Observable<LoginResponse> {
    return this.authRepository.login(documentNumber);
  }
}
