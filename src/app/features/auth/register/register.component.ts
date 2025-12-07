import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ErrorService } from '../../../core/services/error.service';
import { ApiError } from '../../../core/models/auth.model';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['../auth.shared.scss', './register.component.scss']
})
export class RegisterComponent {
  form: FormGroup;
  serverError: string | null = null;
  constructor(
    fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private errors: ErrorService
    
  ) {
    this.form = fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordsMatch });
  }

  passwordsMatch(group: FormGroup) {
    const p = group.get('password')?.value;
    const c = group.get('confirmPassword')?.value;
    return p && c && p === c ? null : { mismatch: true };
  }

  submit() {
  this.serverError = null; // reset before submit
  if (this.form.invalid) {
    this.serverError ='';
    this.errors.show('Please fix the errors in the form.');
    return;
  }

  const { name, email, password } = this.form.value;

  this.auth.register({ name, email, password }).subscribe({
    next: (res) => {
      if (res.success) {
        this.router.navigate(['/login']);
        alert('Registration Successfull.Please login');
      } 
    },
    error: (err) => {
      const apiError = err.error as ApiError;
      this.serverError = apiError?.message || 'Registration failed. Please try again.';
    }
  });
  }
}
