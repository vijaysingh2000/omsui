import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseModel, Provider_Request } from './models';
import { SessionService } from './session.service';
import config from '../config.json';

const BASE_URL = config.apiBaseUrl;

@Injectable({ providedIn: 'root' })
export class ProviderService {
  constructor(private http: HttpClient, private session: SessionService) {}

  get(request: Provider_Request): Observable<BaseModel> {
    return this.http.post<BaseModel>(`${BASE_URL}/api/Provider/Get`, this.session.withSession(request));
  }

  getAll(request: Provider_Request = {}): Observable<BaseModel[]> {
    return this.http.post<BaseModel[]>(`${BASE_URL}/api/Provider/GetAll`, this.session.withSession(request));
  }

  getActive(request: Provider_Request = {}): Observable<BaseModel[]> {
    return this.http.post<BaseModel[]>(`${BASE_URL}/api/Provider/GetActive`, this.session.withSession(request));
  }

  delete(request: Provider_Request): Observable<void> {
    return this.http.delete<void>(`${BASE_URL}/api/Provider/Delete`, { body: this.session.withSession(request) });
  }

  addOrUpdate(request: Provider_Request): Observable<BaseModel> {
    return this.http.post<BaseModel>(`${BASE_URL}/api/Provider/AddOrUpdate`, this.session.withSession(request));
  }
}
