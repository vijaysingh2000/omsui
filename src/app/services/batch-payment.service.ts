import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BatchPayment, BatchPayment_Request } from './models';
import { SessionService } from './session.service';
import config from '../config.json';

const BASE_URL = config.apiBaseUrl;

@Injectable({ providedIn: 'root' })
export class BatchPaymentService {
  constructor(private http: HttpClient, private session: SessionService) {}

  getAll(request: BatchPayment_Request = {}): Observable<BatchPayment[]> {
    return this.http.post<BatchPayment[]>(`${BASE_URL}/api/BatchPayment/GetAll`, this.session.withSession(request));
  }

  doesBatchNameExists(request: BatchPayment_Request): Observable<boolean> {
    return this.http.post<boolean>(`${BASE_URL}/api/BatchPayment/DoesBatchNameExists`, this.session.withSession(request));
  }

  get(batchId: string): Observable<BatchPayment> {
    return this.http.get<BatchPayment>(`${BASE_URL}/api/BatchPayment/Get/${batchId}`);
  }

  delete(batchId: string): Observable<void> {
    return this.http.delete<void>(`${BASE_URL}/api/BatchPayment/Delete/${batchId}`);
  }

  updateBatchPayments(request: BatchPayment_Request): Observable<BatchPayment[]> {
    return this.http.post<BatchPayment[]>(`${BASE_URL}/api/BatchPayment/UpdateBatchPayments`, this.session.withSession(request));
  }

  addOrUpdate(request: BatchPayment_Request): Observable<BatchPayment> {
    return this.http.post<BatchPayment>(`${BASE_URL}/api/BatchPayment/AddOrUpdate`, this.session.withSession(request));
  }
}
