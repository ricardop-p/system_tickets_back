import express from 'express';
import { getTickets, getTicketById, createTicket } from '../controllers/ticketController.js';

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
 *         description: Token no enviado o inválido
 */
router.get('/', getTickets);

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
 *         description: Token no enviado o inválido
 *       404:
 *         description: Ticket no encontrado
 */
router.get('/:id', getTicketById);

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
 *             title: Error en el sistema
 *             description: No permite iniciar sesión
 *     responses:
 *       201:
 *         description: Ticket creado correctamente
 *       401:
 *         description: Token no enviado o inválido
 */
router.post('/', createTicket);

export default router;