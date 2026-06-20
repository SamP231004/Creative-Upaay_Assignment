import mongoose from 'mongoose';

const theaterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  basePrice: { type: Number, required: true },
  schedules: [{
    time: { type: String }, // e.g. "10:30 AM", "02:15 PM"
    format: { type: String }, // "2D" or "3D"
    occupiedSeats: [{ type: String }] // Array of labels like "B-5", "F-12"
  }]
}, { timestamps: true });

export default mongoose.model('Theater', theaterSchema);