import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { users } from "../../db/schema.js"; // أو المسار الذي وضعت فيه الـ schema
import { ApiError } from "../../utils/ApiError.js";
import type { RegisterInput, LoginInput } from "./auth.schema.js";

export class AuthService {
  // 1. تشفير كلمة المرور
  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  // 2. مطابقة كلمة المرور
  async comparePassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  // 3. إنشاء الـ Token
  generateToken(userId: string): string {
    const secret = process.env.JWT_SECRET || 'default_secret';
    return jwt.sign({ id: userId }, secret, { expiresIn: '7d' });
  }

  // 4. تسجيل مستخدم جديد
  async register(data: RegisterInput) {
    const { username, email, password } = data;

    // البحث عن البريد الإلكتروني
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser) {
      throw new ApiError(409, "User with this email already exists");
    }

    // تشفير كلمة المرور
    const hashedPassword = await this.hashPassword(password);

    // إدخال المستخدم
    const [newUser] = await db
      .insert(users)
      .values({
        username,
        email,
        passwordHash: hashedPassword,
      })
      .returning({
        id: users.id,
        username: users.username,
        email: users.email,
        createdAt: users.createdAt,
      });

    // توليد التوكن
    const token = this.generateToken(newUser!.id);

    return { user: newUser, token };
  }

  // 5. تسجيل الدخول
  async login(data: LoginInput) {
    const { email, password } = data;

    // البحث عن المستخدم
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user) {
      throw new ApiError(401, "Invalid email or password");
    }

    // مطابقة كلمة المرور مع passwordHash
    const isPasswordValid = await this.comparePassword(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid email or password");
    }

    // توليد التوكن
    const token = this.generateToken(user.id);

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      token,
    };
  }
}