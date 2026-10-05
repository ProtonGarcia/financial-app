import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { TarjetaMapper } from '../../mapper/tarjeta/tarjeta.mapper';
import { ApiResponse } from '../../models/http/api-response.model';
import { SolicitarTarjetaModel } from '../../models/tarjeta/solicitar-tarjeta.model';
import { TarjetaModel } from '../../models/tarjeta/tarjeta.model';
import { TarjetaWebEntity } from '../../webentity/tarjeta/tarjeta.webentity';
import { TarjetaRepository } from './tarjeta.repository';

const CONNECTION_ERROR = 'No fue posible conectarnos con el servicio. Inténtalo nuevamente.';
const GENERIC_ERROR = 'Ocurrió un error inesperado. Inténtalo nuevamente.';

@Injectable()
export class TarjetaRepositoryImpl extends TarjetaRepository {
  private readonly http = inject(HttpClient);

  override solicitarTarjeta(request: SolicitarTarjetaModel): Observable<TarjetaModel> {
    return this.http
      .post<ApiResponse<TarjetaWebEntity | null>>(
        `${environment.apiUrl}/api/v1/clientes/tarjetas`,
        TarjetaMapper.toWebEntity(request)
      )
      .pipe(
        map(response => {
          if (response.code !== 201 || !response.data) {
            throw new Error(response.message || GENERIC_ERROR);
          }
          return TarjetaMapper.toModel(response.data);
        }),
        catchError(error =>
          throwError(() => (error instanceof HttpErrorResponse ? this.toFriendlyError(error) : error))
        )
      );
  }

  override obtenerTarjetas(): Observable<TarjetaModel[]> {
    return this.http
      .get<ApiResponse<TarjetaWebEntity[] | null>>(`${environment.apiUrl}/api/v1/clientes/tarjetas`)
      .pipe(
        map(response => {
          if (response.code !== 200 || !response.data) {
            throw new Error(response.message || GENERIC_ERROR);
          }
          return response.data.map(entity => TarjetaMapper.toModel(entity));
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
