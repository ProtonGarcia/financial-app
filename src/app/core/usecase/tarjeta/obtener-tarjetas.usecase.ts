import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { TarjetaModel } from '../../models/tarjeta/tarjeta.model';
import { TarjetaRepository } from '../../repository/tarjeta/tarjeta.repository';

@Injectable({ providedIn: 'root' })
export class ObtenerTarjetasUseCase {
  private readonly tarjetaRepository = inject(TarjetaRepository);

  execute(): Observable<TarjetaModel[]> {
    return this.tarjetaRepository.obtenerTarjetas();
  }
}
