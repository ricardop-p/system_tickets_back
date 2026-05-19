import express from 'express';

import { login } from '../controllers/authController.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = express.Router();

/**
 * @swagger
 * /api/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Login de usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             email: admin1@tickets.com
 *             password: "123456"
 *     responses:
 *       200:
 *         description: Login exitoso
 *       400:
 *         description: Datos invalidos
 *       401:
 *         description: Credenciales incorrectas
 */
router.post('/login', asyncHandler(login));

export default router;
