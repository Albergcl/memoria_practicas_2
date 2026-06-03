"use client";
import "./styles.css";
import Link from "next/link";
import { Movie } from "@/app/types";

type Props = {
    movie: Movie;
};

const MovieCard = ({ movie }: Props) => {
    const year = movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : null;

    return (
        <Link href={`/movies/${movie._id}`} className="movieCard">
            <div className="posterContainer">
                {movie.posterPath ? (
                    <img
                        src={`https://image.tmdb.org/t/p/w300${movie.posterPath}`}
                        alt={movie.title}
                        className="poster"
                    />
                ) : (
                    <div className="posterPlaceholder">🎬</div>
                )}
            </div>
            <div className="movieInfo">
                <h3 className="movieTitle">{movie.title}</h3>
                {year && <span className="movieYear">{year}</span>}
                <div className="genreList">
                    {movie.genres.slice(0, 3).map((g) => (
                        <span key={g} className="genreTag">{g}</span>
                    ))}
                </div>
            </div>
        </Link>
    );
};

export default MovieCard;
