// src/app/core/services/tasks.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { PagedResult, TaskItem } from '../models/task.model';

@Injectable({ providedIn: 'root' })
export class TasksService {
  private baseUrl = `${environment.apiBaseUrl}/tasks`;
  constructor(private http: HttpClient) {}
  
  
  // API returns a plain array of TaskItem
  getAll(query: { page?: number; pageSize?: number; status?: string; priority?: string; search?: string }): Observable<PagedResult<TaskItem>> {
    let params = new HttpParams();
    if (query.page) params = params.set('page', query.page);
    if (query.pageSize) params = params.set('pageSize', query.pageSize);
    if (query.status) params = params.set('status', query.status);
    if (query.priority) params = params.set('priority', query.priority);
    if (query.search) params = params.set('search', query.search);

    return this.http.get<PagedResult<TaskItem>>(this.baseUrl, { params });
  }

  getById(id: string): Observable<TaskItem> {
    return this.http.get<TaskItem>(`${this.baseUrl}/${id}`);
  }

  create(dto: Partial<TaskItem>): Observable<TaskItem> {
    return this.http.post<TaskItem>(this.baseUrl, dto);
  }

  update(id: string, dto: Partial<TaskItem>): Observable<TaskItem> {
    return this.http.put<TaskItem>(`${this.baseUrl}/${id}`, dto);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
