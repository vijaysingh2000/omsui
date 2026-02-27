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
  selector: 'app-provider-detail',
  imports: [CommonModule, FormsModule],
  templateUrl: './provider-detail.component.html',
  styleUrl: './provider-detail.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProviderDetailComponent implements OnInit {
  @Input() providerId: number | null = null;
  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  provider: BaseModel | null = null;
  loading = false;
  saving = false;
  errorMsg: string | null = null;
  successMsg: string | null = null;

  get isNew(): boolean { return this.providerId == null; }

  constructor(private listService: ListService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    if (this.isNew) { this.provider = { active: true }; } else { this.loadItem(); }
  }

  loadItem(): void {
    this.loading = true;
    this.listService.get({ listName: E_ListName.Providers, id: this.providerId! })
      .pipe(finalize(() => { this.loading = false; this.cdr.markForCheck(); }))
      .subscribe({
        next: (data) => { this.provider = data ?? {}; this.cdr.markForCheck(); },
        error: (err) => { this.errorMsg = err?.message ?? 'Failed to load provider.'; this.cdr.markForCheck(); },
      });
  }

  save(): void {
    if (!this.provider) return;
    this.saving = true;
    this.errorMsg = null;
    this.successMsg = null;

    const req = this.isNew
      ? { listName: E_ListName.Providers, models: [this.provider] }
      : { listName: E_ListName.Providers, id: this.providerId!, models: [this.provider] };

    this.listService.addOrUpdate(req)
      .pipe(finalize(() => { this.saving = false; this.cdr.markForCheck(); }))
      .subscribe({
        next: () => { this.successMsg = this.isNew ? 'Provider created.' : 'Provider saved.'; this.cdr.markForCheck(); this.saved.emit(); },
        error: (err) => { this.errorMsg = err?.message ?? 'Failed to save provider.'; this.cdr.markForCheck(); },
      });
  }

  close(): void { this.closed.emit(); }
}
