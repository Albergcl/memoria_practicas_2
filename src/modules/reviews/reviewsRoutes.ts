import { Router } from 'express';
import { addReview, editReview, getAverageRating, getMyReviewForMovie, listReviewsByMovie, removeReview } from './reviewsController';
import { authMiddleware } from '../../middlewares/authMiddleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Reseñas de películas
 */

/**
 * @swagger
 * /reviews:
 *   post:
 *     summary: Crear reseña
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - movieId
 *               - rating
 *               - comment
 *             properties:
 *               movieId:
 *                 type: string
 *               rating:
 *                 type: integer
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Reseña creada
 */
router.post("/", authMiddleware, addReview);

/**
 * @swagger
 * /reviews/{reviewId}:
 *   put:
 *     summary: Actualizar una reseña propia existente
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la reseña a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rating
 *               - comment
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *     responses:
 *       200:
 *         description: Reseña actualizada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 review:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     userId:
 *                       type: string
 *                     movieId:
 *                       type: string
 *                     rating:
 *                       type: integer
 *                     comment:
 *                       type: string
 *                     updatedAt:
 *                       type: string
 *       400:
 *         description: Error al actualizar la reseña (datos inválidos o sin permisos)
 *       401:
 *         description: No autorizado (token inválido o ausente)
 */
router.put("/:reviewId", authMiddleware, editReview);

/**
 * @swagger
 * /reviews/{reviewId}:
 *   delete:
 *     summary: Eliminar una reseña propia existente
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la reseña a eliminar
 *     responses:
 *       200:
 *         description: Reseña eliminada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Error al eliminar la reseña (no existe o sin permisos)
 *       401:
 *         description: No autorizado (token inválido o ausente)
 */
router.delete("/:reviewId", authMiddleware, removeReview);

/**
 * @swagger
 * /reviews/movie/{movieId}:
 *   get:
 *     summary: Obtener todas las reseñas para una película específica
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: movieId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la película
 *     responses:
 *       200:
 *         description: Lista de reseñas de la película
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   userId:
 *                     type: string
 *                   movieId:
 *                     type: string
 *                   rating:
 *                     type: integer
 *                   comment:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *       400:
 *         description: Movie ID no proporcionado o inválido
 *       500:
 *         description: Error al obtener las reseñas
 */
router.get("/movie/:movieId", listReviewsByMovie);

/**
 * @swagger
 * /reviews/movie/{movieId}/average:
 *   get:
 *     summary: Obtener media de puntuaciones
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: movieId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Media de reseñas
 */
router.get("/movie/:movieId/average", getAverageRating);

/**
 * @swagger
 * /reviews/movie/{movieId}/my-review:
 *   get:
 *     summary: Obtener la reseña propia para una película específica
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: movieId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la película
 *     responses:
 *       200:
 *         description: Reseña del usuario para la película o null si no existe
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     userId:
 *                       type: string
 *                     movieId:
 *                       type: string
 *                     rating:
 *                       type: integer
 *                     comment:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                 - type: "null"
 *       400:
 *         description: Movie ID no proporcionado o inválido
 *       401:
 *         description: No autorizado (token inválido o ausente)
 *       500:
 *         description: Error al obtener la reseña del usuario
 */
router.get("/movie/:movieId/my-review", authMiddleware, getMyReviewForMovie);

export default router;