import express from 'express';
import { getArtworks, getArtworkById, createArtwork, deleteArtwork } from '../controllers/artworkController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getArtworks).post(protect, admin, createArtwork);
router.route('/:id').get(getArtworkById).delete(protect, admin, deleteArtwork);

export default router;
