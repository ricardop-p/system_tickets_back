import express from 'express';

import { getPriority, getSeniority } from '../controllers/variusController.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = express.Router();

/**
 * @swagger
 * /api/varius/priority:
 *   get:
 *     tags:
 *       - Varius
 *     summary: Obtener todas las prioridades
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de prioridades obtenida correctamente
 *       401:
 *         description: Token no enviado o invalido
 */
router.get('/priority', asyncHandler(getPriority));

/**
 * @swagger
 * /api/varius/seniority:
 *   get:
 *     tags:
 *       - Varius
 *     summary: Consultar si una edad corresponde a mayoria de edad
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: years
 *         required: true
 *         schema:
 *           type: integer
 *         description: Edad a consultar
 *         example: 18
 *     responses:
 *       200:
 *         description: Consulta realizada correctamente
 *       400:
 *         description: Edad invalida
 *       401:
 *         description: Token no enviado o invalido
 */
router.get('/seniority', asyncHandler(getSeniority));

export default router;
