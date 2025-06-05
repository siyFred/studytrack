import { Router } from 'express';
import {
  renderHome,
  renderIntroduction,
  renderFeatures,
  renderAboutUs,
  renderLogin,
  renderRegister,
  renderForgotPassword,
  renderResetPassword,
  dashboardAuth,
  renderDashboard,
  followTopic,
  unfollowTopic,
  renderTopic,
  toggleStep,
  logout
} from '../controller/viewController';

const viewRouter = Router();

viewRouter.get('/', renderHome);
viewRouter.get('/introduction', renderIntroduction);
viewRouter.get('/features', renderFeatures);
viewRouter.get('/aboutus', renderAboutUs);
viewRouter.get('/login', renderLogin);
viewRouter.get('/register', renderRegister);
viewRouter.get('/forgot-password', renderForgotPassword);
viewRouter.get('/reset-password', renderResetPassword);

viewRouter.get('/dashboard', dashboardAuth, renderDashboard);
viewRouter.post('/dashboard/follow', followTopic);
viewRouter.post('/topic/:id/unfollow', dashboardAuth, unfollowTopic);
viewRouter.get('/topic/:id', dashboardAuth, renderTopic);
viewRouter.post('/topic/:id/step/:stepId/toggle', dashboardAuth, toggleStep);
viewRouter.get('/logout', logout);

export default viewRouter;