import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Patient, Patients_Request } from './models';
import config from '../config.json';

const BASE_URL = config.apiBaseUrl;

@Injectable({ providedIn: 'root' })
export class PatientsService {
  constructor(private http: HttpClient) {}

  getByMRN(request: Patients_Request): Observable<Patient> {
    return this.http.post<Patient>(`${BASE_URL}/api/Patients/GetByMRN`, request);
  }

  getById(request: Patients_Request): Observable<Patient> {
    return this.http.post<Patient>(`${BASE_URL}/api/Patients/GetById`, request);
  }

  getList(): Observable<Patient[]> {
    return this.http.get<Patient[]>(`${BASE_URL}/api/Patients/GetList`);
  }

  addOrUpdate(request: Patients_Request): Observable<Patient> {
    return this.http.post<Patient>(`${BASE_URL}/api/Patients/AddOrUpdate`, request);
  }

  delete(request: Patients_Request): Observable<void> {
    return this.http.delete<void>(`${BASE_URL}/api/Patients/Delete`, { body: request });
  }
}
