import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';

import { ListService } from '../../services/list.service';
import { BaseModel } from '../../services/models';
import { E_ListName } from '../../services/enum';

@Component({
  selector: 'app-drug-detail',
  imports: [CommonModule, FormsModule],
  templateUrl: './drug-detail.component.html',
  styleUrl: './drug-detail.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrugDetailComponent implements OnInit {
  @Input() drugId: number | null = null;
  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  drug: BaseModel | null = null;
  loading = false;
  saving = false;
  errorMsg: string | null = null;
  successMsg: string | null = null;

  get isNew(): boolean { return this.drugId == null; }

  constructor(
    private listService: ListService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    if (this.isNew) {
      this.drug = { active: true };
    } else {
      this.loadDrug();
    }
  }

  loadDrug(): void {
    this.loading = true;
    this.errorMsg = null;

    this.listService.get({ listName: E_ListName.Drugs, id: this.drugId! })
      .pipe(finalize(() => { this.loading = false; this.cdr.markForCheck(); }))
      .subscribe({
        next: (data) => { this.drug = data ?? {}; this.cdr.markForCheck(); },
        error: (err) => { this.errorMsg = err?.message ?? 'Failed to load drug.'; this.cdr.markForCheck(); },
      });
  }

  save(): void {
    if (!this.drug) return;
    this.saving = true;
    this.errorMsg = null;
    this.successMsg = null;

    const request = this.isNew
      ? { listName: E_ListName.Drugs, models: [this.drug] }
      : { listName: E_ListName.Drugs, id: this.drugId!, models: [this.drug] };

    this.listService.addOrUpdate(request)
      .pipe(finalize(() => { this.saving = false; this.cdr.markForCheck(); }))
      .subscribe({
        next: () => {
          this.successMsg = this.isNew ? 'Drug created successfully.' : 'Drug saved successfully.';
          this.cdr.markForCheck();
          this.saved.emit();
        },
        error: (err) => { this.errorMsg = err?.message ?? 'Failed to save drug.'; this.cdr.markForCheck(); },
      });
  }

  close(): void {
    this.closed.emit();
  }
}
