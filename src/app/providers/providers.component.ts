import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';

import { ListService } from '../services/list.service';
import { BaseModel } from '../services/models';
import { E_ListName } from '../services/enum';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ProviderDetailComponent } from './provider-detail/provider-detail.component';

@Component({
  selector: 'app-providers',
  imports: [CommonModule, FormsModule, SidebarComponent, ProviderDetailComponent],
  templateUrl: './providers.component.html',
  styleUrl: './providers.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProvidersComponent implements OnInit {
  providers: BaseModel[] = [];
  loading = false;
  errorMsg: string | null = null;
  searchText = '';

  selectedId: number | null = null;
  showDetail = false;

  constructor(
    private listService: ListService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.errorMsg = null;
    this.cdr.markForCheck();
    this.listService.getAll({ listName: E_ListName.Providers })
      .pipe(finalize(() => { this.loading = false; this.cdr.markForCheck(); }))
      .subscribe({
        next: (data) => { this.providers = data ?? []; this.cdr.markForCheck(); },
        error: (err) => { this.errorMsg = err?.message ?? 'Failed to load providers.'; this.cdr.markForCheck(); },
      });
  }

  get filtered(): BaseModel[] {
    const q = this.searchText.trim().toLowerCase();
    if (!q) return this.providers;
    return this.providers.filter(p =>
      (p.name ?? '').toLowerCase().includes(q) ||
      (p.description ?? '').toLowerCase().includes(q)
    );
  }

  openNew(): void { this.selectedId = null; this.showDetail = true; this.cdr.markForCheck(); }

  openDetail(id: number | undefined): void {
    if (id == null) return;
    this.selectedId = id;
    this.showDetail = true;
    this.cdr.markForCheck();
  }

  closeDetail(): void { this.showDetail = false; this.selectedId = null; this.cdr.markForCheck(); }

  onDetailSaved(): void { this.closeDetail(); this.load(); }
}
