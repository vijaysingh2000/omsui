import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { catchError, of } from 'rxjs';
import { SidebarService } from '../services/sidebar.service';
import { SessionService } from '../services/session.service';
import { AuthService } from '../services/auth.service';
import { UsersService } from '../services/users.service';
import { StaticListService } from '../services/static-list.service';
import { E_ListName } from '../services/enum';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent implements OnInit, OnDestroy {
  collapsed = false;
  private sub!: Subscription;

  userName = '';
  userInitials = '';
  userTypeName = '';

  constructor(
    public sidebarService: SidebarService,
    private session: SessionService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    private usersService: UsersService,
    private staticListService: StaticListService,
  ) {}

  ngOnInit(): void {
    this.sub = this.sidebarService.collapsed$.subscribe(v => {
      this.collapsed = v;
      document.body.classList.toggle('sidebar-collapsed', v);
      this.cdr.detectChanges();
    });
    this.loadUser();
  }

  private loadUser(): void {
    const uid = this.session.userId;
    if (!uid) return;
    this.usersService.getById({ id: uid })
      .pipe(catchError(() => of(null)))
      .subscribe(user => {
        if (!user) return;
        const first = user.firstName ?? '';
        const last  = user.lastName  ?? '';
        this.userName    = [first, last].filter(Boolean).join(' ') || user.loginId || 'User';
        this.userInitials = ((first[0] ?? '') + (last[0] ?? '')).toUpperCase() || (user.loginId?.[0]?.toUpperCase() ?? '?');
        const typeId = user.type;
        if (typeId != null) {
          this.staticListService.getActive({ listName: E_ListName.UserTypes })
            .pipe(catchError(() => of([])))
            .subscribe(types => {
              const match = types.find((t: any) => t.id === typeId);
              this.userTypeName = match?.name ?? '';
              this.cdr.detectChanges();
            });
        }
        this.cdr.detectChanges();
      });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  toggle(): void {
    this.sidebarService.toggle();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
