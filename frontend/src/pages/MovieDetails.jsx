import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setActivePage } from '../store/bookingSlice.js';
import { ArrowLeft, Heart, Star } from 'lucide-react';

export default function MovieDetails() {
    const movie = useSelector((state) => state.booking.currentMovie);
    const dispatch = useDispatch();

    if (!movie) return null;

    return (
        <div className="flex-1 overflow-y-auto no-scrollbar bg-white dark:bg-slate-950 transition-colors duration-300 relative">
            <div className="relative h-[250px] w-full shrink-0">
                <img src={movie.banner} alt={movie.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-slate-950 via-transparent to-black/40 transition-colors duration-300" />

                <div className="absolute top-6 left-0 right-0 px-4 flex justify-between items-center z-10">
                    <button onClick={() => dispatch(setActivePage('home'))} className="flex items-center gap-2 text-white font-medium text-sm drop-shadow-md">
                        <ArrowLeft size={18} /> Close
                    </button>
                    <button className="text-white drop-shadow-md">
                        <Heart size={22} />
                    </button>
                </div>
            </div>

            {/* Added proper padding-bottom to clear the navbar */}
            <div className="px-5 -mt-6 relative z-10 pb-24">
                <div className="flex justify-between items-start mb-1">
                    <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white max-w-[70%]">{movie.title}</h1>
                    <div className="flex items-center gap-1 text-[13px] font-bold text-slate-900 dark:text-white">
                        <Star size={14} className="fill-slate-900 dark:fill-white" /> 4.5
                    </div>
                </div>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-4">{movie.formats.join(', ')} · Action, Sci-Fi</p>
                <p className="text-[12px] text-slate-600 dark:text-slate-300 leading-relaxed mb-6">{movie.description}</p>

                <h3 className="text-[13px] font-bold text-slate-900 dark:text-white mb-3">Format Available</h3>
                <div className="flex gap-2 mb-6">
                    {movie.formats.map(f => (
                        <span key={f} className="text-[11px] font-bold border border-slate-200 dark:border-slate-700 text-purple-600 dark:text-purple-400 px-3 py-1 rounded-md">{f}</span>
                    ))}
                </div>

                <h3 className="text-[13px] font-bold text-slate-900 dark:text-white mb-2">Release Date</h3>
                <p className="text-[12px] text-slate-600 dark:text-slate-400 mb-6">10 June 2026</p>

                <h3 className="text-[13px] font-bold text-slate-900 dark:text-white mb-3">Cast</h3>
                <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                    {movie.cast.map((c, i) => (
                        <div key={i} className="flex items-center gap-3 min-w-[140px]">
                            <img src={c.image} alt={c.name} className="w-10 h-10 rounded-lg object-cover bg-slate-100 dark:bg-slate-800" />
                            <div className="flex flex-col">
                                <span className="text-[11px] font-bold text-slate-900 dark:text-white truncate w-24">{c.name}</span>
                                <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate w-24">{c.role}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Normal document flow button placement */}
                <div className="mt-8">
                    <button
                        onClick={() => dispatch(setActivePage('scheduling'))}
                        className="w-full bg-purple-600 text-white font-bold text-[13px] py-3.5 rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-purple-600/30"
                    >
                        Get Tickets
                    </button>
                </div>
            </div>
        </div>
    );
}