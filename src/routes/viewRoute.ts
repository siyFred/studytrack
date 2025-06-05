import { Router, Request, Response, NextFunction } from 'express';
import prisma from '../db/prisma';

const viewRouter = Router();

viewRouter.get('/', (req, res) => {
  res.render('home');
});

viewRouter.get('/login', (req, res) => {
  res.render('login');
});

viewRouter.get('/register', (req, res) => {
  res.render('register');
});

viewRouter.get('/forgot-password', (req, res) => {
  res.render('forgot-password');
});

viewRouter.get('/reset-password', (req, res) => {
  const { email } = req.query;
  res.render('reset-password', { email, error: null, message: null });
});

function dashboardAuth(req: Request, res: Response, next: NextFunction) {
  if (!res.locals.username) {
    return res.redirect('/login');
  }
  next();
}

viewRouter.get('/dashboard', dashboardAuth, async (req: Request, res: Response) => {
  
  const user = await prisma.user.findUnique({ where: { username: res.locals.username } });
  if (!user) return res.redirect('/login');

  const userTopics = await prisma.userTopic.findMany({
    where: { userId: user.id },
    include: {
      topic: {
        include: {
          steps: true
        }
      },
      user: true
    }
  });

  const progress = await prisma.progress.findMany({
    where: { userId: user.id },
  });

  const followedTopicIds = userTopics.map(ut => ut.topicId);
  const availableTopics = await prisma.topic.findMany({
    where: {
      id: { notIn: followedTopicIds }
    }
  });

  res.render('dashboard', { user, userTopics, progress, availableTopics });
});

viewRouter.post('/dashboard/follow', async (req, res) => {
  const { topicId } = req.body;

  const user = await prisma.user.findUnique({ where: { username: res.locals.username } });
  if (!user) return res.redirect('/login');

  await prisma.userTopic.upsert({
    where: {
      userId_topicId: {
        userId: user.id,
        topicId: topicId
      }
    },
    update: {},
    create: {
      userId: user.id,
      topicId: topicId
    }
  });
  res.redirect('/dashboard');
});

viewRouter.post('/topic/:id/unfollow', dashboardAuth, async (req: Request, res: Response) => {
  const topicId = req.params.id;
  const user = await prisma.user.findUnique({ where: { username: res.locals.username } });
  if (!user) return res.redirect('/login');
  await prisma.userTopic.deleteMany({ where: { userId: user.id, topicId } });
  res.redirect('/dashboard');
});

viewRouter.get('/topic/:id', dashboardAuth, async (req: Request, res: Response) => {
  const topicId = req.params.id;
  const user = await prisma.user.findUnique({ where: { username: res.locals.username } });
  if (!user) return res.redirect('/login');
  const topic = await prisma.topic.findUnique({
    where: { id: topicId },
    include: { steps: { orderBy: { order: 'asc' } } }
  });
  if (!topic) return res.status(404).render('dashboard', { error: 'Tópico não encontrado.' });
  
  const progress = await prisma.progress.findMany({
    where: { userId: user.id, stepId: { in: topic.steps.map(s => s.id) } }
  });
  res.render('topic', { topic, user, progress });
});

viewRouter.post('/topic/:id/step/:stepId/toggle', dashboardAuth, async (req: Request, res: Response) => {
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
});

viewRouter.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/');
});

export default viewRouter;