import { Observable } from 'rxjs';
import { LoginResponse } from '../../models/auth/login-response.model';

export abstract class AuthRepository {
  abstract login(documentNumber: string): Observable<LoginResponse>;
}
