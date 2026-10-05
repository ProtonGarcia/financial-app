import { AfterViewInit, Component, ElementRef, EventEmitter, NgZone, OnDestroy, Output, ViewChild, inject } from '@angular/core';

const ANALYSIS_DELAY_MS = 2500;

@Component({
  selector: 'app-document-scanner',
  standalone: false,
  template: `
    <div class="scanner">
      <video #video autoplay muted playsinline class="camera"></video>

      <div class="overlay">
        <p class="hint">Coloca tu DUI dentro del recuadro</p>

        <div #frame class="frame">
          <span class="corner tl"></span>
          <span class="corner tr"></span>
          <span class="corner bl"></span>
          <span class="corner br"></span>
          <span class="label">DUI</span>
        </div>

        @if (error) {
          <p class="error">{{ error }}</p>
        }

        <div class="controls">
          <p-button label="Capturar documento" icon="pi pi-camera" size="large"
                    [disabled]="!ready || analyzing" (onClick)="capture()" />
          <button type="button" class="cancel" [disabled]="analyzing" (click)="close()">Cancelar</button>
        </div>
      </div>

      @if (analyzing) {
        <div class="loader">
          <i class="pi pi-spin pi-spinner"></i>
          <p>Analizando documento...</p>
        </div>
      }
    </div>
  `,
  styles: [`
    .scanner { position: fixed; inset: 0; z-index: 1000; background: #000; }
    .camera { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
    .overlay {
      position: absolute; inset: 0;
      display: flex; flex-direction: column; align-items: center; justify-content: space-between;
      padding: 2rem 1rem; color: #fff; text-align: center;
    }
    .hint { font-weight: 600; font-size: 1.1rem; text-shadow: 0 1px 4px rgba(0, 0, 0, .8); z-index: 1; }
    .frame {
      position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
      width: min(86vw, 520px); aspect-ratio: 1.586;
      border-radius: 16px; border: 2px solid rgba(255, 255, 255, .6);
      box-shadow: 0 0 0 100vmax rgba(0, 0, 0, .6);
      display: flex; align-items: center; justify-content: center;
    }
    .label { font-size: 2.5rem; font-weight: 700; letter-spacing: .3rem; color: rgba(255, 255, 255, .25); }
    .corner { position: absolute; width: 28px; height: 28px; border: 4px solid #3b82f6; }
    .tl { top: -2px; left: -2px; border-right: 0; border-bottom: 0; border-top-left-radius: 16px; }
    .tr { top: -2px; right: -2px; border-left: 0; border-bottom: 0; border-top-right-radius: 16px; }
    .bl { bottom: -2px; left: -2px; border-right: 0; border-top: 0; border-bottom-left-radius: 16px; }
    .br { bottom: -2px; right: -2px; border-left: 0; border-top: 0; border-bottom-right-radius: 16px; }
    .error { background: rgba(200, 0, 0, .85); padding: .5rem 1rem; border-radius: 8px; z-index: 1; }
    .controls { display: flex; flex-direction: column; align-items: center; gap: 1rem; z-index: 1; }
    .cancel { background: none; border: 0; color: #fff; font: inherit; cursor: pointer; text-decoration: underline; }
    .loader {
      position: absolute; inset: 0; z-index: 2; color: #fff;
      display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1rem;
      background: rgba(0, 0, 0, .75);
    }
    .loader i { font-size: 3rem; }
    .loader p { font-weight: 600; font-size: 1.1rem; margin: 0; }
  `]
})
export class DocumentScannerComponent implements AfterViewInit, OnDestroy {
  @Output() documentCaptured = new EventEmitter<File>();
  @Output() scannerClosed = new EventEmitter<void>();

  @ViewChild('video') videoRef!: ElementRef<HTMLVideoElement>;
  @ViewChild('frame') frameRef!: ElementRef<HTMLElement>;

  ready = false;
  analyzing = false;
  error = '';
  private stream?: MediaStream;
  private zone = inject(NgZone);
  private timer?: ReturnType<typeof setTimeout>;

  async ngAfterViewInit(): Promise<void> {
    if (!navigator.mediaDevices?.getUserMedia) {
      this.error = window.isSecureContext
        ? 'Tu navegador no soporta el acceso a la cámara.'
        : 'La cámara requiere una conexión segura (HTTPS).';
      return;
    }
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false
      });
      const video = this.videoRef.nativeElement;
      video.srcObject = this.stream;
      await video.play();
      this.ready = true;
    } catch {
      this.error = 'No se pudo acceder a la cámara.';
    }
  }

  capture(): void {
    const video = this.videoRef.nativeElement;
    const videoBox = video.getBoundingClientRect();
    const frameBox = this.frameRef.nativeElement.getBoundingClientRect();

    const scale = Math.max(videoBox.width / video.videoWidth, videoBox.height / video.videoHeight);
    const offsetX = (videoBox.width - video.videoWidth * scale) / 2;
    const offsetY = (videoBox.height - video.videoHeight * scale) / 2;

    const sx = Math.max(0, (frameBox.left - videoBox.left - offsetX) / scale);
    const sy = Math.max(0, (frameBox.top - videoBox.top - offsetY) / scale);
    const sw = Math.min(video.videoWidth - sx, frameBox.width / scale);
    const sh = Math.min(video.videoHeight - sy, frameBox.height / scale);

    const canvas = document.createElement('canvas');
    canvas.width = Math.round(sw);
    canvas.height = Math.round(sh);
    canvas.getContext('2d')?.drawImage(video, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(blob => this.zone.run(() => {
      if (!blob) {
        this.error = 'No se pudo capturar la imagen.';
        return;
      }
      this.analyzing = true;
      this.stop();
      this.timer = setTimeout(() => {
        this.documentCaptured.emit(new File([blob], 'dui.jpg', { type: 'image/jpeg' }));
      }, ANALYSIS_DELAY_MS);
    }), 'image/jpeg', 0.9);
  }

  close(): void {
    this.stop();
    this.scannerClosed.emit();
  }

  ngOnDestroy(): void {
    clearTimeout(this.timer);
    this.stop();
  }

  private stop(): void {
    this.stream?.getTracks().forEach(t => t.stop());
    this.stream = undefined;
  }
}
