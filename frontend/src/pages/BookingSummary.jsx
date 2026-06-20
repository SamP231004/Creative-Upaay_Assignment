import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setActivePage, clearSelection } from '../store/bookingSlice.js';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';

// Stripe Imports
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Initialize Stripe outside of component render to avoid recreating Stripe object on every render
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

/* -------------------------------------------------------------------------- */
/* CHILD COMPONENT: The Actual Payment Form                                   */
/* -------------------------------------------------------------------------- */
const CheckoutForm = ({ grandTotal }) => {
    const stripe = useStripe();
    const elements = useElements();
    const dispatch = useDispatch();
    const { user } = useUser();
    const { currentMovie, selectedDate, selectedTheater, selectedTimeSlot, selectedSeats } = useSelector((state) => state.booking);

    const [isProcessing, setIsProcessing] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) return;

        setIsProcessing(true);
        setErrorMessage(null);

        // 1. Confirm the payment with Stripe directly
        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            redirect: 'if_required', // Prevents automatic redirect so we can save to DB first
        });

        if (error) {
            setErrorMessage(error.message);
            setIsProcessing(false);
            return;
        }

        // 2. If payment succeeds, save the reservation to your MongoDB
        if (paymentIntent && paymentIntent.status === 'succeeded') {
            try {
                const payload = {
                    userId: user.id,
                    userEmail: user.primaryEmailAddress.emailAddress,
                    movieTitle: currentMovie.title,
                    theaterId: selectedTheater._id,
                    scheduleTime: selectedTimeSlot,
                    date: selectedDate,
                    seats: selectedSeats,
                    totalPrice: grandTotal
                };

                const res = await axios.post(`${import.meta.env.VITE_API_URL}/reserve`, payload);

                if (res.data.success) {
                    dispatch(clearSelection());
                    dispatch(setActivePage('bookings')); // Redirect to success/tickets page
                }
            } catch (err) {
                setErrorMessage("Payment succeeded, but failed to secure database allocation. Please contact support.");
            }
        }

        setIsProcessing(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* This automatically renders a secure, PCI-compliant card input field */}
            <PaymentElement className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800" />

            {errorMessage && <div className="text-[11px] text-red-500 font-bold bg-red-50 dark:bg-red-900/20 p-2 rounded-lg">{errorMessage}</div>}

            <button
                type="submit"
                disabled={!stripe || isProcessing}
                className="w-full bg-purple-600 text-white font-bold text-[13px] py-3.5 rounded-xl mt-6 transition-all active:scale-[0.98] shadow-lg shadow-purple-600/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isProcessing ? 'Processing Transaction...' : `Pay ₹${grandTotal} securely`}
            </button>
        </form>
    );
};

/* -------------------------------------------------------------------------- */
/* PARENT COMPONENT: Fetches intent and provides context                      */
/* -------------------------------------------------------------------------- */
export default function BookingSummary() {
    const dispatch = useDispatch();
    const { selectedSeats, totalPrice } = useSelector((state) => state.booking);

    const [clientSecret, setClientSecret] = useState("");
    const bookingFee = 20;
    const grandTotal = totalPrice + bookingFee;

    useEffect(() => {
        // Tell the backend to create a Stripe Payment Intent when the page loads
        axios.post(`${import.meta.env.VITE_API_URL}/create-payment-intent`, { amount: grandTotal })
            .then((res) => setClientSecret(res.data.clientSecret))
            .catch((err) => console.error("Failed to initialize payment gateway", err));
    }, [grandTotal]);

    const appearance = {
        theme: document.documentElement.classList.contains('dark') ? 'night' : 'stripe',
        variables: {
            colorPrimary: '#9333ea', // Tailwind Purple 600
        },
    };

    return (
        <div className="flex-1 overflow-y-auto no-scrollbar bg-slate-50 dark:bg-slate-950 px-5 pt-6 pb-24 transition-colors duration-300">
            <div className="flex justify-between items-center mb-6 text-slate-900 dark:text-white">
                <button onClick={() => dispatch(setActivePage('seat-selection'))} className="flex items-center gap-2 font-medium text-sm">
                    <ArrowLeft size={18} /> Back
                </button>
                <button className="font-medium text-sm">Cancel</button>
            </div>

            <h2 className="text-[18px] font-black text-slate-900 dark:text-white mb-5">Checkout Summary</h2>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 mb-6 shadow-sm">
                <h3 className="text-[13px] font-bold text-slate-900 dark:text-white mb-3">Order Details</h3>
                <div className="space-y-2 text-[12px] text-slate-500 dark:text-slate-400">
                    <div className="flex justify-between"><span>{selectedSeats.length}x Tickets Base Fare</span><span>₹{totalPrice}</span></div>
                    <div className="flex justify-between"><span>Convenience & Gateway Fee</span><span>₹{bookingFee}</span></div>
                    <div className="flex justify-between text-slate-900 dark:text-white font-black text-[15px] pt-3 mt-3 border-t border-slate-100 dark:border-slate-800">
                        <span>Amount Payable</span><span>₹{grandTotal}</span>
                    </div>
                </div>
            </div>

            {/* Only render the form once we receive the secret key from the backend */}
            {clientSecret ? (
                <Elements options={{ clientSecret, appearance }} stripe={stripePromise}>
                    <CheckoutForm grandTotal={grandTotal} />
                </Elements>
            ) : (
                <div className="flex justify-center items-center py-10">
                    <div className="animate-spin w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full"></div>
                    <span className="ml-3 text-xs text-slate-500 font-bold">Initializing Secure Gateway...</span>
                </div>
            )}
        </div>
    );
}