import { Router } from 'express';
import { searchMovies, addMovie, listMovies } from './moviesController';
import { authMiddleware } from '../../middlewares/authMiddleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Movies
 *   description: Gestión de películas
 */

/**
 * @swagger
 * /movies/search:
 *   get:
 *     summary: Buscar películas en la API externa
 *     tags: [Movies]
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Texto de búsqueda
 *     responses:
 *       200:
 *         description: Lista de películas
 */
router.get('/search', authMiddleware, searchMovies);


/**
 * @swagger
 * /movies:
 *   post:
 *     summary: Añadir una película al catálogo
 *     tags: [Movies]
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
 *               - overview
 *               - genres
 *               - releaseDate
 *             properties:
 *               title:
 *                 type: string
 *               overview:
 *                 type: string
 *               genres:
 *                 type: array
 *                 items:
 *                   type: string
 *               releaseDate:
 *                 type: string
 *     responses:
 *       201:
 *         description: Película añadida
 */
router.post('/', authMiddleware, addMovie);

/**
 * @swagger
 * /movies:
 *   get:
 *     summary: Listar todas las películas guardadas
 *     tags: [Movies]
 *     responses:
 *       200:
 *         description: Lista de películas almacenadas en la base de datos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   overview:
 *                     type: string
 *                   genres:
 *                     type: array
 *                     items:
 *                       type: string
 *                   releaseDate:
 *                     type: string
 *       500:
 *         description: Error listing movies
 */
router.get('/', listMovies);

export default router;