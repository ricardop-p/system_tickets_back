import express from 'express';
import { login } from '../controllers/authController.js';

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
 *             email: admin@gmail.com
 *             password: "123456"
 *     responses:
 *       200:
 *         description: Login exitoso
 *       401:
 *         description: Credenciales incorrectas
 */
router.post('/login', login);

export default router;