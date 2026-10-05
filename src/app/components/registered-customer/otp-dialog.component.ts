import { Component, EventEmitter, Input, Output, effect, inject, model, untracked } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputOtpModule } from 'primeng/inputotp';
import { MessageModule } from 'primeng/message';
import { RegisteredCustomerService } from '../../core/services/registered-customer.service';
import { AuthService } from '../../core/services/auth.service';
import { LoginUseCase } from '../../core/usecase/auth/login.usecase';
import { maskPhone } from '../../core/utils/mask-phone';

const OTP_LENGTH = 6;
const SUCCESS_DELAY_MS = 800;
const OTP_ERROR = 'Código incorrecto. Verifica el código e inténtalo nuevamente.';
const CONNECTION_ERROR = 'No fue posible conectarnos con el servicio. Inténtalo nuevamente.';
const GENERIC_ERROR = 'No fue posible iniciar sesión. Inténtalo nuevamente.';

@Component({
  selector: 'app-otp-dialog',
  imports: [FormsModule, ButtonModule, DialogModule, InputOtpModule, MessageModule],
  template: `
    <p-dialog header="Verificación de identidad" [(visible)]="visible" [modal]="true" [draggable]="false"
              [resizable]="false" [style]="{ width: '26rem', maxWidth: '95vw' }">
      <div class="otp">
        <p>Se ha enviado un código a tu número</p>
        <strong>{{ maskedPhone }}</strong>

        <p-inputotp [(ngModel)]="code" [length]="6" [integerOnly]="true" [disabled]="success || isLoading"
                    (onChange)="errorMessage = ''" />

        @if (errorMessage) {
          <p-message severity="error">{{ errorMessage }}</p-message>
        }
        @if (success) {
          <p-message severity="success">Verificación exitosa.</p-message>
        }

        <p-button [label]="isLoading ? 'Iniciando sesión...' : 'Verificar'" icon="pi pi-check"
                  [loading]="isLoading" [disabled]="code.length !== 6 || success || isLoading"
                  (onClick)="verify()" />
      </div>
    </p-dialog>
  `,
  styles: [`
    .otp { display: flex; flex-direction: column; align-items: center; gap: 1rem; text-align: center; }
    .otp p { margin: 0; }
  `]
})
export class OtpDialogComponent {
  visible = model(false);
  @Input() phone = '';
  @Input() documentNumber = '';
  @Output() verified = new EventEmitter<void>();

  private customers = inject(RegisteredCustomerService);
  private loginUseCase = inject(LoginUseCase);
  private authService = inject(AuthService);

  code = '';
  errorMessage = '';
  success = false;
  isLoading = false;

  constructor() {
    effect(() => {
      if (this.visible()) {
        untracked(() => this.reset());
      }
    });
  }

  get maskedPhone(): string {
    return maskPhone(this.phone);
  }

  verify(): void {
    if (this.code.length !== OTP_LENGTH || this.isLoading) {
      return;
    }
    if (!this.customers.verifyOtp(this.code)) {
      this.errorMessage = OTP_ERROR;
      return;
    }
    this.login();
  }

  private login(): void {
    this.errorMessage = '';
    this.isLoading = true;
    this.loginUseCase
      .execute(this.documentNumber)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: response => {
          if (response.code === 200 && response.data?.token) {
            this.authService.setSession(response.data);
            this.success = true;
            setTimeout(() => this.verified.emit(), SUCCESS_DELAY_MS);
          } else {
            this.errorMessage = response.message || GENERIC_ERROR;
          }
        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage =
            error.status === 0 ? CONNECTION_ERROR : (error.error?.message ?? GENERIC_ERROR);
        }
      });
  }

  private reset(): void {
    this.code = '';
    this.errorMessage = '';
    this.success = false;
    this.isLoading = false;
  }
}
