import axios from 'axios';
import { Db, ObjectId } from 'mongodb';

const TMDB_ACCESS_TOKEN = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = process.env.TMDB_BASE_URL;

const url_tmdb = axios.create({
    baseURL: TMDB_BASE_URL,
    params: {
        language: "es-ES"
    },
    headers: {
        Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`
    }
});

// Obtener los generos de películas desde TMDB
const getGenres = async () => {
    const response = await url_tmdb.get('/genre/movie/list');
    return response.data.genres; // [{ id: number, name: string }] -> [{ id: 28, name: "Acción" }, ...]
}

// Buscar peliculas en la API externa de TMDB
export const searchMoviesFromApi = async (query: string) => {
    const genres = await getGenres();

    const response = await url_tmdb.get('/search/movie', {
        params: { query }
    });

    return response.data.results.map((movie: any) => {
        //Convierto los genre_ids a nombres
        const genreNames = movie.genre_ids.map((id: number) => {
            const genre = genres.find((gen: any) => gen.id === id);
            return genre ? genre.name : null;
        }).filter(Boolean); // Elimino los valores a null

        return {
            title: movie.title,
            overview: movie.overview,
            releaseDate: movie.release_date,
            genres: genreNames,
            posterPath: movie.poster_path,
            tmdbId: movie.id
        };
    });
};

// Guardar una película en la base de datos
export const saveMovie = async (db: Db, movie: any) => {
    const moviesCollection = db.collection("movies");

    // Comprobar existencia: si se proporciona tmdbId usarlo, si no, comprobar por title + releaseDate
    let exists;
    if (movie.tmdbId) {
        exists = await moviesCollection.findOne({ tmdbId: movie.tmdbId });
    } else {
        // Normalizamos el título y la fecha para minimizar falsos duplicados
        const title = (movie.title || '').trim();
        const releaseDate = movie.releaseDate || null;
        exists = await moviesCollection.findOne({ title: title, releaseDate: releaseDate });
    }

    if (exists) {
        throw new Error("Movie already exists");
    }

    const movieToInsert = {
        ...movie,
        createdAt: new Date()
    };

    const result = await moviesCollection.insertOne(movieToInsert);
    return { _id: result.insertedId, ...movieToInsert };
}

// Obtener todas las películas de la base de datos
export const getAllMovies = async (db: Db) => {
    const moviesCollection = db.collection("movies");
    return await moviesCollection.find().toArray();
}

// Obtener una película por su ID
export const getMovieById = async (db: Db, movieId: string) => {
    const moviesCollection = db.collection("movies");
    return await moviesCollection.findOne({ _id: new ObjectId(movieId) });
}