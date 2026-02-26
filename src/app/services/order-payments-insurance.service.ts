import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrderPaymentInsurance, OrderPaymentsInsurance_Request } from './models';
import config from '../config.json';

const BASE_URL = config.apiBaseUrl;

@Injectable({ providedIn: 'root' })
export class OrderPaymentsInsuranceService {
  constructor(private http: HttpClient) {}

  get(request: OrderPaymentsInsurance_Request): Observable<OrderPaymentInsurance[]> {
    return this.http.post<OrderPaymentInsurance[]>(`${BASE_URL}/api/OrderPaymentsInsurance/Get`, request);
  }

  getByBatch(request: OrderPaymentsInsurance_Request): Observable<OrderPaymentInsurance[]> {
    return this.http.post<OrderPaymentInsurance[]>(`${BASE_URL}/api/OrderPaymentsInsurance/GetByBatch`, request);
  }

  addOrUpdate(request: OrderPaymentsInsurance_Request): Observable<OrderPaymentInsurance> {
    return this.http.post<OrderPaymentInsurance>(`${BASE_URL}/api/OrderPaymentsInsurance/AddOrUpdate`, request);
  }
}
