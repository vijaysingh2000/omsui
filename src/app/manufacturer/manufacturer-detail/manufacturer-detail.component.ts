import {
  Component, Input, Output, EventEmitter, OnInit,
  ChangeDetectionStrategy, ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';

import { ListService } from '../../services/list.service';
import { BaseModel } from '../../services/models';
import { E_ListName } from '../../services/enum';

@Component({
  selector: 'app-manufacturer-detail',
  imports: [CommonModule, FormsModule],
  templateUrl: './manufacturer-detail.component.html',
  styleUrl: './manufacturer-detail.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManufacturerDetailComponent implements OnInit {
  @Input() manufacturerId: number | null = null;
  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  manufacturer: BaseModel | null = null;
  loading = false;
  saving = false;
  errorMsg: string | null = null;
  successMsg: string | null = null;

  get isNew(): boolean { return this.manufacturerId == null; }

  constructor(private listService: ListService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    if (this.isNew) { this.manufacturer = { active: true }; } else { this.loadItem(); }
  }

  loadItem(): void {
    this.loading = true;
    this.listService.get({ listName: E_ListName.Manufacturers, id: this.manufacturerId! })
      .pipe(finalize(() => { this.loading = false; this.cdr.markForCheck(); }))
      .subscribe({
        next: (data) => { this.manufacturer = data ?? {}; this.cdr.markForCheck(); },
        error: (err) => { this.errorMsg = err?.message ?? 'Failed to load manufacturer.'; this.cdr.markForCheck(); },
      });
  }

  save(): void {
    if (!this.manufacturer) return;
    this.saving = true;
    this.errorMsg = null;
    this.successMsg = null;

    const req = this.isNew
      ? { listName: E_ListName.Manufacturers, models: [this.manufacturer] }
      : { listName: E_ListName.Manufacturers, id: this.manufacturerId!, models: [this.manufacturer] };

    this.listService.addOrUpdate(req)
      .pipe(finalize(() => { this.saving = false; this.cdr.markForCheck(); }))
      .subscribe({
        next: () => { this.successMsg = this.isNew ? 'Manufacturer created.' : 'Manufacturer saved.'; this.cdr.markForCheck(); this.saved.emit(); },
        error: (err) => { this.errorMsg = err?.message ?? 'Failed to save manufacturer.'; this.cdr.markForCheck(); },
      });
  }

  close(): void { this.closed.emit(); }
}
