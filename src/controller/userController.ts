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

    // Validação backend
    const errors: string[] = [];
    if (!username || username.length < 3) errors.push('Nome de usuário deve ter pelo menos 3 caracteres.');
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) errors.push('Email inválido.');
    if (!password || password.length < 8) errors.push('Senha deve ter pelo menos 8 caracteres.');
    if (errors.length > 0) {
      return res.status(400).render('register', { error: errors.join(' ') });
    }

    // Verifica se email ou username já existem
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username }
        ]
      }
    });
    if (existingUser) {
      let msg = existingUser.email === email ? 'Email já cadastrado.' : 'Nome de usuário já cadastrado.';
      return res.status(400).render('register', { error: msg });
    }

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
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000
    });
    res.redirect('/dashboard');
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(400).render('register', { error: 'Email ou nome de usuário já cadastrado.' });
    }
    console.error('Error saving user:', error);
    res.status(500).render('register', { error: 'Erro ao cadastrar usuário' });
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    // Validação backend
    const errors: string[] = [];
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) errors.push('Email inválido.');
    if (!password || password.length < 8) errors.push('Senha deve ter pelo menos 8 caracteres.');
    if (errors.length > 0) {
      return res.status(400).render('login', { error: errors.join(' ') });
    }
    const user = await prisma.user.findUnique({
      where: {
        email
      },
    });
    if (!user) {
      return res.status(404).render('login', { error: 'Usuário não encontrado' });
    }
    if (!await bcrypt.compare(password, user.password)) {
      return res.status(401).render('login', { error: 'Senha inválida' });
    }
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined in environment variables (.env)');
    }
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000
    });
    res.redirect('/dashboard');
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).render('login', { error: 'Erro ao fazer login' });
  }
}
