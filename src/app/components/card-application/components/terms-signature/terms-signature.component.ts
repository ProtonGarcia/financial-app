import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { Terms } from '../../models/card-application.model';

@Component({
  selector: 'app-terms-signature',
  imports: [ReactiveFormsModule, ButtonModule, CheckboxModule, InputTextModule],
  template: `
    <h3>Términos y condiciones</h3>
    <form [formGroup]="form" (ngSubmit)="submit()" class="ca-form">
      <div class="terms">
        <p>
          Estos son términos y condiciones de ejemplo para la solicitud de la Cuenta Digital y la
          Tarjeta FinanciaPlus. Al continuar declaras que la información proporcionada es verdadera
          y autorizas su verificación conforme a las políticas de la institución.
        </p>
        <p>
          La aprobación de la solicitud está sujeta a la evaluación interna de riesgo. Los límites
          y condiciones podrán ser modificados de acuerdo con la normativa vigente.
        </p>
      </div>
      <div class="ca-check">
        <p-checkbox formControlName="accepted" [binary]="true" inputId="terms" />
        <label for="terms">Acepto los términos y condiciones</label>
      </div>
      <div class="ca-field">
        <label>Nombre completo</label>
        <!-- TODO: integrar firma digital real -->
        <input pInputText formControlName="signature" placeholder="Escribe tu nombre completo" />
      </div>
      <div class="ca-actions">
        <p-button label="Atrás" severity="secondary" icon="pi pi-arrow-left" (onClick)="back.emit()" />
        <p-button label="Firmar y continuar" type="submit" icon="pi pi-pencil" iconPos="right" [disabled]="form.invalid" />
      </div>
    </form>
  `,
  styles: [`
    .terms {
      max-height: 160px; overflow: auto; padding: .75rem 1rem;
       border: 1px solid #e2e8f0; border-radius: 8px; font-size: .9rem;
    }
    .terms p { margin: 0 0 .5rem; }
  `]
})
export class TermsSignatureComponent implements OnInit {
  @Input() data?: Terms;
  @Output() completed = new EventEmitter<Terms>();
  @Output() back = new EventEmitter<void>();

  private fb = inject(FormBuilder);

  form = this.fb.nonNullable.group({
    accepted: [false, Validators.requiredTrue],
    signature: ['', [Validators.required, Validators.minLength(3)]]
  });

  ngOnInit(): void {
    if (this.data) {
      this.form.patchValue({ accepted: this.data.accepted, signature: this.data.signature ?? '' });
    }
  }

  submit(): void {
    if (this.form.valid) {
      const v = this.form.getRawValue();
      this.completed.emit({ accepted: v.accepted, signature: v.signature.trim() });
    }
  }
}
