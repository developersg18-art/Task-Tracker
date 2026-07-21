import type { TaskStatus, TaskPriority } from '@prisma/client';

export interface Task {
  id: string;
  title: string;
  description: string | null;
  dueDate: Date | null;
  status: TaskStatus;
  priority: TaskPriority;
  categoryId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateTaskInput = {
  title: string;
  description?: string | null;
  dueDate?: Date | string | null;
  status?: TaskStatus;
  priority?: TaskPriority;
  categoryId?: string | null;
};

export type UpdateTaskInput = Partial<CreateTaskInput>;
