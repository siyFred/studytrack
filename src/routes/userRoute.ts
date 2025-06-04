import { Router } from 'express';
import { saveUser } from '../controller/userController';

const userRouter = Router();

userRouter.post('/saveuser', saveUser);

export default userRouter;