import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import prisma from './lib/prisma';


dotenv.config();

const app = express();
const port = process.env.PORT;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// CSS, img em ../public

app.get('/', (req, res) => {
  res.render('index');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
