import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../../../core/services/auth.service';

const STORAGE_KEY = 'onboarding.currentStep';
const DOCUMENT_KEY = 'onboarding.documentNumber';

@Component({
  selector: 'app-onboarding',
  standalone: false,
  templateUrl: './onboarding.component.html',
  styleUrl: './onboarding.component.scss'
})
export class OnboardingComponent implements OnInit {
  readonly steps = [
    'Solicitud de DUI',
    'Datos básicos',
    'Foto del documento',
    'Prueba de vida'
  ];

  readonly items: MenuItem[] = this.steps.map(label => ({ label }));

  currentStep = 0;
  documentNumber = '';

  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit(): void {
    this.documentNumber = localStorage.getItem(DOCUMENT_KEY) ?? '';
    const saved = Number(localStorage.getItem(STORAGE_KEY));
    if (Number.isInteger(saved) && saved >= 0 && saved < this.steps.length) {
      this.currentStep = saved;
    }
  }

  next(): void {
    if (this.currentStep < this.steps.length - 1) {
      this.goTo(this.currentStep + 1);
    } else {
      this.finish();
    }
  }

  onDuiCompleted(dui: string): void {
    this.documentNumber = dui;
    localStorage.setItem(DOCUMENT_KEY, dui);
    this.next();
  }

  back(): void {
    if (this.currentStep > 0) {
      this.goTo(this.currentStep - 1);
    }
  }

  cancel(): void {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(DOCUMENT_KEY);
    this.router.navigate(['/']);
  }

  private finish(): void {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(DOCUMENT_KEY);
    this.router.navigate([this.authService.isAuthenticated() ? '/productos-cliente' : '/']);
  }

  private goTo(step: number): void {
    this.currentStep = step;
    localStorage.setItem(STORAGE_KEY, String(step));
  }
}
