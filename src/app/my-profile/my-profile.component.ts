import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { UsersService } from '../services/users.service';
import { SessionService } from '../services/session.service';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { StaticListService } from '../services/static-list.service';
import { ClientService } from '../services/client.service';
import { User, BaseModel, ClientModel } from '../services/models';
import { E_ListName, E_UserAccess } from '../services/enum';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive, SidebarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.css'
})
export class MyProfileComponent implements OnInit {
  loading = false;
  saving = false;
  errorMsg: string | null = null;
  successMsg: string | null = null;

  loginId = '';
  firstName = '';
  lastName = '';
  email = '';
  password = '';
  confirmPassword = '';

  userType: number | undefined = undefined;
  isActive = false;
  clientIds: number[] = [];

  userTypeOptions: BaseModel[] = [];
  clients: ClientModel[] = [];

  get userTypeName(): string {
    const found = this.userTypeOptions.find(o => o.id === this.userType);
    return found?.name ?? (this.userType != null ? String(this.userType) : '—');
  }

  get isAdmin(): boolean {
    return this.session.userType === E_UserAccess.FullAccess;
  }

  get assignedClients(): ClientModel[] {
    return this.clients.filter(c => c.id != null && this.clientIds.includes(c.id));
  }

  get passwordMismatch(): boolean {
    return this.password !== this.confirmPassword;
  }

  constructor(
    private usersService: UsersService,
    private session: SessionService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private staticListService: StaticListService,
    private clientService: ClientService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.staticListService.getActive({ listName: E_ListName.UserTypes })
      .subscribe({ next: (data) => { this.userTypeOptions = data ?? []; this.cdr.detectChanges(); } });
    this.clientService.getAll()
      .subscribe({ next: (data) => { this.clients = data ?? []; this.cdr.detectChanges(); } });
    this.loadProfile();
  }

  loadProfile(): void {
    const uid = this.session.userId;
    if (!uid) return;

    this.loading = true;
    this.cdr.detectChanges();

    this.usersService.getById({ id: uid })
      .pipe(finalize(() => { this.loading = false; this.cdr.detectChanges(); }))
      .subscribe({
        next: (user: User) => {
          this.loginId      = user.loginId    ?? '';
          this.firstName    = user.firstName  ?? '';
          this.lastName     = user.lastName   ?? '';
          this.email        = user.email      ?? '';
          this.userType     = user.type;
          this.isActive     = user.isActive   ?? false;
          this.clientIds    = user.clientIds  ?? [];
          this.password     = '';
          this.confirmPassword = '';
          this.cdr.detectChanges();
        },
        error: () => {
          this.errorMsg = 'Failed to load profile.';
          this.cdr.detectChanges();
        }
      });
  }

  save(): void {
    if (this.passwordMismatch) return;

    this.saving = true;
    this.errorMsg = null;
    this.successMsg = null;
    this.cdr.detectChanges();

    const model: User = {
      id:        this.session.userId,
      loginId:   this.loginId,
      firstName: this.firstName,
      lastName:  this.lastName,
      email:     this.email,
      type:      this.userType,
      isActive:  this.isActive,
      clientIds: this.clientIds,
      ...(this.password ? { password: this.password } : {})
    };

    this.usersService.update({ id: this.session.userId, model })
      .pipe(finalize(() => { this.saving = false; this.cdr.detectChanges(); }))
      .subscribe({
        next: () => {
          this.successMsg = 'Profile saved successfully.';
          this.password = '';
          this.confirmPassword = '';
          this.cdr.detectChanges();
        },
        error: () => {
          this.errorMsg = 'Failed to save profile.';
          this.cdr.detectChanges();
        }
      });
  }

  close(): void {
    this.router.navigate(['/dashboard']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
