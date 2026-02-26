import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {
  private redirectTimerId: ReturnType<typeof setTimeout> | null = null;

  constructor(private readonly router: Router) {}

  ngOnInit(): void {
    this.redirectTimerId = setTimeout(() => {
      this.router.navigateByUrl('/login');
    }, 3000);
  }

  ngOnDestroy(): void {
    if (this.redirectTimerId) {
      clearTimeout(this.redirectTimerId);
    }
  }
}
