import type { Request, Response } from 'express';

import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { CategoryService } from './categories.service.js';
import { createCategorySchema } from './categories.schema.js';
import { ApiError } from '../../utils/ApiError.js';

const categoryService = new CategoryService();

export class CategoryController {

  getCategories = asyncHandler(async (req: Request, res: Response) => {
    const result = await categoryService.getCategories(req.userId!);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          result,
          'get categories successfully'
        )
      );
  });

  createCategory = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = createCategorySchema.parse(req.body);

    const result = await categoryService.createCategory(
      req.userId!,
      validatedData
    );

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          result,
          'create category successfully'
        )
      );
  });

  deleteCategory = asyncHandler(async (req: Request, res: Response) => {
    const categoryId = req.params.id as string;

    if (!categoryId) {
      throw new ApiError(400, 'Category ID is required');
    }

    await categoryService.deleteCategory(
      req.userId!,
      categoryId
    );

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          null,
    'delete category successfully'
        )
      );
  });
}