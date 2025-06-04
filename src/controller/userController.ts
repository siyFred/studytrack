import prisma from '../db/prisma';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';

export const saveUser = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  const passwordHash = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: passwordHash,
      },
    });
    res.status(201).json(user);
  } catch (error) {
    console.error('Error saving user:', error);
    res.status(500).json({ error: 'Failed to save user' });
  }
}