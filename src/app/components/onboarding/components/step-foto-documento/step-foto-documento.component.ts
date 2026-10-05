import { Component, EventEmitter, NgZone, Output, inject } from '@angular/core';

@Component({
  selector: 'app-step-foto-documento',
  standalone: false,
  template: `
    <h2>Foto del documento</h2>
    <p>Escanea tu DUI con la cámara.</p>
    <p-button [label]="preview ? 'Escanear de nuevo' : 'Escanear DUI'" icon="pi pi-camera"
              severity="help" (onClick)="scanning = true" />
    @if (preview) {
      <img [src]="preview" alt="Documento" class="preview" />
    }
    @if (scanning) {
      <app-document-scanner (documentCaptured)="onDocumentCaptured($event)"
                            (scannerClosed)="onScannerClosed()" />
    }
    <div class="actions">
      <p-button label="Atrás" severity="secondary" icon="pi pi-arrow-left" (onClick)="back.emit()" />
      <p-button label="Siguiente" icon="pi pi-arrow-right" iconPos="right"
                [disabled]="!preview" (onClick)="completed.emit()" />
    </div>
  `,
  styles: ['.preview { max-width: 100%; max-height: 300px; display: block; margin: 1rem 0; }']
})
export class StepFotoDocumentoComponent {
  @Output() completed = new EventEmitter<void>();
  @Output() back = new EventEmitter<void>();
  preview: string | null = null;
  scanning = false;
  private zone = inject(NgZone);

  onDocumentCaptured(file: File): void {
    this.scanning = false;
    const reader = new FileReader();
    reader.onload = () => this.zone.run(() => (this.preview = reader.result as string));
    reader.readAsDataURL(file);
  }

  onScannerClosed(): void {
    this.scanning = false;
  }
}
