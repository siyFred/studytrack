import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import prisma from './db/prisma';

import userRouter from './routes/userRoute';
import viewRouter from './routes/viewRoute';

dotenv.config();

const app = express();
const port = process.env.PORT;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.json());

app.use('/', userRouter);

app.use('/', viewRouter);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
