import { z } from 'zod';

export const registerSchema = z.object({
  username: z.string().min(2, 'username at least 2 character'),
  email: z.string().email('email syntax is not correct'),
  password: z.string().min(6, 'min lenght 6'),
});

export const loginSchema = z.object({
  email: z.string().email('email is not valid '),
  password: z.string().min(1, 'password is required'),
});
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
});

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
// استخراج الأنواع لـ TypeScript
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;