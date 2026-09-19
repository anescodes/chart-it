import { eq, or, isNull, and } from 'drizzle-orm';

import { db } from '../../db/index.js';
import { categories } from '../../db/schema.js';

import type { CreateCategoryInput } from './categories.schema.js';

export class CategoryService {

  async getCategories(userId: string) {
    return await db
      .select()
      .from(categories)
      .where(
        or(
          isNull(categories.userId),
          eq(categories.userId, userId)
        )
      );
  }

  async createCategory(
    userId: string,
    input: CreateCategoryInput
  ) {
    const [newCategory] = await db
      .insert(categories)
      .values({
        userId,
        name: input.name,
        color: input.color || '#6366f1',
      })
      .returning();

    return newCategory;
  }

  async deleteCategory(
    userId: string,
    categoryId: string
  ) {
    const [deletedCategory] = await db
      .delete(categories)
      .where(
        and(
          eq(categories.id, categoryId),
          eq(categories.userId, userId)
        )
      )
      .returning();

    if (!deletedCategory) {
      throw new Error(
        'Category not found or you do not have permission to delete it'
      );
    }

    return deletedCategory;
  }
}