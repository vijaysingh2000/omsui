import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ClientModel, Client_Request } from './models';
import config from '../config.json';

const BASE_URL = config.apiBaseUrl;

@Injectable({ providedIn: 'root' })
export class ClientService {
  constructor(private http: HttpClient) {}

  get(request: Client_Request): Observable<ClientModel> {
    return this.http.post<ClientModel>(`${BASE_URL}/api/Client/Get`, request);
  }

  getAll(): Observable<ClientModel[]> {
    return this.http.get<ClientModel[]>(`${BASE_URL}/api/Client/GetAll`);
  }

  getActive(): Observable<ClientModel[]> {
    return this.http.get<ClientModel[]>(`${BASE_URL}/api/Client/GetActive`);
  }

  delete(request: Client_Request): Observable<void> {
    return this.http.delete<void>(`${BASE_URL}/api/Client/Delete`, { body: request });
  }

  addOrUpdate(request: Client_Request): Observable<ClientModel> {
    return this.http.post<ClientModel>(`${BASE_URL}/api/Client/AddOrUpdate`, request);
  }
}
