// src/app/core/services/tasks.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { PagedResult, TaskItem } from '../models/task.model';

@Injectable({ providedIn: 'root' })
export class TasksService {
  private baseUrl = `${environment.apiBaseUrl}/tasks`;
  constructor(private http: HttpClient) {}

  getAll(query: { page?: number; pageSize?: number; status?: string; priority?: string; search?: string }): Observable<ApiResponse<PagedResult<TaskItem>>> {
    let params = new HttpParams();
    if (query.page) params = params.set('page', query.page);
    if (query.pageSize) params = params.set('pageSize', query.pageSize);
    if (query.status) params = params.set('status', query.status);
    if (query.priority) params = params.set('priority', query.priority);
    if (query.search) params = params.set('search', query.search);

    return this.http.get<ApiResponse<PagedResult<TaskItem>>>(this.baseUrl, { params });
  }

  getById(id: string): Observable<ApiResponse<TaskItem>> {
    return this.http.get<ApiResponse<TaskItem>>(`${this.baseUrl}/${id}`);
  }

  create(dto: Partial<TaskItem>): Observable<ApiResponse<TaskItem>> {
    return this.http.post<ApiResponse<TaskItem>>(this.baseUrl, dto);
  }

  update(id: string, dto: Partial<TaskItem>): Observable<ApiResponse<object>> {
    return this.http.put<ApiResponse<object>>(`${this.baseUrl}/${id}`, dto);
  }

  delete(id: string): Observable<ApiResponse<object>> {
    return this.http.delete<ApiResponse<object>>(`${this.baseUrl}/${id}`);
  }
}
