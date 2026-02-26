import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UsersService } from '../services/api.service';
import { SessionService } from '../services/session.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';

  constructor(private usersService: UsersService, private router: Router, private sessionService: SessionService) {}

  onSubmit(): void {
    this.errorMessage = '';
    this.usersService.getByLoginId({ loginId: this.username }).subscribe({
      next: user => {
        if (user && user.password === this.password) {
          this.sessionService.setUserId(user.id);
          this.sessionService.setUserType(user.type);
          this.sessionService.setClientId(user.clientIds?.[0]);
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage = 'Invalid username or password.';
        }
      },
      error: () => {
        this.errorMessage = 'Login failed. Please try again.';
      }
    });
  }
}