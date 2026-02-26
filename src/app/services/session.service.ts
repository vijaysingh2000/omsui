import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const SESSION_KEY_CLIENT_ID = 'oms_clientId';

@Injectable({ providedIn: 'root' })
export class SessionService {
  private _clientId$ = new BehaviorSubject<number | undefined>(this.loadClientId());

  /** Observable stream of the active client id. */
  readonly clientId$ = this._clientId$.asObservable();

  /** Snapshot of the current client id. */
  get clientId(): number | undefined {
    return this._clientId$.value;
  }

  setClientId(id: number | undefined): void {
    if (id != null) {
      sessionStorage.setItem(SESSION_KEY_CLIENT_ID, String(id));
    } else {
      sessionStorage.removeItem(SESSION_KEY_CLIENT_ID);
    }
    this._clientId$.next(id);
  }

  private loadClientId(): number | undefined {
    const raw = sessionStorage.getItem(SESSION_KEY_CLIENT_ID);
    if (raw == null) return undefined;
    const n = Number(raw);
    return isNaN(n) ? undefined : n;
  }
}
