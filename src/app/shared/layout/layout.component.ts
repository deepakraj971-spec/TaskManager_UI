import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { AlertComponent } from '../alert/alert.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterModule,NgIf,AlertComponent],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {

  constructor(private AuthService: AuthService, private router: Router) {}

  isAuth(): boolean {
    return this.AuthService.isAuthenticated();
  }

  logout() {
    this.AuthService.logout().subscribe(() => {
    this.AuthService.updateAuthState(false);
    this.router.navigate(['/login']);
  });
  }
}
