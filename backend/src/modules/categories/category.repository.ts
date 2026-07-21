import { prisma } from '../../config/database';
import type { Category, CreateCategoryInput, UpdateCategoryInput } from './category.types';

const categorySelect = {
  id: true,
  name: true,
  color: true,
  createdAt: true,
  updatedAt: true,
} as const;

export const categoryRepository = {
  findAll(): Promise<Category[]> {
    return prisma.category.findMany({ select: categorySelect, orderBy: { name: 'asc' } });
  },

  findById(id: string): Promise<Category | null> {
    return prisma.category.findUnique({ where: { id }, select: categorySelect });
  },

  create(data: CreateCategoryInput): Promise<Category> {
    return prisma.category.create({ data, select: categorySelect });
  },

  update(id: string, data: UpdateCategoryInput): Promise<Category> {
    return prisma.category.update({ where: { id }, data, select: categorySelect });
  },

  delete(id: string): Promise<void> {
    return prisma.category
      .delete({ where: { id } })
      .then(() => undefined);
  },
};
