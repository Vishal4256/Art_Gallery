import mongoose from 'mongoose';

const artistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  bio: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: '/uploads/default-artist.jpg'
  },
  socialLinks: {
    instagram: { type: String, default: '' },
    twitter: { type: String, default: '' },
    website: { type: String, default: '' }
  }
}, { timestamps: true });

const Artist = mongoose.model('Artist', artistSchema);
export default Artist;
