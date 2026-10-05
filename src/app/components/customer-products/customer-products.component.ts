import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { TarjetaModel } from '../../core/models/tarjeta/tarjeta.model';
import { AuthService } from '../../core/services/auth.service';
import { ObtenerTarjetasUseCase } from '../../core/usecase/tarjeta/obtener-tarjetas.usecase';
import { CardApplicationDialogComponent } from '../card-application/components/card-application-dialog/card-application-dialog.component';

@Component({
  selector: 'app-customer-products',
  imports: [ButtonModule, TooltipModule, CardApplicationDialogComponent],
  templateUrl: './customer-products.component.html',
  styleUrl: './customer-products.component.scss'
})
export class CustomerProductsComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private obtenerTarjetasUseCase = inject(ObtenerTarjetasUseCase);

  cards: TarjetaModel[] = [];
  displayOnboardingDialog = false;
  loading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.loadCards();
  }

  loadCards(): void {
    this.loading = true;
    this.errorMessage = '';
    this.obtenerTarjetasUseCase.execute().subscribe({
      next: cards => {
        this.cards = cards;
        this.loading = false;
      },
      error: (error: Error) => {
        this.errorMessage = error.message;
        this.loading = false;
      }
    });
  }

  tipoLabel(tipo: string): string {
    return tipo === 'CREDITO' ? 'Crédito' : tipo === 'DEBITO' ? 'Débito' : tipo;
  }

  openOnboardingDialog(): void {
    this.displayOnboardingDialog = true;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
