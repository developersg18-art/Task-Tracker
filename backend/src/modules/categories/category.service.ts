import { Prisma } from '@prisma/client';
import { ConflictError, NotFoundError } from '../../utils/api-error';
import { ERROR_MESSAGES } from '../../constants/error-messages';
import { categoryRepository } from './category.repository';
import type { Category, CreateCategoryInput, UpdateCategoryInput } from './category.types';

export const categoryService = {
  listCategories(): Promise<Category[]> {
    return categoryRepository.findAll();
  },

  async getCategoryById(id: string): Promise<Category> {
    const category = await categoryRepository.findById(id);
    if (!category) {
      throw new NotFoundError(ERROR_MESSAGES.CATEGORY_NOT_FOUND, 'CATEGORY_NOT_FOUND');
    }
    return category;
  },

  async createCategory(data: CreateCategoryInput): Promise<Category> {
    try {
      return await categoryRepository.create(data);
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        throw new ConflictError(ERROR_MESSAGES.CATEGORY_NAME_TAKEN, 'CATEGORY_NAME_TAKEN');
      }
      throw err;
    }
  },

  async updateCategory(id: string, data: UpdateCategoryInput): Promise<Category> {
    await this.getCategoryById(id);
    try {
      return await categoryRepository.update(id, data);
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        throw new ConflictError(ERROR_MESSAGES.CATEGORY_NAME_TAKEN, 'CATEGORY_NAME_TAKEN');
      }
      throw err;
    }
  },

  async deleteCategory(id: string): Promise<void> {
    await this.getCategoryById(id);
    await categoryRepository.delete(id);
  },
};
