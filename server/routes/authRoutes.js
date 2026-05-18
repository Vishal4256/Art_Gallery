import express from 'express';
import { authUser, registerUser, forgotPassword, resetPasswordOtp } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password-otp', resetPasswordOtp);

export default router;
