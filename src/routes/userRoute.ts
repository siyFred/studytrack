import { Router } from 'express';
import { getUsers, register, login, verifyEmail, forgotPassword, resetPassword } from '../controller/userController';

const userRouter = Router();

userRouter.post('/register', register);
userRouter.post('/login', login);
userRouter.post('/verify-email', verifyEmail);
userRouter.post('/forgot-password', forgotPassword);
userRouter.post('/reset-password', resetPassword);

export default userRouter;