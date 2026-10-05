import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputMaskModule } from 'primeng/inputmask';
import { ClientModel } from '../../core/models/client/client.model';
import { FindClientUseCase } from '../../core/usecase/client/find-client.usecase';
import { OtpDialogComponent } from './otp-dialog.component';

@Component({
  selector: 'app-registered-customer',
  imports: [FormsModule, ButtonModule, CardModule, InputMaskModule, OtpDialogComponent],
  templateUrl: './registered-customer.component.html',
  styleUrl: './registered-customer.component.scss'
})
export class RegisteredCustomerComponent {
  private router = inject(Router);
  private findClient = inject(FindClientUseCase);

  dui = '';
  errorMessage = '';
  isLoading = false;
  otpVisible = false;
  customer: ClientModel | null = null;

  get validFormat(): boolean {
    return /^\d{8}-\d$/.test(this.dui);
  }

  continue(): void {
    if (!this.validFormat || this.isLoading) {
      return;
    }
    this.isLoading = true;
    this.errorMessage = '';
    this.findClient.execute(this.dui).subscribe({
      next: client => {
        this.isLoading = false;
        this.customer = client;
        this.otpVisible = true;
      },
      error: (err: Error) => {
        this.isLoading = false;
        this.customer = null;
        this.errorMessage = err.message;
      }
    });
  }

  onVerified(): void {
    this.otpVisible = false;
    this.router.navigate(['/productos-cliente']);
  }

  back(): void {
    this.router.navigate(['/']);
  }
}
