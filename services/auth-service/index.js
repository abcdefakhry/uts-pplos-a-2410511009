const express = require('express');
const sequelize = require('./config/database');
const authRoutes = require('./routes/authRoutes');
require('dotenv').config();

const app = express();
app.use(express.json());

app.use('/', authRoutes);

const PORT = process.env.PORT || 5001;

sequelize.sync({ alter: true }).then(() => {
  app.listen(PORT, () => {
    console.log(`Auth Service sudah nyala di port ${PORT}`);
  });
}).catch(err => {
  console.error('Gagal koneksi database:', err);
});
