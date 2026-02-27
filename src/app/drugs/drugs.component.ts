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
import { DrugDetailComponent } from './drug-detail/drug-detail.component';

@Component({
  selector: 'app-drugs',
  imports: [CommonModule, FormsModule, SidebarComponent, DrugDetailComponent],
  templateUrl: './drugs.component.html',
  styleUrl: './drugs.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrugsComponent implements OnInit {
  drugs: BaseModel[] = [];
  loading = false;
  errorMsg: string | null = null;
  searchText = '';

  selectedDrugId: number | null = null;
  showDetail = false;

  constructor(
    private listService: ListService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.errorMsg = null;
    this.cdr.markForCheck();
    this.listService.getAll({ listName: E_ListName.Drugs })
      .pipe(finalize(() => { this.loading = false; this.cdr.markForCheck(); }))
      .subscribe({
        next: (data) => { this.drugs = data ?? []; this.cdr.markForCheck(); },
        error: (err) => { this.errorMsg = err?.message ?? 'Failed to load drugs.'; this.cdr.markForCheck(); },
      });
  }

  get filtered(): BaseModel[] {
    const q = this.searchText.trim().toLowerCase();
    if (!q) return this.drugs;
    return this.drugs.filter(d =>
      (d.name ?? '').toLowerCase().includes(q) ||
      (d.description ?? '').toLowerCase().includes(q)
    );
  }

  openNew(): void {
    this.selectedDrugId = null;
    this.showDetail = true;
    this.cdr.markForCheck();
  }

  openDetail(id: number | undefined): void {
    if (id == null) return;
    this.selectedDrugId = id;
    this.showDetail = true;
    this.cdr.markForCheck();
  }

  closeDetail(): void {
    this.showDetail = false;
    this.selectedDrugId = null;
    this.cdr.markForCheck();
  }

  onDetailSaved(): void {
    this.closeDetail();
    this.load();
  }
}
