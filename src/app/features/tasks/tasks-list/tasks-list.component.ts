// src/app/features/tasks/tasks-list/tasks-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { TasksService } from '../../../core/services/tasks.service';
import { TaskItem } from '../../../core/models/task.model';
import { ErrorService } from '../../../core/services/error.service';

@Component({
  selector: 'app-tasks-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './tasks-list.component.html',
  styleUrls: ['./tasks-list.component.scss']
})
export class TasksListComponent implements OnInit {
  tasks: TaskItem[] = [];
  loading = false;
  page = 1;
  pageSize = 5;
  total = 0;
  priorityFilter = '';
  statusFilter = '';
  
  constructor(private tasksService: TasksService, private errors: ErrorService ,private router: Router  ) {}

  ngOnInit() {
    this.loadTasks();
  }

  get totalPages(): number {
    return Math.ceil(this.total / this.pageSize) || 1;
  }

  private loadTasksAfterDelete() {
  this.tasksService.getAll({ page: this.page, pageSize: this.pageSize }).subscribe({
    next: res => {
      if (res.success && res.data) {
        // If current page is empty after deletion, go back one page
        if (res.data.items.length === 0 && this.page > 1) {
          this.page--;
          this.loadTasks(); // reload previous page
        } else {
          this.tasks = res.data.items;
          this.total = res.data.total;
          this.page = res.data.page;
          this.pageSize = res.data.pageSize;
        }
      }
    },
    error: () => this.errors.show('Failed to reload tasks.')
  });
}

  loadTasks() {
    this.loading = true;
    this.tasksService.getAll({ page: this.page, pageSize: this.pageSize }).subscribe({
      next: res => {
         if (res.success && res.data) {
        this.tasks = res.data.items;
        this.total = res.data.total;
        this.page = res.data.page;
        this.pageSize = res.data.pageSize;
        this.loading = false;
         }else {
      console.error('Failed to load tasks:', res.message);
    }
      },
      error: () => {
        this.loading = false;
        this.errors.show('Failed to load tasks.');
      }
    });
  }
  editTask(id: string) {
  this.router.navigate(['/tasks/edit', id]);
}
  
  deleteTask(id: string) {
    if (!confirm('Delete this task?')) return;
    this.tasksService.delete(id).subscribe({
      next: (res) => {
        if (res.success) {
          this.loadTasksAfterDelete();
        } else {
          console.log('Delete failed');
        }
      },
      error: () => this.errors.show('Delete failed. Please try again.')
    });
  }

  prev() {
    if (this.page > 1) {
      this.page--;
      this.loadTasks();
    }
  }

  next() {
    if (this.page < this.totalPages) {
      this.page++;
      this.loadTasks();
    }
  }

  goToPage(p: number) {
    if (p >= 1 && p <= this.totalPages) {
      this.page = p;
      this.loadTasks();
    }
  }
}
