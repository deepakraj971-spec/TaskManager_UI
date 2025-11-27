import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { LoginResponse, RegisterResponse } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenKey = 'tm_token';
  isAuthenticated = signal<boolean>(this.hasToken());

  constructor(private http: HttpClient) {}

  login(credentials: { email: string; password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiBaseUrl}/auth/login`, credentials);
  }

  register(payload: { name: string; email: string; password: string }): Observable<string> {
  return this.http.post(`${environment.apiBaseUrl}/auth/register`, payload, { responseType: 'text' });
}


  saveToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
    this.isAuthenticated.set(true);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  hasToken(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    this.isAuthenticated.set(false);
  }
}
