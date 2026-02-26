import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseModel } from './models';
import config from '../config.json';

const BASE_URL = config.apiBaseUrl;

@Injectable({ providedIn: 'root' })
export class MiscService {
  constructor(private http: HttpClient) {}

  getAddressTypes(): Observable<BaseModel[]> {
    return this.http.get<BaseModel[]>(`${BASE_URL}/api/Misc/GetAddressTypes`);
  }

  getAllReports(): Observable<BaseModel[]> {
    return this.http.get<BaseModel[]>(`${BASE_URL}/api/Misc/GetAllReports`);
  }

  getAllListItems(): Observable<BaseModel[]> {
    return this.http.get<BaseModel[]>(`${BASE_URL}/api/Misc/GetAllListItems`);
  }
}
