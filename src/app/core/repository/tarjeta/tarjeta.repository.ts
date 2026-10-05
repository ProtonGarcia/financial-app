import { Observable } from 'rxjs';
import { SolicitarTarjetaModel } from '../../models/tarjeta/solicitar-tarjeta.model';
import { TarjetaModel } from '../../models/tarjeta/tarjeta.model';

export abstract class TarjetaRepository {
  abstract solicitarTarjeta(request: SolicitarTarjetaModel): Observable<TarjetaModel>;
  abstract obtenerTarjetas(): Observable<TarjetaModel[]>;
}
