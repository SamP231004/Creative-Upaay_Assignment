import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  banner: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['Now Showing', 'Coming Soon'], required: true },
  formats: [{ type: String }], // ['2D', '3D', 'IMAX']
  cast: [{
    name: { type: String },
    role: { type: String },
    image: { type: String }
  }]
}, { timestamps: true });

export default mongoose.model('Movie', movieSchema);