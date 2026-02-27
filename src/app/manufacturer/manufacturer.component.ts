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
import { ManufacturerDetailComponent } from './manufacturer-detail/manufacturer-detail.component';

@Component({
  selector: 'app-manufacturer',
  imports: [CommonModule, FormsModule, SidebarComponent, ManufacturerDetailComponent],
  templateUrl: './manufacturer.component.html',
  styleUrl: './manufacturer.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManufacturerComponent implements OnInit {
  manufacturers: BaseModel[] = [];
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
    this.listService.getAll({ listName: E_ListName.Manufacturers })
      .pipe(finalize(() => { this.loading = false; this.cdr.markForCheck(); }))
      .subscribe({
        next: (data) => { this.manufacturers = data ?? []; this.cdr.markForCheck(); },
        error: (err) => { this.errorMsg = err?.message ?? 'Failed to load manufacturers.'; this.cdr.markForCheck(); },
      });
  }

  get filtered(): BaseModel[] {
    const q = this.searchText.trim().toLowerCase();
    if (!q) return this.manufacturers;
    return this.manufacturers.filter(m =>
      (m.name ?? '').toLowerCase().includes(q) ||
      (m.description ?? '').toLowerCase().includes(q)
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
