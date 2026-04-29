const Booking = require('../models/Booking');

exports.createBooking = async (req, res) => {
  try {
    const { room_id, tanggal_mulai, durasi_bulan, harga_per_bulan } = req.body;

    const userIdHeader = req.headers['x-user-id'];
    const user_id = userIdHeader ? parseInt(userIdHeader) : 1;

    const booking = await Booking.create({
      user_id: user_id,
      room_id: parseInt(room_id),
      tanggal_mulai,
      durasi_bulan: parseInt(durasi_bulan),
      total_harga: parseInt(harga_per_bulan) * parseInt(durasi_bulan)
    });

    res.status(201).json({
      status: 'success',
      message: 'Booking berhasil dibuat',
      data: booking
    });

  } catch (error) {
    console.error("ERROR BOOKING:", error);

    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};
