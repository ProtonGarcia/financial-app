import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';

import { routes } from './app.routes';
import { AuthRepository } from './core/repository/auth/auth.repository';
import { AuthRepositoryImpl } from './core/repository/auth/auth.repository.impl';
import { TarjetaRepository } from './core/repository/tarjeta/tarjeta.repository';
import { TarjetaRepositoryImpl } from './core/repository/tarjeta/tarjeta.repository.impl';
import { ClientRepository } from './core/repository/client/client.repository';
import { ClientRepositoryImpl } from './core/repository/client/client.repository.impl';
import { authInterceptor } from './core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    { provide: AuthRepository, useClass: AuthRepositoryImpl },
    { provide: TarjetaRepository, useClass: TarjetaRepositoryImpl },
    { provide: ClientRepository, useClass: ClientRepositoryImpl },
    provideAnimationsAsync(),
    providePrimeNG({ theme: { preset: Aura } })
  ]
};
