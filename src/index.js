import express from 'express';
import dotenv from 'dotenv';

const app = express();
dotenv.config();

const PORT = process.env.NODE_PORT;

app.use( express.json());
app.use( express.urlencoded( { extended:true } ) );

app.get('/', (req, res) => {
  res.send('Hello world!\n');
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT = ${PORT}`);
});
