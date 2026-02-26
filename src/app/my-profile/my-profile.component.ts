import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { UsersService } from '../services/users.service';
import { SessionService } from '../services/session.service';
import { User } from '../services/models';

@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive],
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

  get passwordMismatch(): boolean {
    return this.password !== this.confirmPassword;
  }

  constructor(
    private usersService: UsersService,
    private session: SessionService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
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
    this.session.clearSession();
    this.router.navigate(['/login']);
  }
}
