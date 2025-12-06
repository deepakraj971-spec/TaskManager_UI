import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TasksService } from '../../../core/services/tasks.service';
import { Priority, Status } from '../../../core/models/task.model';
import { take } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from '../../../core/services/error.service';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent {
  isEdit = false;
  id: string | null = null;
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private tasks: TasksService,
    private errors: ErrorService
  ) {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(200)]],
      description: ['', [Validators.maxLength(1000)]],
      dueDate: [''],
      priority: ['Medium' as Priority, Validators.required],
      status: ['Pending' as Status, Validators.required],
    });

    this.route.paramMap.pipe(take(1)).subscribe(params => {
      this.id = params.get('id');
      this.isEdit = !!this.id;
      if (this.isEdit && this.id) {
        this.loadTask(this.id);
      }
    });
  }

  private loadTask(id: string) {
    this.tasks.getById(id).pipe(take(1)).subscribe({
      next: task => {
         if (task.success && task.data) {
        const dueDate = task.data.dueDate ? this.toDateInputValue(new Date(task.data.dueDate)) : '';
        this.form.patchValue({
          title: task.data.title,
          description: task.data.description,
          dueDate,
          priority: task.data.priority,
          status: task.data.status
        });
      } else {
          console.log('Task not found');
        }
      },
      error: (err: HttpErrorResponse) => this.errors.show('Failed to load task.')
    });
  }

  private toDateInputValue(date: Date): string {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  submit() {
    if (this.form.invalid) {
      this.errors.show('Please fill out required fields.');
      return;
    }

    const payload: any = { ...this.form.value };
    if (payload.dueDate) payload.dueDate = new Date(payload.dueDate).toISOString();

    if (!this.isEdit) {
      this.tasks.create(payload).subscribe({
        next: (res) => {
        if (res.success && res.data) {
          this.router.navigate(['/tasks']);
        } else {
          console.log(res.message || 'Task creation failed');
        }
      },
        error: () => this.errors.show('Create failed. Please try again.')
      });
    } else if (this.id) {
      this.tasks.update(this.id, payload).subscribe({
        next: (res) => {
        if (res.success) {
          this.router.navigate(['/tasks']);
        } else {
          console.log(res.message || 'Update failed');
        }
      },
        error: () => this.errors.show('Update failed. Please try again.')
      });
    }
  }

  cancel() {
    this.router.navigate(['/tasks']);
  }
}
