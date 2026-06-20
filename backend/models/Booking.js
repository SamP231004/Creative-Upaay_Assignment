import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Clerk User ID
  userEmail: { type: String, required: true },
  movieTitle: { type: String, required: true },
  theaterName: { type: String, required: true },
  timeSlot: { type: String, required: true },
  date: { type: String, required: true },
  seats: [{ type: String }],
  totalPrice: { type: Number, required: true },
  status: { type: String, enum: ['Confirmed', 'Cancelled'], default: 'Confirmed' },
  qrCodeMock: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('Booking', bookingSchema);