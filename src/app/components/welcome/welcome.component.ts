import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-welcome',
  imports: [ButtonModule],
  template: `
    <section class="welcome">
      <span class="brand">FINANCIAPLUS</span>
      <h1>Solicita tu Cuenta Digital<br>+ Tarjeta</h1>

      <p-button label="Comenzar onboarding" icon="pi pi-arrow-right" iconPos="right" size="large"
                (onClick)="router.navigate(['/onboarding'])" />

      <p class="question">¿Ya eres cliente?</p>

      <p-button label="Ya estoy registrado" icon="pi pi-user" severity="secondary" [outlined]="true"
                size="large" (onClick)="router.navigate(['/registrado'])" />
    </section>
  `,
  styles: [`
    .welcome {
      max-width: 420px; margin: 3rem auto; padding: 0 1rem;
      display: flex; flex-direction: column; align-items: center; gap: 1rem; text-align: center;
    }
    .brand { font-weight: 700; letter-spacing: .2rem; color: var(--p-primary-color); }
    h1 { margin: 0 0 1rem; font-size: 1.75rem; line-height: 1.3; }
    .question { margin: 1.5rem 0 0; color: #64748b; }
    p-button { width: 100%; }
    :host ::ng-deep .p-button { width: 100%; }
  `]
})
export class WelcomeComponent {
  router = inject(Router);
}
