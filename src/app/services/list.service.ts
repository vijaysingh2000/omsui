import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseModel, List_Request } from './models';
import { SessionService } from './session.service';
import config from '../config.json';

const BASE_URL = config.apiBaseUrl;

@Injectable({ providedIn: 'root' })
export class ListService {
  constructor(private http: HttpClient, private session: SessionService) {}

  get(request: List_Request): Observable<BaseModel> {
    return this.http.post<BaseModel>(`${BASE_URL}/api/List/Get`, this.session.withSession(request));
  }

  getAll(request: List_Request): Observable<BaseModel[]> {
    return this.http.post<BaseModel[]>(`${BASE_URL}/api/List/GetAll`, this.session.withSession(request));
  }

  getActive(request: List_Request): Observable<BaseModel[]> {
    return this.http.post<BaseModel[]>(`${BASE_URL}/api/List/GetActive`, this.session.withSession(request));
  }

  delete(request: List_Request): Observable<void> {
    return this.http.delete<void>(`${BASE_URL}/api/List/Delete`, { body: this.session.withSession(request) });
  }

  addOrUpdate(request: List_Request): Observable<BaseModel> {
    return this.http.post<BaseModel>(`${BASE_URL}/api/List/AddOrUpdate`, this.session.withSession(request));
  }
}
