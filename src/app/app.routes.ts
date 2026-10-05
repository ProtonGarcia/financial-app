import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./components/welcome/welcome.component').then(m => m.WelcomeComponent)
  },
  {
    path: 'registrado',
    loadComponent: () =>
      import('./components/registered-customer/registered-customer.component').then(
        m => m.RegisteredCustomerComponent
      )
  },
  {
    path: 'onboarding',
    loadChildren: () =>
      import('./components/onboarding/onboarding.module').then(m => m.OnboardingModule)
  },
  {
    path: 'productos-cliente',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/customer-products/customer-products.component').then(
        m => m.CustomerProductsComponent
      )
  }
];
