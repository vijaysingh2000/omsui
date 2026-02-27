import { Component, ChangeDetectorRef, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { finalize, catchError } from 'rxjs/operators';
import { ReportService } from '../services/report.service';
import { ClientService } from '../services/client.service';
import { SessionService } from '../services/session.service';
import { UsersService } from '../services/users.service';
import { StaticListService } from '../services/static-list.service';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { PatientDetailComponent } from '../patients/patient-detail/patient-detail.component';
import { ClientModel, OrderInProgress, Report_Request, Tasks } from '../services/models';
import { E_DashboardView } from '../services/enum';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, RouterLinkActive, FormsModule, CommonModule, SidebarComponent, PatientDetailComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  title = 'Dashboard';

  readonly E_DashboardView = E_DashboardView;

  readonly dashboardViewOptions: { label: string; value: E_DashboardView }[] = [
    { label: 'Full View',      value: E_DashboardView.FullView },
    { label: 'Unbilled View',  value: E_DashboardView.UnbilledView },
    { label: 'Billed View',    value: E_DashboardView.BilledView },
  ];

  readonly dateRangeOptions: { label: string; key: string }[] = [
    { label: 'Current Month', key: 'currentMonth' },
    { label: 'Last Month',    key: 'lastMonth' },
    { label: 'Last 2 Months', key: 'last2Months' },
    { label: 'Last 3 Months', key: 'last3Months' },
    { label: 'Last 6 Months', key: 'last6Months' },
    { label: 'Last 1 Year',   key: 'last1Year' },
    { label: 'Last 2 Years',  key: 'last2Years' },
  ];

  selectedDashboardView: E_DashboardView = E_DashboardView.UnbilledView;
  selectedDateRangeKey = 'last2Years';
  clientId: number | undefined = undefined;

  clients: ClientModel[] = [];
  clientsLoading = false;

  get selectedClientId(): number | undefined {
    return this.session.clientId;
  }
  set selectedClientId(id: number | undefined) {
    this.session.setClientId(id);
  }

  private computeDateRange(key: string = this.selectedDateRangeKey): { startDate: string; endDate: string } {
    const today = new Date();
    const fmt = (d: Date) => d.toISOString().split('T')[0];

    switch (key) {
      case 'currentMonth': {
        return { startDate: fmt(new Date(today.getFullYear(), today.getMonth(), 1)), endDate: fmt(today) };
      }
      case 'lastMonth': {
        return {
          startDate: fmt(new Date(today.getFullYear(), today.getMonth() - 1, 1)),
          endDate:   fmt(new Date(today.getFullYear(), today.getMonth(), 0)),
        };
      }
      case 'last2Months': {
        return { startDate: fmt(new Date(today.getFullYear(), today.getMonth() - 2, 1)), endDate: fmt(today) };
      }
      case 'last3Months': {
        return { startDate: fmt(new Date(today.getFullYear(), today.getMonth() - 3, 1)), endDate: fmt(today) };
      }
      case 'last6Months': {
        return { startDate: fmt(new Date(today.getFullYear(), today.getMonth() - 6, 1)), endDate: fmt(today) };
      }
      case 'last1Year': {
        return { startDate: fmt(new Date(today.getFullYear() - 1, today.getMonth(), 1)), endDate: fmt(today) };
      }
      case 'last2Years': {
        return { startDate: fmt(new Date(today.getFullYear() - 2, today.getMonth(), 1)), endDate: fmt(today) };
      }
      default: {
        return { startDate: fmt(new Date(today.getFullYear(), today.getMonth(), 1)), endDate: fmt(today) };
      }
    }
  }

  dateRangeLabel(key: string): string {
    const { startDate, endDate } = this.computeDateRange(key);
    return `${startDate} – ${endDate}`;
  }

  get computedDateRange(): { startDate: string; endDate: string } {
    return this.computeDateRange();
  }

  private buildRequest(): Report_Request {
    const { startDate, endDate } = this.computeDateRange();
    return {
      clientId: this.session.clientId,
      startDate,
      endDate,
      dashboardView: this.selectedDashboardView,
      id: null,
      guid: null,
      userAccess: undefined,
      orderAge: undefined,
      type: undefined,
    };
  }

  results: OrderInProgress[] = [];
  loading = false;
  errorMsg: string | null = null;
  submitted = false;

  taskMap = new Map<string, string>();

  selectedPatientId: string | null = null;
  showPatientDetail = false;

  sortField: string | null = null;
  sortDir: 'asc' | 'desc' = 'asc';

  collapsedGroups = new Set<string>();

  toggleGroup(key: string): void {
    if (this.collapsedGroups.has(key)) {
      this.collapsedGroups.delete(key);
    } else {
      this.collapsedGroups.add(key);
    }
    this.cdr.detectChanges();
  }

  isGroupCollapsed(key: string): boolean {
    return this.collapsedGroups.has(key);
  }

  expandAll(): void {
    this.collapsedGroups.clear();
    this.cdr.detectChanges();
  }

  collapseAll(): void {
    for (const g of this.groupedResults) {
      this.collapsedGroups.add(g.sortKey);
    }
    this.cdr.detectChanges();
  }

  sortBy(field: string): void {
    if (this.sortField === field) {
      this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDir = 'asc';
    }
  }

  get sortedResults(): OrderInProgress[] {
    if (!this.sortField) return this.results;
    const field = this.sortField as keyof OrderInProgress;
    const dir = this.sortDir === 'asc' ? 1 : -1;
    return [...this.results].sort((a, b) => {
      const av = a[field] ?? '';
      const bv = b[field] ?? '';
      if (av < bv) return -dir;
      if (av > bv) return dir;
      return 0;
    });
  }

  get groupedResults(): { label: string; sortKey: string; rows: OrderInProgress[] }[] {
    const map = new Map<string, { label: string; sortKey: string; rows: OrderInProgress[] }>();
    for (const row of this.sortedResults) {
      let label = 'Unknown';
      let sortKey = '0000-00';
      if (row.dos) {
        const d = new Date(row.dos);
        sortKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        label = d.toLocaleString('default', { month: 'long', year: 'numeric' });
      }
      if (!map.has(sortKey)) {
        map.set(sortKey, { label, sortKey, rows: [] });
      }
      map.get(sortKey)!.rows.push(row);
    }
    return Array.from(map.values()).sort((a, b) => b.sortKey.localeCompare(a.sortKey));
  }

  groupTotalBilled(rows: OrderInProgress[]): number {
    return rows.reduce((sum, r) => sum + (r.totalAmountBilled ?? 0), 0);
  }

  groupTotalPayments(rows: OrderInProgress[]): number {
    return rows.reduce((sum, r) => sum + (r.totalPayments ?? 0), 0);
  }

  groupTotalBalance(rows: OrderInProgress[]): number {
    return rows.reduce((sum, r) => sum + (r.totalBalance ?? 0), 0);
  }

  constructor(
    private reportService: ReportService,
    private clientService: ClientService,
    private usersService: UsersService,
    private staticListService: StaticListService,
    private session: SessionService,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.clientsLoading = true;
    forkJoin({
      clients: this.clientService.getAll().pipe(catchError(() => of([]))),
      user: this.usersService.getById({ id: this.session.userId }).pipe(catchError(() => of(null))),
      tasks: this.staticListService.getAllTasks().pipe(catchError(() => of([]))),
    })
      .pipe(finalize(() => { this.clientsLoading = false; this.cdr.detectChanges(); }))
      .subscribe({
        next: ({ clients, user, tasks }) => {
          const allClients = clients ?? [];
          const assigned = user?.clientIds;
          this.clients = assigned?.length
            ? allClients.filter(c => c.id != null && assigned.includes(c.id))
            : allClients;
          // Auto-select first client if none selected or current selection is not in list
          if (!this.selectedClientId || !this.clients.some(c => c.id === this.selectedClientId)) {
            this.selectedClientId = this.clients[0]?.id;
          }
          this.taskMap = new Map((tasks ?? []).filter(t => t.code).map(t => [t.code!, t.name ?? t.code!]));
          this.cdr.detectChanges();
          this.submit();
        },
        error: () => { this.cdr.detectChanges(); this.submit(); },
      });
  }

  taskName(code: string | null | undefined): string {
    if (!code) return '';
    return this.taskMap.get(code) ?? code;
  }

  submit(): void {
    this.loading = true;
    this.errorMsg = null;
    this.submitted = true;
    this.results = [];
    this.sortField = null;
    this.sortDir = 'asc';
    this.collapsedGroups.clear();
    this.cdr.detectChanges();
    this.reportService.getOrdersInProgress(this.buildRequest())
      .pipe(finalize(() => { this.loading = false; this.cdr.detectChanges(); }))
      .subscribe({
        next: (data) => {
          this.results = data ?? [];
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.errorMsg = err?.message ?? 'An error occurred.';
          this.cdr.detectChanges();
        },
      });
  }

  logout(): void {
    this.session.clearSession();
    this.router.navigate(['/login']);
  }

  openPatientDetail(patientId: string | undefined): void {
    if (!patientId) return;
    this.selectedPatientId = patientId;
    this.showPatientDetail = true;
    this.cdr.detectChanges();
  }

  closePatientDetail(): void {
    this.showPatientDetail = false;
    this.selectedPatientId = null;
    this.cdr.detectChanges();
  }

  onPatientDetailSaved(): void {
    this.closePatientDetail();
  }

  get totalBalance(): number {
    return this.results.reduce((sum, r) => sum + (r.totalBalance ?? 0), 0);
  }

  get totalAmountBilled(): number {
    return this.results.reduce((sum, r) => sum + (r.totalAmountBilled ?? 0), 0);
  }

  get totalPayments(): number {
    return this.results.reduce((sum, r) => sum + (r.totalPayments ?? 0), 0);
  }
}
