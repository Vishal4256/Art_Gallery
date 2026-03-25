import Reservation from '../models/reservationModel.js';
import Artwork from '../models/artworkModel.js';

// @desc    Create new reservation
// @route   POST /api/reservations
// @access  Private
export const addReservation = async (req, res) => {
  try {
    const { artworkId } = req.body;

    // Check if artwork is already reserved or sold
    const artwork = await Artwork.findById(artworkId);

    if (!artwork) {
      return res.status(404).json({ message: 'Artwork not found' });
    }

    if (artwork.status !== 'available') {
      return res.status(400).json({ message: 'Artwork is not available for reservation' });
    }

    const reservation = new Reservation({
      user: req.user._id,
      artwork: artworkId
    });

    const createdReservation = await reservation.save();

    // Update artwork status
    artwork.status = 'reserved';
    await artwork.save();

    res.status(201).json(createdReservation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user reservations
// @route   GET /api/reservations/myreservations
// @access  Private
export const getMyReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({ user: req.user._id }).populate('artwork');
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all reservations
// @route   GET /api/reservations
// @access  Private/Admin
export const getReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({}).populate('user', 'id name email').populate('artwork', 'title price');
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
