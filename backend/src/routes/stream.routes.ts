import express from 'express';
import { createChannel, createCall } from '../controllers/stream.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/channel', authMiddleware, createChannel);
router.post('/call', authMiddleware, createCall);

export default router;