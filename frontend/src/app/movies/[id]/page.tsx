"use client";
import "./styles.css";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Movie, Review, Forum } from "@/app/types";
import api from "@/api/api";
import { useAuth } from "@/context/AuthContext";
import ReviewCard from "@/app/components/ReviewCard";
import ForumMessage from "@/app/components/ForumMessage";
import StarRating from "@/app/components/StarRating";

const MovieDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();

    const [movie, setMovie] = useState<Movie | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [myReview, setMyReview] = useState<Review | null>(null);
    const [avgRating, setAvgRating] = useState<number | null>(null);
    const [totalReviews, setTotalReviews] = useState(0);
    const [forum, setForum] = useState<Forum | null>(null);
    const [loading, setLoading] = useState(true);

    // Review form
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewComment, setReviewComment] = useState("");
    const [submittingReview, setSubmittingReview] = useState(false);

    // Forum form
    const [forumText, setForumText] = useState("");
    const [sendingMessage, setSendingMessage] = useState(false);

    const fetchMovie = () => {
        return api.get("/movies").then((res) => {
            const found = res.data.find((m: Movie) => m._id === id);
            setMovie(found || null);
        });
    };

    const fetchReviews = () => {
        return Promise.all([
            api.get(`/reviews/movie/${id}`).then((res) => setReviews(res.data)),
            // El backend devuelve { averageRating, totalReviews }
            api.get(`/reviews/movie/${id}/average`).then((res) => {
                setAvgRating(res.data.averageRating ?? null);
                setTotalReviews(res.data.totalReviews ?? 0);
            }),
        ]);
    };

    const fetchMyReview = () => {
        if (!user) return Promise.resolve();
        return api
            .get(`/reviews/movie/${id}/my-review`)
            .then((res) => setMyReview(res.data || null))
            .catch(() => setMyReview(null));
    };

    const fetchForum = () => {
        return api.get(`/forums/movie/${id}`).then((res) => setForum(res.data));
    };

    const loadAll = () => {
        setLoading(true);
        Promise.all([fetchMovie(), fetchReviews(), fetchMyReview(), fetchForum()])
            .catch((e) => alert("Error cargando datos: " + String(e)))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, user]);

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!reviewComment.trim()) return;
        setSubmittingReview(true);
        try {
            await api.post("/reviews", {
                movieId: id,
                rating: reviewRating,
                comment: reviewComment,
                username: user!.username,
            });
            setReviewComment("");
            setReviewRating(5);
            await Promise.all([fetchReviews(), fetchMyReview()]);
        } catch (err: unknown) {
            alert("Error al publicar la reseña: " + String(err));
        } finally {
            setSubmittingReview(false);
        }
    };

    const handleSendMessage = async () => {
        if (!forumText.trim()) return;
        setSendingMessage(true);
        try {
            await api.post(`/forums/movie/${id}/message`, {
                text: forumText,
                userId: user!._id,
                username: user!.username,
            });
            setForumText("");
            await fetchForum();
        } catch (err: unknown) {
            alert("Error al enviar el mensaje: " + String(err));
        } finally {
            setSendingMessage(false);
        }
    };

    if (loading) return <p className="loadingState">Cargando película...</p>;
    if (!movie) return <p className="notFound">Película no encontrada.</p>;

    const year = movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : null;

    // Reseñas que no son la del usuario actual (para no duplicar)
    const otherReviews = reviews.filter((r) => r._id !== myReview?._id);

    return (
        <div>
            <Link href="/movies" className="backLink">← Volver al catálogo</Link>

            {/* ── Hero ── */}
            <div className="movieHero">
                <div className="heroPoster">
                    {movie.posterPath ? (
                        <img
                            src={`https://image.tmdb.org/t/p/w300${movie.posterPath}`}
                            alt={movie.title}
                        />
                    ) : (
                        <div className="posterPlaceholder">🎬</div>
                    )}
                </div>
                <div className="heroInfo">
                    <h1 className="movieTitle">{movie.title}</h1>
                    {year && <span className="movieYear">{year}</span>}
                    <div className="genreList">
                        {movie.genres.map((g) => (
                            <span key={g} className="genreTag">{g}</span>
                        ))}
                    </div>
                    {movie.overview && (
                        <p className="movieOverview">{movie.overview}</p>
                    )}
                    {avgRating !== null && avgRating > 0 && (
                        <div className="avgRating">
                            <span className="avgRatingValue">
                                {Number(avgRating).toFixed(1)}
                            </span>
                            <span>/ 5 · Media de {totalReviews} reseña{totalReviews !== 1 ? "s" : ""}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Reseñas ── */}
            <section className="section">
                <h2 className="sectionTitle">Reseñas</h2>

                {user ? (
                    myReview ? (
                        <div className="reviewsList" style={{ marginBottom: "20px" }}>
                            <ReviewCard
                                review={myReview}
                                isOwner={true}
                                username={user.username}
                                onUpdated={() => { fetchReviews(); fetchMyReview(); }}
                                onDeleted={() => { fetchReviews(); setMyReview(null); }}
                            />
                        </div>
                    ) : (
                        <form className="reviewFormCard" onSubmit={handleSubmitReview}>
                            <p className="reviewFormTitle">Escribe tu reseña</p>
                            <StarRating value={reviewRating} onChange={setReviewRating} />
                            <textarea
                                className="reviewTextarea"
                                placeholder="¿Qué te ha parecido la película?"
                                value={reviewComment}
                                onChange={(e) => setReviewComment(e.target.value)}
                                required
                            />
                            <button
                                className="btnSubmitReview"
                                type="submit"
                                disabled={submittingReview}
                            >
                                {submittingReview ? "Publicando..." : "Publicar reseña"}
                            </button>
                        </form>
                    )
                ) : (
                    <p className="authNotice">
                        <Link href="/login">Inicia sesión</Link> para escribir una reseña.
                    </p>
                )}

                <div className="reviewsList">
                    {otherReviews.map((review) => (
                        <ReviewCard
                            key={review._id}
                            review={review}
                            isOwner={false}
                            username={review.username || "Usuario"}
                            onUpdated={fetchReviews}
                            onDeleted={fetchReviews}
                        />
                    ))}
                    {reviews.length === 0 && (
                        <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem" }}>
                            Todavía no hay reseñas. ¡Sé el primero!
                        </p>
                    )}
                </div>
            </section>

            {/* ── Foro ── */}
            <section className="section">
                <h2 className="sectionTitle">Foro de discusión</h2>

                <div className="forumMessages">
                    {!forum || forum.messages.length === 0 ? (
                        <p className="forumEmpty">El foro está vacío. ¡Empieza la conversación!</p>
                    ) : (
                        [...forum.messages]
                            .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
                            .map((msg) => (
                                <ForumMessage key={String(msg._id)} message={msg} />
                            ))
                    )}
                </div>

                {user ? (
                    <div className="forumInputArea">
                        <textarea
                            className="forumInput"
                            placeholder="Escribe un mensaje..."
                            value={forumText}
                            onChange={(e) => setForumText(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage();
                                }
                            }}
                        />
                        <button
                            className="btnSendMessage"
                            onClick={handleSendMessage}
                            disabled={sendingMessage || !forumText.trim()}
                        >
                            {sendingMessage ? "Enviando..." : "Enviar"}
                        </button>
                    </div>
                ) : (
                    <p className="authNotice">
                        <Link href="/login">Inicia sesión</Link> para participar en el foro.
                    </p>
                )}
            </section>
        </div>
    );
};

export default MovieDetailPage;
