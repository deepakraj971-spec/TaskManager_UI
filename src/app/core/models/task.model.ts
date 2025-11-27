export type Priority = 'Low' | 'Medium' | 'High';
export type Status = 'Pending' | 'Completed';

export interface TaskItem {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  priority: Priority;
  status: Status;
}

export interface PagedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}
