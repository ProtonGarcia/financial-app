import { Injectable, inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { SolicitarTarjetaModel } from '../../models/tarjeta/solicitar-tarjeta.model';
import { TarjetaModel } from '../../models/tarjeta/tarjeta.model';
import { TarjetaRepository } from '../../repository/tarjeta/tarjeta.repository';

@Injectable({ providedIn: 'root' })
export class SolicitarTarjetaUseCase {
  private readonly tarjetaRepository = inject(TarjetaRepository);

  execute(request: SolicitarTarjetaModel): Observable<TarjetaModel> {
    if (!request.tipoTarjeta?.trim()) {
      return throwError(() => new Error('Selecciona un tipo de tarjeta.'));
    }
    return this.tarjetaRepository.solicitarTarjeta(request);
  }
}
