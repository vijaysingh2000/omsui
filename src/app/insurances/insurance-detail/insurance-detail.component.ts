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
  selector: 'app-insurance-detail',
  imports: [CommonModule, FormsModule],
  templateUrl: './insurance-detail.component.html',
  styleUrl: './insurance-detail.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InsuranceDetailComponent implements OnInit {
  @Input() insuranceId: number | null = null;
  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  insurance: BaseModel | null = null;
  loading = false;
  saving = false;
  errorMsg: string | null = null;
  successMsg: string | null = null;

  get isNew(): boolean { return this.insuranceId == null; }

  constructor(private listService: ListService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    if (this.isNew) { this.insurance = { active: true }; } else { this.loadItem(); }
  }

  loadItem(): void {
    this.loading = true;
    this.listService.get({ listName: E_ListName.Insurances, id: this.insuranceId! })
      .pipe(finalize(() => { this.loading = false; this.cdr.markForCheck(); }))
      .subscribe({
        next: (data) => { this.insurance = data ?? {}; this.cdr.markForCheck(); },
        error: (err) => { this.errorMsg = err?.message ?? 'Failed to load insurance.'; this.cdr.markForCheck(); },
      });
  }

  save(): void {
    if (!this.insurance) return;
    this.saving = true;
    this.errorMsg = null;
    this.successMsg = null;

    const req = this.isNew
      ? { listName: E_ListName.Insurances, models: [this.insurance] }
      : { listName: E_ListName.Insurances, id: this.insuranceId!, models: [this.insurance] };

    this.listService.addOrUpdate(req)
      .pipe(finalize(() => { this.saving = false; this.cdr.markForCheck(); }))
      .subscribe({
        next: () => { this.successMsg = this.isNew ? 'Insurance created.' : 'Insurance saved.'; this.cdr.markForCheck(); this.saved.emit(); },
        error: (err) => { this.errorMsg = err?.message ?? 'Failed to save insurance.'; this.cdr.markForCheck(); },
      });
  }

  close(): void { this.closed.emit(); }
}
