import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SelectModule } from 'primeng/select';
import { CardSelection } from '../../models/card-application.model';

@Component({
  selector: 'app-card-selection',
  imports: [ReactiveFormsModule, ButtonModule, RadioButtonModule, SelectModule],
  template: `
    <h3>Selecciona tu tarjeta</h3>
    <form [formGroup]="form" (ngSubmit)="submit()" class="ca-form">
      <div class="options">
        @for (card of cards; track card.value) {
          <div class="ca-check">
            <p-radiobutton formControlName="cardType" [value]="card.value" [inputId]="card.value" />
            <label [for]="card.value">{{ card.label }}</label>
          </div>
        }
      </div>
      <div class="ca-field">
        <label>Límite transaccional</label>
        <p-select formControlName="transactionLimit" [options]="limits" optionLabel="label"
                  optionValue="value" appendTo="body" />
      </div>
      <div class="ca-actions">
        <p-button label="Atrás" severity="secondary" icon="pi pi-arrow-left" (onClick)="back.emit()" />
        <p-button label="Continuar" type="submit" icon="pi pi-arrow-right" iconPos="right" [disabled]="form.invalid" />
      </div>
    </form>
  `,
  styles: ['.options { display: flex; flex-direction: column; gap: .75rem; }']
})
export class CardSelectionComponent implements OnInit {
  @Input() data?: CardSelection;
  @Output() completed = new EventEmitter<CardSelection>();
  @Output() back = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  readonly cards = [{ value: 'CREDITO', label: 'Tarjeta de Crédito' }];
  readonly limits = [500, 1000, 2000, 5000].map(value => ({ label: `$${value}`, value }));

  form = this.fb.nonNullable.group({
    cardType: ['CREDITO', Validators.required],
    transactionLimit: [500, Validators.required]
  });

  ngOnInit(): void {
    if (this.data?.cardType === 'CREDITO') {
      this.form.patchValue(this.data);
    }
  }

  submit(): void {
    if (this.form.valid) {
      this.completed.emit(this.form.getRawValue());
    }
  }
}
