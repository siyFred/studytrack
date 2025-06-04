import { Router } from 'express';

const viewRouter = Router();

viewRouter.get('/', (req, res) => {
  res.render('home');
});

// mais rotas view

export default viewRouter;