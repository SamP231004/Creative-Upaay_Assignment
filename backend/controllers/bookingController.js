import Booking from '../models/Booking.js';
import Theater from '../models/Theater.js';
import redisClient from '../config/redis.js';
import mongoose from 'mongoose';

export const createReservation = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { userId, userEmail, movieTitle, theaterId, scheduleTime, date, seats, totalPrice } = req.body;

        const theater = await Theater.findById(theaterId).session(session);
        if (!theater) {
            throw new Error("Theater not found");
        }

        const schedule = theater.schedules.find(s => s.time === scheduleTime);
        if (!schedule) {
            throw new Error("Target schedule slot not found");
        }

        // Level 2 Distributed Locking / Concurrency check
        const isDoubleBooked = seats.some(seat => schedule.occupiedSeats.includes(seat));
        if (isDoubleBooked) {
            return res.status(409).json({ message: "One or more selected seats have just been booked by another user." });
        }

        // Atomically reserve seats
        schedule.occupiedSeats.push(...seats);
        await theater.save({ session });

        // Save transaction state
        const newBooking = new Booking({
            userId,
            userEmail,
            movieTitle,
            theaterName: theater.name,
            timeSlot: scheduleTime,
            date,
            seats,
            totalPrice,
            qrCodeMock: `MOCK_QR_${Date.now()}_${userId.slice(-4)}`
        });

        await newBooking.save({ session });

        await session.commitTransaction();
        session.endSession();

        const delPromises = seats.map(seat =>
            redisClient.del(`lock:${theaterId}:${scheduleTime}:${seat}`)
        );
        await Promise.all(delPromises);

        res.status(201).json({ success: true, booking: newBooking });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ message: error.message });
    }
};

export const getMyBookings = async (req, res) => {
    try {
        const { userId } = req.params;
        const bookings = await Booking.find({ userId }).sort({ createdAt: -1 });
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const cancelBooking = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { bookingId } = req.params;
        const booking = await Booking.findById(bookingId).session(session);
        if (!booking) {
            return res.status(444).json({ message: "Booking record not found" });
        }

        booking.status = 'Cancelled';
        await booking.save({ session });

        // Free the layout allocations
        const theater = await Theater.findOne({ name: booking.theaterName }).session(session);
        if (theater) {
            const schedule = theater.schedules.find(s => s.time === booking.timeSlot);
            if (schedule) {
                schedule.occupiedSeats = schedule.occupiedSeats.filter(seat => !booking.seats.includes(seat));
                await theater.save({ session });
            }
        }

        await session.commitTransaction();
        session.endSession();
        res.status(200).json({ success: true, message: "Booking cancelled successfully" });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ message: error.message });
    }
};