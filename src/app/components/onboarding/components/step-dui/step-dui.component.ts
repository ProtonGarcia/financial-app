import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-step-dui',
  standalone: false,
  template: `
    <h2>Solicitud de DUI</h2>
    <p>Ingresa tu número de DUI para comenzar.</p>
    <p-inputmask [(ngModel)]="dui" mask="99999999-9" placeholder="00000000-0" styleClass="w-full" />
    <div class="actions">
      <p-button label="Iniciar solicitud" icon="pi pi-arrow-right" iconPos="right"
                [disabled]="!valido" (onClick)="completed.emit(dui)" />
    </div>
  `
})
export class StepDuiComponent {
  @Output() completed = new EventEmitter<string>();
  @Input() dui = '';

  get valido(): boolean {
    return /^\d{8}-\d$/.test(this.dui);
  }
}
