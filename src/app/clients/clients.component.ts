import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';

import { ClientService } from '../services/client.service';
import { ClientModel } from '../services/models';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ClientDetailComponent } from './client-detail/client-detail.component';

@Component({
  selector: 'app-clients',
  imports: [CommonModule, FormsModule, SidebarComponent, ClientDetailComponent],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientsComponent implements OnInit {
  clients: ClientModel[] = [];
  loading = false;
  errorMsg: string | null = null;
  searchText = '';

  selectedClientId: number | null = null;
  showDetail = false;

  constructor(
    private clientService: ClientService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.errorMsg = null;
    this.cdr.markForCheck();
    this.clientService.getAll()
      .pipe(finalize(() => { this.loading = false; this.cdr.markForCheck(); }))
      .subscribe({
        next: (data) => { this.clients = data ?? []; this.cdr.markForCheck(); },
        error: (err) => { this.errorMsg = err?.message ?? 'Failed to load clients.'; this.cdr.markForCheck(); },
      });
  }

  get filtered(): ClientModel[] {
    const q = this.searchText.trim().toLowerCase();
    if (!q) return this.clients;
    return this.clients.filter(c =>
      (c.name ?? '').toLowerCase().includes(q) ||
      (c.contactPerson ?? '').toLowerCase().includes(q) ||
      (c.email ?? '').toLowerCase().includes(q) ||
      (c.phone ?? '').toLowerCase().includes(q) ||
      (c.city ?? '').toLowerCase().includes(q)
    );
  }

  openNewClient(): void {
    this.selectedClientId = null;
    this.showDetail = true;
    this.cdr.markForCheck();
  }

  openDetail(id: number | undefined): void {
    if (id == null) return;
    this.selectedClientId = id;
    this.showDetail = true;
    this.cdr.markForCheck();
  }

  closeDetail(): void {
    this.showDetail = false;
    this.selectedClientId = null;
    this.cdr.markForCheck();
  }

  onDetailSaved(): void {
    this.closeDetail();
    this.load();
  }
}
