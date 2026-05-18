import express from 'express';
import { getArtworks, getArtworkById, createArtwork, deleteArtwork, updateArtwork } from '../controllers/artworkController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getArtworks).post(protect, admin, createArtwork);
router.route('/:id')
  .get(getArtworkById)
  .put(protect, admin, updateArtwork)
  .delete(protect, admin, deleteArtwork);

export default router;
