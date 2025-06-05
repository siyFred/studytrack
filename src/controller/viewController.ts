import { Request, Response } from 'express';
import prisma from '../db/prisma';

export const renderHome = (req: Request, res: Response) => {
  res.render('home');
};

export const renderIntroduction = (req: Request, res: Response) => {
  res.render('introduction');
};

export const renderFeatures = (req: Request, res: Response) => {
  res.render('features');
};

export const renderAboutUs = (req: Request, res: Response) => {
  res.render('aboutus');
};

export const renderLogin = (req: Request, res: Response) => {
  res.render('login');
};

export const renderRegister = (req: Request, res: Response) => {
  res.render('register');
};

export const renderForgotPassword = (req: Request, res: Response) => {
  res.render('forgot-password');
};

export const renderResetPassword = (req: Request, res: Response) => {
  const { email } = req.query;
  res.render('reset-password', { email, error: null, message: null });
};

export const dashboardAuth = (req: Request, res: Response, next: Function) => {
  if (!res.locals.username) {
    return res.redirect('/login');
  }
  next();
};

export const renderDashboard = async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({ where: { username: res.locals.username } });
  if (!user) return res.redirect('/login');
  const userTopics = await prisma.userTopic.findMany({
    where: { userId: user.id },
    include: {
      topic: { include: { steps: true } },
      user: true
    }
  });
  const progress = await prisma.progress.findMany({ where: { userId: user.id } });
  const followedTopicIds = userTopics.map(ut => ut.topicId);
  const availableTopics = await prisma.topic.findMany({ where: { id: { notIn: followedTopicIds } } });
  res.render('dashboard', { user, userTopics, progress, availableTopics });
};

export const followTopic = async (req: Request, res: Response) => {
  const { topicId } = req.body;
  const user = await prisma.user.findUnique({ where: { username: res.locals.username } });
  if (!user) return res.redirect('/login');
  await prisma.userTopic.upsert({
    where: { userId_topicId: { userId: user.id, topicId: topicId } },
    update: {},
    create: { userId: user.id, topicId: topicId }
  });
  res.redirect('/dashboard');
};

export const unfollowTopic = async (req: Request, res: Response) => {
  const topicId = req.params.id;
  const user = await prisma.user.findUnique({ where: { username: res.locals.username } });
  if (!user) return res.redirect('/login');
  await prisma.userTopic.deleteMany({ where: { userId: user.id, topicId } });
  res.redirect('/dashboard');
};

export const renderTopic = async (req: Request, res: Response) => {
  const topicId = req.params.id;
  const user = await prisma.user.findUnique({ where: { username: res.locals.username } });
  if (!user) return res.redirect('/login');
  const topic = await prisma.topic.findUnique({
    where: { id: topicId },
    include: { steps: { orderBy: { order: 'asc' } } }
  });
  if (!topic) return res.status(404).render('dashboard', { error: 'Tópico não encontrado.' });
  const progress = await prisma.progress.findMany({ where: { userId: user.id, stepId: { in: topic.steps.map(s => s.id) } } });
  res.render('topic', { topic, user, progress });
};

export const toggleStep = async (req: Request, res: Response) => {
  const topicId = req.params.id;
  const stepId = req.params.stepId;
  const user = await prisma.user.findUnique({ where: { username: res.locals.username } });
  if (!user) return res.redirect('/login');
  const progress = await prisma.progress.findUnique({ where: { userId_stepId: { userId: user.id, stepId } } });
  if (progress) {
    await prisma.progress.update({ where: { id: progress.id }, data: { completed: !progress.completed } });
  } else {
    await prisma.progress.create({ data: { userId: user.id, stepId, completed: true } });
  }
  res.redirect(`/topic/${topicId}`);
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie('token');
  res.redirect('/');
};
