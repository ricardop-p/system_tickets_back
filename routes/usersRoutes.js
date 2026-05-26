import express from 'express';

import { createUser, getUsers } from '../controllers/userController.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = express.Router();

/**
 * @swagger
 * /api/users:
 *   get:
 *     tags:
 *       - Users
 *     summary: Listar usuarios registrados
 *     description: Retorna los usuarios registrados en el sistema. Solo ADMIN puede consultar esta lista.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   role:
 *                     type: string
 *                   is_active:
 *                     type: boolean
 *             example:
 *               - id: 1
 *                 name: Administrador Demo
 *                 email: admin@test.com
 *                 role: ADMIN
 *                 is_active: true
 *       401:
 *         description: No hay token, acceso denegado
 *       403:
 *         description: Token invalido o expirado / Solo administrador
 */
router.get('/', asyncHandler(getUsers));

/**
 * @swagger
 * /api/users/create:
 *   post:
 *     tags:
 *       - Users
 *     summary: Crear un nuevo usuario
 *     description: Crea un usuario con rol especificado. Solo ADMIN puede crear usuarios.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               age:
 *                 type: integer
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum:
 *                   - ADMIN
 *                   - AGENT
 *                   - USER
 *               is_active:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *       400:
 *         description: Error en la solicitud
 *       401:
 *         description: No hay token, acceso denegado
 *       403:
 *         description: Solo administrador
 */
router.post('/create', asyncHandler(createUser));

export default router;
