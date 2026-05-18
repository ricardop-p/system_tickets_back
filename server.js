import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes.js';
import ticketRoutes from './routes/ticketRoutes.js';
import { authenticateToken } from './middleware/authMiddleware.js';
import { setupSwagger } from './config/swagger.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

// Swagger
setupSwagger(app);

// Rutas de la API
app.use('/api', authRoutes);
app.use('/api/tickets', authenticateToken, ticketRoutes);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`🚀 http://localhost:${PORT}`);
  console.log(`📘 Swagger http://localhost:${PORT}/api-docs`);
});