import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { StepsModule } from 'primeng/steps';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { MessageModule } from 'primeng/message';

import { OnboardingRoutingModule } from './onboarding-routing.module';
import { OnboardingComponent } from './pages/onboarding/onboarding.component';
import { StepDuiComponent } from './components/step-dui/step-dui.component';
import { StepDatosBasicosComponent } from './components/step-datos-basicos/step-datos-basicos.component';
import { StepFotoDocumentoComponent } from './components/step-foto-documento/step-foto-documento.component';
import { StepVideoVidaComponent } from './components/step-video-vida/step-video-vida.component';
import { DocumentScannerComponent } from './components/document-scanner/document-scanner.component';
import { LivenessCheckComponent } from './components/liveness-check/liveness-check.component';


@NgModule({
  declarations: [
    OnboardingComponent,
    StepDuiComponent,
    StepDatosBasicosComponent,
    StepFotoDocumentoComponent,
    StepVideoVidaComponent,
    DocumentScannerComponent,
    LivenessCheckComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    StepsModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    InputMaskModule,
    DatePickerModule,
    SelectModule,
    MessageModule,
    OnboardingRoutingModule
  ]
})
export class OnboardingModule { }
