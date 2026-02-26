import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  OrderInProgress,
  Report_BatchPaymentAggr_Model,
  Report_BatchPaymentSummary_Model,
  Report_MonthlyInvoice_Model,
  Report_OrderAging_Model,
  Report_OrderDispensedSummary_Model,
  Report_PaymentReceived_Model,
  Report_PurchasingReport_Model,
  Report_Request,
} from './models';
import config from '../config.json';

const BASE_URL = config.apiBaseUrl;

@Injectable({ providedIn: 'root' })
export class ReportService {
  constructor(private http: HttpClient) {}

  getOrdersInProgress(request: Report_Request): Observable<OrderInProgress[]> {
    return this.http.post<OrderInProgress[]>(`${BASE_URL}/api/Reports/GetOrdersInProgress`, request);
  }

  getBatchPaymentAggr(request: Report_Request): Observable<Report_BatchPaymentAggr_Model[]> {
    return this.http.post<Report_BatchPaymentAggr_Model[]>(`${BASE_URL}/api/Reports/GetBatchPaymentAggr`, request);
  }

  getBatchPaymentSummaryReport(request: Report_Request): Observable<Report_BatchPaymentSummary_Model[]> {
    return this.http.post<Report_BatchPaymentSummary_Model[]>(`${BASE_URL}/api/Reports/GetBatchPaymentSummaryReport`, request);
  }

  getMonthlyDispenseReport(request: Report_Request): Observable<Report_MonthlyInvoice_Model[]> {
    return this.http.post<Report_MonthlyInvoice_Model[]>(`${BASE_URL}/api/Reports/GetMonthlyDispenseReport`, request);
  }

  getOrderAgingReport(request: Report_Request): Observable<Report_OrderAging_Model[]> {
    return this.http.post<Report_OrderAging_Model[]>(`${BASE_URL}/api/Reports/GetOrderAgingReport`, request);
  }

  getOrderDispensedSummaryReport(request: Report_Request): Observable<Report_OrderDispensedSummary_Model[]> {
    return this.http.post<Report_OrderDispensedSummary_Model[]>(`${BASE_URL}/api/Reports/GetOrderDispensedSummaryReport`, request);
  }

  getOrderPaymentReceivedReport(request: Report_Request): Observable<Report_PaymentReceived_Model[]> {
    return this.http.post<Report_PaymentReceived_Model[]>(`${BASE_URL}/api/Reports/GetOrderPaymentReceivedReport`, request);
  }

  getPurchasingReport(request: Report_Request): Observable<Report_PurchasingReport_Model[]> {
    return this.http.post<Report_PurchasingReport_Model[]>(`${BASE_URL}/api/Reports/GetPurchasingReport`, request);
  }
}
