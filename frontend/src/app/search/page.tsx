"use client";
import "./styles.css";
import { useState } from "react";
import Link from "next/link";
import { TmdbMovie } from "@/app/types";
import api from "@/api/api";
import { useAuth } from "@/context/AuthContext";

const SearchPage = () => {
    const { user } = useAuth();

    const [query, setQuery] = useState("");
    const [results, setResults] = useState<TmdbMovie[]>([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const [addedIds, setAddedIds] = useState<Set<number>>(new Set());
    const [addingId, setAddingId] = useState<number | null>(null);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;
        setLoading(true);
        setSearched(true);
        try {
            const res = await api.get("/movies/search", { params: { q: query } });
            setResults(res.data);
        } catch (err: unknown) {
            alert("Error al buscar: " + String(err));
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (movie: TmdbMovie) => {
        setAddingId(movie.tmdbId);
        try {
            await api.post("/movies", {
                title: movie.title,
                overview: movie.overview,
                genres: movie.genres,
                releaseDate: movie.releaseDate,
                posterPath: movie.posterPath,
                tmdbId: movie.tmdbId,
            });
            setAddedIds((prev) => new Set(prev).add(movie.tmdbId));
        } catch (err: unknown) {
            alert("Error al añadir la película: " + String(err));
        } finally {
            setAddingId(null);
        }
    };

    if (!user) {
        return (
            <div className="notAuthCard">
                <h2>Acceso restringido</h2>
                <p>Debes iniciar sesión para buscar y añadir películas al catálogo.</p>
                <Link href="/login" className="btnLogin">Iniciar sesión</Link>
            </div>
        );
    }

    return (
        <div>
            <div className="searchHeader">
                <h1 className="searchTitle">Buscar en TMDB</h1>
                <p className="searchSubtitle">
                    Encuentra películas de la base de datos de TMDB y añádelas al catálogo.
                </p>
            </div>

            <form className="searchBar" onSubmit={handleSearch}>
                <input
                    className="searchInput"
                    type="text"
                    placeholder="Ej: Inception, El Padrino, Interstellar..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button className="btnSearch" type="submit" disabled={loading}>
                    {loading ? "Buscando..." : "Buscar"}
                </button>
            </form>

            {loading && <p className="loadingState">Buscando en TMDB...</p>}

            {!loading && !searched && (
                <p className="idleState">Introduce un título para buscar películas.</p>
            )}

            {!loading && searched && results.length === 0 && (
                <p className="emptyState">No se encontraron resultados para &quot;{query}&quot;.</p>
            )}

            {!loading && results.length > 0 && (
                <div className="resultsList">
                    {results.map((movie) => {
                        const year = movie.releaseDate
                            ? new Date(movie.releaseDate).getFullYear()
                            : null;
                        const isAdded = addedIds.has(movie.tmdbId);
                        const isAdding = addingId === movie.tmdbId;

                        return (
                            <div key={movie.tmdbId} className="resultCard">
                                {movie.posterPath ? (
                                    <img
                                        src={`https://image.tmdb.org/t/p/w185${movie.posterPath}`}
                                        alt={movie.title}
                                        className="resultPoster"
                                    />
                                ) : (
                                    <div className="resultPosterPlaceholder">🎬</div>
                                )}
                                <div className="resultInfo">
                                    <h3 className="resultTitle">{movie.title}</h3>
                                    {year && <span className="resultYear">{year}</span>}
                                    {movie.overview && (
                                        <p className="resultOverview">{movie.overview}</p>
                                    )}
                                    <div className="resultGenres">
                                        {movie.genres.map((g) => (
                                            <span key={g} className="genreTag">{g}</span>
                                        ))}
                                    </div>
                                    <button
                                        className={`btnAdd ${isAdded ? "btnAdded" : ""}`}
                                        onClick={() => handleAdd(movie)}
                                        disabled={isAdded || isAdding}
                                    >
                                        {isAdded
                                            ? "✓ Añadida"
                                            : isAdding
                                            ? "Añadiendo..."
                                            : "Añadir al catálogo"}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default SearchPage;
