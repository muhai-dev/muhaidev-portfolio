import express from 'express';
import { contactRateLimiter } from '../middleware/contactRateLimit.js';
import { validateContact } from '../middleware/validateContact.js';
import { submitContact } from '../controllers/contactController.js';

const router = express.Router();

router.post('/', contactRateLimiter, validateContact, submitContact);

export default router;
