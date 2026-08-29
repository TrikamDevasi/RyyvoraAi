import express from 'express';
import { submitInquiry, getInquiries, updateInquiryStatus } from '../controllers/contact.controller';
import { protect, requireRole } from '../middleware/auth.middleware';

const router = express.Router();

// Public route to submit inquiry
router.post('/industry', submitInquiry);

// Admin only routes - support both PUT and PATCH for compatibility
router.get('/industry', protect, requireRole('admin'), getInquiries);
router.put('/industry/:id', protect, requireRole('admin'), updateInquiryStatus);
router.patch('/industry/:id', protect, requireRole('admin'), updateInquiryStatus);

export default router;
