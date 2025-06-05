import prisma from '../db/prisma';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import '../config/config';

const pendingRegistrations: {
  [email: string]: {
    username: string;
    password: string;
    code: string;
    expiresAt: number;
  }
} = {};

let pendingPasswordResets: {
  [email: string]: { code: string; expiresAt: number }
} = {};

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

    const errors: string[] = [];
    if (!username || username.length < 3) errors.push('Nome de usuário deve ter pelo menos 3 caracteres.');
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) errors.push('Email inválido.');
    if (!password || password.length < 8) errors.push('Senha deve ter pelo menos 8 caracteres.');
    if (errors.length > 0) {
      return res.status(400).render('register', { error: errors.join(' ') });
    }

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

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    pendingRegistrations[email] = {
      username,
      password: await bcrypt.hash(password, 10),
      code,
      expiresAt: Date.now() + 15 * 60 * 1000
    };

    if (req.mailer) {
      await req.mailer({
        to: email,
        subject: 'Código de verificação - StudyTrack',
        text: `Seu código de verificação é: ${code}`
      });
    }

    return res.render('verify-email', { email, code });
  } catch (error: any) {
    console.error('Error saving user:', error);
    res.status(500).render('register', { error: 'Erro ao cadastrar usuário' });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  const { email, code } = req.body;
  const pending = pendingRegistrations[email];
  if (!pending || pending.code !== code || pending.expiresAt < Date.now()) {
    return res.render('verify-email', { email, error: 'Código inválido ou expirado.' });
  }

  const user = await prisma.user.create({
    data: {
      username: pending.username,
      email,
      password: pending.password
    }
  });
  delete pendingRegistrations[email];
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
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

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

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return res.render('forgot-password', { error: 'Email inválido.' });
  }
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.render('forgot-password', { error: 'Email não encontrado.' });
  }
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  pendingPasswordResets[email] = {
    code,
    expiresAt: Date.now() + 15 * 60 * 1000
  };
  if (req.mailer) {
    await req.mailer({
      to: email,
      subject: 'Recuperação de senha - StudyTrack',
      text: `Seu código de recuperação é: ${code}`
    });
  }
  return res.redirect(`/reset-password?email=${encodeURIComponent(email)}`);
};

export const resetPassword = async (req: Request, res: Response) => {
  const { email, code, password } = req.body;
  const pending = pendingPasswordResets[email];
  if (!pending || pending.code !== code || pending.expiresAt < Date.now()) {
    return res.render('reset-password', { email, error: 'Código inválido ou expirado.', message: null });
  }
  if (!password || password.length < 8) {
    return res.render('reset-password', { email, error: 'Senha deve ter pelo menos 8 caracteres.', message: null });
  }
  const hash = await bcrypt.hash(password, 10);
  await prisma.user.update({ where: { email }, data: { password: hash } });
  delete pendingPasswordResets[email];
  res.render('reset-password', { email, error: null, message: 'Senha redefinida com sucesso! Faça login.' });
};
