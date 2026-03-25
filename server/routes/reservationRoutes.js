import express from 'express';
import { addReservation, getMyReservations, getReservations } from '../controllers/reservationController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, addReservation).get(protect, admin, getReservations);
router.route('/myreservations').get(protect, getMyReservations);

export default router;
