import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ClientMapper } from '../../mapper/client/client.mapper';
import { ApiResponse } from '../../models/http/api-response.model';
import { ClientModel, CreateClientModel } from '../../models/client/client.model';
import { ClientWebEntity } from '../../webentity/client/client.webentity';
import { ClientRepository } from './client.repository';

const CONNECTION_ERROR = 'No fue posible conectarnos con el servicio. Inténtalo nuevamente.';
const GENERIC_ERROR = 'Ocurrió un error inesperado. Inténtalo nuevamente.';

@Injectable()
export class ClientRepositoryImpl extends ClientRepository {
  private readonly http = inject(HttpClient);

  override createClient(request: CreateClientModel): Observable<ClientModel> {
    return this.http
      .post<ApiResponse<ClientWebEntity | null>>(
        `${environment.apiUrl}/api/v1/onboarding/client`,
        ClientMapper.toWebEntity(request)
      )
      .pipe(
        map(response => {
          if ((response.code !== 200 && response.code !== 201) || !response.data) {
            throw new Error(response.message || GENERIC_ERROR);
          }
          return ClientMapper.toModel(response.data);
        }),
        catchError(error =>
          throwError(() => (error instanceof HttpErrorResponse ? this.toFriendlyError(error) : error))
        )
      );
  }

  override findClient(documentNumber: string): Observable<ClientModel> {
    return this.http
      .get<ApiResponse<ClientWebEntity | null>>(
        `${environment.apiUrl}/api/v1/onboarding/client/${encodeURIComponent(documentNumber)}`
      )
      .pipe(
        map(response => {
          if (response.code !== 200 || !response.data) {
            throw new Error(response.message || GENERIC_ERROR);
          }
          return ClientMapper.toModel(response.data);
        }),
        catchError(error =>
          throwError(() => (error instanceof HttpErrorResponse ? this.toFriendlyError(error) : error))
        )
      );
  }

  private toFriendlyError(error: HttpErrorResponse): Error {
    if (error.status === 0) {
      return new Error(CONNECTION_ERROR);
    }
    return new Error(error.error?.message ?? GENERIC_ERROR);
  }
}
