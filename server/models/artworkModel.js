import mongoose from 'mongoose';

const artworkSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  artist: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Artist'
  },
  price: {
    type: Number,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Painting', 'Sculpture', 'Photography', 'Digital', 'Mixed Media', 'Other']
  },
  status: {
    type: String,
    required: true,
    enum: ['available', 'reserved', 'sold'],
    default: 'available'
  }
}, { timestamps: true });

const Artwork = mongoose.model('Artwork', artworkSchema);
export default Artwork;
