import { z } from 'zod';

const nameSchema = z
  .string({ required_error: 'Name is required' })
  .trim()
  .min(1, 'Name is required')
  .max(100, 'Name must be at most 100 characters');

const colorSchema = z
  .string()
  .trim()
  .regex(/^#([0-9a-fA-F]{3}){1,2}$/, 'Color must be a hex value')
  .nullish();

export const createCategorySchema = z.object({
  name: nameSchema,
  color: colorSchema,
});

export const updateCategorySchema = z.object({
  name: nameSchema.optional(),
  color: colorSchema,
});

export const idParamSchema = z.object({
  id: z.string().uuid('Invalid category id'),
});

export type CreateCategoryDto = z.infer<typeof createCategorySchema>;
export type UpdateCategoryDto = z.infer<typeof updateCategorySchema>;
export type IdParamDto = z.infer<typeof idParamSchema>;
