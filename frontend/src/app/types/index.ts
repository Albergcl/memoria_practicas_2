export type User = {
    _id: string;
    username: string;
    email: string;
    role: "user" | "admin";
    createdAt: string;
};

export type Movie = {
    _id: string;
    tmdbId?: number;
    title: string;
    overview: string;
    releaseDate: string;
    genres: string[];
    rating?: number;
    posterPath?: string;
    createdAt?: string;
};

export type Review = {
    _id: string;
    userId: string;
    movieId: string;
    rating: number;
    comment: string;
    createdAt: string;
    updatedAt?: string;
};

export type ForumMessage = {
    _id: string;
    userId: string;
    username: string;
    text: string;
    createdAt: string;
};

export type Forum = {
    _id: string;
    movieId: string;
    messages: ForumMessage[];
    createdAt: string;
};

// Resultado de búsqueda en TMDB (devuelto por el backend)
export type TmdbMovie = {
    tmdbId: number;
    title: string;
    overview: string;
    releaseDate: string;
    genres: string[];
    posterPath: string;
    rating: number;
};
