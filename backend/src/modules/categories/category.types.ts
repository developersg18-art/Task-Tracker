export interface Category {
  id: string;
  name: string;
  color: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateCategoryInput = {
  name: string;
  color?: string | null;
};

export type UpdateCategoryInput = Partial<CreateCategoryInput>;
