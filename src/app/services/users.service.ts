import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, Users_Request } from './models';
import config from '../config.json';

const BASE_URL = config.apiBaseUrl;

@Injectable({ providedIn: 'root' })
export class UsersService {
  constructor(private http: HttpClient) {}

  getByLoginId(request: Users_Request): Observable<User> {
    return this.http.post<User>(`${BASE_URL}/api/Users/GetByLoginId`, request);
  }

  getById(request: Users_Request): Observable<User> {
    return this.http.post<User>(`${BASE_URL}/api/Users/GetById`, request);
  }

  getByEmail(request: Users_Request): Observable<User> {
    return this.http.post<User>(`${BASE_URL}/api/Users/GetByEmail`, request);
  }

  getAll(): Observable<User[]> {
    return this.http.post<User[]>(`${BASE_URL}/api/Users/GetAll`, {});
  }

  add(request: Users_Request): Observable<User> {
    return this.http.post<User>(`${BASE_URL}/api/Users/Add`, request);
  }

  update(request: Users_Request): Observable<User> {
    return this.http.post<User>(`${BASE_URL}/api/Users/Update`, request);
  }

  delete(request: Users_Request): Observable<void> {
    return this.http.post<void>(`${BASE_URL}/api/Users/Delete`, request);
  }

  resetPassword(request: Users_Request): Observable<void> {
    return this.http.post<void>(`${BASE_URL}/api/Users/ResetPassword`, request);
  }
}
