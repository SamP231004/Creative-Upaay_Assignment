import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useDispatch } from 'react-redux';
import { setActivePage } from '../store/bookingSlice.js';
import axios from 'axios';
import { Trash2, ShieldAlert, ArrowLeft, QrCode } from 'lucide-react';

export default function MyBookings() {
    const { user, isSignedIn } = useUser();
    const dispatch = useDispatch();
    const [bookings, setBookings] = useState([]);

    const fetchBookings = () => {
        if (isSignedIn && user) {
            axios.get(`${import.meta.env.VITE_API_URL}/user-bookings/${user.id}`)
                .then(res => setBookings(res.data))
                .catch(err => console.error(err));
        }
    };

    useEffect(() => {
        fetchBookings();
    }, [isSignedIn, user]);

    const handleCancellation = async (bookingId) => {
        if (window.confirm("Confirm cancellation request? Seats will return to the available pool immediately.")) {
            try {
                await axios.put(`${import.meta.env.VITE_API_URL}/cancel-booking/${bookingId}`);
                fetchBookings();
            } catch (err) {
                console.error(err);
            }
        }
    };

    if (!isSignedIn) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
                <ShieldAlert size={36} className="text-purple-600 dark:text-purple-500 mb-2" />
                <p className="text-[13px] text-slate-500 dark:text-slate-400">Please authenticate your profile via the bottom navigation to view your tickets.</p>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto no-scrollbar bg-slate-50 dark:bg-slate-950 px-5 pt-6 pb-24 transition-colors duration-300">
            {/* Header */}
            <div className="flex justify-between items-center mb-6 text-slate-900 dark:text-white">
                <button onClick={() => dispatch(setActivePage('home'))} className="flex items-center gap-2 font-medium text-sm transition-opacity hover:opacity-70">
                    <ArrowLeft size={18} /> Back
                </button>
            </div>

            {/* Figma-style Tabs */}
            <div className="flex gap-4 mb-6 border-b border-slate-200 dark:border-slate-800">
                <button className="text-[13px] font-bold text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 pb-1.5 transition-colors">My Bookings</button>
                <button className="text-[13px] font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 pb-1.5 transition-colors">Past Bookings</button>
            </div>

            <div className="space-y-5">
                {bookings.length === 0 ? (
                    <div className="text-center py-16 flex flex-col items-center">
                        <QrCode size={40} strokeWidth={1} className="text-slate-300 dark:text-slate-700 mb-3" />
                        <p className="text-xs text-slate-500 dark:text-slate-400">No active ticket allocations found.</p>
                    </div>
                ) : (
                    bookings.map((b) => (
                        <div key={b._id} className={`bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm border transition-colors duration-300 ${b.status === 'Cancelled' ? 'border-red-200 dark:border-red-900/50 opacity-60' : 'border-slate-200 dark:border-slate-800'
                            }`}>

                            {/* Ticket Banner Image */}
                            <div className="h-32 bg-slate-200 dark:bg-slate-800 relative">
                                <img src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&q=80" alt="Ticket Banner" className="w-full h-full object-cover" />
                                {b.status === 'Cancelled' && (
                                    <div className="absolute top-3 right-3 bg-red-600 text-[10px] px-2 py-1 rounded text-white uppercase font-black tracking-widest z-10 shadow-md">
                                        Void / Cancelled
                                    </div>
                                )}
                            </div>

                            {/* Ticket Details */}
                            <div className="p-4">
                                <h3 className="text-[16px] font-black text-slate-900 dark:text-white mb-4">{b.movieTitle}</h3>

                                <div className="grid grid-cols-2 gap-y-4 text-[12px] mb-5">
                                    <div>
                                        <p className="text-slate-500 dark:text-slate-400 mb-1">Theater</p>
                                        <p className="font-bold text-slate-900 dark:text-white truncate pr-2">{b.theaterName}</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-500 dark:text-slate-400 mb-1">Date & Time</p>
                                        <p className="font-bold text-slate-900 dark:text-white">{b.date} · {b.timeSlot}</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-500 dark:text-slate-400 mb-1">Seats:</p>
                                        <div className="flex gap-1.5 flex-wrap">
                                            {b.seats.map(s => (
                                                <span key={s} className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-1.5 py-0.5 rounded font-bold text-slate-900 dark:text-white text-[10px] transition-colors">
                                                    {s}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-slate-500 dark:text-slate-400 mb-1">Amount Paid:</p>
                                        <p className="font-bold text-purple-600 dark:text-purple-400">₹{b.totalPrice}</p>
                                    </div>
                                </div>

                                {/* Actions & QR Code Footer */}
                                <div className="flex justify-between items-end pt-4 border-t border-dashed border-slate-200 dark:border-slate-700">
                                    {b.status === 'Confirmed' ? (
                                        <button
                                            onClick={() => handleCancellation(b._id)}
                                            className="text-[11px] text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/30 px-3 py-2 rounded-lg font-bold transition-colors flex items-center gap-1.5 active:scale-95"
                                        >
                                            <Trash2 size={14} /> Cancel Booking
                                        </button>
                                    ) : (
                                        <span className="text-[11px] font-bold text-slate-400 dark:text-slate-600 flex items-center gap-1.5">
                                            <ShieldAlert size={14} /> Allocation Retracted
                                        </span>
                                    )}

                                    {/* Mock QR Code UI */}
                                    <div className="w-16 h-16 bg-white p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-sm">
                                        <QrCode size={48} strokeWidth={1.5} className="text-slate-900" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}