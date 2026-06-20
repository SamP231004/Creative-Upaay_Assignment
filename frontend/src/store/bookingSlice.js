import { createSlice } from '@reduxjs/toolkit';

const loadFromLocalStorage = () => {
    try {
        const serializedState = localStorage.getItem('redux_booking_state');
        if (serializedState === null) return undefined;
        return JSON.parse(serializedState);
    } catch (err) {
        return undefined;
    }
};

const initialState = loadFromLocalStorage() || {
    currentMovie: null,
    selectedDate: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
    selectedTheater: null,
    selectedTimeSlot: null,
    selectedFormat: '2D',
    selectedSeats: [],
    totalPrice: 0,
    activePage: 'home',
    theme: 'dark' // Added theme state
};

const bookingSlice = createSlice({
    name: 'booking',
    initialState,
    reducers: {
        setMovie: (state, action) => { /* existing code */
            state.currentMovie = action.payload;
            state.selectedSeats = [];
            state.totalPrice = 0;
        },
        setSchedule: (state, action) => { /* existing code */
            state.selectedDate = action.payload.date;
            state.selectedTheater = action.payload.theater;
            state.selectedTimeSlot = action.payload.timeSlot;
            state.selectedFormat = action.payload.format;
            state.selectedSeats = [];
            state.totalPrice = 0;
        },
        toggleSeatSelection: (state, action) => { /* existing code */
            const seat = action.payload.seatLabel;
            const price = action.payload.price;
            if (state.selectedSeats.includes(seat)) {
                state.selectedSeats = state.selectedSeats.filter(s => s !== seat);
                state.totalPrice -= price;
            } else {
                if (state.selectedSeats.length < 6) {
                    state.selectedSeats.push(seat);
                    state.totalPrice += price;
                }
            }
        },
        clearSelection: (state) => { /* existing code */
            state.selectedSeats = [];
            state.totalPrice = 0;
        },
        setActivePage: (state, action) => { /* existing code */
            state.activePage = action.payload;
        },
        toggleTheme: (state) => { // New reducer for theme
            state.theme = state.theme === 'dark' ? 'light' : 'dark';
        }
    }
});

export const { setMovie, setSchedule, toggleSeatSelection, clearSelection, setActivePage, toggleTheme } = bookingSlice.actions;
export default bookingSlice.reducer;