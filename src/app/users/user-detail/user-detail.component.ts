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

import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UsersService } from '../../services/users.service';
import { ClientService } from '../../services/client.service';
import { StaticListService } from '../../services/static-list.service';
import { User, ClientModel, BaseModel } from '../../services/models';
import { E_UserAccess, E_ListName } from '../../services/enum';

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

  clients: ClientModel[] = [];
  userTypeOptions: BaseModel[] = [];

  get isNew(): boolean { return this.userId == null; }

  constructor(
    private usersService: UsersService,
    private clientService: ClientService,
    private staticListService: StaticListService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loading = true;
    const user$ = this.isNew
      ? of<User>({ isActive: true, type: E_UserAccess.LimitedAccess, clientIds: [] })
      : this.usersService.getById({ id: this.userId! }).pipe(catchError(() => of<User>({})));

    forkJoin({
      user: user$,
      clients: this.clientService.getAll().pipe(catchError(() => of<ClientModel[]>([]))),
      userTypes: this.staticListService.getActive({ listName: E_ListName.UserTypes }).pipe(catchError(() => of<BaseModel[]>([]))),
    })
      .pipe(finalize(() => { this.loading = false; this.cdr.markForCheck(); }))
      .subscribe({
        next: ({ user, clients, userTypes }) => {
          this.user = user ?? {};
          this.user.clientIds = (this.user.clientIds ?? []).map(Number).filter(id => id > 0);
          this.clients = clients;
          this.userTypeOptions = userTypes;
          this.cdr.markForCheck();
        },
        error: (err) => { this.errorMsg = err?.message ?? 'Failed to load data.'; this.cdr.markForCheck(); },
      });
  }

  isClientSelected(clientId: number): boolean {
    return (this.user?.clientIds ?? []).map(Number).includes(Number(clientId));
  }

  toggleClient(clientId: number): void {
    if (!this.user) return;
    if (!this.user.clientIds) this.user.clientIds = [];
    const id = Number(clientId);
    const idx = this.user.clientIds.map(Number).indexOf(id);
    if (idx === -1) {
      this.user.clientIds = [...this.user.clientIds, id];
    } else {
      this.user.clientIds = this.user.clientIds.filter(c => Number(c) !== id);
    }
    this.cdr.markForCheck();
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
