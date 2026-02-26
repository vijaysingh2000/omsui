import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BatchInvoice, BatchInvoice_Request } from './models';
import { SessionService } from './session.service';
import config from '../config.json';

const BASE_URL = config.apiBaseUrl;

@Injectable({ providedIn: 'root' })
export class BatchInvoiceService {
  constructor(private http: HttpClient, private session: SessionService) {}

  getList(request: BatchInvoice_Request): Observable<BatchInvoice[]> {
    return this.http.post<BatchInvoice[]>(`${BASE_URL}/api/BatchInvoice/GetList`, this.session.withSession(request));
  }

  doesBatchNameExists(request: BatchInvoice_Request): Observable<boolean> {
    return this.http.post<boolean>(`${BASE_URL}/api/BatchInvoice/DoesBatchNameExists`, this.session.withSession(request));
  }

  get(batchId: string): Observable<BatchInvoice> {
    return this.http.get<BatchInvoice>(`${BASE_URL}/api/BatchInvoice/Get/${batchId}`);
  }

  delete(batchId: string): Observable<void> {
    return this.http.delete<void>(`${BASE_URL}/api/BatchInvoice/Delete/${batchId}`);
  }

  updateBatchInvoices(request: BatchInvoice_Request): Observable<BatchInvoice[]> {
    return this.http.post<BatchInvoice[]>(`${BASE_URL}/api/BatchInvoice/UpdateBatchInvoices`, this.session.withSession(request));
  }

  addOrUpdate(request: BatchInvoice_Request): Observable<BatchInvoice> {
    return this.http.post<BatchInvoice>(`${BASE_URL}/api/BatchInvoice/AddOrUpdate`, this.session.withSession(request));
  }
}
