import { Router } from 'express';
import { getUsers, register, login } from '../controller/userController';
import { auth } from '../middlewares/auth';

const userRouter = Router();

userRouter.post('/register', register);
userRouter.post('/login', login);

userRouter.use(auth);

//userRouter.get('/api/users', getUsers);

export default userRouter;