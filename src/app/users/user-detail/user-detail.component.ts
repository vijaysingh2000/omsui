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

import { UsersService } from '../../services/users.service';
import { User } from '../../services/models';
import { E_UserAccess } from '../../services/enum';

@Component({
  selector: 'app-user-detail',
  imports: [CommonModule, FormsModule],
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDetailComponent implements OnInit {
  @Input() userId: number | null = null;
  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  user: User | null = null;
  loading = false;
  saving = false;
  errorMsg: string | null = null;
  successMsg: string | null = null;

  get isNew(): boolean { return this.userId == null; }

  readonly userTypeOptions = [
    { value: E_UserAccess.FullAccess,    label: 'Full Access' },
    { value: E_UserAccess.LimitedAccess, label: 'Limited Access' },
    { value: E_UserAccess.NoAccess,      label: 'No Access' },
  ];

  constructor(
    private usersService: UsersService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    if (this.isNew) {
      this.user = { isActive: true, type: E_UserAccess.LimitedAccess };
    } else {
      this.loadUser();
    }
  }

  loadUser(): void {
    this.loading = true;
    this.errorMsg = null;
    this.usersService.getById({ id: this.userId! })
      .pipe(finalize(() => { this.loading = false; this.cdr.markForCheck(); }))
      .subscribe({
        next: (data) => { this.user = data ?? {}; this.cdr.markForCheck(); },
        error: (err) => { this.errorMsg = err?.message ?? 'Failed to load user.'; this.cdr.markForCheck(); },
      });
  }

  save(): void {
    if (!this.user) return;
    this.saving = true;
    this.errorMsg = null;
    this.successMsg = null;

    const call$ = this.isNew
      ? this.usersService.add({ model: this.user })
      : this.usersService.update({ id: this.userId!, model: this.user });

    call$
      .pipe(finalize(() => { this.saving = false; this.cdr.markForCheck(); }))
      .subscribe({
        next: () => {
          this.successMsg = this.isNew ? 'User created successfully.' : 'User saved successfully.';
          this.cdr.markForCheck();
          this.saved.emit();
        },
        error: (err) => { this.errorMsg = err?.message ?? 'Failed to save user.'; this.cdr.markForCheck(); },
      });
  }

  close(): void { this.closed.emit(); }
}
