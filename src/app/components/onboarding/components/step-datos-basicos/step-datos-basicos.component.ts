import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CreateClientUseCase } from '../../../../core/usecase/client/create-client.usecase';
import { CreateClientModel } from '../../../../core/models/client/client.model';
@Component({
  selector: 'app-step-datos-basicos',
  standalone: false,
  template: `
    <h2>Datos básicos</h2>
    <form [formGroup]="form" (ngSubmit)="siguiente()" class="form">
      <input pInputText formControlName="firstName" placeholder="Nombres" />
      <input pInputText formControlName="lastName" placeholder="Apellidos" />
      <input pInputText formControlName="address" placeholder="Dirección" />
      <div class="row">
        <p-datepicker formControlName="birthDate" placeholder="Fecha de nacimiento"
                      dateFormat="dd/mm/yy" [maxDate]="hoy" [showIcon]="true" appendTo="body" />
        <p-select formControlName="gender" [options]="generos" optionLabel="label" optionValue="value"
                  placeholder="Género" appendTo="body" />
      </div>
      <input pInputText formControlName="email" type="email" placeholder="Correo electrónico" />
      <input pInputText formControlName="phone" placeholder="Teléfono (+503 0000-0000)" />
      @if (error) {
        <p-message severity="error">{{ error }}</p-message>
      }
      <div class="actions">
        <p-button label="Atrás" severity="secondary" icon="pi pi-arrow-left" (onClick)="back.emit()" />
        <p-button label="Siguiente" type="submit" icon="pi pi-arrow-right" iconPos="right"
                  [disabled]="form.invalid || loading" [loading]="loading" />
      </div>
    </form>
  `,
  styles: [`
    .form { display: flex; flex-direction: column; gap: 0.75rem; }
    .row { display: flex; gap: 0.75rem; }
    .row > * { flex: 1; min-width: 0; }
  `]
})
export class StepDatosBasicosComponent implements OnInit {
  @Input() documentNumber = '';
  @Output() completed = new EventEmitter<void>();
  @Output() back = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private createClient = inject(CreateClientUseCase);
  loading = false;
  error = '';
  hoy = new Date();
  generos = [
    { label: 'Masculino', value: 'M' },
    { label: 'Femenino', value: 'F' }
  ];

  form = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    address: ['', Validators.required],
    birthDate: [null as Date | null, Validators.required],
    gender: ['', Validators.required],
    documentNumber: ['', [Validators.required, Validators.pattern(/^\d{8}-\d$/)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^\+?[\d\s-]{8,15}$/)]]
  });

  ngOnInit(): void {
    this.form.patchValue({ documentNumber: this.documentNumber });
  }

  siguiente(): void {
    if (this.form.invalid || this.loading) {
      return;
    }
    const v = this.form.getRawValue();
    const birth = v.birthDate as Date;
    const pad = (n: number) => String(n).padStart(2, '0');
    const request: Omit<CreateClientModel, 'ipAddresses'> = {
      firstName: v.firstName!.trim(),
      lastName: v.lastName!.trim(),
      address: v.address!.trim(),
      birthDate: `${birth.getFullYear()}-${pad(birth.getMonth() + 1)}-${pad(birth.getDate())}`,
      gender: v.gender!,
      status: 'pendiente',
      documentNumber: v.documentNumber!,
      email: v.email!.trim(),
      phone: v.phone!.trim()
    };
    this.loading = true;
    this.error = '';
    this.createClient.execute(request).subscribe({
      next: () => {
        this.loading = false;
        this.completed.emit();
      },
      error: (err: Error) => {
        this.loading = false;
        this.error = err.message;
      }
    });
  }
}
