import express from 'express';
import { getDashboardData, seedDatabase } from '../controllers/movieController.js';
import { createReservation, getMyBookings, cancelBooking } from '../controllers/bookingController.js';
import { createPaymentIntent } from '../controllers/paymentController.js';
import { lockSeats } from '../controllers/lockingController.js';

const router = express.Router();

router.get('/dashboard', getDashboardData);
router.post('/seed', seedDatabase);
router.post('/reserve', createReservation);
router.get('/user-bookings/:userId', getMyBookings);
router.put('/cancel-booking/:bookingId', cancelBooking);
router.post('/create-payment-intent', createPaymentIntent);
router.post('/lock-seats', lockSeats);

export default router;