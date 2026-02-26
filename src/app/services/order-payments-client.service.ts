import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrderPaymentClient, OrderPaymentsClient_Request } from './models';
import config from '../config.json';

const BASE_URL = config.apiBaseUrl;

@Injectable({ providedIn: 'root' })
export class OrderPaymentsClientService {
  constructor(private http: HttpClient) {}

  get(request: OrderPaymentsClient_Request): Observable<OrderPaymentClient[]> {
    return this.http.post<OrderPaymentClient[]>(`${BASE_URL}/api/OrderPaymentsClient/Get`, request);
  }

  addOrUpdate(request: OrderPaymentsClient_Request): Observable<OrderPaymentClient> {
    return this.http.post<OrderPaymentClient>(`${BASE_URL}/api/OrderPaymentsClient/AddOrUpdate`, request);
  }
}
