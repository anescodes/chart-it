import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { AuthService } from "./auth.service.js";
import { registerSchema, loginSchema, changePasswordSchema } from "./auth.schema.js";
import { ApiError } from "../../utils/ApiError.js";

const authService = new AuthService();

export class AuthController {
  // 1. تسجيل مستخدم جديد
  register = asyncHandler(async (req: Request, res: Response) => {
    // أ) التحقق من صحة البيانات القادمة من req.body بـ Zod
    // إذا كانت إحدى البيانات ناقصة أو غير صحيحة، Zod سينتج خطأ تلقائياً يمسكه errorHandler
    const validatedData = registerSchema.parse(req.body);

    // ب) استدعاء الخدمة لمعالجة المنطق البرمجي والتنسيق مع قاعدة البيانات
    const result = await authService.register(validatedData);
    // ج) إرجاع الاستجابة بـ ApiResponse بكود 201 (Created)
    return res
      .status(201)
      .json(new ApiResponse(201, result, "User registered successfully"));
  });

  // 2. تسجيل الدخول
  login = asyncHandler(async (req: Request, res: Response) => {
    // أ) التحقق من صحة بيانات الدخول عبر Zod
    const validatedData = loginSchema.parse(req.body);

    // ب) استدعاء الخدمة للتحقق من البريد وكلمة المرور
    const result = await authService.login(validatedData);

    // ج) إرجاع الاستجابة بـ ApiResponse بكود 200 (OK)
    return res
      .status(200)
      .json(new ApiResponse(200, result, "Logged in successfully"));
  });
  // auth.controller.ts

changePassword = asyncHandler(async (req: Request, res: Response) => {
  const validatedData = changePasswordSchema.parse(req.body);

  // 👈 اقرأ من req.userId مباشرة لأن الـ Middleware يضعها هناك
  const userId = req.userId;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const result = await authService.changePassword(userId, validatedData);

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Password changed successfully"));
});
}