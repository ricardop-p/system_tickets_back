import express from 'express';

import {
  assignTicket,
  changeTicketStatus,
  createTicket,
  createTicketComment,
  getTicketById,
  getTicketComments,
  getTickets,
  updateTicket,
} from '../controllers/ticketController.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = express.Router();

/**
 * @swagger
 * /api/tickets:
 *   get:
 *     tags:
 *       - Tickets
 *     summary: Listar tickets
 *     description: ADMIN lista todos los tickets, AGENT solo sus tickets asignados y USER solo sus tickets creados.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [OPEN, ASSIGNED, IN_PROGRESS, ON_HOLD, ESCALATED, RESOLVED, CLOSED, CANCELLED]
 *       - in: query
 *         name: sla_status
 *         schema:
 *           type: string
 *           enum: [ON_TIME, EXPIRED, BREACHED]
 *       - in: query
 *         name: priority_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: category_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: assigned_agent_id
 *         description: Solo aplica para ADMIN.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de tickets obtenida correctamente
 *       401:
 *         description: Token no enviado o invalido
 *       403:
 *         description: Rol no autorizado
 */
router.get('/', asyncHandler(getTickets));

/**
 * @swagger
 * /api/tickets:
 *   post:
 *     tags:
 *       - Tickets
 *     summary: Crear ticket
 *     description: El backend define requester, estado inicial, SLA y asignacion automatica.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - category_id
 *               - priority_id
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               category_id:
 *                 type: integer
 *               priority_id:
 *                 type: integer
 *           example:
 *             title: No puedo iniciar sesion
 *             description: El sistema no me permite ingresar.
 *             category_id: 1
 *             priority_id: 3
 *     responses:
 *       201:
 *         description: Ticket creado correctamente
 *       400:
 *         description: Datos invalidos
 *       401:
 *         description: Token no enviado o invalido
 */
router.post('/', asyncHandler(createTicket));

/**
 * @swagger
 * /api/tickets/{id}:
 *   get:
 *     tags:
 *       - Tickets
 *     summary: Consultar detalle de ticket
 *     description: ADMIN puede ver cualquier ticket, AGENT solo asignados a el y USER solo propios.
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
 *       403:
 *         description: No tiene permisos para ver este ticket
 *       404:
 *         description: Ticket no encontrado
 */
router.get('/:id', asyncHandler(getTicketById));

/**
 * @swagger
 * /api/tickets/{id}:
 *   patch:
 *     tags:
 *       - Tickets
 *     summary: Actualizar datos principales del ticket
 *     description: Solo ADMIN puede editar title, description, category_id, priority_id y assigned_agent_id.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               category_id:
 *                 type: integer
 *               priority_id:
 *                 type: integer
 *               assigned_agent_id:
 *                 type: integer
 *           example:
 *             title: Error al iniciar sesion
 *             description: No puedo ingresar con mi usuario.
 *             category_id: 1
 *             priority_id: 2
 *             assigned_agent_id: 4
 *     responses:
 *       200:
 *         description: Ticket actualizado correctamente
 *       400:
 *         description: Datos invalidos
 *       401:
 *         description: Token no enviado o invalido
 *       403:
 *         description: Solo administrador
 *       404:
 *         description: Ticket no encontrado
 */
router.patch('/:id', asyncHandler(updateTicket));

/**
 * @swagger
 * /api/tickets/{id}/status:
 *   patch:
 *     tags:
 *       - Tickets
 *     summary: Cambiar estado del ticket
 *     description: ADMIN puede cambiar cualquier ticket y AGENT solo tickets asignados a el.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [OPEN, ASSIGNED, IN_PROGRESS, ON_HOLD, ESCALATED, RESOLVED, CLOSED, CANCELLED]
 *           example:
 *             status: IN_PROGRESS
 *     responses:
 *       200:
 *         description: Estado actualizado correctamente
 *       400:
 *         description: Estado invalido
 *       401:
 *         description: Token no enviado o invalido
 *       403:
 *         description: No tiene permisos para cambiar estado
 *       404:
 *         description: Ticket no encontrado
 */
router.patch('/:id/status', asyncHandler(changeTicketStatus));

/**
 * @swagger
 * /api/tickets/{id}/assign:
 *   patch:
 *     tags:
 *       - Tickets
 *     summary: Reasignar ticket
 *     description: Solo ADMIN puede reasignar tickets a agentes activos.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - agent_id
 *             properties:
 *               agent_id:
 *                 type: integer
 *           example:
 *             agent_id: 2
 *     responses:
 *       200:
 *         description: Ticket reasignado correctamente
 *       400:
 *         description: Agente invalido o inactivo
 *       401:
 *         description: Token no enviado o invalido
 *       403:
 *         description: Solo administrador
 *       404:
 *         description: Ticket no encontrado
 */
router.patch('/:id/assign', asyncHandler(assignTicket));

/**
 * @swagger
 * /api/tickets/{id}/comments:
 *   post:
 *     tags:
 *       - Ticket Comments
 *     summary: Crear comentario en ticket
 *     description: ADMIN puede comentar cualquier ticket, AGENT solo asignados a el y USER solo propios.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - comment
 *             properties:
 *               comment:
 *                 type: string
 *           example:
 *             comment: Se revisa el caso.
 *     responses:
 *       201:
 *         description: Comentario creado correctamente
 *       400:
 *         description: Comentario obligatorio
 *       401:
 *         description: Token no enviado o invalido
 *       403:
 *         description: No tiene permisos para comentar
 *       404:
 *         description: Ticket no encontrado
 */
router.post('/:id/comments', asyncHandler(createTicketComment));

/**
 * @swagger
 * /api/tickets/{id}/comments:
 *   get:
 *     tags:
 *       - Ticket Comments
 *     summary: Listar comentarios de un ticket
 *     description: Aplica las mismas reglas de acceso del detalle del ticket.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Comentarios obtenidos correctamente
 *       401:
 *         description: Token no enviado o invalido
 *       403:
 *         description: No tiene permisos para ver comentarios
 *       404:
 *         description: Ticket no encontrado
 */
router.get('/:id/comments', asyncHandler(getTicketComments));

export default router;
