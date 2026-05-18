import express from 'express';
import { sendInquiry, getInquiries, deleteInquiry } from '../controllers/contactController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(sendInquiry)
  .get(protect, admin, getInquiries);

router.route('/:id')
  .delete(protect, admin, deleteInquiry);

export default router;
