import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order, Orders_Request } from './models';
import { SessionService } from './session.service';
import config from '../config.json';

const BASE_URL = config.apiBaseUrl;

@Injectable({ providedIn: 'root' })
export class OrdersService {
  constructor(private http: HttpClient, private session: SessionService) {}

  canDeleteOrder(request: Orders_Request): Observable<boolean> {
    return this.http.post<boolean>(`${BASE_URL}/api/Orders/CanDeleteOrder`, this.session.withSession(request));
  }

  deleteOrder(request: Orders_Request): Observable<void> {
    return this.http.delete<void>(`${BASE_URL}/api/Orders/DeleteOrder`, { body: this.session.withSession(request) });
  }

  getBasicDetails(request: Orders_Request): Observable<Order> {
    return this.http.post<Order>(`${BASE_URL}/api/Orders/GetBasicDetails`, this.session.withSession(request));
  }

  getByOrderNumber(request: Orders_Request): Observable<Order> {
    return this.http.post<Order>(`${BASE_URL}/api/Orders/GetByOrderNumber`, this.session.withSession(request));
  }

  doesOrderNumberExists(request: Orders_Request): Observable<boolean> {
    return this.http.post<boolean>(`${BASE_URL}/api/Orders/DoesOrderNumberExists`, this.session.withSession(request));
  }

  get(request: Orders_Request): Observable<Order> {
    return this.http.post<Order>(`${BASE_URL}/api/Orders/Get`, this.session.withSession(request));
  }

  getByPatientId(request: Orders_Request): Observable<Order[]> {
    return this.http.post<Order[]>(`${BASE_URL}/api/Orders/GetOrdersByPatientId`, this.session.withSession(request));
  }

  getForInvoice(request: Orders_Request): Observable<Order[]> {
    return this.http.post<Order[]>(`${BASE_URL}/api/Orders/GetOrdersForInvoice`, this.session.withSession(request));
  }

  add(request: Orders_Request): Observable<Order> {
    return this.http.post<Order>(`${BASE_URL}/api/Orders/Add`, this.session.withSession(request));
  }

  update(request: Orders_Request): Observable<Order> {
    return this.http.post<Order>(`${BASE_URL}/api/Orders/Update`, this.session.withSession(request));
  }

  updateDeliveryReceivedDate(request: Orders_Request): Observable<void> {
    return this.http.post<void>(`${BASE_URL}/api/Orders/UpdateDeliveryReceivedDate`, this.session.withSession(request));
  }

  updateNotes(request: Orders_Request): Observable<void> {
    return this.http.post<void>(`${BASE_URL}/api/Orders/UpdateOrderNotes`, this.session.withSession(request));
  }

  updateBilled(request: Orders_Request): Observable<void> {
    return this.http.post<void>(`${BASE_URL}/api/Orders/UpdateOrderBilled`, this.session.withSession(request));
  }

  lockUnlock(request: Orders_Request): Observable<void> {
    return this.http.post<void>(`${BASE_URL}/api/Orders/LockUnlockOrder`, this.session.withSession(request));
  }

  getBilled(request: Orders_Request): Observable<Order> {
    return this.http.post<Order>(`${BASE_URL}/api/Orders/GetOrderBilled`, this.session.withSession(request));
  }

  addOrUpdate(request: Orders_Request): Observable<Order> {
    return this.http.post<Order>(`${BASE_URL}/api/Orders/AddOrUpdate`, this.session.withSession(request));
  }

  getOrderNumberAndGuidMap(): Observable<Record<string, string>> {
    return this.http.get<Record<string, string>>(`${BASE_URL}/api/Orders/GetOrderNumberAndGuidMap`);
  }
}
