import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const SESSION_KEY_CLIENT_ID = 'oms_clientId';
const SESSION_KEY_USER_ID = 'oms_userId';
const SESSION_KEY_USER_TYPE = 'oms_userType';

@Injectable({ providedIn: 'root' })
export class SessionService {
  private _clientId$ = new BehaviorSubject<number | undefined>(this.loadClientId());
  private _userId$ = new BehaviorSubject<number | undefined>(this.loadUserId());
  private _userType$ = new BehaviorSubject<number | undefined>(this.loadUserType());

  /** Observable stream of the active client id. */
  readonly clientId$ = this._clientId$.asObservable();

  /** Observable stream of the logged-in user id. */
  readonly userId$ = this._userId$.asObservable();

  /** Observable stream of the logged-in user type. */
  readonly userType$ = this._userType$.asObservable();

  /** Snapshot of the current client id. */
  get clientId(): number | undefined {
    return this._clientId$.value;
  }

  /** Snapshot of the logged-in user id. */
  get userId(): number | undefined {
    return this._userId$.value;
  }

  /** Snapshot of the logged-in user type. */
  get userType(): number | undefined {
    return this._userType$.value;
  }

  setClientId(id: number | undefined): void {
    if (id != null) {
      sessionStorage.setItem(SESSION_KEY_CLIENT_ID, String(id));
    } else {
      sessionStorage.removeItem(SESSION_KEY_CLIENT_ID);
    }
    this._clientId$.next(id);
  }

  setUserId(id: number | undefined): void {
    if (id != null) {
      sessionStorage.setItem(SESSION_KEY_USER_ID, String(id));
    } else {
      sessionStorage.removeItem(SESSION_KEY_USER_ID);
    }
    this._userId$.next(id);
  }

  setUserType(type: number | undefined): void {
    if (type != null) {
      sessionStorage.setItem(SESSION_KEY_USER_TYPE, String(type));
    } else {
      sessionStorage.removeItem(SESSION_KEY_USER_TYPE);
    }
    this._userType$.next(type);
  }

  /**
   * Merges clientId, userId, and userType from the current session into the provided request object.
   * Use this in every service method before sending an HTTP request.
   */
  withSession<T extends object>(request: T): T & { clientId?: number; userId?: number; userType?: number } {
    return { ...request, clientId: this._clientId$.value, userId: this._userId$.value, userType: this._userType$.value };
  }

  clearSession(): void {
    sessionStorage.removeItem(SESSION_KEY_CLIENT_ID);
    sessionStorage.removeItem(SESSION_KEY_USER_ID);
    sessionStorage.removeItem(SESSION_KEY_USER_TYPE);
    this._clientId$.next(undefined);
    this._userId$.next(undefined);
    this._userType$.next(undefined);
  }

  private loadClientId(): number | undefined {
    const raw = sessionStorage.getItem(SESSION_KEY_CLIENT_ID);
    if (raw == null) return undefined;
    const n = Number(raw);
    return isNaN(n) ? undefined : n;
  }

  private loadUserId(): number | undefined {
    const raw = sessionStorage.getItem(SESSION_KEY_USER_ID);
    if (raw == null) return undefined;
    const n = Number(raw);
    return isNaN(n) ? undefined : n;
  }

  private loadUserType(): number | undefined {
    const raw = sessionStorage.getItem(SESSION_KEY_USER_TYPE);
    if (raw == null) return undefined;
    const n = Number(raw);
    return isNaN(n) ? undefined : n;
  }
}
