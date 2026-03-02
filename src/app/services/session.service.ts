import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from './models';

const SESSION_KEY_CLIENT_ID     = 'oms_clientId';
const SESSION_KEY_USER_ID       = 'oms_userId';
const SESSION_KEY_USER_TYPE     = 'oms_userType';
const SESSION_KEY_USER          = 'oms_user';
const SESSION_KEY_USER_TYPE_NAME = 'oms_userTypeName';

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

  /** Persists the full user object to sessionStorage. */
  setUser(user: User): void {
    sessionStorage.setItem(SESSION_KEY_USER, JSON.stringify(user));
  }

  /** Retrieves the cached user object, or null if not present. */
  getUser(): User | null {
    const raw = sessionStorage.getItem(SESSION_KEY_USER);
    if (!raw) return null;
    try { return JSON.parse(raw) as User; } catch { return null; }
  }

  /** Persists the resolved user type name (e.g. "Full Access"). */
  setUserTypeName(name: string): void {
    sessionStorage.setItem(SESSION_KEY_USER_TYPE_NAME, name);
  }

  /** Retrieves the cached user type name, or null if not present. */
  getUserTypeName(): string | null {
    return sessionStorage.getItem(SESSION_KEY_USER_TYPE_NAME);
  }

  /**
   * Merges clientId from the current session into the provided request object.
   * userId and userType are now conveyed via the JWT Bearer token.
   */
  withSession<T extends object>(request: T): T & { clientId?: number } {
    return { ...request, clientId: this._clientId$.value };
  }

  clearSession(): void {
    sessionStorage.removeItem(SESSION_KEY_CLIENT_ID);
    sessionStorage.removeItem(SESSION_KEY_USER_ID);
    sessionStorage.removeItem(SESSION_KEY_USER_TYPE);
    sessionStorage.removeItem(SESSION_KEY_USER);
    sessionStorage.removeItem(SESSION_KEY_USER_TYPE_NAME);
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
