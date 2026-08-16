import { z } from 'zod';

export const registerSchema = z.object({
  username: z.string().min(2, 'username at least 2 character'),
  email: z.string().email('صيغة البريد الإلكتروني غير صحيحة'),
  password: z.string().min(6, 'min lenght 6'),
});

export const loginSchema = z.object({
  email: z.string().email('email is not valid '),
  password: z.string().min(1, 'password is required'),
});

// استخراج الأنواع لـ TypeScript
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;