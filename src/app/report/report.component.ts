import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import * as XLSX from 'xlsx';
import { ReportService } from '../services/report.service';
import { MiscService } from '../services/misc.service';
import { SessionService } from '../services/session.service';
import { BaseModel, E_DashboardView, E_UserAccess, Report_Request } from '../services/models';

export interface ReportColumn {
  header: string;
  field: string;
  type?: 'currency' | 'date' | 'badge' | 'number' | 'text';
}

export interface ReportDefinition {
  key: string;
  label: string;
  serviceKey: string;
  columns: ReportColumn[];
  type?: number;
  userAccess?: E_UserAccess;
  dashboardView?: E_DashboardView;
}

@Component({
  selector: 'app-report',
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './report.component.html',
  styleUrl: './report.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CurrencyPipe, DatePipe],
})
export class ReportComponent implements OnInit {

  readonly reports: ReportDefinition[] = [
    {
      key: 'PurchaseReport',
      label: 'Purchase Report',
      serviceKey: 'purchasing',
      columns: [
        { header: 'Order #',        field: 'orderNumber' },
        { header: 'Patient',        field: 'patientName' },
        { header: 'Drug',           field: 'drugName' },
        { header: 'Manufacturer',   field: 'manufacturerName' },
        { header: 'Confirmation #', field: 'confirmationNumber' },
        { header: 'PO #',           field: 'poNumber' },
        { header: 'NDC',            field: 'ndc' },
        { header: 'Lot',            field: 'lot' },
        { header: 'Exp Date',       field: 'expDate',      type: 'date' },
        { header: 'Date Ordered',   field: 'dateOrdered',  type: 'date' },
        { header: 'Date Received',  field: 'dateReceived', type: 'date' },
        { header: 'Qty',            field: 'quantity',     type: 'number' },
        { header: 'Bill/Unit',      field: 'billPerUnit',  type: 'currency' },
        { header: 'COG/Unit',       field: 'cogPerUnit',   type: 'currency' },
        { header: 'Emergency Svc',  field: 'emergencyService' },
        { header: '340B',           field: 'id340BName' },
      ],
    },
    {
      key: 'MonthlyDispense',
      label: 'Monthly Dispense',
      serviceKey: 'monthlyDispense',
      columns: [
        { header: 'Order #',          field: 'orderNumber' },
        { header: 'Patient',          field: 'patientName' },
        { header: 'Drug',             field: 'drugName' },
        { header: 'DOS',              field: 'dos',              type: 'date' },
        { header: 'Insurance',        field: 'insuranceName' },
        { header: 'Manufacturer',     field: 'manufacturerName' },
        { header: 'RX1',              field: 'rX1' },
        { header: 'RX2',              field: 'rX2' },
        { header: 'RX3',              field: 'rX3' },
        { header: 'Total Prescribed', field: 'totalPrescribed',  type: 'number' },
        { header: 'Units Billed',     field: 'totalUnitsBilled', type: 'number' },
        { header: 'Bill Amount',      field: 'totalBillAmount',  type: 'currency' },
        { header: 'COG Amount',       field: 'totalCogAmount',   type: 'currency' },
      ],
    },
    {
      key: 'BatchPaymentSummary',
      label: 'Batch Payment Summary',
      serviceKey: 'batchPaymentSummary',
      columns: [
        { header: 'Batch',        field: 'batchName' },
        { header: 'Order #',      field: 'orderNumber' },
        { header: 'Patient',      field: 'patientName' },
        { header: 'Report Date',  field: 'reportDate',   type: 'date' },
        { header: 'DOS',          field: 'dos',          type: 'date' },
        { header: 'Insurance',    field: 'insuranceName' },
        { header: 'Units Billed', field: 'unitsBilled',  type: 'number' },
        { header: 'Amt Billed',   field: 'amountBilled', type: 'currency' },
        { header: 'Payment',      field: 'totalPayment', type: 'currency' },
        { header: 'Balance',      field: 'totalBalance', type: 'currency' },
      ],
    },
    {
      key: 'BatchPaymentAggr',
      label: 'Batch Payment Aggregate',
      serviceKey: 'batchPaymentAggr',
      columns: [
        { header: 'Order #',      field: 'orderNumber' },
        { header: 'Patient',      field: 'patientName' },
        { header: 'DOS',          field: 'dos',              type: 'date' },
        { header: 'Insurance',    field: 'insuranceName' },
        { header: 'Batch',        field: 'batchName' },
        { header: 'Cheque #',     field: 'chequeNumber' },
        { header: 'Cheque Date',  field: 'chequeDate',       type: 'date' },
        { header: 'Units Billed', field: 'unitsBilled',      type: 'number' },
        { header: 'Amt Billed',   field: 'amountBilled',     type: 'currency' },
        { header: 'Payment',      field: 'totalPayment',     type: 'currency' },
        { header: 'Write-Off',    field: 'totalWriteOff',    type: 'currency' },
        { header: 'Adjustments',  field: 'totalAdjustments', type: 'currency' },
        { header: 'Balance',      field: 'totalBalance',     type: 'currency' },
      ],
    },
    {
      key: 'OrderDispensedSummary',
      label: 'Order Dispensed Summary',
      serviceKey: 'orderDispensedSummary',
      type: 1,
      columns: [
        { header: 'Order #',          field: 'orderNumber' },
        { header: 'Patient',          field: 'patientName' },
        { header: 'MRN',              field: 'mrn' },
        { header: 'DOS',              field: 'dos',                  type: 'date' },
        { header: 'Insurance',        field: 'insuranceName' },
        { header: 'Drug',             field: 'drugName' },
        { header: 'Manufacturer',     field: 'manufacturerName' },
        { header: 'Units Billed',     field: 'totalBilledUnits',     type: 'number' },
        { header: 'Amt Billed',       field: 'totalBilledAmount',    type: 'currency' },
        { header: 'COG Amount',       field: 'totalCOGAmount',       type: 'currency' },
        { header: 'COS Amount',       field: 'totalCOSAmount',       type: 'currency' },
        { header: 'UCD Income',       field: 'totalUCDIncome',       type: 'currency' },
        { header: 'Profit Margin',    field: 'profitMargin',         type: 'currency' },
        { header: 'Prescribed Units', field: 'totalPrescribedUnits', type: 'number' },
      ],
    },
    {
      key: 'OrderDispensedState',
      label: 'Order Dispensed (State)',
      serviceKey: 'orderDispensedSummary',
      type: 2,
      columns: [
        { header: 'Order #',          field: 'orderNumber' },
        { header: 'Patient',          field: 'patientName' },
        { header: 'MRN',              field: 'mrn' },
        { header: 'DOS',              field: 'dos',                  type: 'date' },
        { header: 'Insurance',        field: 'insuranceName' },
        { header: 'Drug',             field: 'drugName' },
        { header: 'Manufacturer',     field: 'manufacturerName' },
        { header: 'Units Billed',     field: 'totalBilledUnits',     type: 'number' },
        { header: 'Amt Billed',       field: 'totalBilledAmount',    type: 'currency' },
        { header: 'COG Amount',       field: 'totalCOGAmount',       type: 'currency' },
        { header: 'COS Amount',       field: 'totalCOSAmount',       type: 'currency' },
        { header: 'UCD Income',       field: 'totalUCDIncome',       type: 'currency' },
        { header: 'Profit Margin',    field: 'profitMargin',         type: 'currency' },
        { header: 'Prescribed Units', field: 'totalPrescribedUnits', type: 'number' },
      ],
    },
    {
      key: 'OrderDispensedCommercial',
      label: 'Order Dispensed (Commercial)',
      serviceKey: 'orderDispensedSummary',
      type: 3,
      columns: [
        { header: 'Order #',          field: 'orderNumber' },
        { header: 'Patient',          field: 'patientName' },
        { header: 'MRN',              field: 'mrn' },
        { header: 'DOS',              field: 'dos',                  type: 'date' },
        { header: 'Insurance',        field: 'insuranceName' },
        { header: 'Drug',             field: 'drugName' },
        { header: 'Manufacturer',     field: 'manufacturerName' },
        { header: 'Units Billed',     field: 'totalBilledUnits',     type: 'number' },
        { header: 'Amt Billed',       field: 'totalBilledAmount',    type: 'currency' },
        { header: 'COG Amount',       field: 'totalCOGAmount',       type: 'currency' },
        { header: 'COS Amount',       field: 'totalCOSAmount',       type: 'currency' },
        { header: 'UCD Income',       field: 'totalUCDIncome',       type: 'currency' },
        { header: 'Profit Margin',    field: 'profitMargin',         type: 'currency' },
        { header: 'Prescribed Units', field: 'totalPrescribedUnits', type: 'number' },
      ],
    },
    {
      key: 'OrderDispensedSummaryState',
      label: 'Order Dispensed Summary (State)',
      serviceKey: 'orderDispensedSummary',
      type: 4,
      columns: [
        { header: 'Order #',          field: 'orderNumber' },
        { header: 'Patient',          field: 'patientName' },
        { header: 'MRN',              field: 'mrn' },
        { header: 'DOS',              field: 'dos',                  type: 'date' },
        { header: 'Insurance',        field: 'insuranceName' },
        { header: 'Drug',             field: 'drugName' },
        { header: 'Manufacturer',     field: 'manufacturerName' },
        { header: 'Units Billed',     field: 'totalBilledUnits',     type: 'number' },
        { header: 'Amt Billed',       field: 'totalBilledAmount',    type: 'currency' },
        { header: 'COG Amount',       field: 'totalCOGAmount',       type: 'currency' },
        { header: 'COS Amount',       field: 'totalCOSAmount',       type: 'currency' },
        { header: 'UCD Income',       field: 'totalUCDIncome',       type: 'currency' },
        { header: 'Profit Margin',    field: 'profitMargin',         type: 'currency' },
        { header: 'Prescribed Units', field: 'totalPrescribedUnits', type: 'number' },
      ],
    },
    {
      key: 'OrderDispensedSummaryCommercial',
      label: 'Order Dispensed Summary (Commercial)',
      serviceKey: 'orderDispensedSummary',
      type: 6,
      columns: [
        { header: 'Order #',          field: 'orderNumber' },
        { header: 'Patient',          field: 'patientName' },
        { header: 'MRN',              field: 'mrn' },
        { header: 'DOS',              field: 'dos',                  type: 'date' },
        { header: 'Insurance',        field: 'insuranceName' },
        { header: 'Drug',             field: 'drugName' },
        { header: 'Manufacturer',     field: 'manufacturerName' },
        { header: 'Units Billed',     field: 'totalBilledUnits',     type: 'number' },
        { header: 'Amt Billed',       field: 'totalBilledAmount',    type: 'currency' },
        { header: 'COG Amount',       field: 'totalCOGAmount',       type: 'currency' },
        { header: 'COS Amount',       field: 'totalCOSAmount',       type: 'currency' },
        { header: 'UCD Income',       field: 'totalUCDIncome',       type: 'currency' },
        { header: 'Profit Margin',    field: 'profitMargin',         type: 'currency' },
        { header: 'Prescribed Units', field: 'totalPrescribedUnits', type: 'number' },
      ],
    },
    {
      key: 'OrderPaymentReceived',
      label: 'Order Payment Received',
      serviceKey: 'orderPaymentReceived',
      type: 1,
      columns: [
        { header: 'Order #',      field: 'orderNumber' },
        { header: 'Patient',      field: 'patientName' },
        { header: 'Insurance',    field: 'insuranceName' },
        { header: 'DOS',          field: 'dos',               type: 'date' },
        { header: 'Report Date',  field: 'reportDate',        type: 'date' },
        { header: 'Deposit Date', field: 'depositDate',       type: 'date' },
        { header: 'Cheque #',     field: 'checkNumber' },
        { header: 'Units',        field: 'units',             type: 'number' },
        { header: 'Actual Units', field: 'actualUnits',       type: 'number' },
        { header: 'Amt Billed',   field: 'totalBilledAmount', type: 'currency' },
        { header: 'Payment',      field: 'payment',           type: 'currency' },
        { header: 'Payment Type', field: 'paymentType' },
      ],
    },
    {
      key: 'OrderPaymentInterestReceived',
      label: 'Order Payment Interest Received',
      serviceKey: 'orderPaymentReceived',
      type: 2,
      columns: [
        { header: 'Order #',      field: 'orderNumber' },
        { header: 'Patient',      field: 'patientName' },
        { header: 'Insurance',    field: 'insuranceName' },
        { header: 'DOS',          field: 'dos',               type: 'date' },
        { header: 'Report Date',  field: 'reportDate',        type: 'date' },
        { header: 'Deposit Date', field: 'depositDate',       type: 'date' },
        { header: 'Cheque #',     field: 'checkNumber' },
        { header: 'Units',        field: 'units',             type: 'number' },
        { header: 'Actual Units', field: 'actualUnits',       type: 'number' },
        { header: 'Amt Billed',   field: 'totalBilledAmount', type: 'currency' },
        { header: 'Payment',      field: 'payment',           type: 'currency' },
        { header: 'Payment Type', field: 'paymentType' },
      ],
    },
    {
      key: 'OrderPaymentReceivedSummary',
      label: 'Order Payment Received Summary',
      serviceKey: 'orderPaymentReceived',
      type: 3,
      columns: [
        { header: 'Order #',      field: 'orderNumber' },
        { header: 'Patient',      field: 'patientName' },
        { header: 'Insurance',    field: 'insuranceName' },
        { header: 'DOS',          field: 'dos',               type: 'date' },
        { header: 'Report Date',  field: 'reportDate',        type: 'date' },
        { header: 'Deposit Date', field: 'depositDate',       type: 'date' },
        { header: 'Cheque #',     field: 'checkNumber' },
        { header: 'Units',        field: 'units',             type: 'number' },
        { header: 'Actual Units', field: 'actualUnits',       type: 'number' },
        { header: 'Amt Billed',   field: 'totalBilledAmount', type: 'currency' },
        { header: 'Payment',      field: 'payment',           type: 'currency' },
        { header: 'Payment Type', field: 'paymentType' },
      ],
    },
    {
      key: 'OrderAging',
      label: 'Order Aging',
      serviceKey: 'orderAging',
      columns: [
        { header: 'Order #',      field: 'orderNumber' },
        { header: 'Patient',      field: 'patientName' },
        { header: 'DOS',          field: 'dos',               type: 'date' },
        { header: 'Insurance',    field: 'insuranceName' },
        { header: 'Drug',         field: 'drugName' },
        { header: 'Manufacturer', field: 'manufacturerName' },
        { header: 'Days',         field: 'days',              type: 'number' },
        { header: 'Units Billed', field: 'totalBilledUnit',   type: 'number' },
        { header: 'Amt Billed',   field: 'totalBilledAmout',  type: 'currency' },
        { header: 'Payment',      field: 'totalOrderPayment', type: 'currency' },
        { header: 'Balance',      field: 'totalBalance',      type: 'currency' },
        { header: 'Notes',        field: 'orderNotes' },
      ],
    },
    {
      key: 'FinancialReport',
      label: 'Financial Report',
      serviceKey: 'financial',
      columns: [],  // TODO: implement when service method is ready
    },
    {
      key: 'AllOrders',
      label: 'All Orders',
      serviceKey: 'ordersInProgress',
      userAccess: E_UserAccess.FullAccess,
      dashboardView: E_DashboardView.ALL,
      columns: [
        { header: 'Order #',       field: 'orderNumber' },
        { header: 'Patient',       field: 'patientName' },
        { header: 'MRN',           field: 'mrn' },
        { header: 'Drug',          field: 'drugName' },
        { header: 'DOS',           field: 'dos',                   type: 'date' },
        { header: 'Est. Delivery', field: 'estimatedDeliveryDate', type: 'date' },
        { header: 'Insurance',     field: 'insuranceName' },
        { header: 'Task',          field: 'currentTaskCode',       type: 'badge' },
        { header: 'Units Billed',  field: 'totalUnitsBilled',      type: 'number' },
        { header: 'Amt Billed',    field: 'totalAmountBilled',     type: 'currency' },
        { header: 'Payments',      field: 'totalPayments',         type: 'currency' },
        { header: 'Balance',       field: 'totalBalance',          type: 'currency' },
      ],
    },
  ];

  availableReports: BaseModel[] = [];
  reportsLoading = false;

  /** Dropdown items: from API if it returned named items, otherwise hardcoded reports. */
  get dropdownItems(): { key: string; label: string }[] {
    const apiItems = this.availableReports.filter(r => r.name);
    if (apiItems.length > 0) {
      return apiItems.map((r, i) => ({
        key: this.reports[i]?.key ?? String(r.id ?? i),
        label: r.name!,
      }));
    }
    return this.reports.map(r => ({ key: r.key, label: r.label }));
  }

  selectedReportKey = this.reports[0].key;
  startDate = this.firstDayOfCurrentMonth();
  endDate   = this.lastDayOfCurrentMonth();

  results: any[] = [];
  loading = false;
  errorMsg: string | null = null;
  submitted = false;
  displayedReport: ReportDefinition | null = null;

  sortField: string | null = null;
  sortDir: 'asc' | 'desc' = 'asc';

  sortBy(field: string): void {
    if (this.sortField === field) {
      this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDir = 'asc';
    }
  }

  get sortedResults(): any[] {
    if (!this.sortField) return this.results;
    const field = this.sortField;
    const dir = this.sortDir === 'asc' ? 1 : -1;
    return [...this.results].sort((a, b) => {
      const av = a[field] ?? '';
      const bv = b[field] ?? '';
      if (av < bv) return -dir;
      if (av > bv) return dir;
      return 0;
    });
  }

  get selectedReport(): ReportDefinition {
    return this.reports.find(r => r.key === this.selectedReportKey)!;
  }

  constructor(
    private reportService: ReportService,
    private miscService: MiscService,
    private session: SessionService,
    private cdr: ChangeDetectorRef,
    private currencyPipe: CurrencyPipe,
    private datePipe: DatePipe,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.reportsLoading = true;
    this.miscService.getAllReports()
      .pipe(finalize(() => { this.reportsLoading = false; this.cdr.detectChanges(); }))
      .subscribe({
        next: (data) => {
          this.availableReports = data ?? [];
          this.cdr.detectChanges();
        },
        error: () => { this.cdr.detectChanges(); },
      });
  }

  private firstDayOfCurrentMonth(): string {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
  }

  private lastDayOfCurrentMonth(): string {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
  }

  private buildRequest(def: ReportDefinition): Report_Request {
    return {
      clientId:      this.session.clientId,
      startDate:     this.startDate,
      endDate:       this.endDate,
      id:            null,
      guid:          null,
      type:          def.type,
      userAccess:    def.userAccess,
      dashboardView: def.dashboardView,
      orderAge:      undefined,
    };
  }

  submit(): void {
    this.loading = true;
    this.errorMsg = null;
    this.submitted = true;
    this.results = [];
    this.displayedReport = this.selectedReport;
    this.sortField = null;
    this.sortDir = 'asc';
    this.cdr.detectChanges();

    const def = this.selectedReport;
    const req = this.buildRequest(def);
    let obs$: Observable<any[]>;

    switch (def.serviceKey) {
      case 'purchasing':             obs$ = this.reportService.getPurchasingReport(req);              break;
      case 'monthlyDispense':        obs$ = this.reportService.getMonthlyDispenseReport(req);         break;
      case 'batchPaymentSummary':    obs$ = this.reportService.getBatchPaymentSummaryReport(req);     break;
      case 'batchPaymentAggr':       obs$ = this.reportService.getBatchPaymentAggr(req);              break;
      case 'orderDispensedSummary':  obs$ = this.reportService.getOrderDispensedSummaryReport(req);  break;
      case 'orderPaymentReceived':   obs$ = this.reportService.getOrderPaymentReceivedReport(req);   break;
      case 'orderAging':             obs$ = this.reportService.getOrderAgingReport(req);              break;
      case 'ordersInProgress':       obs$ = this.reportService.getOrdersInProgress(req);             break;
      case 'financial':
        this.errorMsg = 'Financial Report is not yet implemented.';
        this.loading = false;
        this.cdr.detectChanges();
        return;
      default:                       obs$ = this.reportService.getOrdersInProgress(req);
    }

    obs$.pipe(finalize(() => { this.loading = false; this.cdr.detectChanges(); }))
      .subscribe({
        next: (data: any[]) => {
          this.results = data ?? [];
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          this.errorMsg = err?.message ?? 'An error occurred.';
          this.cdr.detectChanges();
        },
      });
  }

  formatCell(value: any, type?: string): string {
    if (value == null) return '—';
    switch (type) {
      case 'currency': return this.currencyPipe.transform(value) ?? '—';
      case 'date':     return this.datePipe.transform(value, 'MM/dd/yyyy') ?? '—';
      case 'number':   return String(value);
      default:         return String(value);
    }
  }

  currencyFields(): string[] {
    return (this.displayedReport ?? this.selectedReport).columns
      .filter(c => c.type === 'currency')
      .map(c => c.field);
  }

  columnTotal(field: string): number {
    return this.results.reduce((s, r) => s + (r[field] ?? 0), 0);
  }

  exportToExcel(): void {
    if (!this.displayedReport || !this.sortedResults.length) return;
    const headers = this.displayedReport.columns.map(c => c.header);
    const rows = this.sortedResults.map(row =>
      this.displayedReport!.columns.map(col => row[col.field] ?? '')
    );
    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);

    // Auto-fit column widths
    const colWidths = headers.map((h, i) => ({
      wch: Math.max(h.length, ...rows.map(r => String(r[i] ?? '').length), 10)
    }));
    ws['!cols'] = colWidths;

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, this.displayedReport.label.substring(0, 31));
    XLSX.writeFile(wb, `${this.displayedReport.label}.xlsx`);
  }

  logout(): void {
    this.session.clearSession();
    this.router.navigate(['/login']);
  }
}
