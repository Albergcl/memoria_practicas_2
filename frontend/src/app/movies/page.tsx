"use client";
import "./styles.css";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Movie } from "@/app/types";
import api from "@/api/api";
import MovieCard from "@/app/components/MovieCard";

const MoviesPage = () => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedGenre, setSelectedGenre] = useState("");

    const fetchMovies = () => {
        setLoading(true);
        api.get("/movies")
            .then((res) => {
                setMovies(res.data);
            })
            .catch((e) => {
                alert("Error al cargar las películas: " + String(e));
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchMovies();
    }, []);

    // Extraer géneros únicos de todas las películas
    const allGenres = Array.from(
        new Set(movies.flatMap((m) => m.genres))
    ).sort();

    // Filtrar por búsqueda y género
    const filtered = movies.filter((m) => {
        const matchesSearch = m.title
            .toLowerCase()
            .includes(search.toLowerCase());
        const matchesGenre = selectedGenre
            ? m.genres.includes(selectedGenre)
            : true;
        return matchesSearch && matchesGenre;
    });

    if (loading) {
        return <p className="loadingState">Cargando catálogo...</p>;
    }

    return (
        <div>
            <div className="moviesHeader">
                <h1 className="moviesTitle">Catálogo de Películas</h1>
                <div className="moviesControls">
                    <input
                        className="searchInput"
                        type="text"
                        placeholder="Buscar por título..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <select
                        className="genreFilter"
                        value={selectedGenre}
                        onChange={(e) => setSelectedGenre(e.target.value)}
                    >
                        <option value="">Todos los géneros</option>
                        {allGenres.map((g) => (
                            <option key={g} value={g}>{g}</option>
                        ))}
                    </select>
                </div>
            </div>

            {movies.length === 0 ? (
                <div className="emptyState">
                    <h2>El catálogo está vacío</h2>
                    <p>Todavía no hay películas. ¡Sé el primero en añadir una!</p>
                    <Link href="/search" className="btnGoSearch">
                        Buscar películas en TMDB
                    </Link>
                </div>
            ) : filtered.length === 0 ? (
                <div className="emptyState">
                    <h2>Sin resultados</h2>
                    <p>No hay películas que coincidan con tu búsqueda.</p>
                </div>
            ) : (
                <>
                    <p className="resultsCount">
                        {filtered.length} película{filtered.length !== 1 ? "s" : ""}
                        {selectedGenre ? ` en "${selectedGenre}"` : ""}
                        {search ? ` con "${search}"` : ""}
                    </p>
                    <div className="moviesGrid">
                        {filtered.map((movie) => (
                            <MovieCard key={movie._id} movie={movie} />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default MoviesPage;
