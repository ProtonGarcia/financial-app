import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { AddressProof, DocumentStatus } from '../../models/card-application.model';
import { CardApplicationService } from '../../services/card-application.service';

const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];
const STATUS_LABELS: Record<DocumentStatus, string> = {
  VALID: 'Documento válido',
  INVALID: 'Documento inválido (vacío o mayor a 5 MB)',
  DUPLICATE: 'Documento repetido'
};

@Component({
  selector: 'app-address-proof',
  imports: [ButtonModule],
  template: `
    <h3>Comprobante de domicilio</h3>
    <p class="hint">Recibo de agua, energía eléctrica, teléfono, estado de cuenta u otro comprobante válido.</p>
    <div class="drop">
      <i class="pi pi-file"></i>
      @if (proof) {
        <p class="name">{{ proof.fileName }}</p>
        <small>{{ proof.fileType }} · {{ sizeLabel }}</small>
        <p [class.ok]="proof.validationStatus === 'VALID'" [class.error]="proof.validationStatus !== 'VALID'">
          <i class="pi" [class.pi-check]="proof.validationStatus === 'VALID'"
             [class.pi-times]="proof.validationStatus !== 'VALID'"></i> {{ statusLabel }}
        </p>
      } @else {
        <p>Selecciona tu comprobante de domicilio</p>
        <small>PDF, JPG, JPEG o PNG</small>
      }
      <input #file type="file" hidden accept=".pdf,.jpg,.jpeg,.png" (change)="onFile($event)" />
      <p-button [label]="proof ? 'Cambiar archivo' : 'Seleccionar archivo'" severity="secondary"
                icon="pi pi-upload" (onClick)="file.click()" />
      @if (error) {
        <p class="error">{{ error }}</p>
      }
    </div>
    <div class="ca-actions">
      <p-button label="Atrás" severity="secondary" icon="pi pi-arrow-left" (onClick)="back.emit()" />
      <p-button label="Continuar" icon="pi pi-arrow-right" iconPos="right"
                [disabled]="proof?.validationStatus !== 'VALID'" (onClick)="submit()" />
    </div>
  `,
  styles: [`
    .hint { margin: 0 0 1rem; color: #64748b; font-size: .9rem; }
    .name { font-weight: 600; word-break: break-all; }
    .drop {
      display: flex; flex-direction: column; align-items: center; gap: .5rem;
      border: 2px dashed #94a3b8; border-radius: 12px; padding: 1.5rem; text-align: center;
    }
    .drop > i { font-size: 2rem; color: #64748b; }
    .drop p { margin: 0; }
    .ok { color: #16a34a; font-weight: 600; }
    .error { color: #dc2626; }
  `]
})
export class AddressProofComponent implements OnInit {
  @Input() data?: AddressProof;
  @Output() completed = new EventEmitter<AddressProof>();
  @Output() back = new EventEmitter<void>();

  proof: AddressProof | null = null;
  error = '';

  private service = inject(CardApplicationService);

  get statusLabel(): string {
    return this.proof?.validationStatus ? STATUS_LABELS[this.proof.validationStatus] : '';
  }

  get sizeLabel(): string {
    const size = this.proof?.fileSize ?? 0;
    return size >= 1024 * 1024 ? `${(size / 1024 / 1024).toFixed(2)} MB` : `${(size / 1024).toFixed(1)} KB`;
  }

  ngOnInit(): void {
    this.proof = this.data ?? null;
  }

  onFile(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      this.error = 'Formato no permitido. Usa PDF, JPG, JPEG o PNG.';
      return;
    }
    this.error = '';
    this.proof = {
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      validationStatus: this.service.validateDocument(file, this.data)
    };
  }

  submit(): void {
    if (this.proof?.validationStatus === 'VALID') {
      this.completed.emit(this.proof);
    }
  }
}
