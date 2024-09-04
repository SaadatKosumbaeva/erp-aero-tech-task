import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { authRouter } from './app/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.NODE_PORT;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/', authRouter);

app.listen(PORT, () => {
  console.log(`Server is running on PORT = ${PORT}`);
});
