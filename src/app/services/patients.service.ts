import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Patient, Patients_Request } from './models';
import { SessionService } from './session.service';
import config from '../config.json';

const BASE_URL = config.apiBaseUrl;

@Injectable({ providedIn: 'root' })
export class PatientsService {
  constructor(private http: HttpClient, private session: SessionService) {}

  getByMRN(request: Patients_Request): Observable<Patient> {
    return this.http.post<Patient>(`${BASE_URL}/api/Patients/GetByMRN`, this.session.withSession(request));
  }

  getById(request: Patients_Request): Observable<Patient> {
    return this.http.post<Patient>(`${BASE_URL}/api/Patients/GetById`, this.session.withSession(request));
  }

  getList(request: Patients_Request = {}): Observable<Patient[]> {
    return this.http.post<Patient[]>(`${BASE_URL}/api/Patients/GetList`, this.session.withSession(request));
  }

  addOrUpdate(request: Patients_Request): Observable<Patient> {
    return this.http.post<Patient>(`${BASE_URL}/api/Patients/AddOrUpdate`, this.session.withSession(request));
  }

  delete(request: Patients_Request): Observable<void> {
    return this.http.delete<void>(`${BASE_URL}/api/Patients/Delete`, { body: this.session.withSession(request) });
  }
}
