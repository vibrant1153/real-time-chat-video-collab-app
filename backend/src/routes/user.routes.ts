import express from 'express';
import { getAllUsers, searchUsers, getUserById, upsertStreamUserEndpoint } from '../controllers/user.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', authMiddleware, getAllUsers);
router.get('/search', authMiddleware, searchUsers);
router.post('/upsert-stream', authMiddleware, upsertStreamUserEndpoint);
router.get('/:userId', authMiddleware, getUserById);

export default router;