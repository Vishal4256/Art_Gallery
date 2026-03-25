import express from 'express';
import { getExhibitions, getExhibitionById, createExhibition } from '../controllers/exhibitionController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getExhibitions).post(protect, admin, createExhibition);
router.route('/:id').get(getExhibitionById);

export default router;
