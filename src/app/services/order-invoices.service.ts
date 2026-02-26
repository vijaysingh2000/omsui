import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrderInvoice, OrderInvoice_Request } from './models';
import config from '../config.json';

const BASE_URL = config.apiBaseUrl;

@Injectable({ providedIn: 'root' })
export class OrderInvoicesService {
  constructor(private http: HttpClient) {}

  get(request: OrderInvoice_Request): Observable<OrderInvoice[]> {
    return this.http.post<OrderInvoice[]>(`${BASE_URL}/api/OrderInvoices/Get`, request);
  }

  getByBatch(request: OrderInvoice_Request): Observable<OrderInvoice[]> {
    return this.http.post<OrderInvoice[]>(`${BASE_URL}/api/OrderInvoices/GetByBatch`, request);
  }

  getByBatchForPrint(request: OrderInvoice_Request): Observable<OrderInvoice[]> {
    return this.http.post<OrderInvoice[]>(`${BASE_URL}/api/OrderInvoices/GetByBatchForPrint`, request);
  }

  addOrUpdate(request: OrderInvoice_Request): Observable<OrderInvoice> {
    return this.http.post<OrderInvoice>(`${BASE_URL}/api/OrderInvoices/AddOrUpdate`, request);
  }
}
