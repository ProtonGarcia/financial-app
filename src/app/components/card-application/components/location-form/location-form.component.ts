import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CustomerOrigin } from '../../models/card-application.model';

const IPV4 = /^((25[0-5]|2[0-4]\d|1?\d?\d)\.){3}(25[0-5]|2[0-4]\d|1?\d?\d)$/;

@Component({
  selector: 'app-location-form',
  imports: [ReactiveFormsModule, ButtonModule, InputTextModule],
  template: `
    <h3>Ubicación</h3>
    <form [formGroup]="form" (ngSubmit)="submit()" class="ca-form">
      
      <div class="ca-field">
        <label for="country">País</label>
        <input pInputText id="country" formControlName="country" placeholder="El Salvador" />
      </div>
      <div class="ca-field">
        <label for="region">Región</label>
        <input pInputText id="region" formControlName="region" placeholder="San Salvador" />
      </div>
      <div class="ca-field">
        <label for="city">Ciudad</label>
        <input pInputText id="city" formControlName="city" placeholder="San Salvador" />
      </div>
      <div class="ca-actions">
        <p-button label="Atrás" severity="secondary" icon="pi pi-arrow-left" (onClick)="back.emit()" />
        <p-button label="Continuar" type="submit" icon="pi pi-arrow-right" iconPos="right" [disabled]="form.invalid" />
      </div>
    </form>
  `,
  styles: ['.err { color: #dc2626; }']
})
export class LocationFormComponent implements OnInit {
  @Input() data?: CustomerOrigin;
  @Output() completed = new EventEmitter<CustomerOrigin>();
  @Output() back = new EventEmitter<void>();

  private fb = inject(FormBuilder);

  form = this.fb.nonNullable.group({
    ip: ['', [Validators.required, Validators.pattern(IPV4)]],
    country: ['', Validators.required],
    region: ['', Validators.required],
    city: ['', Validators.required]
  });

  ngOnInit(): void {
    if (this.data) {
      this.form.patchValue({
        ip: this.data.ip ?? '',
        country: this.data.country ?? '',
        region: this.data.region ?? '',
        city: this.data.city ?? ''
      });
    }
  }

  submit(): void {
    if (this.form.valid) {
      const v = this.form.getRawValue();
      this.completed.emit({
        ip: v.ip.trim(),
        country: v.country.trim(),
        region: v.region.trim(),
        city: v.city.trim()
      });
    }
  }
}
