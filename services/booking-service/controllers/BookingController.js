const Booking = require('../models/Booking');

exports.createBooking = async (req, res) => {
  try {
    const { room_id, tanggal_mulai, durasi_bulan, harga_per_bulan } = req.body;
    const user_id = req.headers['x-user-id'];

    const newBooking = await Booking.create({
      user_id,
      room_id,
      tanggal_mulai,
      durasi_bulan,
      total_harga: harga_per_bulan * durasi_bulan
    });

    res.status(201).json({ status: 'success', data: newBooking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
