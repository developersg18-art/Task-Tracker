import type { Status } from '@prisma/client';

export interface Task {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  status: Status;
  dueDate: Date | null;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateTaskInput = {
  title: string;
  description?: string | null;
  category?: string | null;
  status?: Status;
  dueDate?: Date | string | null;
  completedAt?: Date | string | null;
};

export type UpdateTaskInput = Partial<CreateTaskInput>;
