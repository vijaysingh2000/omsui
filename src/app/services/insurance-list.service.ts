import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InsuranceModel, Insurance_Request } from './models';
import config from '../config.json';

const BASE_URL = config.apiBaseUrl;

@Injectable({ providedIn: 'root' })
export class InsuranceListService {
  constructor(private http: HttpClient) {}

  get(request: Insurance_Request): Observable<InsuranceModel> {
    return this.http.post<InsuranceModel>(`${BASE_URL}/api/InsuranceList/Get`, request);
  }

  getList(): Observable<InsuranceModel[]> {
    return this.http.get<InsuranceModel[]>(`${BASE_URL}/api/InsuranceList/GetList`);
  }

  getActive(): Observable<InsuranceModel[]> {
    return this.http.get<InsuranceModel[]>(`${BASE_URL}/api/InsuranceList/GetActive`);
  }

  delete(request: Insurance_Request): Observable<void> {
    return this.http.delete<void>(`${BASE_URL}/api/InsuranceList/Delete`, { body: request });
  }

  addOrUpdate(request: Insurance_Request): Observable<InsuranceModel> {
    return this.http.post<InsuranceModel>(`${BASE_URL}/api/InsuranceList/AddOrUpdate`, request);
  }
}
