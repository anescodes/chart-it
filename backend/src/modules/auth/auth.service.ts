import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { eq, or } from "drizzle-orm";
import { db } from "../../db/index.js";
import { users } from "../../db/schema.js";
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

  // 3. إنشاء الـ Token (نضع id و userId معاً لضمان القراءة في أي middleware)
  generateToken(userId: string): string {
    const secret = process.env.JWT_SECRET || 'default_secret';
    return jwt.sign({ id: userId, userId: userId }, secret, { expiresIn: '7d' });
  }

  // 4. تسجيل مستخدم جديد
  async register(data: RegisterInput) {
    const { username, email, password } = data;

    // البحث عن البريد الإلكتروني أو اسم المستخدم لمنع التعارض
    const [existingUser] = await db
      .select()
      .from(users)
      .where(or(eq(users.email, email), eq(users.username, username)))
      .limit(1);

    if (existingUser) {
      if (existingUser.email === email) {
        throw new ApiError(409, "User with this email already exists");
      }
      throw new ApiError(409, "Username is already taken");
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

    if (!newUser) {
      throw new ApiError(500, "Failed to create user account");
    }

    // توليد التوكن
    const token = this.generateToken(String(newUser.id));

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
    const token = this.generateToken(String(user.id));

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      token,
    };
  }
  // 6. تغيير كلمة المرور
  async changePassword(userId: string, data: { currentPassword: string; newPassword: string }) {
    const { currentPassword, newPassword } = data;

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const isPasswordValid = await this.comparePassword(currentPassword, user.passwordHash);
    if (!isPasswordValid) {
      throw new ApiError(400, "Incorrect current password");
    }

    const newHashedPassword = await this.hashPassword(newPassword);

    await db
      .update(users)
      .set({ passwordHash: newHashedPassword })
      .where(eq(users.id, userId));

    return true;
  }
  async changeUsername(userId: string, newUsername: string) {
    const cleanUsername = newUsername.trim().toLowerCase();

    // 1. Check if user exists
    const [currentUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!currentUser) {
      throw new ApiError(404, "User not found");
    }

    // 2. Prevent updating to the same username
    if (currentUser.username === cleanUsername) {
      throw new ApiError(400, "New username cannot be identical to current username");
    }

    // 3. Check if the username is already taken by another account
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.username, cleanUsername))
      .limit(1);

    if (existingUser) {
      throw new ApiError(409, "Username is already taken");
    }

    // 4. Perform the update
    const [updatedUser] = await db
      .update(users)
      .set({ username: cleanUsername })
      .where(eq(users.id, userId))
      .returning({
        id: users.id,
        username: users.username,
        email: users.email,
      });

    return updatedUser;
  }
}
