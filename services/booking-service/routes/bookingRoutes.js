const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/BookingController');

router.get('/', bookingController.getUserBookings);
router.get('/:id', bookingController.getBookingById);
router.post('/', bookingController.createBooking);
router.put('/:id', bookingController.updateBooking);
router.delete('/:id', bookingController.deleteBooking);

module.exports = router;
