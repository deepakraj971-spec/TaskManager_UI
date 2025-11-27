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

    this.route.queryParams.subscribe(params => {
      if (params['registered'] === 'true') {
        this.successMessage = 'Registration successful! Please log in.';
        setTimeout(() => this.successMessage = null, 6000);
      }
    });
  }

  submit() {
  if (this.form.invalid) return;

  this.auth.login(this.form.value).subscribe({
    next: (res) => {
      this.auth.saveToken(res.token);
      const redirect = this.route.snapshot.queryParams['redirect'] ?? '/tasks';
      this.router.navigate([redirect]);
    },
    error: (err) => {
      const apiError = err.error as ApiError;
      this.errors.show(apiError?.message || 'Invalid email or password.');
    }
  });
}
}
