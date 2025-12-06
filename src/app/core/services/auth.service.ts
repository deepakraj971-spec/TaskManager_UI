import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';

@Injectable({ providedIn: 'root' })
export class AuthService {

  isAuthenticated = signal<boolean>(false);

  constructor(private http: HttpClient) {}

  login(credentials: { email: string; password: string }): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(
      `${environment.apiBaseUrl}/auth/login`,
      credentials,
      { withCredentials: true } 
    );
  }

  logout(): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(
      `${environment.apiBaseUrl}/auth/logout`,
      {},
      { withCredentials: true }
    );
  }

  checkSession(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${environment.apiBaseUrl}/auth/me`, { withCredentials: true });
  }

  updateAuthState(authenticated: boolean) {
    this.isAuthenticated.set(authenticated);
  }

  register(payload: { name: string; email: string; password: string }): Observable<ApiResponse<boolean>> {
    return this.http.post<ApiResponse<boolean>>(`${environment.apiBaseUrl}/auth/register`, payload);
  }
}
