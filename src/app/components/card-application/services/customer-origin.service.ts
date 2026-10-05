import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { CustomerOrigin } from '../models/card-application.model';

@Injectable({ providedIn: 'root' })
export class CustomerOriginService {
  getOrigin(): Observable<CustomerOrigin> {
    return of({
      ip: '190.10.20.30',
      country: 'El Salvador',
      region: 'San Salvador',
      city: 'San Salvador'
    }).pipe(delay(800));
  }
}
