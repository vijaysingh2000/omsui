import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order, Orders_Request } from './models';
import config from '../config.json';

const BASE_URL = config.apiBaseUrl;

@Injectable({ providedIn: 'root' })
export class OrdersService {
  constructor(private http: HttpClient) {}

  canDeleteOrder(request: Orders_Request): Observable<boolean> {
    return this.http.post<boolean>(`${BASE_URL}/api/Orders/CanDeleteOrder`, request);
  }

  deleteOrder(request: Orders_Request): Observable<void> {
    return this.http.delete<void>(`${BASE_URL}/api/Orders/DeleteOrder`, { body: request });
  }

  getBasicDetails(request: Orders_Request): Observable<Order> {
    return this.http.post<Order>(`${BASE_URL}/api/Orders/GetBasicDetails`, request);
  }

  getByOrderNumber(request: Orders_Request): Observable<Order> {
    return this.http.post<Order>(`${BASE_URL}/api/Orders/GetByOrderNumber`, request);
  }

  doesOrderNumberExists(request: Orders_Request): Observable<boolean> {
    return this.http.post<boolean>(`${BASE_URL}/api/Orders/DoesOrderNumberExists`, request);
  }

  get(request: Orders_Request): Observable<Order> {
    return this.http.post<Order>(`${BASE_URL}/api/Orders/Get`, request);
  }

  getByPatientId(request: Orders_Request): Observable<Order[]> {
    return this.http.post<Order[]>(`${BASE_URL}/api/Orders/GetOrdersByPatientId`, request);
  }

  getForInvoice(request: Orders_Request): Observable<Order[]> {
    return this.http.post<Order[]>(`${BASE_URL}/api/Orders/GetOrdersForInvoice`, request);
  }

  add(request: Orders_Request): Observable<Order> {
    return this.http.post<Order>(`${BASE_URL}/api/Orders/Add`, request);
  }

  update(request: Orders_Request): Observable<Order> {
    return this.http.post<Order>(`${BASE_URL}/api/Orders/Update`, request);
  }

  updateDeliveryReceivedDate(request: Orders_Request): Observable<void> {
    return this.http.post<void>(`${BASE_URL}/api/Orders/UpdateDeliveryReceivedDate`, request);
  }

  updateNotes(request: Orders_Request): Observable<void> {
    return this.http.post<void>(`${BASE_URL}/api/Orders/UpdateOrderNotes`, request);
  }

  updateBilled(request: Orders_Request): Observable<void> {
    return this.http.post<void>(`${BASE_URL}/api/Orders/UpdateOrderBilled`, request);
  }

  lockUnlock(request: Orders_Request): Observable<void> {
    return this.http.post<void>(`${BASE_URL}/api/Orders/LockUnlockOrder`, request);
  }

  getBilled(request: Orders_Request): Observable<Order> {
    return this.http.post<Order>(`${BASE_URL}/api/Orders/GetOrderBilled`, request);
  }

  addOrUpdate(request: Orders_Request): Observable<Order> {
    return this.http.post<Order>(`${BASE_URL}/api/Orders/AddOrUpdate`, request);
  }

  getOrderNumberAndGuidMap(): Observable<Record<string, string>> {
    return this.http.get<Record<string, string>>(`${BASE_URL}/api/Orders/GetOrderNumberAndGuidMap`);
  }
}
