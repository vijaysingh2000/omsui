import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrderTask, OrderTask_Request } from './models';
import { SessionService } from './session.service';
import config from '../config.json';

const BASE_URL = config.apiBaseUrl;

@Injectable({ providedIn: 'root' })
export class OrderTasksService {
  constructor(private http: HttpClient, private session: SessionService) {}

  get(request: OrderTask_Request): Observable<OrderTask> {
    return this.http.post<OrderTask>(`${BASE_URL}/api/OrderTasks/Get`, this.session.withSession(request));
  }

  getList(request: OrderTask_Request): Observable<OrderTask[]> {
    return this.http.post<OrderTask[]>(`${BASE_URL}/api/OrderTasks/GetList`, this.session.withSession(request));
  }

  addAllTasks(request: OrderTask_Request): Observable<OrderTask[]> {
    return this.http.post<OrderTask[]>(`${BASE_URL}/api/OrderTasks/AddAllTasks`, this.session.withSession(request));
  }

  update(request: OrderTask_Request): Observable<OrderTask> {
    return this.http.post<OrderTask>(`${BASE_URL}/api/OrderTasks/Update`, this.session.withSession(request));
  }
}
