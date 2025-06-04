import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../db/prisma';

export const userSession = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.token;
  if (!token || !process.env.JWT_SECRET) {
    res.locals.username = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as { userId: string };
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    res.locals.username = user ? user.username : null;
  } catch {
    res.locals.username = null;
  }
  next();
};
