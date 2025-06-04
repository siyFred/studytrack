import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user?: { id: string };
    }
  }
}

export const auth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization header is missing' });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token is missing' });
  }

  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined in environment variables (.env)');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as { userId: string };
    req.user = { id: decoded.userId }; // Attach user ID to request object
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ error: 'Invalid token' });
  }
}