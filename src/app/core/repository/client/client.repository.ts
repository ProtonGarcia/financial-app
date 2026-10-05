import { Observable } from 'rxjs';
import { ClientModel, CreateClientModel } from '../../models/client/client.model';

export abstract class ClientRepository {
  abstract createClient(request: CreateClientModel): Observable<ClientModel>;
  abstract findClient(documentNumber: string): Observable<ClientModel>;
}
