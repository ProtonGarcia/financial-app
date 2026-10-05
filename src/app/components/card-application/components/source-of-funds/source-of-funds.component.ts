import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { SourceOfFunds } from '../../models/card-application.model';

@Component({
  selector: 'app-source-of-funds',
  imports: [ReactiveFormsModule, ButtonModule, CheckboxModule, InputTextModule, SelectModule],
  template: `
    <h3>Origen de fondos</h3>
    <form [formGroup]="form" (ngSubmit)="submit()" class="ca-form">
      <div class="ca-field">
        <label>Origen principal</label>
        <p-select formControlName="source" [options]="sources" placeholder="Selecciona" appendTo="body" />
      </div>
      <div class="ca-field">
        <label>Descripción {{ form.controls.source.value === 'Otro' ? '' : '(opcional)' }}</label>
        <input pInputText formControlName="description" placeholder="Describe el origen de tus fondos" />
      </div>
      <div class="ca-check">
        <p-checkbox formControlName="declarationAccepted" [binary]="true" inputId="declaration" />
        <label for="declaration">Declaro que los fondos utilizados tienen un origen legítimo.</label>
      </div>
      <div class="ca-actions">
        <p-button label="Atrás" severity="secondary" icon="pi pi-arrow-left" (onClick)="back.emit()" />
        <p-button label="Continuar" type="submit" icon="pi pi-arrow-right" iconPos="right" [disabled]="form.invalid" />
      </div>
    </form>
  `
})
export class SourceOfFundsComponent implements OnInit {
  @Input() data?: SourceOfFunds;
  @Output() completed = new EventEmitter<SourceOfFunds>();
  @Output() back = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  readonly sources = ['Salario', 'Negocio propio', 'Ahorros', 'Remesas', 'Herencia', 'Otro'];

  form = this.fb.nonNullable.group({
    source: ['', Validators.required],
    description: [''],
    declarationAccepted: [false, Validators.requiredTrue]
  });

  ngOnInit(): void {
    if (this.data) {
      this.form.patchValue({
        source: this.data.source,
        description: this.data.description ?? '',
        declarationAccepted: this.data.declarationAccepted
      });
    }
    this.form.controls.source.valueChanges.subscribe(source => {
      const description = this.form.controls.description;
      description.setValidators(source === 'Otro' ? Validators.required : null);
      description.updateValueAndValidity();
    });
  }

  submit(): void {
    if (this.form.invalid) {
      return;
    }
    const v = this.form.getRawValue();
    this.completed.emit({
      source: v.source,
      description: v.description || undefined,
      declarationAccepted: v.declarationAccepted
    });
  }
}
