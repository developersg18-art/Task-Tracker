import { prisma } from '../../config/database';
import type { CreateTaskInput, Task, UpdateTaskInput } from './task.types';

const taskSelect = {
  id: true,
  title: true,
  description: true,
  dueDate: true,
  status: true,
  priority: true,
  categoryId: true,
  createdAt: true,
  updatedAt: true,
} as const;

export const taskRepository = {
  findAll(): Promise<Task[]> {
    return prisma.task.findMany({ select: taskSelect, orderBy: { createdAt: 'desc' } });
  },

  findById(id: string): Promise<Task | null> {
    return prisma.task.findUnique({ where: { id }, select: taskSelect });
  },

  create(data: CreateTaskInput): Promise<Task> {
    return prisma.task.create({ data, select: taskSelect });
  },

  update(id: string, data: UpdateTaskInput): Promise<Task> {
    return prisma.task.update({ where: { id }, data, select: taskSelect });
  },

  delete(id: string): Promise<void> {
    return prisma.task
      .delete({ where: { id } })
      .then(() => undefined);
  },
};
