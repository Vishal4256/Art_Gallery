import mongoose from 'mongoose';

const exhibitionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  image: {
    type: String,
    required: true
  }
}, { timestamps: true });

const Exhibition = mongoose.model('Exhibition', exhibitionSchema);
export default Exhibition;
