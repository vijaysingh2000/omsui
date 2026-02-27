import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';

import { PatientsService } from '../services/patients.service';
import { Patient } from '../services/models';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { PatientDetailComponent } from './patient-detail/patient-detail.component';

export const GENDER_MAP: Record<number, string> = {
  0: 'Unknown',
  1: 'Male',
  2: 'Female',
  3: 'Other',
};

@Component({
  selector: 'app-patients',
  imports: [CommonModule, RouterLink, RouterLinkActive, FormsModule, SidebarComponent, PatientDetailComponent],
  templateUrl: './patients.component.html',
  styleUrl: './patients.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PatientsComponent implements OnInit {
  patients: Patient[] = [];
  loading = false;
  errorMsg: string | null = null;

  searchText = '';

  selectedPatientId: string | null = null;
  showDetail = false;

  readonly genderMap = GENDER_MAP;

  constructor(
    private patientsService: PatientsService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.errorMsg = null;
    this.patientsService.getList()
      .pipe(finalize(() => { this.loading = false; this.cdr.markForCheck(); }))
      .subscribe({
        next: (data) => { this.patients = data ?? []; },
        error: (err) => { this.errorMsg = err?.message ?? 'Failed to load patients.'; },
      });
  }

  get filtered(): Patient[] {
    const q = this.searchText.trim().toLowerCase();
    if (!q) return this.patients;
    return this.patients.filter(p =>
      [p.mrn, p.firstName, p.lastName, p.email, p.phone1]
        .some(v => v?.toLowerCase().includes(q))
    );
  }

  openDetail(patientId: string | undefined): void {
    if (!patientId) return;
    this.selectedPatientId = patientId;
    this.showDetail = true;
    this.cdr.markForCheck();
  }

  openNewPatient(): void {
    this.selectedPatientId = null;
    this.showDetail = true;
    this.cdr.markForCheck();
  }

  closeDetail(): void {
    this.showDetail = false;
    this.selectedPatientId = null;
    this.cdr.markForCheck();
  }

  onDetailSaved(): void {
    this.closeDetail();
    this.load();
  }

  formatDob(dob: string | undefined): string {
    if (!dob) return '—';
    const d = new Date(dob);
    return isNaN(d.getTime()) ? dob : d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
  }

  genderLabel(g: number | undefined): string {
    if (g == null) return '—';
    return this.genderMap[g] ?? `${g}`;
  }
}
