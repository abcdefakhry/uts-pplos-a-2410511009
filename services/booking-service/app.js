const express = require('express');
const sequelize = require('./config/database');
const bookingRoutes = require('./routes/bookingRoutes');
require('dotenv').config();

const app = express();
app.use(express.json());

app.use('/api/bookings', bookingRoutes);

const PORT = process.env.PORT || 5002;

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Booking Service jalan di port ${PORT}`);
  });
}).catch(err => console.log('Gagal konek DB:', err));
