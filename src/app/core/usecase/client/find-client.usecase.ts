import { Injectable, inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { ClientModel } from '../../models/client/client.model';
import { ClientRepository } from '../../repository/client/client.repository';

@Injectable({ providedIn: 'root' })
export class FindClientUseCase {
  private readonly clientRepository = inject(ClientRepository);

  execute(documentNumber: string): Observable<ClientModel> {
    if (!documentNumber?.trim()) {
      return throwError(() => new Error('El número de documento es obligatorio.'));
    }
    return this.clientRepository.findClient(documentNumber.trim());
  }
}
