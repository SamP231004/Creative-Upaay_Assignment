import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setActivePage } from '../store/bookingSlice.js';
import { Home, Ticket, Heart, User } from 'lucide-react';

export default function BottomNav() {
    const dispatch = useDispatch();
    const activePage = useSelector((state) => state.booking.activePage);

    const navigationItems = [
        { id: 'home', icon: Home },
        { id: 'bookings', icon: Ticket },
        { id: 'saved', icon: Heart }, // Added Heart/Saved icon from Figma
        { id: 'profile', icon: User }
    ];

    return (
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-white dark:bg-slate-950 flex items-center justify-around z-50 px-2 border-t border-slate-100 dark:border-slate-900 transition-colors duration-300 pb-safe">
            {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = activePage === item.id;
                return (
                    <button
                        key={item.id}
                        onClick={() => dispatch(setActivePage(item.id))}
                        className={`flex items-center justify-center w-12 h-12 transition-all ${isActive
                                ? 'text-purple-600 dark:text-purple-500'
                                : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                            }`}
                    >
                        <Icon size={22} className={isActive ? 'stroke-[2.5]' : 'stroke-[1.5]'} />
                    </button>
                );
            })}
        </div>
    );
}