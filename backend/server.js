const express = require('express');
const app = express();
require('dotenv').config();
const mongoose = require('mongoose');

app.get('/', (req, res) => {
  res.send('Hello World!This is MediTrust Backend Server.');
})

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log('Connected to MongoDB');
  }).catch((err) => {
    console.error('Failed to connect to MongoDB', err);
  });
})

module.exports = app;