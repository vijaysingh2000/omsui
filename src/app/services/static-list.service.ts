import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseModel, StaticList_Request, Tasks } from './models';
import { SessionService } from './session.service';
import config from '../config.json';

const BASE_URL = config.apiBaseUrl;

@Injectable({ providedIn: 'root' })
export class StaticListService {
  constructor(private http: HttpClient, private session: SessionService) {}

  getTaskName(request: StaticList_Request): Observable<string> {
    return this.http.post<string>(`${BASE_URL}/api/StaticList/GetTaskName`, this.session.withSession(request));
  }

  buildStaticList(): Observable<void> {
    return this.http.post<void>(`${BASE_URL}/api/StaticList/BuildStaticList`, this.session.withSession({}));
  }

  getId(request: StaticList_Request): Observable<number> {
    return this.http.post<number>(`${BASE_URL}/api/StaticList/GetId`, this.session.withSession(request));
  }

  getName(request: StaticList_Request): Observable<string> {
    return this.http.post<string>(`${BASE_URL}/api/StaticList/GetName`, this.session.withSession(request));
  }

  get(request: StaticList_Request): Observable<BaseModel> {
    return this.http.post<BaseModel>(`${BASE_URL}/api/StaticList/Get`, this.session.withSession(request));
  }

  getActive(request: StaticList_Request): Observable<BaseModel[]> {
    return this.http.post<BaseModel[]>(`${BASE_URL}/api/StaticList/GetActive`, this.session.withSession(request));
  }

  getAllTasks(): Observable<Tasks[]> {
    return this.http.get<Tasks[]>(`${BASE_URL}/api/StaticList/GetAllTasks`);
  }

  createAllTaskFolders(request: StaticList_Request): Observable<void> {
    return this.http.post<void>(`${BASE_URL}/api/StaticList/CreateAllTaskFolders`, this.session.withSession(request));
  }

  getTaskDefaultAttachFolder(request: StaticList_Request): Observable<string> {
    return this.http.post<string>(`${BASE_URL}/api/StaticList/GetTaskDefaultAttachFolder`, this.session.withSession(request));
  }

  getDefaultStepsForTask(request: StaticList_Request): Observable<Tasks> {
    return this.http.post<Tasks>(`${BASE_URL}/api/StaticList/GetDefaultStepsForTask`, this.session.withSession(request));
  }

  getFees(request: StaticList_Request): Observable<BaseModel[]> {
    return this.http.post<BaseModel[]>(`${BASE_URL}/api/StaticList/GetFees`, this.session.withSession(request));
  }

  getPermission(request: StaticList_Request): Observable<BaseModel> {
    return this.http.post<BaseModel>(`${BASE_URL}/api/StaticList/GetPermission`, this.session.withSession(request));
  }
}
