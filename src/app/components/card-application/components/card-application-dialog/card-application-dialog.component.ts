import { Component, EventEmitter, Output, effect, inject, model, untracked } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { StepperModule } from 'primeng/stepper';
import { TarjetaModel } from '../../../../core/models/tarjeta/tarjeta.model';
import { SolicitarTarjetaUseCase } from '../../../../core/usecase/tarjeta/solicitar-tarjeta.usecase';
import {
  AddressProof,
  CardApplication,
  CardSelection,
  EconomicProfile,
  SourceOfFunds
} from '../../models/card-application.model';
import { CardApplicationService } from '../../services/card-application.service';
import { EconomicProfileComponent } from '../economic-profile/economic-profile.component';
import { SourceOfFundsComponent } from '../source-of-funds/source-of-funds.component';
import { AddressProofComponent } from '../address-proof/address-proof.component';
import { CardSelectionComponent } from '../card-selection/card-selection.component';
import {
  ApplicationSuccessComponent,
  ConfirmationPhase
} from '../application-success/application-success.component';

const LAST_STEP = 4;

@Component({
  selector: 'app-card-application-dialog',
  imports: [
    DialogModule,
    StepperModule,
    ButtonModule,
    EconomicProfileComponent,
    SourceOfFundsComponent,
    AddressProofComponent,
    CardSelectionComponent,
    ApplicationSuccessComponent
  ],
  templateUrl: './card-application-dialog.component.html',
  styleUrl: './card-application-dialog.component.scss'
})
export class CardApplicationDialogComponent {
  visible = model(false);
  @Output() applicationCompleted = new EventEmitter<CardApplication>();

  private service = inject(CardApplicationService);
  private solicitarTarjetaUseCase = inject(SolicitarTarjetaUseCase);

  readonly steps = ['Perfil', 'Fondos', 'Domicilio', 'Tarjeta', 'Confirmación'];

  application: CardApplication | null = null;
  view: 'resume' | 'form' = 'form';

  phase: ConfirmationPhase = 'summary';
  isProcessing = false;
  isSaving = false;
  confirmError = '';
  tarjeta: TarjetaModel | null = null;

  private finished = false;
  private emitted = false;

  constructor() {
    effect(() => {
      if (this.visible()) {
        untracked(() => this.open());
      }
    });
  }

  private open(): void {
    this.finished = false;
    this.emitted = false;
    this.phase = 'summary';
    this.isProcessing = false;
    this.isSaving = false;
    this.confirmError = '';
    this.tarjeta = null;

    const pending = this.service.getApplication();
    if (this.service.hasPendingApplication() && pending && pending.currentStep > 0) {
      this.application = { ...pending, currentStep: Math.min(pending.currentStep, LAST_STEP) };
      this.view = 'resume';
    } else {
      this.application = this.service.createApplication();
      this.view = 'form';
    }
  }

  continueApplication(): void {
    this.view = 'form';
  }

  newApplication(): void {
    this.service.clearApplication();
    this.application = this.service.createApplication();
    this.view = 'form';
  }

  onHide(): void {
    if (this.finished) {
      this.emitCompleted();
    } else if (this.application && this.view === 'form') {
      this.service.saveProgress(this.application);
    }
    this.visible.set(false);
  }

  saveAndExit(): void {
    if (!this.application || this.isSaving) {
      return;
    }
    this.isSaving = true;
    this.service.saveProgress(this.application);
    this.isSaving = false;
    this.visible.set(false);
  }

  onEconomicProfile(economicProfile: EconomicProfile): void {
    this.advance({ economicProfile });
  }

  onSourceOfFunds(sourceOfFunds: SourceOfFunds): void {
    this.advance({ sourceOfFunds });
  }

  onAddressProof(addressProof: AddressProof): void {
    this.service.registerDocument(addressProof);
    this.advance({ addressProof });
  }

  onCardSelection(cardSelection: CardSelection): void {
    this.advance({ cardSelection });
  }

  goBack(): void {
    if (this.application && this.application.currentStep > 0 && !this.isProcessing) {
      this.confirmError = '';
      this.update({ currentStep: this.application.currentStep - 1 });
    }
  }

  confirm(name: string): void {
    const cardType = this.application?.cardSelection?.cardType;
    if (this.isProcessing || !cardType || !name.trim()) {
      return;
    }
    this.update({ terms: { accepted: true, signature: name.trim() } });
    this.isProcessing = true;
    this.confirmError = '';
    this.phase = 'processing';

    this.solicitarTarjetaUseCase.execute({ tipoTarjeta: cardType }).subscribe({
      next: tarjeta => {
        this.tarjeta = tarjeta;
        this.service.completeApplication();
        this.finished = true;
        this.isProcessing = false;
        this.phase = 'success';
      },
      error: (error: Error) => {
        this.confirmError = error.message;
        this.isProcessing = false;
        this.phase = 'summary';
      }
    });
  }

  finish(): void {
    this.emitCompleted();
    this.visible.set(false);
  }

  private emitCompleted(): void {
    if (this.emitted) {
      return;
    }
    this.emitted = true;
    const completed = this.service.getApplication();
    if (completed) {
      this.applicationCompleted.emit(completed);
    }
  }

  private advance(patch: Partial<CardApplication>): void {
    if (!this.application) {
      return;
    }
    this.update({ ...patch, currentStep: this.application.currentStep + 1 });
  }

  private update(patch: Partial<CardApplication>): void {
    if (!this.application) {
      return;
    }
    this.application = { ...this.application, ...patch };
    this.service.saveProgress(this.application);
  }
}
