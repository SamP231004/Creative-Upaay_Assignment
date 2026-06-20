import { configureStore } from '@reduxjs/toolkit';
import bookingReducer from './bookingSlice.js';

const store = configureStore({
    reducer: {
        booking: bookingReducer
    }
});

store.subscribe(() => {
    try {
        const state = store.getState().booking;
        localStorage.setItem('redux_booking_state', JSON.stringify(state));
    } catch (err) {
        console.error("Could not save state to local storage", err);
    }
});

export default store;