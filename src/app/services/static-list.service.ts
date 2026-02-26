import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseModel, StaticList_Request, Tasks } from './models';
import config from '../config.json';

const BASE_URL = config.apiBaseUrl;

@Injectable({ providedIn: 'root' })
export class StaticListService {
  constructor(private http: HttpClient) {}

  getTaskName(request: StaticList_Request): Observable<string> {
    return this.http.post<string>(`${BASE_URL}/api/StaticList/GetTaskName`, request);
  }

  buildStaticList(): Observable<void> {
    return this.http.post<void>(`${BASE_URL}/api/StaticList/BuildStaticList`, {});
  }

  getId(request: StaticList_Request): Observable<number> {
    return this.http.post<number>(`${BASE_URL}/api/StaticList/GetId`, request);
  }

  getName(request: StaticList_Request): Observable<string> {
    return this.http.post<string>(`${BASE_URL}/api/StaticList/GetName`, request);
  }

  get(request: StaticList_Request): Observable<BaseModel> {
    return this.http.post<BaseModel>(`${BASE_URL}/api/StaticList/Get`, request);
  }

  getActive(request: StaticList_Request): Observable<BaseModel[]> {
    return this.http.post<BaseModel[]>(`${BASE_URL}/api/StaticList/GetActive`, request);
  }

  getAllTasks(): Observable<Tasks[]> {
    return this.http.get<Tasks[]>(`${BASE_URL}/api/StaticList/GetAllTasks`);
  }

  createAllTaskFolders(request: StaticList_Request): Observable<void> {
    return this.http.post<void>(`${BASE_URL}/api/StaticList/CreateAllTaskFolders`, request);
  }

  getTaskDefaultAttachFolder(request: StaticList_Request): Observable<string> {
    return this.http.post<string>(`${BASE_URL}/api/StaticList/GetTaskDefaultAttachFolder`, request);
  }

  getDefaultStepsForTask(request: StaticList_Request): Observable<Tasks> {
    return this.http.post<Tasks>(`${BASE_URL}/api/StaticList/GetDefaultStepsForTask`, request);
  }

  getFees(request: StaticList_Request): Observable<BaseModel[]> {
    return this.http.post<BaseModel[]>(`${BASE_URL}/api/StaticList/GetFees`, request);
  }

  getPermission(request: StaticList_Request): Observable<BaseModel> {
    return this.http.post<BaseModel>(`${BASE_URL}/api/StaticList/GetPermission`, request);
  }
}
