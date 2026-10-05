import { SolicitarTarjetaModel } from '../../models/tarjeta/solicitar-tarjeta.model';
import { TarjetaModel } from '../../models/tarjeta/tarjeta.model';
import { SolicitarTarjetaWebEntity } from '../../webentity/tarjeta/solicitar-tarjeta.webentity';
import { TarjetaWebEntity } from '../../webentity/tarjeta/tarjeta.webentity';

export class TarjetaMapper {
  static toWebEntity(model: SolicitarTarjetaModel): SolicitarTarjetaWebEntity {
    return { tipoTarjeta: model.tipoTarjeta };
  }

  static toModel(entity: TarjetaWebEntity): TarjetaModel {
    if (!entity?.numeroTarjeta || !entity.tipoTarjeta) {
      throw new Error('Respuesta de tarjeta inválida.');
    }

    return {
      numeroTarjeta: entity.numeroTarjeta,
      tipoTarjeta: entity.tipoTarjeta,
      estado: entity.estado,
      limiteTransaccional: entity.limiteTransaccional,
      fechaEmision: entity.fechaEmision,
      fechaVencimiento: entity.fechaVencimiento,
      diaCorte: entity.diaCorte,
      fechaPago: entity.fechaPago,
      bloqueo: entity.bloqueo,
      beneficiario: entity.beneficiario
    };
  }
}
