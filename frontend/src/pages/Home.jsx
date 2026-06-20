import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setMovie, setActivePage } from '../store/bookingSlice.js';
import axios from 'axios';
import { Search, MapPin, Star, MonitorPlay } from 'lucide-react';

export default function Home() {
    const dispatch = useDispatch();
    const [movies, setMovies] = useState([]);
    const [theaters, setTheaters] = useState([]);
    const [activeTab, setActiveTab] = useState('Now Showing');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/dashboard`);
                setMovies(res.data.movies);
                setTheaters(res.data.theaters);
            } catch (err) {
                console.error("Error fetching data", err);
            }
        };
        fetchData();
    }, []);

    const filteredMovies = movies.filter(m => m.status === activeTab);
    const heroMovie = movies.length > 0 ? movies[0] : null;

    return (
        <div className="flex-1 overflow-y-auto no-scrollbar pb-20 bg-white dark:bg-slate-950 transition-colors duration-300">
            {heroMovie && (
                <div className="relative w-full h-56 bg-slate-200 dark:bg-slate-800">
                    <img src={heroMovie.banner} alt="Featured Movie" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                    <button className="absolute top-6 right-4 p-2 text-white/90 hover:text-white transition-colors">
                        <Search size={22} strokeWidth={2} />
                    </button>
                </div>
            )}

            <div className="flex justify-between items-end px-4 mt-5 mb-4">
                <div className="flex gap-4">
                    {['Now Showing', 'Coming Soon'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`text-[13px] font-bold pb-1.5 border-b-[3px] transition-all ${activeTab === tab
                                ? 'text-purple-600 dark:text-purple-400 border-purple-600 dark:border-purple-400'
                                : 'text-slate-400 border-transparent hover:text-slate-600 dark:hover:text-slate-300'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
                <button className="text-[11px] font-bold text-purple-600 dark:text-purple-400 pb-1.5">View All</button>
            </div>

            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 px-4 snap-x">
                {filteredMovies.map((movie) => (
                    <div
                        key={movie._id}
                        onClick={() => {
                            dispatch(setMovie(movie));
                            dispatch(setActivePage('details'));
                        }}
                        className="min-w-[130px] max-w-[130px] snap-start cursor-pointer group"
                    >
                        <div className="w-full h-[190px] rounded-xl overflow-hidden relative mb-2.5 bg-slate-100 dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800">
                            <img src={movie.banner} alt={movie.title} className="w-full h-full object-cover" />
                            <div className="absolute bottom-0 right-0 bg-[#0f172a] text-white text-[10px] font-bold px-2 py-1 rounded-tl-xl flex items-center gap-1">
                                <Star size={10} className="fill-white" /> 4.5
                            </div>
                        </div>
                        <h3 className="text-[13px] font-bold truncate text-slate-900 dark:text-white mb-0.5">{movie.title}</h3>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{movie.formats.join(', ')}</p>
                    </div>
                ))}
            </div>

            <div className="mt-2">
                <div className="flex justify-between items-end px-4 mb-4">
                    <h2 className="text-[13px] font-bold text-slate-900 dark:text-white">Movie Theatres</h2>
                    <button className="text-[11px] font-bold text-purple-600 dark:text-purple-400">View All</button>
                </div>

                <div className="space-y-0">
                    {theaters.map((theater) => (
                        <div key={theater._id} className="px-4 py-3 bg-white dark:bg-slate-950 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors border-b border-slate-50 dark:border-slate-900 last:border-0">
                            <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center text-slate-400 shrink-0">
                                <MonitorPlay size={20} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-[13px] font-bold text-slate-900 dark:text-white truncate">{theater.name}</h4>
                                <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5 truncate"><MapPin size={10} className="shrink-0" /> {theater.location}</p>
                                <div className="mt-1.5 flex items-center gap-2">
                                    <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">₹{theater.basePrice} - ₹{theater.basePrice + 150}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}