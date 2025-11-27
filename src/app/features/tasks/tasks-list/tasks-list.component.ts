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

  loadTasks() {
    this.loading = true;
    this.tasksService.getAll({ page: this.page, pageSize: this.pageSize }).subscribe({
      next: res => {
        this.tasks = res.items;
        this.total = res.total;
        this.page = res.page;
        this.pageSize = res.pageSize;
        this.loading = false;
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
  // 👇 Add this method
  deleteTask(id: string) {
    if (!confirm('Delete this task?')) return;
    this.tasksService.delete(id).subscribe({
      next: () => this.loadTasks(),
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
