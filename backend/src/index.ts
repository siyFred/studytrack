import express from 'express';
import dotenv from 'dotenv';

const app = express();
const port = process.env.PORT;

app.get('/', (req, res) => {
  res.send(`Tudo certo`);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
