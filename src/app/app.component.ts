import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { AlertComponent } from './shared/alert/alert.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, AlertComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private auth: AuthService,private router: Router) {}
  isAuth = computed(() => this.auth.isAuthenticated());
  logout() { 
    this.auth.logout(); 
    this.router.navigate(['/login']);
  }
}
