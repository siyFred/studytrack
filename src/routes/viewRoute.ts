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

function dashboardAuth(req: Request, res: Response, next: NextFunction) {
  if (!res.locals.username) {
    return res.redirect('/login');
  }
  next();
}

viewRouter.get('/dashboard', dashboardAuth, async (req: Request, res: Response) => {
  // Busca o usuário pelo username salvo em res.locals
  const user = await prisma.user.findUnique({ where: { username: res.locals.username } });
  if (!user) return res.redirect('/login');

  // Busca os tópicos que o usuário já segue
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

  // Busca progresso do usuário
  const progress = await prisma.progress.findMany({
    where: { userId: user.id },
  });

  // Busca tópicos disponíveis para seguir (que o usuário ainda não segue)
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
  // Busca o usuário logado
  const user = await prisma.user.findUnique({ where: { username: res.locals.username } });
  if (!user) return res.redirect('/login');
  // Cria relação UserTopic se não existir
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

// Visualização de tópico e seus passos para usuário logado
viewRouter.get('/topic/:id', dashboardAuth, async (req: Request, res: Response) => {
  const topicId = req.params.id;
  const topic = await prisma.topic.findUnique({
    where: { id: topicId },
    include: { steps: { orderBy: { order: 'asc' } } }
  });
  if (!topic) return res.status(404).render('dashboard', { error: 'Tópico não encontrado.' });
  res.render('topic', { topic });
});

viewRouter.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/');
});

export default viewRouter;