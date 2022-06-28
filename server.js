const path = require('path');
const express = require('express');
const app = express();
const port = 4000;

app.use(express.static(path.join(__dirname, 'dist')));

app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'pug');

app.get('/', (req, res) => {
  res.render('./pages/home');
});
app.get('/about', (req, res) => {
  res.render('./pages/about');
});
app.get('/collections', (req, res) => {
  res.render('./pages/collections');
});
app.get('/detail/:id', (req, res) => {
  res.render('./pages/detail');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
