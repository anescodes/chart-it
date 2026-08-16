import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError.js';

interface JwtPayload {
  id: string;
}

// Extend Express Request interface to include user ID
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer TOKEN"

  if (!token) {
    throw new ApiError(401, 'Access token is missing or invalid');
  }

  try {
    const secret = process.env.JWT_SECRET || 'default_secret';
    const decoded = jwt.verify(token, secret) as JwtPayload;
    
    // Attach the user ID to the request object
    req.userId = decoded.id;
    next();
  } catch (error) {
    throw new ApiError(403, 'Invalid or expired token');
  }
};