import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { TasksListComponent } from './features/tasks/tasks-list/tasks-list.component';
import { TaskFormComponent } from './features/tasks/task-form/task-form.component';
import { authGuard } from './core/guards/auth.guard';
import { LayoutComponent } from './shared/layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'tasks', component: TasksListComponent },
      { path: 'tasks/new', component: TaskFormComponent },
      { path: 'tasks/edit/:id', component: TaskFormComponent },
      { path: '', redirectTo: 'tasks', pathMatch: 'full' }
    ]
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '**', redirectTo: 'tasks' }
];
