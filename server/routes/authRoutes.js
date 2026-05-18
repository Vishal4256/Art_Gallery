import express from 'express';
import { authUser, registerUser, resetPassword } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authUser);
router.post('/reset-password', resetPassword);

export default router;
