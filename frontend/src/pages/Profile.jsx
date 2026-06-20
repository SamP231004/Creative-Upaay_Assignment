import React from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme, setActivePage } from '../store/bookingSlice.js';
import { Moon, Sun, LogOut, ChevronRight, CreditCard, Bell } from 'lucide-react';

export default function Profile() {
    const { user } = useUser();
    const { signOut } = useClerk();
    const dispatch = useDispatch();
    const theme = useSelector((state) => state.booking.theme);

    const handleLogout = async () => {
        await signOut();
        dispatch(setActivePage('home'));
    };

    return (
        <div className="flex-1 overflow-y-auto no-scrollbar pb-24 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            <div className="flex flex-col items-center pt-10 pb-6 px-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
                <img src={user?.imageUrl || 'https://via.placeholder.com/150'} alt="Profile" className="w-24 h-24 rounded-full border-[3px] border-purple-500 shadow-md object-cover" />
                <h2 className="text-lg font-black mt-4 text-slate-900 dark:text-white transition-colors">{user?.fullName || 'User Profile'}</h2>
                <p className="text-xs text-slate-500 font-medium mt-1">{user?.primaryEmailAddress?.emailAddress || 'Authenticated Account'}</p>
            </div>

            <div className="px-5 mt-6 space-y-3">
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 pl-1">App Settings</h3>

                <button onClick={() => dispatch(toggleTheme())} className="w-full flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 transition-all">
                    <div className="flex items-center gap-3 text-slate-700 dark:text-slate-200">
                        {theme === 'dark' ? <Moon size={18} className="text-purple-500" /> : <Sun size={18} className="text-amber-500" />}
                        <span className="text-[13px] font-bold">Appearance</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">{theme} Mode</span>
                        <ChevronRight size={16} className="text-slate-400" />
                    </div>
                </button>

                <div className="w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                    <button className="w-full flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800/50">
                        <div className="flex items-center gap-3 text-slate-700 dark:text-slate-200">
                            <CreditCard size={18} /> <span className="text-[13px] font-bold">Payment Methods</span>
                        </div>
                        <ChevronRight size={16} className="text-slate-400" />
                    </button>
                    <button className="w-full flex items-center justify-between p-4">
                        <div className="flex items-center gap-3 text-slate-700 dark:text-slate-200">
                            <Bell size={18} /> <span className="text-[13px] font-bold">Notifications</span>
                        </div>
                        <ChevronRight size={16} className="text-slate-400" />
                    </button>
                </div>
            </div>

            <div className="px-5 mt-8">
                <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 p-4 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-2xl border border-red-200 dark:border-red-500/30 font-bold text-[13px]">
                    <LogOut size={16} /> Sign Out
                </button>
            </div>
        </div>
    );
}