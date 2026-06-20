import redisClient from '../config/redis.js';

const LOCK_EXPIRY = 300; // 5 Minutes in seconds

export const lockSeats = async (req, res) => {
    try {
        const { theaterId, scheduleTime, seats, userId } = req.body;

        // 1. Verify if ANY of the requested seats are already locked by someone else
        const checkPromises = seats.map(seat =>
            redisClient.get(`lock:${theaterId}:${scheduleTime}:${seat}`)
        );
        const existingLocks = await Promise.all(checkPromises);

        const isLockedByOther = existingLocks.some(lock => lock !== null && lock !== userId);

        if (isLockedByOther) {
            return res.status(409).json({
                success: false,
                message: 'One or more of these seats are currently being checked out by another user. Please select different seats.'
            });
        }

        // 2. If all are free, place a lock on all of them simultaneously
        const setPromises = seats.map(seat =>
            redisClient.setEx(`lock:${theaterId}:${scheduleTime}:${seat}`, LOCK_EXPIRY, userId)
        );
        await Promise.all(setPromises);

        res.status(200).json({ success: true, message: 'Seats locked for 5 minutes.' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};