const Booking = require('../models/Booking');
const axios = require('axios');

exports.createBooking = async (req, res) => {
    try {
        const { room_id, tanggal_mulai, tanggal_selesai } = req.body;
        const user_id = req.headers['x-user-id'];

        if (!user_id) {
            return res.status(401).json({ status: 'error', message: 'Token tidak valid, ID User tidak ditemukan' });
        }

        const mulai = new Date(tanggal_mulai);
        const selesai = new Date(tanggal_selesai);
        const selisihHari = Math.ceil((selesai - mulai) / (1000 * 60 * 60 * 24));

        if (selisihHari <= 0) {
            return res.status(400).json({ status: 'error', message: 'Tanggal selesai harus setelah tanggal mulai!' });
        }

        const responseKos = await axios.get(`http://kos-service:8000/api/rooms/${room_id}`);
        const hargaPerBulan = responseKos.data.data.harga_per_bulan;

        const total_harga = Math.round((selisihHari / 30) * hargaPerBulan);
        const durasi_bulan = parseFloat((selisihHari / 30).toFixed(2));

        const booking = await Booking.create({
            user_id: parseInt(user_id),
            room_id: parseInt(room_id),
            tanggal_mulai,
            tanggal_selesai,
            durasi_bulan,
            total_harga,
            status: 'pending'
        });

        res.status(201).json({ status: 'success', message: 'Booking berhasil dibuat', data: booking });
    } catch (error) {
        const errorMessage = error.response ? error.response.data.message : error.message;
        res.status(500).json({ status: 'error', message: errorMessage });
    }
};

exports.getUserBookings = async (req, res) => {
    try {
        const user_id = req.headers['x-user-id'];
        const bookings = await Booking.findAll({ where: { user_id } });

        res.status(200).json({ status: 'success', data: bookings });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

exports.getBookingById = async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await Booking.findByPk(id);

        if (!booking) {
            return res.status(404).json({ status: 'error', message: 'Data booking tidak ditemukan' });
        }

        res.status(200).json({ status: 'success', data: booking });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

exports.updateBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const booking = await Booking.findByPk(id);
        if (!booking) {
            return res.status(404).json({ status: 'error', message: 'Booking tidak ditemukan' });
        }

        await booking.update({ status });
        res.status(200).json({ status: 'success', message: 'Status booking berhasil diupdate', data: booking });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

exports.deleteBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await Booking.findByPk(id);

        if (!booking) {
            return res.status(404).json({ status: 'error', message: 'Booking tidak ditemukan' });
        }

        await booking.destroy();
        res.status(200).json({ status: 'success', message: 'Booking berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};
