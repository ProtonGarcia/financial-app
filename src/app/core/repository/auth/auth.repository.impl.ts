import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { LoginMapper } from '../../mapper/auth/login.mapper';
import { LoginResponse } from '../../models/auth/login-response.model';
import { LoginResponseWebEntity } from '../../webentity/auth/login-response.webentity';
import { AuthRepository } from './auth.repository';

@Injectable()
export class AuthRepositoryImpl extends AuthRepository {
  private readonly http = inject(HttpClient);

  override login(documentNumber: string): Observable<LoginResponse> {
    const request = LoginMapper.toWebEntity({ documentNumber });

    return this.http
      .post<LoginResponseWebEntity>(`${environment.apiUrl}/api/v1/auth/login`, request)
      .pipe(map(response => LoginMapper.toModel(response)));
  }
}
