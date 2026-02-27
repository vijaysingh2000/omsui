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

import { ClientService } from '../../services/client.service';
import { ClientModel } from '../../services/models';

@Component({
  selector: 'app-client-detail',
  imports: [CommonModule, FormsModule],
  templateUrl: './client-detail.component.html',
  styleUrl: './client-detail.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientDetailComponent implements OnInit {
  @Input() clientId: number | null = null;
  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  client: ClientModel | null = null;
  loading = false;
  saving = false;
  errorMsg: string | null = null;
  successMsg: string | null = null;

  get isNew(): boolean { return this.clientId == null; }

  constructor(
    private clientService: ClientService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    if (this.isNew) {
      this.client = { active: true };
    } else {
      this.loadClient();
    }
  }

  loadClient(): void {
    this.loading = true;
    this.errorMsg = null;

    this.clientService.get({ id: this.clientId! })
      .pipe(finalize(() => { this.loading = false; this.cdr.markForCheck(); }))
      .subscribe({
        next: (data) => { this.client = data ?? {}; },
        error: (err) => { this.errorMsg = err?.message ?? 'Failed to load client.'; },
      });
  }

  save(): void {
    if (!this.client) return;
    this.saving = true;
    this.errorMsg = null;
    this.successMsg = null;

    const request = this.isNew
      ? { models: [this.client] }
      : { id: this.clientId!, models: [this.client] };

    this.clientService.addOrUpdate(request)
      .pipe(finalize(() => { this.saving = false; this.cdr.markForCheck(); }))
      .subscribe({
        next: () => {
          this.successMsg = this.isNew ? 'Client created successfully.' : 'Client saved successfully.';
          this.saved.emit();
        },
        error: (err) => { this.errorMsg = err?.message ?? 'Failed to save client.'; },
      });
  }

  close(): void {
    this.closed.emit();
  }
}
