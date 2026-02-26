import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrderAssay, OrderAssay_Request } from './models';
import config from '../config.json';

const BASE_URL = config.apiBaseUrl;

@Injectable({ providedIn: 'root' })
export class OrderAssayService {
  constructor(private http: HttpClient) {}

  get(request: OrderAssay_Request): Observable<OrderAssay[]> {
    return this.http.post<OrderAssay[]>(`${BASE_URL}/api/OrderAssay/Get`, request);
  }

  addOrUpdate(request: OrderAssay_Request): Observable<OrderAssay> {
    return this.http.post<OrderAssay>(`${BASE_URL}/api/OrderAssay/AddOrUpdate`, request);
  }
}
