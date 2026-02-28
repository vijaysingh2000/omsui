import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';

import { UsersService } from '../services/users.service';
import { User, BaseModel } from '../services/models';
import { E_ListName } from '../services/enum';
import { StaticListService } from '../services/static-list.service';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { UserDetailComponent } from './user-detail/user-detail.component';

@Component({
  selector: 'app-users',
  imports: [CommonModule, FormsModule, SidebarComponent, UserDetailComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  loading = false;
  errorMsg: string | null = null;
  searchText = '';

  selectedUserId: number | null = null;
  showDetail = false;

  userTypeMap: Record<number, string> = {};

  constructor(
    private usersService: UsersService,
    private staticListService: StaticListService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.staticListService.getActive({ listName: E_ListName.UserTypes })
      .subscribe({
        next: (items: BaseModel[]) => {
          this.userTypeMap = Object.fromEntries((items ?? []).filter(i => i.id != null).map(i => [i.id!, i.name ?? String(i.id)]));
          this.cdr.markForCheck();
        },
      });
    this.load();
  }

  load(): void {
    this.loading = true;
    this.errorMsg = null;
    this.cdr.markForCheck();
    this.usersService.getAll()
      .pipe(finalize(() => { this.loading = false; this.cdr.markForCheck(); }))
      .subscribe({
        next: (data) => { this.users = data ?? []; this.cdr.markForCheck(); },
        error: (err) => { this.errorMsg = err?.message ?? 'Failed to load users.'; this.cdr.markForCheck(); },
      });
  }

  get filtered(): User[] {
    const q = this.searchText.trim().toLowerCase();
    if (!q) return this.users;
    return this.users.filter(u =>
      (u.firstName ?? '').toLowerCase().includes(q) ||
      (u.lastName ?? '').toLowerCase().includes(q) ||
      (u.email ?? '').toLowerCase().includes(q) ||
      (u.loginId ?? '').toLowerCase().includes(q)
    );
  }

  fullName(u: User): string {
    return [u.firstName, u.lastName].filter(Boolean).join(' ') || '—';
  }

  userTypeLabel(type: number | undefined): string {
    return type != null ? (this.userTypeMap[type] ?? `Type ${type}`) : '—';
  }

  openNew(): void {
    this.selectedUserId = null;
    this.showDetail = true;
    this.cdr.markForCheck();
  }

  openDetail(id: number | undefined): void {
    if (id == null) return;
    this.selectedUserId = id;
    this.showDetail = true;
    this.cdr.markForCheck();
  }

  closeDetail(): void {
    this.showDetail = false;
    this.selectedUserId = null;
    this.cdr.markForCheck();
  }

  onDetailSaved(): void {
    this.closeDetail();
    this.load();
  }
}
