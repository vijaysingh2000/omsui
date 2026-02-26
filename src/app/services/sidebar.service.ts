import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SidebarService {
  private _collapsed$ = new BehaviorSubject<boolean>(false);
  readonly collapsed$ = this._collapsed$.asObservable();

  get collapsed(): boolean { return this._collapsed$.value; }

  toggle(): void { this._collapsed$.next(!this._collapsed$.value); }
  expand(): void  { this._collapsed$.next(false); }
  collapse(): void { this._collapsed$.next(true); }
}
