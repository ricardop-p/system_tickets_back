import express from 'express';

import { checkExpiredSla } from '../controllers/slaController.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = express.Router();

/**
 * @swagger
 * /api/sla/check-expired:
 *   post:
 *     tags:
 *       - SLA
 *     summary: Revisar tickets vencidos por SLA
 *     description: Solo ADMIN puede ejecutar la revision. Escala tickets vencidos por primera atencion o resolucion y registra eventos del sistema.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Revision SLA ejecutada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 escalated_count:
 *                   type: integer
 *                 tickets:
 *                   type: array
 *                   items:
 *                     type: object
 *             example:
 *               escalated_count: 1
 *               tickets:
 *                 - id: 10
 *                   status: ESCALATED
 *                   sla_status: EXPIRED
 *                   escalation_level: 2
 *                   escalation_reason: Escalado automatico por vencimiento de primera atencion
 *       401:
 *         description: Token no enviado o invalido
 *       403:
 *         description: Solo administrador
 */
router.post('/check-expired', asyncHandler(checkExpiredSla));

export default router;
