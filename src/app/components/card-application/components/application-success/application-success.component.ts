import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { TarjetaModel } from '../../../../core/models/tarjeta/tarjeta.model';
import { CardApplication } from '../../models/card-application.model';

export type ConfirmationPhase = 'summary' | 'processing' | 'success';

@Component({
  selector: 'app-application-success',
  imports: [FormsModule, ButtonModule, InputTextModule, MessageModule, CurrencyPipe, DatePipe],
  template: `
    @switch (phase) {
      @case ('summary') {
        
        @if (errorMessage) {
          <p-message severity="error">No pudimos completar la solicitud. {{ errorMessage }}</p-message>
        }
        <div class="ca-field">
          <label for="signer">Ingresa tu nombre para confirmar la solicitud</label>
          <input pInputText id="signer" [(ngModel)]="name" placeholder="Nombre completo" />
        </div>
        <div class="ca-actions">
          <p-button label="Atrás" severity="secondary" icon="pi pi-arrow-left" (onClick)="back.emit()" />
          <p-button label="Ingresar solicitud" icon="pi pi-check" iconPos="right"
                    [disabled]="!allDone || !name.trim()" (onClick)="confirm.emit(name.trim())" />
        </div>
      }
      @case ('processing') {
        <div class="box">
          <i class="pi pi-spin pi-spinner big"></i>
          <h3>Estamos procesando tu solicitud...</h3>
          <ul class="progress">
            <li>Validando información</li>
            <li>Guardando solicitud</li>
            <li>Generando cuenta digital</li>
            <li>Generando tarjeta</li>
          </ul>
        </div>
      }
      @case ('success') {
        <div class="box">
          <i class="pi pi-check-circle big ok"></i>
          <h3>¡Proceso completado!</h3>
          <p>Tu Cuenta Digital y Tarjeta fueron creadas correctamente.</p>
          <p>Tu solicitud ha sido registrada exitosamente.</p>
          <small>Número de solicitud</small>
          <strong>{{ application.id }}</strong>

          @if (tarjeta) {
            <div class="card-preview">
              <span class="brand">FINANCIAPLUS</span>
              <div class="number">{{ tarjeta.numeroTarjeta }}</div>
              <div class="row">
                <span>{{ tarjeta.tipoTarjeta === 'CREDITO' ? 'Tarjeta de crédito' : tarjeta.tipoTarjeta }}</span>
                <span>{{ tarjeta.fechaVencimiento | date: 'MM/yyyy' }}</span>
              </div>
            </div>
            <small>Límite: {{ tarjeta.limiteTransaccional | currency: 'USD' : 'symbol' : '1.2-2' }}</small>
          }

          <p-button label="Ver mis productos" icon="pi pi-check" iconPos="right" (onClick)="finished.emit()" />
        </div>
      }
    }
  `,
  styles: [`
    .box { display: flex; flex-direction: column; align-items: center; gap: .5rem; text-align: center; padding: 1rem 0; }
    .big { font-size: 3rem; }
    .ok { color: #16a34a; }
    h3, p { margin: 0; }
    strong { font-size: 1.25rem; margin-bottom: .5rem; }
    ul { list-style: none; margin: 0 0 1rem; padding: 0; display: flex; flex-direction: column; gap: .5rem; }
    .summary li { display: flex; align-items: center; gap: .5rem; color: #dc2626; }
    .summary li.done { color: #16a34a; }
    .progress { color: #64748b; margin-top: .5rem; }
    .card-preview {
      width: 100%; max-width: 320px; aspect-ratio: 1.586; border-radius: 16px; padding: 1.25rem; color: #fff;
      display: flex; flex-direction: column; justify-content: space-between; align-items: flex-start;
      background: linear-gradient(135deg, #1e3a8a, #3b82f6); margin: .75rem 0 .25rem;
    }
    .card-preview .brand { font-weight: 700; letter-spacing: .15rem; font-size: .85rem; }
    .card-preview .number { font-size: 1.3rem; letter-spacing: .1rem; }
    .card-preview .row { display: flex; justify-content: space-between; width: 100%; }
  `]
})
export class ApplicationSuccessComponent {
  @Input({ required: true }) application!: CardApplication;
  @Input() phase: ConfirmationPhase = 'summary';
  @Input() tarjeta: TarjetaModel | null = null;
  @Input() errorMessage = '';
  name = '';
  @Output() confirm = new EventEmitter<string>();
  @Output() back = new EventEmitter<void>();
  @Output() finished = new EventEmitter<void>();

  get items(): { label: string; done: boolean }[] {
    const a = this.application;
    return [
      { label: 'Perfil económico', done: !!a.economicProfile },
      { label: 'Origen de fondos', done: !!a.sourceOfFunds?.declarationAccepted },
      { label: 'Comprobante de domicilio', done: a.addressProof?.validationStatus === 'VALID' },
      { label: 'Tipo de tarjeta', done: !!a.cardSelection?.cardType },
      { label: 'Límite transaccional', done: !!a.cardSelection?.transactionLimit }
    ];
  }

  get allDone(): boolean {
    return this.items.every(i => i.done);
  }
}
