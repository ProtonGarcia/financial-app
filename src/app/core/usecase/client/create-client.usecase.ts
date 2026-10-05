import { Injectable, inject } from '@angular/core';
import { Observable, map, switchMap, throwError } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { IpService } from '../../services/ip.service';
import { ClientModel, CreateClientModel } from '../../models/client/client.model';
import { ClientRepository } from '../../repository/client/client.repository';

@Injectable({ providedIn: 'root' })
export class CreateClientUseCase {
  private readonly clientRepository = inject(ClientRepository);
  private readonly authService = inject(AuthService);
  private readonly ipService = inject(IpService);

  execute(request: Omit<CreateClientModel, 'ipAddresses'>): Observable<ClientModel> {
    if (!request.documentNumber?.trim()) {
      return throwError(() => new Error('El número de documento es obligatorio.'));
    }
    return this.ipService.getClientIp().pipe(
      switchMap(ip =>
        this.clientRepository.createClient({ ...request, ipAddresses: [{ ipAddress: ip }] })
      ),
      map(client => {
        if (!client.token) {
          throw new Error('No fue posible completar el registro. Inténtalo nuevamente.');
        }
        this.authService.setSession({
          token: client.token,
          tokenType: client.tokenType ?? 'Bearer',
          expiresIn: client.expiresIn ?? 3600
        });
        return client;
      })
    );
  }
}
