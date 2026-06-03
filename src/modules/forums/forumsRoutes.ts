import { Router } from 'express';
import { getForum, postMessage } from './forumsController';
import { authMiddleware } from '../../middlewares/authMiddleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Forums
 *   description: Foros por película
 */


/**
 * @swagger
 * /forums/movie/{movieId}:
 *   get:
 *     summary: Obtener foro de una película
 *     tags: [Forums]
 *     parameters:
 *       - in: path
 *         name: movieId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Foro de la película
 */
router.get("/movie/:movieId", getForum);

/**
 * @swagger
 * /forums/movie/{movieId}/message:
 *   post:
 *     summary: Publicar mensaje en el foro
 *     tags: [Forums]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: movieId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *             properties:
 *               text:
 *                 type: string
 *     responses:
 *       201:
 *         description: Mensaje publicado
 */
router.post("/movie/:movieId/message", authMiddleware, postMessage);

export default router;