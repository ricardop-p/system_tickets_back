import express from 'express';

import {
  changeCategoryStatus,
  createCategory,
  getCategories,
  updateCategory,
} from '../controllers/categoryController.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = express.Router();

/**
 * @swagger
 * /api/categories/list:
 *   get:
 *     tags:
 *       - Categories
 *     summary: Listar categorias
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de categorias
 *       401:
 *         description: Token no enviado o invalido
 *       500:
 *         description: Error del servidor
 */
router.get('/list', asyncHandler(getCategories));

/**
 * @swagger
 * /api/categories/create:
 *   post:
 *     tags:
 *       - Categories
 *     summary: Crear una nueva categoria
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
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Categoria creada exitosamente
 *       400:
 *         description: Error en la solicitud
 *       401:
 *         description: Token no enviado o invalido
 *       500:
 *         description: Error del servidor
 */
router.post('/create', asyncHandler(createCategory));

/**
 * @swagger
 * /api/categories/update:
 *   put:
 *     tags:
 *       - Categories
 *     summary: Editar una categoria existente
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - name
 *             properties:
 *               id:
 *                 type: integer
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Categoria editada exitosamente
 *       400:
 *         description: Error en la solicitud
 *       401:
 *         description: Token no enviado o invalido
 *       404:
 *         description: Categoria no encontrada
 *       500:
 *         description: Error del servidor
 */
router.put('/update', asyncHandler(updateCategory));

/**
 * @swagger
 * /api/categories/status:
 *   patch:
 *     tags:
 *       - Categories
 *     summary: Activar o desactivar una categoria
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - isActive
 *             properties:
 *               id:
 *                 type: integer
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Categoria actualizada exitosamente
 *       400:
 *         description: Error en la solicitud
 *       401:
 *         description: Token no enviado o invalido
 *       404:
 *         description: Categoria no encontrada
 *       500:
 *         description: Error del servidor
 */
router.patch('/status', asyncHandler(changeCategoryStatus));

export default router;
