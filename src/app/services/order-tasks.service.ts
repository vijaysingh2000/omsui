import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrderTask, OrderTask_Request } from './models';
import config from '../config.json';

const BASE_URL = config.apiBaseUrl;

@Injectable({ providedIn: 'root' })
export class OrderTasksService {
  constructor(private http: HttpClient) {}

  get(request: OrderTask_Request): Observable<OrderTask> {
    return this.http.post<OrderTask>(`${BASE_URL}/api/OrderTasks/Get`, request);
  }

  getList(request: OrderTask_Request): Observable<OrderTask[]> {
    return this.http.post<OrderTask[]>(`${BASE_URL}/api/OrderTasks/GetList`, request);
  }

  addAllTasks(request: OrderTask_Request): Observable<OrderTask[]> {
    return this.http.post<OrderTask[]>(`${BASE_URL}/api/OrderTasks/AddAllTasks`, request);
  }

  update(request: OrderTask_Request): Observable<OrderTask> {
    return this.http.post<OrderTask>(`${BASE_URL}/api/OrderTasks/Update`, request);
  }
}
