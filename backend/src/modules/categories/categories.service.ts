import { eq, or, isNull } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { categories } from '../../db/schema.js';
import type { CreateCategoryInput } from './categories.schema.js';

export class CategoryService {
  async getCategories(userId: string) {
    return await db
      .select()
      .from(categories)
      .where(or(isNull(categories.userId), eq(categories.userId, userId)));
  }

  async createCategory(userId: string, input: CreateCategoryInput) {
    const [newCategory] = await db
      .insert(categories)
      .values({
        userId,
        name: input.name,
        type: input.type,
        color: input.color || '#6366f1',
      })
      .returning();

    return newCategory;
  }
}