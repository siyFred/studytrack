import { Router } from 'express';
import { getUsers, register, login } from '../controller/userController';
import { auth } from '../middlewares/auth';

const userRouter = Router();

userRouter.post('/register', register);
userRouter.post('/login', login);

userRouter.use(auth);

userRouter.get('/users', getUsers);

export default userRouter;