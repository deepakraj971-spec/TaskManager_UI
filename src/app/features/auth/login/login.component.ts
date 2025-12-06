import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ErrorService } from '../../../core/services/error.service';
import { ApiError } from '../../../core/models/auth.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['../auth.shared.scss', './login.component.scss']
})
export class LoginComponent {
  form: FormGroup;
  successMessage: string | null = null;
  serverError: string | null = null;

  constructor(
    fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private errors: ErrorService
  ) {
    this.form = fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  submit() {
  if (this.form.invalid) return;

  this.auth.login(this.form.value).subscribe({
    next: (res) => {
      if (res.success) {
      this.auth.updateAuthState(true);
      this.router.navigate(['/tasks']);
    }
    },
    error: (err) => {
      this.auth.updateAuthState(false);
      const apiError = err.error as ApiError;
      this.serverError = apiError?.message || 'Login failed. Please try again.';
    }
  });
}
}
