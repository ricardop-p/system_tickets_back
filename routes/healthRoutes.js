import express from 'express';
import { checkApiHealth, checkDatabaseConnection } from '../controllers/healthController.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = express.Router();

/**
 * @swagger
 * /api/health:
 *   get:
 *     tags:
 *       - Health
 *     summary: Validar estado del servicio
 *     responses:
 *       200:
 *         description: Servicio disponible
 */
router.get('/', checkApiHealth);

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
router.get('/db', asyncHandler(checkDatabaseConnection));

export default router;
