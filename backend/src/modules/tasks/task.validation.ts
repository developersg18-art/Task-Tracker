import { z } from 'zod';
import { Status } from '@prisma/client';

const titleSchema = z
  .string({ required_error: 'Title is required' })
  .trim()
  .min(1, 'Title is required')
  .max(200, 'Title must be at most 200 characters');

const descriptionSchema = z
  .string()
  .trim()
  .max(5000, 'Description is too long')
  .nullish();

const categorySchema = z
  .string()
  .trim()
  .min(1, 'Category cannot be empty')
  .max(50, 'Category must be at most 50 characters')
  .nullish();

const dueDateSchema = z.coerce.date().nullish();

const completedAtSchema = z.coerce.date().nullish();

const statusSchema = z.nativeEnum(Status, {
  errorMap: () => ({ message: 'Invalid status' }),
});

export const createTaskSchema = z.object({
  title: titleSchema,
  description: descriptionSchema,
  category: categorySchema,
  dueDate: dueDateSchema,
  status: statusSchema.optional(),
  completedAt: completedAtSchema,
});

export const updateTaskSchema = z.object({
  title: titleSchema.optional(),
  description: descriptionSchema,
  category: categorySchema,
  dueDate: dueDateSchema,
  status: statusSchema.optional(),
  completedAt: completedAtSchema,
});

export const idParamSchema = z.object({
  id: z.string().uuid('Invalid task id'),
});

export type CreateTaskDto = z.infer<typeof createTaskSchema>;
export type UpdateTaskDto = z.infer<typeof updateTaskSchema>;
export type IdParamDto = z.infer<typeof idParamSchema>;
