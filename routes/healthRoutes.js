import express from 'express';
import { checkDatabaseConnection } from '../controllers/healthController.js';

const router = express.Router();

/**
 * @swagger
 * /api/health/db:
 *   get:
 *     tags:
 *       - Health
 *     summary: Validar conexion con la base de datos
 *     responses:
 *       200:
 *         description: Conexion con la base de datos correcta
 *       500:
 *         description: Error al conectar con la base de datos
 */
router.get('/db', checkDatabaseConnection);

export default router;
