import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { SessionService } from '../services/session.service';
import { SidebarComponent } from '../sidebar/sidebar.component';

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
  ) {}

  goBack(): void { this.location.back(); }

  logout(): void {
    this.session.clearSession();
    this.router.navigate(['/login']);
  }
}

