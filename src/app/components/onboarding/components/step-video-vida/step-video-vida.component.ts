import { Component, EventEmitter, Output } from '@angular/core';
import { LivenessResult } from '../liveness-check/liveness-check.component';

@Component({
  selector: 'app-step-video-vida',
  standalone: false,
  template: `
    <h2>Prueba de vida</h2>
    <p>Verifica tu identidad mirando a la cámara.</p>
    @if (result) {
      <p-message severity="success" text="Identidad verificada" />
    }
    <p-button [label]="result ? 'Verificar de nuevo' : 'Iniciar verificación'" severity="help"
              icon="pi pi-user" (onClick)="checking = true" />
    @if (checking) {
      <app-liveness-check (verificationCompleted)="onLivenessCompleted($event)"
                          (verificationCancelled)="onLivenessCancelled()" />
    }
    <div class="actions">
      <p-button label="Atrás" severity="secondary" icon="pi pi-arrow-left" (onClick)="back.emit()" />
      <p-button label="Finalizar" icon="pi pi-check" iconPos="right"
                [disabled]="!result" (onClick)="completed.emit()" />
    </div>
  `
})
export class StepVideoVidaComponent {
  @Output() completed = new EventEmitter<void>();
  @Output() back = new EventEmitter<void>();

  checking = false;
  result: LivenessResult | null = null;

  onLivenessCompleted(result: LivenessResult): void {
    this.result = result;
    this.checking = false;
  }

  onLivenessCancelled(): void {
    this.checking = false;
  }
}
