import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, Users_Request } from './models';
import { SessionService } from './session.service';
import config from '../config.json';

const BASE_URL = config.apiBaseUrl;

@Injectable({ providedIn: 'root' })
export class UsersService {
  constructor(private http: HttpClient, private session: SessionService) {}

  validate(request: Users_Request): Observable<boolean> {
    return this.http.post<boolean>(`${BASE_URL}/api/Users/Validate`, this.session.withSession(request));
  }

  getByLoginId(request: Users_Request): Observable<User> {
    return this.http.post<User>(`${BASE_URL}/api/Users/GetByLoginId`, this.session.withSession(request));
  }

  getById(request: Users_Request): Observable<User> {
    return this.http.post<User>(`${BASE_URL}/api/Users/GetById`, this.session.withSession(request));
  }

  getByEmail(request: Users_Request): Observable<User> {
    return this.http.post<User>(`${BASE_URL}/api/Users/GetByEmail`, this.session.withSession(request));
  }

  getAll(): Observable<User[]> {
    return this.http.post<User[]>(`${BASE_URL}/api/Users/GetAll`, this.session.withSession({}));
  }

  add(request: Users_Request): Observable<User> {
    return this.http.post<User>(`${BASE_URL}/api/Users/Add`, this.session.withSession(request));
  }

  update(request: Users_Request): Observable<User> {
    return this.http.post<User>(`${BASE_URL}/api/Users/Update`, this.session.withSession(request));
  }

  delete(request: Users_Request): Observable<void> {
    return this.http.post<void>(`${BASE_URL}/api/Users/Delete`, this.session.withSession(request));
  }

  resetPassword(request: Users_Request): Observable<void> {
    return this.http.post<void>(`${BASE_URL}/api/Users/ResetPassword`, this.session.withSession(request));
  }
}
