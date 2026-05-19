import express from 'express';

import { createTicket, getTicketById, getTickets } from '../controllers/ticketController.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = express.Router();

/**
 * @swagger
 * /api/tickets:
 *   get:
 *     tags:
 *       - Tickets
 *     summary: Obtener todos los tickets
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de tickets obtenida correctamente
 *       401:
 *         description: Token no enviado o invalido
 */
router.get('/', asyncHandler(getTickets));

/**
 * @swagger
 * /api/tickets/{id}:
 *   get:
 *     tags:
 *       - Tickets
 *     summary: Obtener un ticket por ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del ticket
 *     responses:
 *       200:
 *         description: Ticket obtenido correctamente
 *       401:
 *         description: Token no enviado o invalido
 *       404:
 *         description: Ticket no encontrado
 */
router.get('/:id', asyncHandler(getTicketById));

/**
 * @swagger
 * /api/tickets:
 *   post:
 *     tags:
 *       - Tickets
 *     summary: Crear un ticket
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             titulo: Error en el sistema
 *             descripcion: No permite iniciar sesion
 *             prioridad: Alta
 *     responses:
 *       201:
 *         description: Ticket creado correctamente
 *       400:
 *         description: Datos invalidos
 *       401:
 *         description: Token no enviado o invalido
 */
router.post('/', asyncHandler(createTicket));

export default router;
