import express from 'express';
import type { Request, Response, NextFunction } from 'express'; // 👈 استيراد أنواع Express المصححة
import cors from 'cors';
import authRouter from "./modules/auth/auth.route.js";

const app = express();

// 1. تفعيل CORS للسماح بالاتصال من الواجهة الأمامية مع تحديد الخيارات الضامنة
app.use(cors({
  origin: ['http://localhost:5177', 'http://127.0.0.1:5177'], // مسار Vite الـ Frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));
// 2. تفعيل معالجة بيانات الـ JSON القادمة في الـ Body
app.use(express.json());

// 3. ربط مسارات التوثيق (Auth Routes)
app.use('/api/auth', authRouter); 

// 4. معالجة المسارات غير الموجودة (404 Handler)
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
});

// 5. معالجة الأخطاء العامة (Global Error Handler)
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("🔥 Global Error caught:", err);

  const statusCode = err.statusCode || 500;
  return res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

export default app;