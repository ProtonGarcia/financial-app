export interface TarjetaModel {
  numeroTarjeta: string;
  tipoTarjeta: string;
  estado: string;
  limiteTransaccional: number;
  fechaEmision: string;
  fechaVencimiento: string;
  diaCorte: number;
  fechaPago: string;
  bloqueo: boolean;
  beneficiario: string;
}
