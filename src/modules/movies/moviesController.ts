import { Request, Response } from 'express';
import { getDB } from '../../database/mongo';
import { getAllMovies, saveMovie, searchMoviesFromApi } from './moviesService';

export const searchMovies = async (req: Request, res: Response) => {
    try {
        const query = req.query.q as string;
        if (!query || query.trim().length < 2) {
            return res.status(400).json({ message: "Query parameter 'q' is required and must be at least 2 characters long" });
        }

        // Llamar al servicio para buscar películas
        const movies = await searchMoviesFromApi(query);
        res.status(200).json(movies);
    } catch (error) {
        res.status(500).json({ message: "Error searching movies", error });
    }
}

export const addMovie = async (req: Request, res: Response) => {
    try {
        const { title, overview, genres, releaseDate, posterPath, tmdbId } = req.body;

        if (!title || !overview || !Array.isArray(genres) || genres.length === 0 || !releaseDate) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const newMovie = {
            title,
            overview,
            genres,
            releaseDate,
            ...(posterPath && { posterPath }),
            ...(tmdbId && { tmdbId }),
        }

        const savedMovie = await saveMovie(getDB(), newMovie);
        res.status(201).json({ message: 'Movie added successfully', movie: savedMovie });
    } catch (error) {
        const message = (error instanceof Error) ? error.message : 'Unknown error';
        res.status(400).json({ message: 'Error adding movie', error: message } );
    }
}

export const listMovies = async (req: Request, res: Response) => {
    try {
        const movies = await getAllMovies(getDB());
        res.status(200).json(movies);
    } catch (error) {
        res.status(500).json({ message: "Error listing movies", error });
    }
}