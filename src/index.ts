import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';

import './config/config';

import viewRouter from './routes/viewRoute';
import userRouter from './routes/userRoute';
import adminRouter from './routes/adminRoute';
import { userSession } from './middlewares/userSession';

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(userSession);

app.use('/', viewRouter);
app.use('/api', userRouter);
app.use(adminRouter);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
