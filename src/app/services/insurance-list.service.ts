import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InsuranceModel, Insurance_Request } from './models';
import { SessionService } from './session.service';
import config from '../config.json';

const BASE_URL = config.apiBaseUrl;

@Injectable({ providedIn: 'root' })
export class InsuranceListService {
  constructor(private http: HttpClient, private session: SessionService) {}

  get(request: Insurance_Request): Observable<InsuranceModel> {
    return this.http.post<InsuranceModel>(`${BASE_URL}/api/InsuranceList/Get`, this.session.withSession(request));
  }

  getList(): Observable<InsuranceModel[]> {
    return this.http.get<InsuranceModel[]>(`${BASE_URL}/api/InsuranceList/GetList`);
  }

  getActive(): Observable<InsuranceModel[]> {
    return this.http.get<InsuranceModel[]>(`${BASE_URL}/api/InsuranceList/GetActive`);
  }

  delete(request: Insurance_Request): Observable<void> {
    return this.http.delete<void>(`${BASE_URL}/api/InsuranceList/Delete`, { body: this.session.withSession(request) });
  }

  addOrUpdate(request: Insurance_Request): Observable<InsuranceModel> {
    return this.http.post<InsuranceModel>(`${BASE_URL}/api/InsuranceList/AddOrUpdate`, this.session.withSession(request));
  }
}
