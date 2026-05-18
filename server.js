import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes.js';
import ticketRoutes from './routes/ticketRoutes.js';
import variusRoutes from './routes/variusRoutes.js';
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
app.use('/api/varius', authenticateToken, variusRoutes);


const PORT = process.env.PORT || 8007;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📘 Swagger disponible en /api-docs`);
});