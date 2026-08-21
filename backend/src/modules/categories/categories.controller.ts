import type { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { CategoryService } from './categories.service.js';
import { createCategorySchema } from './categories.schema.js';

const categoryService = new CategoryService();

export class CategoryController {
  getCategories = asyncHandler(async (req: Request, res: Response) => {
    const result = await categoryService.getCategories(req.userId!);
    return res.status(200).json(new ApiResponse(200, result, 'تم جلب التصنيفات بنجاح'));
  });

  createCategory = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = createCategorySchema.parse(req.body);
    const result = await categoryService.createCategory(req.userId!, validatedData);
    return res.status(201).json(new ApiResponse(201, result, 'تم إنشاء التصنيف بنجاح'));
  });
}