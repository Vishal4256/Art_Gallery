import express from 'express';
import { getArtists, createArtist, getArtistById, updateArtist, deleteArtist } from '../controllers/artistController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getArtists).post(protect, admin, createArtist);
router.route('/:id')
  .get(getArtistById)
  .put(protect, admin, updateArtist)
  .delete(protect, admin, deleteArtist);

export default router;
