require('dotenv').config();
const express = require('express');
const sequelize = require('./config/database');
const bookingRoutes = require('./routes/bookingRoutes');

const app = express();
app.use(express.json());

app.use('/', bookingRoutes);

const PORT = process.env.PORT || 5002;

sequelize.sync({ alter: true }).then(() => {
    app.listen(PORT, () => {
console.log(`Booking Service jalan di port ${PORT}`);
  });
}).catch(err => console.log('Gagal konek DB:', err));
