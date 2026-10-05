import { AfterViewInit, Component, ElementRef, EventEmitter, OnDestroy, Output, ViewChild } from '@angular/core';

export interface LivenessResult {
  success: boolean;
  status: 'VERIFIED';
}

type LivenessState = 'idle' | 'verifying' | 'verified';

const VERIFYING_DELAY_MS = 1800;
const VERIFIED_DELAY_MS = 1000;

@Component({
  selector: 'app-liveness-check',
  standalone: false,
  template: `
    <div class="liveness">
      <video #video autoplay muted playsinline class="camera"></video>

      <div class="overlay">
        <header class="top">
          <h2>Prueba de identidad</h2>
          <p>Coloca tu rostro dentro del recuadro</p>
        </header>

        <div class="face" [class.ok]="state === 'verified'">
          <span class="label">ROSTRO</span>
        </div>

        <footer class="bottom">
          @if (error) {
            <p class="error">{{ error }}</p>
          } @else {
            <p class="tip">Mantén tu rostro centrado</p>
          }
          <p-button label="Continuar" icon="pi pi-check" size="large"
                    [disabled]="!ready || state !== 'idle'" (onClick)="continue()" />
          <button type="button" class="cancel" [disabled]="state !== 'idle'" (click)="cancel()">Cancelar</button>
        </footer>
      </div>

      @if (state !== 'idle') {
        <div class="status">
          @if (state === 'verifying') {
            <i class="pi pi-spin pi-spinner"></i>
            <p>Verificando...</p>
          } @else {
            <i class="pi pi-check-circle success"></i>
            <p>Identidad verificada</p>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .liveness { position: fixed; inset: 0; z-index: 1000; background: #000; }
    .camera { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transform: scaleX(-1); }
    .overlay {
      position: absolute; inset: 0; color: #fff; text-align: center;
      display: flex; flex-direction: column; align-items: center; justify-content: space-between;
      padding: calc(1.5rem + env(safe-area-inset-top)) 1rem calc(1.5rem + env(safe-area-inset-bottom));
    }
    .top, .bottom { z-index: 1; display: flex; flex-direction: column; align-items: center; gap: .75rem; }
    .top h2 { margin: 0; font-size: 1.25rem; text-shadow: 0 1px 4px rgba(0, 0, 0, .8); }
    .top p, .tip { margin: 0; font-weight: 600; text-shadow: 0 1px 4px rgba(0, 0, 0, .8); }
    .face {
      position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
      width: min(70vw, 300px); aspect-ratio: 3 / 4; border-radius: 50%;
      border: 3px solid rgba(255, 255, 255, .7);
      box-shadow: 0 0 0 100vmax rgba(0, 0, 0, .6);
      display: flex; align-items: center; justify-content: center;
      transition: border-color .3s;
    }
    .face.ok { border-color: #22c55e; }
    .label { font-size: 1.5rem; font-weight: 700; letter-spacing: .25rem; color: rgba(255, 255, 255, .25); }
    .error { margin: 0; background: rgba(200, 0, 0, .85); padding: .5rem 1rem; border-radius: 8px; }
    .cancel { background: none; border: 0; color: #fff; font: inherit; cursor: pointer; text-decoration: underline; }
    .status {
      position: absolute; inset: 0; z-index: 2; color: #fff;
      display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1rem;
      background: rgba(0, 0, 0, .75);
    }
    .status i { font-size: 3rem; }
    .status .success { color: #22c55e; }
    .status p { margin: 0; font-weight: 600; font-size: 1.1rem; }
  `]
})
export class LivenessCheckComponent implements AfterViewInit, OnDestroy {
  @Output() verificationCompleted = new EventEmitter<LivenessResult>();
  @Output() verificationCancelled = new EventEmitter<void>();

  @ViewChild('video') videoRef!: ElementRef<HTMLVideoElement>;

  ready = false;
  error = '';
  state: LivenessState = 'idle';

  private stream?: MediaStream;
  private timers: ReturnType<typeof setTimeout>[] = [];

  async ngAfterViewInit(): Promise<void> {
    if (!navigator.mediaDevices?.getUserMedia) {
      this.error = window.isSecureContext
        ? 'Tu navegador no soporta el acceso a la cámara.'
        : 'La cámara requiere una conexión segura (HTTPS).';
      return;
    }
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false
      });
      const video = this.videoRef.nativeElement;
      video.srcObject = this.stream;
      await video.play();
      this.ready = true;
    } catch (e) {
      const name = (e as DOMException).name;
      if (name === 'NotAllowedError' || name === 'SecurityError') {
        this.error = 'Permiso de cámara denegado. Habilítalo en la configuración del navegador.';
      } else if (name === 'NotFoundError' || name === 'OverconstrainedError') {
        this.error = 'No se encontró una cámara en este dispositivo.';
      } else {
        this.error = 'No se pudo acceder a la cámara.';
      }
    }
  }

  continue(): void {
    this.state = 'verifying';
    this.timers.push(setTimeout(() => {
      this.state = 'verified';
      this.timers.push(setTimeout(() => {
        this.releaseCamera();
        this.verificationCompleted.emit({ success: true, status: 'VERIFIED' });
      }, VERIFIED_DELAY_MS));
    }, VERIFYING_DELAY_MS));
  }

  cancel(): void {
    this.releaseCamera();
    this.verificationCancelled.emit();
  }

  ngOnDestroy(): void {
    this.timers.forEach(clearTimeout);
    this.releaseCamera();
  }

  private releaseCamera(): void {
    this.stream?.getTracks().forEach(track => track.stop());
    this.stream = undefined;
  }
}
