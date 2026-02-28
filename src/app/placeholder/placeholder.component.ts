import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { SessionService } from '../services/session.service';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-placeholder',
  imports: [RouterLink, RouterLinkActive, SidebarComponent],
  templateUrl: './placeholder.component.html',
  styleUrl: './placeholder.component.css',
})
export class PlaceholderComponent {
  constructor(
    private location: Location,
    private session: SessionService,
    private router: Router,
    private authService: AuthService,
  ) {}

  goBack(): void { this.location.back(); }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

