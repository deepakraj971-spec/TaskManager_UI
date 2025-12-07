# Task Manager

A task management application built with **Angular 18**, featuring authentication, route guards, HTTP interceptors, and task CRUD operations.

---

## Features

- **Authentication**
  - Login, logout, register
  - Session check & refresh
  - Auth state management using Angular signals
- **Route Guard**
  - Protects routes based on authentication state
  - Redirects unauthenticated users to login
- **HTTP Interceptor**
  - Attaches credentials to requests
  - Handles 401/403 errors
  - Refreshes tokens automatically
- **Task Management**
  - Create, read, update, delete tasks, pagination
- **Error Handling**
  - Centralized error service for user-friendly messages

---

## Project Setup

### Prerequisites

- Node.js (>= 18.x)
- Angular CLI (>= 18.x)

### Installation

```bash
# Clone repository
git clone <your-repo-url>
cd task-manager

# Install dependencies
npm install


```
