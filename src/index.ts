import express from 'express';
import path from 'path';

import './config/config';

import userRouter from './routes/userRoute';
import viewRouter from './routes/viewRoute';

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.json());

app.use('/', userRouter);
app.use('/', viewRouter);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
