import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";
import Home from './pages/Home.jsx';
import MovieDetails from './pages/MovieDetails.jsx';
import Scheduling from './pages/Scheduling.jsx';
import SeatSelection from './pages/SeatSelection.jsx';
import BookingSummary from './pages/BookingSummary.jsx';
import MyBookings from './pages/MyBookings.jsx';
import Profile from './pages/Profile.jsx'; // Import the new component
import BottomNav from './components/BottomNav.jsx';

export default function App() {
    const activePage = useSelector((state) => state.booking.activePage);
    const theme = useSelector((state) => state.booking.theme); // Grab theme state

    // Apply the dark class to the HTML document element based on state
    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    const renderActiveScreen = () => {
        switch (activePage) {
            case 'home': return <Home />;
            case 'details': return <MovieDetails />;
            case 'scheduling': return <Scheduling />;
            case 'seat-selection': return <SeatSelection />;
            case 'summary': return <BookingSummary />;
            case 'bookings': return <MyBookings />;
            case 'profile':
                return (
                    <>
                        <SignedIn>
                            <Profile />
                        </SignedIn>
                        <SignedOut>
                            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-slate-50 dark:bg-slate-950 transition-colors">
                                <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col items-center shadow-xl">
                                    <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center mb-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                                    </div>
                                    <h3 className="font-black text-slate-900 dark:text-white mb-2 text-lg">Sign In Required</h3>
                                    <p className="text-xs text-slate-500 mb-6 px-4">Create an account or sign in to manage your tickets and preferences.</p>
                                    <div className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm py-3.5 rounded-xl cursor-pointer transition-all shadow-lg shadow-purple-600/30 flex items-center justify-center">
                                        <SignInButton mode="modal" />
                                    </div>
                                </div>
                            </div>
                        </SignedOut>
                    </>
                );
            default: return <Home />;
        }
    };

    return (
        <div className="w-full min-h-screen bg-slate-200 dark:bg-slate-900 flex items-center justify-center p-0 sm:p-4 transition-colors duration-300">
            {/* Changed sm:h-[844px] to sm:h-[760px] for a shorter mobile simulator */}
            <div className="w-full max-w-[390px] h-[100dvh] sm:h-[700px] bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white rounded-none sm:rounded-[40px] shadow-2xl overflow-hidden border border-transparent sm:border-slate-300 dark:sm:border-slate-800 relative flex flex-col transition-colors duration-300">
                {renderActiveScreen()}
                <BottomNav />
            </div>
        </div>
    );
}