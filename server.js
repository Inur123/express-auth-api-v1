require('dotenv').config();
require('./setup'); // jalankan setup DB
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);

app.listen(process.env.PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${process.env.PORT}`);
});
