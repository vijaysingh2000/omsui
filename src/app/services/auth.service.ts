import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { User } from './models';
import { SessionService } from './session.service';
import config from '../config.json';

const BASE_URL = config.apiBaseUrl;
const TOKEN_KEY = 'oms_token';

export interface LoginRequest {
  loginId?: string | null;
  password?: string | null;
}

export interface LoginResponse {
  token?: string | null;
  expiresIn?: number;
  user?: User;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient, private session: SessionService) {}

  /**
   * Calls POST /api/Auth/login, stores the JWT token in sessionStorage,
   * and hydrates the SessionService with user data.
   */
  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${BASE_URL}/api/Auth/login`, request).pipe(
      tap(response => {
        if (response.token) {
          sessionStorage.setItem(TOKEN_KEY, response.token);
        }
        if (response.user) {
          this.session.setUserId(response.user.id);
          this.session.setUserType(response.user.type);
          this.session.setClientId(response.user.clientIds?.[0]);
        }
      })
    );
  }

  /**
   * Calls POST /api/Auth/refresh to renew the token.
   */
  refresh(): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${BASE_URL}/api/Auth/refresh`, {}).pipe(
      tap(response => {
        if (response.token) {
          sessionStorage.setItem(TOKEN_KEY, response.token);
        }
      })
    );
  }

  /** Clears the stored token and session data. */
  logout(): void {
    sessionStorage.removeItem(TOKEN_KEY);
    this.session.clearSession();
  }

  /** Returns the stored JWT token, or null if not authenticated. */
  getToken(): string | null {
    return sessionStorage.getItem(TOKEN_KEY);
  }

  /** Returns true if a token is present in sessionStorage. */
  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
