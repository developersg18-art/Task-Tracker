import { z } from 'zod';
import { TaskStatus, TaskPriority } from '@prisma/client';

const titleSchema = z
  .string({ required_error: 'Title is required' })
  .trim()
  .min(1, 'Title is required')
  .max(200, 'Title must be at most 200 characters');

const descriptionSchema = z.string().trim().max(5000, 'Description is too long').nullish();
const dueDateSchema = z.coerce.date().nullish();
const categoryIdSchema = z.string().uuid('Invalid category id').nullish();

const statusSchema = z.nativeEnum(TaskStatus, { errorMap: () => ({ message: 'Invalid status' }) });
const prioritySchema = z.nativeEnum(TaskPriority, { errorMap: () => ({ message: 'Invalid priority' }) });

export const createTaskSchema = z.object({
  title: titleSchema,
  description: descriptionSchema,
  dueDate: dueDateSchema,
  status: statusSchema.optional(),
  priority: prioritySchema.optional(),
  categoryId: categoryIdSchema,
});

export const updateTaskSchema = z.object({
  title: titleSchema.optional(),
  description: descriptionSchema,
  dueDate: dueDateSchema,
  status: statusSchema.optional(),
  priority: prioritySchema.optional(),
  categoryId: categoryIdSchema,
});

export const idParamSchema = z.object({
  id: z.string().uuid('Invalid task id'),
});

export type CreateTaskDto = z.infer<typeof createTaskSchema>;
export type UpdateTaskDto = z.infer<typeof updateTaskSchema>;
export type IdParamDto = z.infer<typeof idParamSchema>;
