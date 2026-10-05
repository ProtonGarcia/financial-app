import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';

const IP_ERROR = 'No fue posible obtener la información de conexión. Intenta nuevamente.';

@Injectable({ providedIn: 'root' })
export class IpService {
  private readonly http = inject(HttpClient);

  getClientIp(): Observable<string> {
    return this.http.get<{ ip?: string }>('https://api.ipify.org?format=json').pipe(
      map(response => {
        if (!response?.ip) {
          throw new Error(IP_ERROR);
        }
        return response.ip;
      }),
      catchError(() => throwError(() => new Error(IP_ERROR)))
    );
  }
}
