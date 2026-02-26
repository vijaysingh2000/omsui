import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrderInvoice, OrderInvoice_Request } from './models';
import { SessionService } from './session.service';
import config from '../config.json';

const BASE_URL = config.apiBaseUrl;

@Injectable({ providedIn: 'root' })
export class OrderInvoicesService {
  constructor(private http: HttpClient, private session: SessionService) {}

  get(request: OrderInvoice_Request): Observable<OrderInvoice[]> {
    return this.http.post<OrderInvoice[]>(`${BASE_URL}/api/OrderInvoices/Get`, this.session.withSession(request));
  }

  getByBatch(request: OrderInvoice_Request): Observable<OrderInvoice[]> {
    return this.http.post<OrderInvoice[]>(`${BASE_URL}/api/OrderInvoices/GetByBatch`, this.session.withSession(request));
  }

  getByBatchForPrint(request: OrderInvoice_Request): Observable<OrderInvoice[]> {
    return this.http.post<OrderInvoice[]>(`${BASE_URL}/api/OrderInvoices/GetByBatchForPrint`, this.session.withSession(request));
  }

  addOrUpdate(request: OrderInvoice_Request): Observable<OrderInvoice> {
    return this.http.post<OrderInvoice>(`${BASE_URL}/api/OrderInvoices/AddOrUpdate`, this.session.withSession(request));
  }
}
