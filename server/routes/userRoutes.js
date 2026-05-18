import express from 'express';
import { getUsers, getWishlist, toggleWishlist } from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, admin, getUsers);
router.route('/wishlist').get(protect, getWishlist).post(protect, toggleWishlist);

export default router;
