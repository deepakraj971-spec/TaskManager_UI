import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';   
import { TasksService } from '../../../core/services/tasks.service';
import { TaskItem } from '../../../core/models/task.model';
import { ErrorService } from '../../../core/services/error.service';

@Component({
  selector: 'app-tasks-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],   
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
    this.tasksService.getAll({ page: this.page, pageSize: this.pageSize, status: this.statusFilter || undefined, priority: this.priorityFilter || undefined }).subscribe({
      next: res => {
        if (res.success && res.data) {
          if (res.data.items.length === 0 && this.page > 1) {
            this.page--;
            this.loadTasks();
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
    this.tasksService.getAll({
      page: this.page,
      pageSize: this.pageSize,
      status: this.statusFilter || undefined,
      priority: this.priorityFilter || undefined
    }).subscribe({
      next: res => {
        if (res.success && res.data) {
          this.tasks = res.data.items;
          this.total = res.data.total;
          this.page = res.data.page;
          this.pageSize = res.data.pageSize;
        } else {
          console.error('Failed to load tasks:', res.message);
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.errors.show('Failed to load tasks.');
      }
    });
  }

  applyFilters() {
    this.page = 1; // reset pagination
    this.loadTasks();
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
          this.errors.show('Task deleted successfully!');
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
