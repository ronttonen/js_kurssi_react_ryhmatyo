const express = require('express');

const app = express();
const port = process.env.PORT || 5000;

app.get('/api/lounaatdata', (req, res) => {
  res.send({ express: 'Hello From Express' });
});