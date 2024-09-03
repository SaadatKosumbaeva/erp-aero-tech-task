const express = require('express');
const app = express();
const PORT = 8000;

app.get('/', (req, res) => {
  res.send('Hello world!\n');
});

app.listen(PORT, () => {
  console.log(`App started on PORT = ${PORT}`);
});

