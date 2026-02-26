import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrderAssay, OrderAssay_Request } from './models';
import { SessionService } from './session.service';
import config from '../config.json';

const BASE_URL = config.apiBaseUrl;

@Injectable({ providedIn: 'root' })
export class OrderAssayService {
  constructor(private http: HttpClient, private session: SessionService) {}

  get(request: OrderAssay_Request): Observable<OrderAssay[]> {
    return this.http.post<OrderAssay[]>(`${BASE_URL}/api/OrderAssay/Get`, this.session.withSession(request));
  }

  addOrUpdate(request: OrderAssay_Request): Observable<OrderAssay> {
    return this.http.post<OrderAssay>(`${BASE_URL}/api/OrderAssay/AddOrUpdate`, this.session.withSession(request));
  }
}
