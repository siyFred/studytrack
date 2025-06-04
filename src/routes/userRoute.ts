import { Router } from 'express';
import { getUsers, createUser } from '../controller/userController';

const userRouter = Router();

userRouter.get('/users', getUsers);
userRouter.post('/users', createUser);

export default userRouter;