import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setSchedule, setActivePage } from '../store/bookingSlice.js';
import axios from 'axios';
import { ArrowLeft, MapPin, Calendar } from 'lucide-react';

export default function Scheduling() {
    const dispatch = useDispatch();
    const movie = useSelector((state) => state.booking.currentMovie);
    const [theaters, setTheaters] = useState([]);
    const [selectedDay, setSelectedDay] = useState(null);
    const [format, setFormat] = useState('2D');

    const dateOptions = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i);
        return {
            dayNum: d.getDate(),
            dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
            formatted: d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
        };
    });

    useEffect(() => {
        if (!selectedDay) setSelectedDay(dateOptions[0].formatted);
        axios.get(`${import.meta.env.VITE_API_URL}/dashboard`)
            .then(res => setTheaters(res.data.theaters))
            .catch(err => console.error(err));
    }, []);

    const handleSlotSelection = (theater, slot) => {
        dispatch(setSchedule({
            date: selectedDay,
            theater: theater,
            timeSlot: slot.time,
            format: slot.format
        }));
        dispatch(setActivePage('seat-selection'));
    };

    return (
        <div className="flex-1 overflow-y-auto no-scrollbar bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            <div className="relative h-[180px] w-full">
                <img src={movie?.banner} alt={movie?.title} className="w-full h-full object-cover opacity-80" />
                <div className="absolute inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-[2px]" />

                <div className="absolute top-6 left-0 right-0 px-4 flex justify-between items-center z-10 text-white">
                    <button onClick={() => dispatch(setActivePage('details'))} className="flex items-center gap-2 font-medium text-sm">
                        <ArrowLeft size={18} /> Back
                    </button>
                    <button className="font-medium text-sm">Cancel</button>
                </div>

                <div className="absolute bottom-6 left-5 right-5 z-10 text-white">
                    <h1 className="text-xl font-black mb-1">{movie?.title}</h1>
                    <p className="text-[11px] text-slate-300 flex items-center gap-3">
                        <span className="flex items-center gap-1"><MapPin size={10} /> The Grandview</span>
                        <span className="flex items-center gap-1"><Calendar size={10} /> {selectedDay}</span>
                    </p>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-950 rounded-t-3xl -mt-4 relative z-20 pt-6 px-5 pb-6 min-h-screen">
                <h2 className="text-[14px] font-bold text-slate-900 dark:text-white mb-4">Choose Schedule</h2>

                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-4 -mx-5 px-5">
                    {dateOptions.map((d, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedDay(d.formatted)}
                            className={`flex flex-col items-center justify-center py-2 px-3 min-w-[45px] rounded-xl border transition-all ${selectedDay === d.formatted
                                ? 'bg-purple-600 border-purple-600 text-white shadow-md'
                                : 'bg-transparent border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                                }`}
                        >
                            <span className="text-[10px] font-medium">{d.dayName}</span>
                            <span className="text-[13px] font-black">{d.dayNum}</span>
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-3 mb-6">
                    <span className="text-[12px] font-bold text-slate-900 dark:text-white mr-2">Format</span>
                    {['2D', '3D'].map(f => (
                        <button key={f} onClick={() => setFormat(f)} className={`text-[11px] font-bold px-3 py-1 rounded-md transition-colors ${format === f ? 'bg-purple-600 text-white' : 'border border-slate-200 dark:border-slate-700 text-purple-600 dark:text-purple-400'
                            }`}>
                            {f}
                        </button>
                    ))}
                    <span className="ml-auto text-[11px] font-bold text-slate-500">₹300 - ₹450</span>
                </div>

                <div className="space-y-6">
                    {theaters.map((theater) => (
                        <div key={theater._id}>
                            <h3 className="text-[13px] font-bold text-slate-900 dark:text-white mb-3">{theater.name}</h3>
                            <div className="flex flex-wrap gap-2">
                                {theater.schedules.map((slot, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleSlotSelection(theater, slot)}
                                        className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 hover:border-purple-600 dark:hover:border-purple-500 rounded-md text-[11px] font-bold text-purple-600 dark:text-purple-400 transition-colors"
                                    >
                                        {slot.time}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}