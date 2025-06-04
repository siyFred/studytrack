import prisma from '../db/prisma';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import '../config/config';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
}

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: passwordHash,
      },
    });

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined in environment variables (.env)');
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    const { password: _password, ...userWithoutPassword } = user;
    res.status(201).json({
      token,
      user: userWithoutPassword
    });
    
  } catch (error) {
    console.error('Error saving user:', error);
    res.status(500).json({ error: 'Failed to save user' });
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
      where: {
        email
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined in environment variables (.env)');
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    const { password: _password, ...userWithoutPassword } = user;
    res.status(200).json({
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
}
