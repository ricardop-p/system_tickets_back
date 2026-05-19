import express from 'express';

import authRoutes from './authRoutes.js';
import healthRoutes from './healthRoutes.js';
import ticketRoutes from './ticketRoutes.js';
import variusRoutes from './variusRoutes.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use('/health', healthRoutes);
router.use('/', authRoutes);
router.use('/tickets', authenticateToken, ticketRoutes);
router.use('/varius', authenticateToken, variusRoutes);

export default router;
