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
export const changeUsernameSchema = z.object({
  newUsername: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username cannot exceed 50 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
});

export type ChangeUsernameInput = z.infer<typeof changeUsernameSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
// استخراج الأنواع لـ TypeScript
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;