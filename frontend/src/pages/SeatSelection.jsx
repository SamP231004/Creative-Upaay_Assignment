import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleSeatSelection, setActivePage } from '../store/bookingSlice.js';
import SeatLayout from '../components/SeatLayout.jsx';
import { ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { useUser } from '@clerk/clerk-react';

export default function SeatSelection() {
    const dispatch = useDispatch();
    const { selectedTheater, selectedTimeSlot, selectedSeats, totalPrice } = useSelector((state) => state.booking);
    const [occupiedSeats, setOccupiedSeats] = useState([]);
    const { user, isSignedIn } = useUser();
    const [lockError, setLockError] = useState('');
    const [isLocking, setIsLocking] = useState(false);

    useEffect(() => {
        if (selectedTheater) {
            axios.get(`${import.meta.env.VITE_API_URL}/dashboard`)
                .then(res => {
                    const matched = res.data.theaters.find(t => t._id === selectedTheater._id);
                    const schedule = matched?.schedules.find(s => s.time === selectedTimeSlot);
                    if (schedule) setOccupiedSeats(schedule.occupiedSeats);
                });
        }
    }, [selectedTheater, selectedTimeSlot]);

    const handleSeatClick = (seatLabel, price) => {
        dispatch(toggleSeatSelection({ seatLabel, price }));
    };

    return (
        <div className="flex-1 overflow-y-auto no-scrollbar bg-white dark:bg-slate-950 transition-colors duration-300 px-5 pt-6 relative pb-24">
            <div className="flex justify-between items-center mb-6 text-slate-900 dark:text-white">
                <button onClick={() => dispatch(setActivePage('scheduling'))} className="flex items-center gap-2 font-medium text-sm">
                    <ArrowLeft size={18} /> Back
                </button>
                <button className="font-medium text-sm">Cancel</button>
            </div>

            <div className="flex justify-between items-end mb-8">
                <div>
                    <h2 className="text-[18px] font-black text-slate-900 dark:text-white">Select Seats</h2>
                    <p className="text-[11px] text-purple-600 dark:text-purple-400 font-bold mt-1">Screen 1 <span className="ml-2 text-slate-500">{selectedTimeSlot}</span></p>
                </div>
                <span className="text-[14px] font-black text-slate-900 dark:text-white">₹{totalPrice}</span>
            </div>

            <SeatLayout
                occupiedSeats={occupiedSeats}
                selectedSeats={selectedSeats}
                onSeatClick={handleSeatClick}
                basePrice={selectedTheater?.basePrice || 200}
            />

            {/* Normal document flow button placement */}
            <div className="mt-12">
                {/* Show lock errors if someone beat them to the seat */}
                {lockError && (
                    <div className="absolute bottom-24 left-5 right-5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-xs font-bold text-center border border-red-200 dark:border-red-900">
                        {lockError}
                    </div>
                )}

                {/* Normal document flow button placement */}
                <div className="mt-12">
                    <button
                        disabled={selectedSeats.length === 0 || isLocking}
                        onClick={async () => {
                            if (!isSignedIn) {
                                alert("Please sign in via the profile tab to lock seats.");
                                return;
                            }
                            setIsLocking(true);
                            setLockError('');
                            try {
                                const res = await axios.post(`${import.meta.env.VITE_API_URL}/lock-seats`, {
                                    theaterId: selectedTheater._id,
                                    scheduleTime: selectedTimeSlot,
                                    seats: selectedSeats,
                                    userId: user.id
                                });

                                if (res.data.success) {
                                    dispatch(setActivePage('summary'));
                                }
                            } catch (err) {
                                setLockError(err.response?.data?.message || "Failed to secure seats.");
                            } finally {
                                setIsLocking(false);
                            }
                        }}
                        className={`w-full font-bold text-[13px] py-3.5 rounded-xl transition-all ${selectedSeats.length > 0
                                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                            }`}
                    >
                        {isLocking ? 'Locking Seats...' : 'View Booking Summary'}
                    </button>
                </div>
            </div>
        </div>
    );
}