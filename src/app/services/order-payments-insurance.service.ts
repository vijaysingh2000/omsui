import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrderPaymentInsurance, OrderPaymentsInsurance_Request } from './models';
import { SessionService } from './session.service';
import config from '../config.json';

const BASE_URL = config.apiBaseUrl;

@Injectable({ providedIn: 'root' })
export class OrderPaymentsInsuranceService {
  constructor(private http: HttpClient, private session: SessionService) {}

  get(request: OrderPaymentsInsurance_Request): Observable<OrderPaymentInsurance[]> {
    return this.http.post<OrderPaymentInsurance[]>(`${BASE_URL}/api/OrderPaymentsInsurance/Get`, this.session.withSession(request));
  }

  getByBatch(request: OrderPaymentsInsurance_Request): Observable<OrderPaymentInsurance[]> {
    return this.http.post<OrderPaymentInsurance[]>(`${BASE_URL}/api/OrderPaymentsInsurance/GetByBatch`, this.session.withSession(request));
  }

  addOrUpdate(request: OrderPaymentsInsurance_Request): Observable<OrderPaymentInsurance> {
    return this.http.post<OrderPaymentInsurance>(`${BASE_URL}/api/OrderPaymentsInsurance/AddOrUpdate`, this.session.withSession(request));
  }
}
