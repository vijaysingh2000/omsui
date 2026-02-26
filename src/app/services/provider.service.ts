import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseModel, Provider_Request } from './models';
import config from '../config.json';

const BASE_URL = config.apiBaseUrl;

@Injectable({ providedIn: 'root' })
export class ProviderService {
  constructor(private http: HttpClient) {}

  get(request: Provider_Request): Observable<BaseModel> {
    return this.http.post<BaseModel>(`${BASE_URL}/api/Provider/Get`, request);
  }

  getAll(): Observable<BaseModel[]> {
    return this.http.get<BaseModel[]>(`${BASE_URL}/api/Provider/GetAll`);
  }

  getActive(): Observable<BaseModel[]> {
    return this.http.get<BaseModel[]>(`${BASE_URL}/api/Provider/GetActive`);
  }

  delete(request: Provider_Request): Observable<void> {
    return this.http.delete<void>(`${BASE_URL}/api/Provider/Delete`, { body: request });
  }

  addOrUpdate(request: Provider_Request): Observable<BaseModel> {
    return this.http.post<BaseModel>(`${BASE_URL}/api/Provider/AddOrUpdate`, request);
  }
}
