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

import { forkJoin } from 'rxjs';
import { PatientsService } from '../../services/patients.service';
import { ListService } from '../../services/list.service';
import { Patient, BaseModel } from '../../services/models';
import { E_ListName } from '../../services/enum';
import { GENDER_MAP } from '../patients.component';

@Component({
  selector: 'app-patient-detail',
  imports: [CommonModule, FormsModule],
  templateUrl: './patient-detail.component.html',
  styleUrl: './patient-detail.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PatientDetailComponent implements OnInit {
  @Input() patientId: string = '';
  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  patient: Patient | null = null;
  loading = false;
  saving = false;
  errorMsg: string | null = null;
  successMsg: string | null = null;

  insurances: BaseModel[] = [];
  insurancesLoading = false;

  readonly genderOptions = Object.entries(GENDER_MAP).map(([k, v]) => ({
    value: Number(k),
    label: v,
  }));

  readonly contactMethods = [
    { value: 0, label: 'None' },
    { value: 1, label: 'Phone' },
    { value: 2, label: 'Email' },
    { value: 3, label: 'Text' },
  ];

  readonly spaOptions = [
    { value: 0, label: 'Not Required' },
    { value: 1, label: 'Required' },
  ];

  constructor(
    private patientsService: PatientsService,
    private listService: ListService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {
    this.insurancesLoading = true;
    this.errorMsg = null;

    if (!this.patientId) {
      // New patient — only load the insurance list
      this.listService.getAll({ listName: E_ListName.Insurances })
        .pipe(finalize(() => { this.insurancesLoading = false; this.cdr.markForCheck(); }))
        .subscribe({
          next: (insurances) => {
            this.patient = {};
            this.insurances = insurances ?? [];
          },
          error: (err) => { this.errorMsg = err?.message ?? 'Failed to load insurance list.'; },
        });
      return;
    }

    this.loading = true;
    forkJoin({
      patient: this.patientsService.getById({ guid: this.patientId }),
      insurances: this.listService.getAll({ listName: E_ListName.Insurances }),
    })
      .pipe(finalize(() => {
        this.loading = false;
        this.insurancesLoading = false;
        this.cdr.markForCheck();
      }))
      .subscribe({
        next: ({ patient, insurances }) => {
          this.patient = { ...patient };
          this.insurances = insurances ?? [];
        },
        error: (err) => { this.errorMsg = err?.message ?? 'Failed to load patient details.'; },
      });
  }

  onInsuranceChange(id: number | undefined): void {
    if (!this.patient) return;
    const match = this.insurances.find(i => i.id === id);
    this.patient.insuranceName = match?.name ?? null;
  }

  onSecondaryInsuranceChange(id: number | undefined): void {
    if (!this.patient) return;
    const match = this.insurances.find(i => i.id === id);
    this.patient.secondaryInsuranceName = match?.name ?? null;
  }

  save(): void {
    if (!this.patient) return;
    this.saving = true;
    this.errorMsg = null;
    this.successMsg = null;
    this.patientsService.addOrUpdate({ models: [this.patient] })
      .pipe(finalize(() => { this.saving = false; this.cdr.markForCheck(); }))
      .subscribe({
        next: () => {
          this.successMsg = 'Patient saved successfully.';
          this.cdr.markForCheck();
          setTimeout(() => { this.saved.emit(); }, 800);
        },
        error: (err) => { this.errorMsg = err?.message ?? 'Failed to save patient.'; },
      });
  }

  close(): void {
    this.closed.emit();
  }

  formatDobForInput(dob: string | undefined): string {
    if (!dob) return '';
    const d = new Date(dob);
    if (isNaN(d.getTime())) return '';
    return d.toISOString().split('T')[0];
  }

  onDobChange(val: string): void {
    if (this.patient) {
      this.patient.dob = val ? new Date(val).toISOString() : undefined;
    }
  }

  onCcsghppDateChange(val: string): void {
    if (this.patient) {
      this.patient.ccsghppDate = val ? new Date(val).toISOString() : undefined;
    }
  }
}
