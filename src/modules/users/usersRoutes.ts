import { Router } from 'express';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { getMe } from './usersController';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gestión de usuarios
 */

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Obtener información del usuario autenticado
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Datos del usuario
 */
router.get("/me", authMiddleware, getMe);

export default router;