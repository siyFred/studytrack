import { Router, Request, Response } from 'express';
import prisma from '../db/prisma';
import { createTopicWithSteps } from '../controller/adminController';

const adminRouter = Router();

function adminAuth(req: Request, res: Response, next: Function) {
  if (req.cookies && req.cookies.admin === 'true') return next();
  return res.redirect('/admin/login');
}

adminRouter.get('/admin/login', (req, res) => {
  res.render('admin-login');
});

adminRouter.post('/admin/login', (req, res) => {
  const { adminPassword } = req.body;
  if (adminPassword === process.env.ADMIN_SECRET) {
    res.cookie('admin', 'true', { httpOnly: true });
    return res.redirect('/admin/topics');
  }
  res.render('admin-login', { error: 'Senha de administrador incorreta.' });
});

adminRouter.get('/admin/topics', adminAuth, (req, res) => {
  res.render('admin-topic');
});

adminRouter.post('/admin/topics', adminAuth, createTopicWithSteps);

adminRouter.get('/admin/logout', (req, res) => {
  res.clearCookie('admin');
  res.redirect('/admin/login');
});

export default adminRouter;
