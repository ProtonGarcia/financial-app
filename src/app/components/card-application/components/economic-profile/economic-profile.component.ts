import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { EconomicProfile } from '../../models/card-application.model';

@Component({
  selector: 'app-economic-profile',
  imports: [ReactiveFormsModule, ButtonModule, InputNumberModule, InputTextModule, SelectModule],
  template: `
    <h3>Perfil económico</h3>
    <form [formGroup]="form" (ngSubmit)="submit()" class="ca-form">
      <div class="ca-field">
        <label>Situación laboral</label>
        <p-select formControlName="employmentStatus" [options]="statuses" placeholder="Selecciona" appendTo="body" />
      </div>
      <div class="ca-field">
        <label>Ingresos mensuales</label>
        <p-inputnumber formControlName="monthlyIncome" mode="currency" currency="USD" locale="en-US" [min]="0" />
      </div>
      <div class="ca-field">
        <label>Gastos mensuales</label>
        <p-inputnumber formControlName="monthlyExpenses" mode="currency" currency="USD" locale="en-US" [min]="0" />
      </div>
      <div class="ca-field">
        <label>Actividad económica</label>
        <input pInputText formControlName="economicActivity" placeholder="Ej. Desarrollo de software" />
      </div>
      <div class="ca-actions">
        <p-button label="Continuar" type="submit" icon="pi pi-arrow-right" iconPos="right" [disabled]="form.invalid" />
      </div>
    </form>
  `
})
export class EconomicProfileComponent implements OnInit {
  @Input() data?: EconomicProfile;
  @Output() completed = new EventEmitter<EconomicProfile>();

  private fb = inject(FormBuilder);
  readonly statuses = ['Empleado', 'Independiente', 'Empresario', 'Jubilado', 'Estudiante', 'Otro'];

  form = this.fb.nonNullable.group({
    employmentStatus: ['', Validators.required],
    monthlyIncome: [null as number | null, [Validators.required, Validators.min(1)]],
    monthlyExpenses: [null as number | null, [Validators.required, Validators.min(0)]],
    economicActivity: ['', Validators.required]
  });

  ngOnInit(): void {
    if (this.data) {
      this.form.patchValue(this.data);
    }
  }

  submit(): void {
    if (this.form.invalid) {
      return;
    }
    const v = this.form.getRawValue();
    this.completed.emit({
      employmentStatus: v.employmentStatus,
      monthlyIncome: v.monthlyIncome ?? 0,
      monthlyExpenses: v.monthlyExpenses ?? 0,
      economicActivity: v.economicActivity
    });
  }
}
